// src/components/CalendarSyncButton.tsx
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Calendar, Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface CalendarSyncButtonProps {
  userId: string;
  appointmentId?: string;
  onSyncComplete?: () => void;
}

export default function CalendarSyncButton({
  userId,
  appointmentId,
  onSyncComplete,
}: CalendarSyncButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [authWindow, setAuthWindow] = useState<Window | null>(null);

  const calendarStatus = useQuery(api.calendar.getUserCalendarIntegration, {
    userId: userId as any,
  });
  const syncAppointment = useMutation(api.calendar.syncAppointmentToGoogleCalendar);
  const syncAll = useMutation(api.calendar.syncAllAppointmentsForUser);
  const disconnect = useMutation(api.calendar.disconnectGoogleCalendar);
  const setAutoSync = useMutation(api.calendar.setCalendarSyncPreference);

  const handleConnect = () => {
    setIsConnecting(true);

    // Generate OAuth URL
    const clientId = import.meta.env.VITE_GOOGLE_CALENDAR_CLIENT_ID || "";
    const redirectUri = encodeURIComponent(window.location.origin + "/admin/calendar");
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
    );
    const state = encodeURIComponent(userId);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

    // Open popup for OAuth
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      "Google Calendar Authorization",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    setAuthWindow(popup);

    // Listen for popup close
    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        setAuthWindow(null);
        setIsConnecting(false);
        // Refresh calendar status
        window.location.reload();
      }
    }, 1000);
  };

  const handleSyncSingle = async () => {
    if (!appointmentId) return;
    try {
      await syncAppointment({ appointmentId: appointmentId as any });
      if (onSyncComplete) onSyncComplete();
    } catch (error) {
      console.error("Failed to sync appointment:", error);
      alert("Failed to sync appointment to calendar");
    }
  };

  const handleSyncAll = async () => {
    try {
      const result = await syncAll({ userId: userId as any });
      alert(result.message);
      if (onSyncComplete) onSyncComplete();
    } catch (error) {
      console.error("Failed to sync appointments:", error);
      alert("Failed to sync appointments to calendar");
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Google Calendar?")) return;

    try {
      await disconnect({ userId: userId as any });
      alert("Google Calendar disconnected successfully");
      if (onSyncComplete) onSyncComplete();
    } catch (error) {
      console.error("Failed to disconnect:", error);
      alert("Failed to disconnect Google Calendar");
    }
  };

  const handleToggleAutoSync = async (enabled: boolean) => {
    try {
      await setAutoSync({ userId: userId as any, enabled });
    } catch (error) {
      console.error("Failed to update sync preference:", error);
      alert("Failed to update sync preference");
    }
  };

  if (!calendarStatus) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-sm text-sm font-medium"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </button>
    );
  }

  if (!calendarStatus.connected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2 bg-elite-600 text-white rounded-sm text-sm font-medium hover:bg-elite-700 transition-colors disabled:opacity-50"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4" />
            Connect Google Calendar
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-sm">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-700">Connected</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={calendarStatus.autoSync}
            onChange={(e) => handleToggleAutoSync(e.target.checked)}
            className="w-4 h-4 text-elite-600 border-slate-300 rounded focus:ring-elite-500"
          />
          Auto-sync
        </label>
      </div>

      {appointmentId ? (
        <button
          onClick={handleSyncSingle}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-sm text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Sync to Calendar
        </button>
      ) : (
        <button
          onClick={handleSyncAll}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-sm text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Sync All
        </button>
      )}

      <button
        onClick={handleDisconnect}
        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-sm text-sm font-medium hover:bg-red-100 transition-colors"
      >
        <XCircle className="w-4 h-4" />
        Disconnect
      </button>
    </div>
  );
}
