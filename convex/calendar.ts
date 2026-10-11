// convex/calendar.ts
// Calendar integration queries and mutations

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id, Doc } from "./_generated/dataModel";
import {
  syncAppointmentToCalendar,
  exchangeCodeForToken,
  refreshAccessToken,
  deleteGoogleCalendarEvent,
  appointmentToCalendarEvent,
} from "./lib/calendar";

// ==================== Queries ====================

/**
 * Get user's Google Calendar integration status
 */
export const getUserCalendarIntegration = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      connected: user.googleCalendarConnected || false,
      autoSync: user.calendarAutoSync || false,
      connectedAt: user.googleCalendarTokenExpiry,
      // Don't expose tokens to client
      hasValidToken: !!(
        user.googleCalendarAccessToken &&
        user.googleCalendarTokenExpiry &&
        user.googleCalendarTokenExpiry > Date.now()
      ),
    };
  },
});

/**
 * Get appointments for iCal export
 */
export const getAppointmentsForICal = query({
  args: {
    userId: v.id("users"),
    startDate: v.number(),
    endDate: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, startDate, endDate, limit }) => {
    // Get user's appointments (if they're a tech/crew member)
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Query appointments in date range
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_time")
      .order("asc")
      .take(limit ?? 500);

    const filtered = appointments.filter(
      (apt) => apt.scheduledFor >= startDate && apt.scheduledFor <= endDate
    );

    // Fetch lead names for each appointment
    const result = await Promise.all(
      filtered.map(async (apt) => {
        const lead = await ctx.db.get(apt.leadId);
        return {
          appointment: apt,
          leadName: lead?.name || "Unknown",
        };
      })
    );

    return result;
  },
});

/**
 * Get sync status for a specific appointment
 */
export const getAppointmentSyncStatus = query({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, { appointmentId }) => {
    const appointment = await ctx.db.get(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    return {
      synced: !!appointment.googleCalendarEventId,
      eventId: appointment.googleCalendarEventId || null,
      syncedAt: appointment.calendarSyncedAt || null,
      status: appointment.calendarSyncStatus || "not_synced",
    };
  },
});

/**
 * Get sync history for user
 */
export const getCalendarSyncHistory = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, limit }) => {
    // Get user's appointments
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get recent synced appointments
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_time")
      .order("desc")
      .take(limit ?? 50);

    const synced = appointments.filter(
      (apt) => apt.calendarSyncStatus === "synced" || apt.calendarSyncStatus === "error"
    );

    return synced;
  },
});

// ==================== Mutations ====================

/**
 * Connect Google Calendar for a user
 */
export const connectGoogleCalendar = mutation({
  args: {
    userId: v.id("users"),
    authCode: v.string(),
  },
  handler: async (ctx, { userId, authCode }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    try {
      // Exchange code for tokens
      const tokens = await exchangeCodeForToken(authCode);

      // Update user record
      await ctx.db.patch(userId, {
        googleCalendarConnected: true,
        googleCalendarAccessToken: tokens.accessToken,
        googleCalendarRefreshToken: tokens.refreshToken,
        googleCalendarTokenExpiry: tokens.expiry,
        calendarAutoSync: true, // Enable auto-sync by default
      });

      return {
        success: true,
        message: "Google Calendar connected successfully",
      };
    } catch (error) {
      console.error("Failed to connect Google Calendar:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to connect Google Calendar",
      };
    }
  },
});

/**
 * Disconnect Google Calendar for a user
 */
export const disconnectGoogleCalendar = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Revoke tokens by clearing them
    await ctx.db.patch(userId, {
      googleCalendarConnected: false,
      googleCalendarAccessToken: undefined,
      googleCalendarRefreshToken: undefined,
      googleCalendarTokenExpiry: undefined,
      calendarAutoSync: false,
    });

    return {
      success: true,
      message: "Google Calendar disconnected successfully",
    };
  },
});

/**
 * Sync a single appointment to Google Calendar
 */
export const syncAppointmentToGoogleCalendar = mutation({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, { appointmentId }) => {
    const appointment = await ctx.db.get(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Get lead info
    const lead = await ctx.db.get(appointment.leadId);
    const leadName = lead?.name || "Unknown";

    // Find user with calendar integration (admin or assigned tech)
    // For now, use the first admin with calendar connected
    const users = await ctx.db
      .query("users")
      .withIndex("by_status")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("googleCalendarConnected"), true)
        )
      )
      .take(1);

    if (users.length === 0) {
      return {
        success: false,
        message: "No user with Google Calendar connected",
      };
    }

    const user = users[0];
    let accessToken = user.googleCalendarAccessToken!;

    // Refresh token if expired
    if (
      user.googleCalendarTokenExpiry &&
      user.googleCalendarTokenExpiry < Date.now()
    ) {
      try {
        const newTokens = await refreshAccessToken(user.googleCalendarRefreshToken!);
        accessToken = newTokens.accessToken;

        // Update user tokens
        await ctx.db.patch(user._id, {
          googleCalendarAccessToken: newTokens.accessToken,
          googleCalendarTokenExpiry: newTokens.expiry,
        });
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return {
          success: false,
          message: "Failed to refresh access token",
        };
      }
    }

    try {
      // Sync to Google Calendar
      const result = await syncAppointmentToCalendar(
        appointment,
        accessToken,
        leadName,
        appointment.googleCalendarEventId || undefined
      );

      // Update appointment record
      await ctx.db.patch(appointmentId, {
        googleCalendarEventId: result.eventId,
        calendarSyncedAt: Date.now(),
        calendarSyncStatus: "synced",
      });

      return {
        success: true,
        message: "Appointment synced to Google Calendar",
        eventId: result.eventId,
        htmlLink: result.htmlLink,
      };
    } catch (error) {
      console.error("Failed to sync appointment:", error);

      // Update appointment with error status
      await ctx.db.patch(appointmentId, {
        calendarSyncStatus: "error",
      });

      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to sync appointment",
      };
    }
  },
});

