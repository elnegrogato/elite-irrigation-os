// src/components/ICSExportButton.tsx
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Download, Calendar, Loader2, CheckCircle } from "lucide-react";

interface ICSExportButtonProps {
  userId: string;
  startDate?: number;
  endDate?: number;
  filename?: string;
  className?: string;
}

export default function ICSExportButton({
  userId,
  startDate,
  endDate,
  filename = "appointments.ics",
  className = "",
}: ICSExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Default date range: next 30 days
  const defaultStartDate = startDate || Date.now();
  const defaultEndDate = endDate || Date.now() + 30 * 24 * 60 * 60 * 1000;

  const appointments = useQuery(
    api.calendar.getAppointmentsForICal,
    {
      userId: userId as any,
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      limit: 500,
    }
  );

  const handleExport = async () => {
    if (!appointments || appointments.length === 0) {
      alert("No appointments to export");
      return;
    }

    setIsExporting(true);
    setExportSuccess(false);

    try {
      // Import the calendar library functions
      const { downloadICSFile } = await import("../convex/lib/calendar");

      // Convert appointments to format expected by downloadICSFile
      const formattedAppointments = appointments.map((item) => ({
        appointment: item.appointment,
        leadName: item.leadName,
      }));

      // Trigger download
      downloadICSFile(formattedAppointments, filename);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to export appointments:", error);
      alert("Failed to export appointments. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const appointmentCount = appointments?.length || 0;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleExport}
        disabled={isExporting || appointmentCount === 0}
        className={`flex items-center gap-2 px-4 py-2 bg-elite-600 text-white rounded-sm text-sm font-medium hover:bg-elite-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exporting...
          </>
        ) : exportSuccess ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Exported!
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export to iCal
          </>
        )}
      </button>

      {appointmentCount > 0 && (
        <span className="text-sm text-slate-500">
          {appointmentCount} appointment{appointmentCount !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

// Simplified version for single appointment export
interface SingleAppointmentExportProps {
  appointment: any;
  leadName?: string;
  filename?: string;
  className?: string;
}

export function ExportSingleAppointment({
  appointment,
  leadName,
  filename = "appointment.ics",
  className = "",
}: SingleAppointmentExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const { downloadICSFile } = await import("../convex/lib/calendar");

      downloadICSFile(
        [{ appointment, leadName }],
        filename
      );
    } catch (error) {
      console.error("Failed to export appointment:", error);
      alert("Failed to export appointment. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-sm text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50 ${className}`}
      title="Add to calendar"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Calendar className="w-4 h-4" />
          Add to Calendar
        </>
      )}
    </button>
  );
}
