// convex/lib/calendar.ts
// Calendar integration library for iCal export and Google Calendar sync

import { Id } from "../_generated/dataModel";

// Types
export interface Appointment {
  _id: string | Id<"appointments">;
  scheduledFor: number;
  windowMins?: number;
  leadId: string | Id<"leads">;
  notes?: string;
  addressText?: string;
  serviceSlug?: string;
  status: string;
  crewId?: string;
  createdAt: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  attendees?: string[];
  status?: string;
}

export interface GoogleCalendarTokens {
  accessToken: string;
  refreshToken: string;
  expiry: number;
}

export interface GoogleCalendarEvent {
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  attendees?: Array<{ email: string }>;
  status?: string;
}

// ==================== iCal Export Functions ====================

/**
 * Format an appointment as an iCal VEVENT
 */
export function formatAppointmentAsEvent(appointment: Appointment, leadName?: string): string {
  const startDate = new Date(appointment.scheduledFor);
  const endDate = new Date(appointment.scheduledFor + (appointment.windowMins || 60) * 60 * 1000);

  // Format dates for iCal: YYYYMMDDTHHmmssZ
  const formatICalDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const startDateStr = formatICalDate(startDate);
  const endDateStr = formatICalDate(endDate);
  const nowStr = formatICalDate(new Date());
  const uid = `${appointment._id}@elite-irrigation.com`;

  const lines = [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startDateStr}`,
    `DTEND:${endDateStr}`,
    `SUMMARY:${leadName || "Appointment"} - ${appointment.serviceSlug || "Service"}`,
    appointment.addressText ? `LOCATION:${appointment.addressText}` : "",
    appointment.notes ? `DESCRIPTION:${escapeICalText(appointment.notes)}` : "",
    `STATUS:CONFIRMED`,
    "END:VEVENT",
  ].filter(Boolean);

  return lines.join("\r\n");
}

/**
 * Escape special characters in iCal text
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generate iCal format from multiple appointments
 */
export function generateICalendar(
  appointments: Array<{ appointment: Appointment; leadName?: string }>
): string {
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const events = appointments
    .map(({ appointment, leadName }) => formatAppointmentAsEvent(appointment, leadName))
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Elite Irrigation & Landscaping//NONSGML v1.0//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Elite Irrigation Appointments`,
    `X-WR-TIMEZONE:America/Denver`,
    `X-WR-CALDESC:Appointments from Elite Irrigation & Landscaping OS`,
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Generate ICS file content for download
 */
export function generateICSFile(
  appointments: Array<{ appointment: Appointment; leadName?: string }>
): string {
  return generateICalendar(appointments);
}

/**
 * Trigger download of ICS file (browser-side function)
 * This should be called from client-side code
 */
export function downloadICSFile(
  appointments: Array<{ appointment: Appointment; leadName?: string }>,
  filename: string = "appointments.ics"
): void {
  const icsContent = generateICSFile(appointments);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ==================== Google Calendar Integration ====================

/**
 * Generate Google OAuth consent URL
 */
export function getAuthUrl(state?: string): string {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID || "";
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI || "http://localhost:5173/calendar/oauth/callback";
  const scope = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scope,
    access_type: "offline",
    prompt: "consent",
    state: state || "",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange OAuth code for access token
 */
export async function exchangeCodeForToken(
  code: string
): Promise<GoogleCalendarTokens> {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET || "";
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI || "http://localhost:5173/calendar/oauth/callback";

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }

  const data = await response.json();
  const expiresAt = Date.now() + data.expires_in * 1000;

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiry: expiresAt,
  };
}

/**
 * Refresh expired access token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<GoogleCalendarTokens> {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET || "";

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const data = await response.json();
  const expiresAt = Date.now() + data.expires_in * 1000;

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiry: expiresAt,
  };
}

/**
 * Create an event in Google Calendar
 */
export async function createGoogleCalendarEvent(
  event: CalendarEvent,
  token: string
): Promise<{ eventId: string; htmlLink: string }> {
  const googleEvent: GoogleCalendarEvent = {
    summary: event.title,
    description: event.description,
    location: event.location,
    start: {
      dateTime: event.startTime.toISOString(),
    },
    end: {
      dateTime: event.endTime.toISOString(),
    },
  };

  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(googleEvent),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create event: ${error}`);
  }

  const data = await response.json();
  return {
    eventId: data.id,
    htmlLink: data.htmlLink,
  };
}

/**
 * Update an event in Google Calendar
 */
export async function updateGoogleCalendarEvent(
  eventId: string,
  event: CalendarEvent,
  token: string
): Promise<{ htmlLink: string }> {
  const googleEvent: GoogleCalendarEvent = {
    summary: event.title,
    description: event.description,
    location: event.location,
    start: {
      dateTime: event.startTime.toISOString(),
    },
    end: {
      dateTime: event.endTime.toISOString(),
    },
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(googleEvent),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update event: ${error}`);
  }

  const data = await response.json();
  return {
    htmlLink: data.htmlLink,
  };
}

/**
 * Delete an event from Google Calendar
 */
export async function deleteGoogleCalendarEvent(
  eventId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok && response.status !== 404) {
    const error = await response.text();
    throw new Error(`Failed to delete event: ${error}`);
  }
}

/**
 * Sync a single appointment to Google Calendar
 */
export async function syncAppointmentToCalendar(
  appointment: Appointment,
  userToken: string,
  leadName?: string,
  eventId?: string
): Promise<{ eventId: string; htmlLink: string }> {
  const event: CalendarEvent = {
    id: appointment._id.toString(),
    title: `${leadName || "Appointment"} - ${appointment.serviceSlug || "Service"}`,
    description: appointment.notes || "",
    location: appointment.addressText || "",
    startTime: new Date(appointment.scheduledFor),
    endTime: new Date(appointment.scheduledFor + (appointment.windowMins || 60) * 60 * 1000),
    status: appointment.status,
  };

  if (eventId) {
    return await updateGoogleCalendarEvent(eventId, event, userToken);
  } else {
    return await createGoogleCalendarEvent(event, userToken);
  }
}

/**
 * Convert Convex appointment to CalendarEvent
 */
export function appointmentToCalendarEvent(
  appointment: Appointment,
  leadName?: string
): CalendarEvent {
  return {
    id: appointment._id.toString(),
    title: `${leadName || "Appointment"} - ${appointment.serviceSlug || "Service"}`,
    description: appointment.notes || "",
    location: appointment.addressText || "",
    startTime: new Date(appointment.scheduledFor),
    endTime: new Date(appointment.scheduledFor + (appointment.windowMins || 60) * 60 * 1000),
    status: appointment.status,
  };
}
