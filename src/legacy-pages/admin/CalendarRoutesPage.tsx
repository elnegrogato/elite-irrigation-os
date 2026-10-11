// src/pages/admin/CalendarRoutesPage.tsx
import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../../components/AuthProvider";
import CalendarSyncButton from "../../../components/CalendarSyncButton";
import ICSExportButton from "../../../components/ICSExportButton";
import { Download, Calendar as CalendarIcon } from "lucide-react";

export default function CalendarRoutesPage() {
  const { user } = useAuth();
  const now = Date.now();
  const start = now - 7 * 24 * 60 * 60 * 1000;
  const end = now + 21 * 24 * 60 * 60 * 1000;

  const appts = useQuery(api.appointments.listRange, { start, end, limit: 500 }) ?? [];
  const leads = useQuery(api.leads.listRecent, { limit: 200 }) ?? [];
  const create = useMutation(api.appointments.create);
  const sendDeposit = useAction(api.depositSend.sendDepositLinkSms);

  const [leadId, setLeadId] = useState("");
  const [time, setTime] = useState<string>("");
  const [windowMins, setWindowMins] = useState<number>(120);

  const sorted = useMemo(() => [...appts].sort((a, b) => a.scheduledFor - b.scheduledFor), [appts]);

  const depositStatus = useQuery(api.depositStatus.forLead, leadId ? { leadId: leadId as any } : "skip" as any);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Schedule & Routes</h1>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <ICSExportButton
                userId={user._id}
                startDate={start}
                endDate={end}
                filename="elite-irrigation-schedule.ics"
              />
              <CalendarSyncButton userId={user._id} />
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 rounded-sm border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <h3 className="font-serif font-bold text-lg text-slate-900 mb-4">Book Appointment</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Lead</label>
              <select className="w-full rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none" value={leadId} onChange={(e) => setLeadId(e.target.value)}>
                <option value="">Choose lead…</option>
                {leads.map(l => (
                  <option key={l._id} value={l._id}>
                    {(l.name ?? "New lead")} — {l.serviceSlug ?? "unknown"}
                  </option>
                ))}
              </select>
            </div>

            {leadId && depositStatus && depositStatus.depositRuleEnabled && !depositStatus.ok ? (
                <div className="mt-3 rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm">
                    <div className="font-semibold text-amber-900">Scheduling Blocked</div>
                    <div className="mt-1 text-xs text-amber-700">{depositStatus.reason}</div>
                    <button
                    className="mt-3 w-full rounded-sm bg-amber-900 text-white px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-amber-800"
                    onClick={async () => {
                        const res: any = await sendDeposit({ leadId: leadId as any });
                        alert(res?.alreadySatisfied ? "Deposit already satisfied." : "Deposit link has been sent.");
                    }}
                    >
                    Send Deposit Link Now
                    </button>
                </div>
            ) : null}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Time</label>
              <input
                className="w-full rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none"
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Window (Mins)</label>
              <input
                className="w-full rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none"
                type="number"
                value={windowMins}
                onChange={(e) => setWindowMins(Number(e.target.value))}
                placeholder="Window minutes"
              />
            </div>

            <button
              className="w-full mt-4 rounded-sm bg-elite-600 text-white px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-elite-700 transition-colors disabled:opacity-50"
              disabled={!leadId || !time}
              onClick={async () => {
                if (!leadId || !time) return;
                const dt = new Date(time).getTime();

                const lead = leads.find(l => l._id === leadId);
                try {
                    await create({
                    leadId: leadId as any,
                    scheduledFor: dt,
                    windowMins,
                    status: "proposed",
                    locationSlug: lead?.locationSlug,
                    addressText: lead?.addressText,
                    serviceSlug: lead?.serviceSlug,
                    });

                    setTime("");
                    alert("Appointment created.");
                } catch(e: any) {
                    alert("Scheduling Failed: " + e.message);
                }
              }}
            >
              Add to Schedule
            </button>
          </div>
        </div>

        <div className="md:col-span-2 rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif font-bold text-lg text-slate-900 mb-4">Upcoming Route</h3>
          <div className="space-y-3">
            {sorted.length === 0 && <p className="text-sm text-slate-500 italic">No appointments scheduled.</p>}
            {sorted.map((a: any) => (
              <div key={a._id} className="flex items-center justify-between p-4 border border-slate-100 rounded-sm hover:bg-slate-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-16 flex-shrink-0 text-center mr-4">
                     <div className="text-xs font-bold text-slate-500 uppercase">{new Date(a.scheduledFor).toLocaleDateString(undefined, {weekday: 'short'})}</div>
                     <div className="text-lg font-bold text-slate-900">{new Date(a.scheduledFor).getDate()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {new Date(a.scheduledFor).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {a.status}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      <span className="font-medium">Lead {a.leadId.slice(-4)}</span> • {a.serviceSlug ?? "—"} • {a.locationSlug ?? "—"}
                    </div>
                    {a.addressText && <div className="text-xs text-slate-400 mt-1">{a.addressText}</div>}
                  </div>
                </div>

                {/* Sync Status Indicator */}
                <div className="flex items-center gap-2">
                  {a.calendarSyncStatus === "synced" ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-green-700">Synced</span>
                    </div>
                  ) : a.calendarSyncStatus === "error" ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs font-medium text-red-700">Error</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 border border-slate-200 rounded">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span className="text-xs font-medium text-slate-600">Not Synced</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}