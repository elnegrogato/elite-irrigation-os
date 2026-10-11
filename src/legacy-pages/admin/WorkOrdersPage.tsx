// src/pages/admin/WorkOrdersPage.tsx
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useToast } from "../../components/ToastProvider";
import { handleError, showSuccessToast } from "../../lib/errorHandler";

const STATUSES = ["new","triage","assigned","scheduled","inProgress","completed","invoiced","closed"] as const;

export default function WorkOrdersPage() {
  const toast = useToast();
  const [status, setStatus] = useState<string>("triage");
  const rows = useQuery(api.workOrders.listByStatus, { status, limit: 200 }) ?? [];
  const setStatusMut = useMutation(api.workOrders.setStatus);
  const assignMut = useMutation(api.workOrders.assign);
  const setOverride = useMutation(api.workOrdersClose.setManagerOverride);
  const tryClose = useMutation(api.workOrdersClose.tryClose);
  const setScheduleOverride = useMutation(api.workOrdersOverride.setScheduleOverride);
  const sendDeposit = useAction(api.depositSend.sendDepositLinkSms);

  const [openId, setOpenId] = useState<string | null>(null);
  const [assignTo, setAssignTo] = useState("");
  
  const detail = useQuery(api.workOrders.get, openId ? { workOrderId: openId as any } : "skip" as any);
  
  const depositStatus = useQuery(
    api.depositStatus.forLead,
    detail?.wo?.leadId ? { leadId: detail.wo.leadId } : "skip" as any
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Work Orders</h1>
        <select className="rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {rows.map((wo: any) => (
            <button
              key={wo._id}
              className={`w-full text-left rounded-sm border p-4 hover:bg-slate-50 transition-all ${openId === wo._id ? 'border-elite-500 bg-elite-50' : 'border-slate-200 bg-white'}`}
              onClick={() => {
                  setOpenId(wo._id);
                  setAssignTo(wo.assignedTo || "");
              }}
            >
              <div className="text-sm font-bold text-slate-900 mb-1">{wo.serviceSlug}</div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                 <span>{wo.status}</span>
                 <span>{wo.priority}</span>
              </div>
              <div className="mt-2 text-xs text-slate-400 flex justify-between">
                <span>{wo.locationSlug ?? "—"}</span>
                <span>Proof: {wo.proofComplete ? "✅" : "❌"}</span>
              </div>
              {wo.scheduledFor ? <div className="mt-1 text-xs text-elite-600 font-medium">Scheduled: {new Date(wo.scheduledFor).toLocaleString()}</div> : null}
              {wo.assignedTo && <div className="mt-1 text-xs text-slate-500">Assigned: <strong>{wo.assignedTo}</strong></div>}
            </button>
          ))}
          {rows.length === 0 && (
             <div className="p-8 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-sm">No work orders in this status.</div>
          )}
        </div>

        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-4">Details</div>
          {!detail ? (
            <div className="text-sm text-zinc-600 italic">Select a work order to view details.</div>
          ) : (
            <>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between"><span className="text-slate-500">Service:</span> <span className="font-medium text-slate-900">{detail.wo.serviceSlug}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status:</span> <span className="font-medium text-slate-900">{detail.wo.status}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Area:</span> <span className="font-medium text-slate-900">{detail.wo.locationSlug ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Priority:</span> <span className="font-medium text-slate-900">{detail.wo.priority}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Proof:</span> <span className="font-medium text-slate-900">{detail.wo.proofComplete ? "Complete" : "Missing"}</span></div>
              </div>

              {/* Assignment Control */}
              <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-sm">
                 <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Assign Crew / Tech</label>
                 <div className="flex gap-2">
                    <input 
                        className="flex-1 rounded-sm border border-slate-200 p-2 text-sm focus:outline-none focus:border-elite-500" 
                        placeholder="e.g. crew-1"
                        value={assignTo}
                        onChange={(e) => setAssignTo(e.target.value)}
                    />
                    <button
                        className="bg-slate-900 text-white px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-slate-800"
                        onClick={async () => {
                            if (!assignTo.trim()) return;
                            try {
                                await assignMut({ workOrderId: detail.wo._id, assignedTo: assignTo });
                                toast.success("Assigned", "Work order assigned successfully.");
                            } catch (error) {
                                handleError(error, { context: "Assign work order" });
                            }
                        }}
                    >
                        Assign
                    </button>
                 </div>
              </div>

              {/* Deposit Warning */}
              {detail?.wo?.leadId && depositStatus && depositStatus.depositRuleEnabled && !depositStatus.ok && !detail.wo.managerOverrideSchedule ? (
                <div className="mt-4 mb-6 rounded-sm border border-amber-200 bg-amber-50 p-4">
                  <div className="text-sm font-semibold text-amber-900">Deposit required before scheduling</div>
                  <div className="mt-1 text-xs text-amber-700">{depositStatus.reason}</div>

                  <div className="flex gap-2 mt-3">
                    <button
                        className="rounded-sm bg-amber-900 text-white px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-amber-800"
                        onClick={async () => {
                            try {
                                const res: any = await sendDeposit({ leadId: detail.wo.leadId });
                                if (res?.alreadySatisfied) {
                                    toast.info(
                                        "Deposit Already Satisfied",
                                        `Required $${res.requiredDeposit.toFixed(2)}, paid $${res.amountPaid.toFixed(2)}.`
                                    );
                                } else {
                                    toast.success(
                                        "Deposit Link Sent",
                                        `Deposit link queued via SMS. Required ~$${res.requiredDeposit.toFixed(2)}.`
                                    );
                                }
                            } catch (error) {
                                handleError(error, { context: "Send deposit link" });
                            }
                        }}
                    >
                        Send Deposit Link
                    </button>
                    <button
                        className="rounded-sm border border-amber-300 text-amber-900 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-amber-100"
                        onClick={async () => {
                            try {
                                await setScheduleOverride({ workOrderId: detail.wo._id, override: true, note: "Manager override via UI" });
                                toast.success("Override Enabled", "Scheduling override enabled.");
                            } catch (error) {
                                handleError(error, { context: "Set schedule override" });
                            }
                        }}
                    >
                        Override
                    </button>
                  </div>
                </div>
              ) : null}

              {detail.wo.scope?.length ? (
                <div className="mb-6">
                  <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">Scope</div>
                  <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                    {detail.wo.scope.map((s: string) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              ) : null}

              <div className="mb-6">
                <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">Media Evidence</div>
                {detail.media.length === 0 ? <div className="text-xs text-slate-400 italic">No media uploaded.</div> : (
                  <div className="grid grid-cols-3 gap-2">
                    {detail.media.map((m: any) => (
                        <div key={m._id} className="rounded-sm border border-slate-200 overflow-hidden relative group aspect-square">
                        <img src={m.url} className="w-full h-full object-cover" alt={m.kind || "Work order photo"} loading="lazy" />
                        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/70 text-white text-[10px] p-1 truncate text-center">{m.kind}</div>
                        </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">Actions</div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {["assigned","scheduled","inProgress","completed"].map(s => (
                    <button
                        key={s}
                        className="rounded-sm border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-elite-50 hover:text-elite-700 hover:border-elite-200 transition-colors"
                        onClick={async () => {
                            try {
                                await setStatusMut({ workOrderId: detail.wo._id, status: s });
                                toast.success("Status Updated", `Status updated to ${s}`);
                            } catch (error) {
                                handleError(error, { context: `Update status to ${s}` });
                            }
                        }}
                    >
                        {s}
                    </button>
                    ))}
                </div>
                
                <div className="flex gap-2">
                    <button
                        className="flex-1 rounded-sm bg-white border border-slate-300 text-slate-700 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-slate-50"
                        onClick={async () => {
                            try {
                                await setOverride({ workOrderId: detail.wo._id, override: true });
                                toast.success("Override Enabled", "Manager override enabled. You can now close without payment.");
                            } catch (error) {
                                handleError(error, { context: "Override close gate" });
                            }
                        }}
                    >
                        Override Close Gate
                    </button>
                    <button
                        className="flex-1 rounded-sm bg-elite-900 text-white px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-elite-800"
                        onClick={async () => {
                            try {
                                await tryClose({ workOrderId: detail.wo._id });
                                toast.success("Job Closed", "Work order closed successfully.");
                            } catch (error) {
                                handleError(error, { context: "Close job" });
                            }
                        }}
                    >
                        Close Job
                    </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}