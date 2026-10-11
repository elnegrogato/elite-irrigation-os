// src/pages/admin/CalendarSettingsPage.tsx
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../../components/AuthProvider";
import CalendarSyncButton from "../../components/CalendarSyncButton";
import ICSExportButton from "../../components/ICSExportButton";
import {
  Calendar,
  Settings,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function CalendarSettingsPage() {
  const { user } = useAuth();
  const [syncHistoryLimit, setSyncHistoryLimit] = useState(20);

  const calendarStatus = useQuery(
    api.calendar.getUserCalendarIntegration,
    user?._id ? { userId: user._id as any } : "skip"
  );
  const syncHistory = useQuery(
    api.calendar.getCalendarSyncHistory,
    user?._id ? { userId: user._id as any, limit: syncHistoryLimit } : "skip"
  );

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">Loading user information...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
            Calendar Settings
          </h1>
          <p className="text-slate-600">
            Manage Google Calendar integration and export appointments
          </p>
        </div>

        {/* Google Calendar Integration Section */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-elite-100 rounded-sm flex items-center justify-center">
                <Calendar className="w-5 h-5 text-elite-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Google Calendar Integration
                </h2>
                <p className="text-sm text-slate-500">
                  Sync appointments automatically to your Google Calendar
                </p>
              </div>
            </div>

            {calendarStatus?.connected && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Connected</span>
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="bg-slate-50 rounded-sm border border-slate-200 p-4 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Status
                </div>
                <div className="flex items-center gap-2">
                  {calendarStatus?.connected ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">Not Connected</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Auto-Sync
                </div>
                <div className="flex items-center gap-2">
                  {calendarStatus?.autoSync ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Enabled</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">Disabled</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Token Status
                </div>
                <div className="flex items-center gap-2">
                  {calendarStatus?.hasValidToken ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Valid</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-700">Expired/Invalid</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <CalendarSyncButton userId={user._id} />
          </div>
        </div>

        {/* iCal Export Section */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-sm flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Export to iCal (.ics)
              </h2>
              <p className="text-sm text-slate-500">
                Download appointments as an iCal file to import into any calendar app
              </p>
            </div>
          </div>

          {/* Export Options */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Export Range
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm focus:border-elite-500 outline-none"
                defaultValue="30"
              >
                <option value="7">Next 7 days</option>
                <option value="30">Next 30 days</option>
                <option value="90">Next 90 days</option>
                <option value="365">Next year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Filter
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm focus:border-elite-500 outline-none"
                defaultValue="all"
              >
                <option value="all">All appointments</option>
                <option value="upcoming">Upcoming only</option>
                <option value="completed">Completed only</option>
              </select>
            </div>

            <div className="flex items-end">
              <ICSExportButton
                userId={user._id}
                filename="elite-irrigation-appointments.ics"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium mb-1">
                About iCal Export
              </p>
              <p className="text-xs text-blue-700">
                The exported .ics file can be imported into Google Calendar, Apple Calendar,
                Outlook, or any other calendar application that supports the iCalendar format.
                This is a one-time export - changes made after exporting won't be reflected.
              </p>
            </div>
          </div>
        </div>

        {/* Sync History Section */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-sm flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Sync History</h2>
                <p className="text-sm text-slate-500">
                  Recent calendar synchronization activity
                </p>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {!syncHistory || syncHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No sync history yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Synced appointments will appear here
                </p>
              </div>
            ) : (
              syncHistory.map((apt: any) => (
                <div
                  key={apt._id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-500 uppercase">
                        {new Date(apt.scheduledFor).toLocaleDateString(undefined, {
                          weekday: "short",
                        })}
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        {new Date(apt.scheduledFor).getDate()}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {apt.serviceSlug || "Appointment"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {apt.addressText || "No address"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {apt.calendarSyncStatus === "synced" ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-sm">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-medium text-green-700">Synced</span>
                      </div>
                    ) : apt.calendarSyncStatus === "error" ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-sm">
                        <XCircle className="w-3 h-3 text-red-600" />
                        <span className="text-xs font-medium text-red-700">Error</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-sm">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-xs font-medium text-slate-600">Pending</span>
                      </div>
                    )}

                    {apt.calendarSyncedAt && (
                      <span className="text-xs text-slate-400">
                        {new Date(apt.calendarSyncedAt).toLocaleString()}
                      </span>
                    )}

                    {apt.googleCalendarEventId && (
                      <a
                        href={`https://calendar.google.com/calendar/event?eid=${btoa(
                          apt.googleCalendarEventId
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-elite-600 hover:text-elite-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-bold text-slate-900">Setup Instructions</h2>
          </div>

          <div className="prose prose-sm max-w-none">
            <ol className="text-sm text-slate-600 space-y-2">
              <li>
                <strong>Connect Google Calendar:</strong> Click the "Connect Google Calendar" button above and authorize the application.
              </li>
              <li>
                <strong>Enable Auto-Sync:</strong> Once connected, enable auto-sync to automatically sync new and updated appointments.
              </li>
              <li>
                <strong>Manual Sync:</strong> Use the "Sync All" button to manually sync all appointments to your calendar.
              </li>
              <li>
                <strong>Export to iCal:</strong> Use the export button to download appointments as an .ics file for one-time imports.
              </li>
              <li>
                <strong>View Sync History:</strong> Check the sync history section to see which appointments have been synced and their status.
              </li>
            </ol>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-sm">
              <p className="text-sm text-amber-900 font-medium mb-1">
                Note on Google Calendar API
              </p>
              <p className="text-xs text-amber-700">
                This integration uses the Google Calendar API. Make sure your Google Cloud Console project has the Calendar API enabled
                and your OAuth 2.0 credentials are properly configured. Contact your administrator if you encounter connection issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