/**
 * Sync all pending appointments for a user
 */
export const syncAllAppointmentsForUser = mutation({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, limit }) => {
    const user = await ctx.db.get(userId);
    if (!user || !user.googleCalendarConnected) {
      return {
        success: false,
        message: "User does not have Google Calendar connected",
      };
    }

    let accessToken = user.googleCalendarAccessToken!;

    // Refresh token if expired
    if (
      user.googleCalendarTokenExpiry &&
      user.googleCalendarTokenExpiry < Date.now()
    ) {
      try {
        const newTokens = await refreshAccessToken(user.googleCalendarRefreshToken!);
        accessToken = newTokens.accessToken;

        // Update user tokens
        await ctx.db.patch(userId, {
          googleCalendarAccessToken: newTokens.accessToken,
          googleCalendarTokenExpiry: newTokens.expiry,
        });
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return {
          success: false,
          message: "Failed to refresh access token",
        };
      }
    }

    // Get appointments to sync
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_time")
      .order("asc")
      .take(limit ?? 50);

    // Filter for upcoming appointments that aren't synced
    const toSync = appointments.filter(
      (apt) =>
        apt.scheduledFor > Date.now() &&
        apt.calendarSyncStatus !== "synced"
    );

    let synced = 0;
    let errors = 0;

    for (const appointment of toSync) {
      const lead = await ctx.db.get(appointment.leadId);
      const leadName = lead?.name || "Unknown";

      try {
        const result = await syncAppointmentToCalendar(
          appointment,
          accessToken,
          leadName,
          appointment.googleCalendarEventId || undefined
        );

        await ctx.db.patch(appointment._id, {
          googleCalendarEventId: result.eventId,
          calendarSyncedAt: Date.now(),
          calendarSyncStatus: "synced",
        });

        synced++;
      } catch (error) {
        console.error(`Failed to sync appointment ${appointment._id}:`, error);
        await ctx.db.patch(appointment._id, {
          calendarSyncStatus: "error",
        });
        errors++;
      }
    }

    return {
      success: true,
      message: `Synced ${synced} appointments, ${errors} errors`,
      synced,
      errors,
      total: toSync.length,
    };
  },
});

/**
 * Set calendar sync preference
 */
export const setCalendarSyncPreference = mutation({
  args: {
    userId: v.id("users"),
    enabled: v.boolean(),
  },
  handler: async (ctx, { userId, enabled }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(userId, {
      calendarAutoSync: enabled,
    });

    return {
      success: true,
      message: `Auto-sync ${enabled ? "enabled" : "disabled"}`,
    };
  },
});

/**
 * Delete appointment from Google Calendar
 */
export const deleteAppointmentFromCalendar = mutation({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, { appointmentId }) => {
    const appointment = await ctx.db.get(appointmentId);
    if (!appointment || !appointment.googleCalendarEventId) {
      throw new Error("Appointment not found or not synced to calendar");
    }

    // Get user with calendar integration
    const users = await ctx.db
      .query("users")
      .withIndex("by_status")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("googleCalendarConnected"), true)
        )
      )
      .take(1);

    if (users.length === 0) {
      return {
        success: false,
        message: "No user with Google Calendar connected",
      };
    }

    const user = users[0];
    let accessToken = user.googleCalendarAccessToken!;

    // Refresh token if expired
    if (
      user.googleCalendarTokenExpiry &&
      user.googleCalendarTokenExpiry < Date.now()
    ) {
      try {
        const newTokens = await refreshAccessToken(user.googleCalendarRefreshToken!);
        accessToken = newTokens.accessToken;

        await ctx.db.patch(user._id, {
          googleCalendarAccessToken: newTokens.accessToken,
          googleCalendarTokenExpiry: newTokens.expiry,
        });
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return {
          success: false,
          message: "Failed to refresh access token",
        };
      }
    }

    try {
      await deleteGoogleCalendarEvent(appointment.googleCalendarEventId, accessToken);

      // Update appointment record
      await ctx.db.patch(appointmentId, {
        googleCalendarEventId: undefined,
        calendarSyncedAt: undefined,
        calendarSyncStatus: "not_synced",
      });

      return {
        success: true,
        message: "Appointment removed from Google Calendar",
      };
    } catch (error) {
      console.error("Failed to delete appointment from calendar:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete from calendar",
      };
    }
  },
});
