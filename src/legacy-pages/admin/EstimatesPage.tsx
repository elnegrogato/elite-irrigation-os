// src/pages/admin/EstimatesPage.tsx
import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { servicePacks } from "../../data/servicePacks";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "../../components/ToastProvider";
import { handleError, showSuccessToast } from "../../lib/errorHandler";

export default function EstimatesPage() {
  const toast = useToast();
  const leads = useQuery(api.leads.listRecent, { limit: 200 }) ?? [];
  const estimates = useQuery(api.estimates.listRecent, { limit: 50 }) ?? [];
  const createDraft = useMutation(api.estimates.createDraft);
  const convertToWo = useMutation(api.workOrders.createFromEstimate);
  const setStatus = useMutation(api.estimates.setStatus);
  const sendEstimateEmail = useAction(api.emails.sendEstimate);

  const [leadId, setLeadId] = useState<string>("");
  const [packId, setPackId] = useState<string>(servicePacks[0]?.id ?? "");
  const [notes, setNotes] = useState<string>("");
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  const selectedPack = useMemo(() => servicePacks.find(p => p.id === packId), [packId]);
  const selectedLead = useMemo(() => leads.find(l => l._id === leadId), [leads, leadId]);

  const handleSendEmail = async (estimateId: string, leadId: string) => {
    setSendingEmail(estimateId);
    try {
      const result: any = await sendEstimateEmail({ estimateId });
      if (result.skipped) {
        toast.warning(
          "Email Not Sent",
          "Lead has unsubscribed from estimate emails"
        );
      } else if (result.success) {
        toast.success("Email Sent", "Estimate email sent successfully!");
        await setStatus({ estimateId, status: "sent" });
      } else {
        toast.error("Failed to Send", result.error || "Unknown error");
      }
    } catch (error) {
      handleError(error, { context: "Send estimate email" });
    } finally {
      setSendingEmail(null);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Estimate Builder</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Creator Panel */}
        <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm h-fit">
          <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">1. Select Lead</div>
          <select
            className="w-full rounded-sm border border-slate-200 p-3 text-sm focus:border-elite-500 outline-none mb-6"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
          >
            <option value="">Choose lead…</option>
            {leads.map(l => (
              <option key={l._id} value={l._id}>
                {(l.name ?? "New lead")} — {l.phone ?? ""} — {l.serviceSlug ?? "unknown"}
              </option>
            ))}
          </select>

          <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">2. Select Service Pack</div>
          <select
            className="w-full rounded-sm border border-slate-200 p-3 text-sm focus:border-elite-500 outline-none mb-6"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {servicePacks.map(p => (
              <option key={p.id} value={p.id}>
                {p.tier}: {p.name}
              </option>
            ))}
          </select>

          <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">3. Scope Notes</div>
          <textarea
            className="w-full rounded-sm border border-slate-200 p-3 text-sm focus:border-elite-500 outline-none mb-6 h-32"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Scope notes, assumptions, exclusions…"
          />

          <button
            className="w-full rounded-sm bg-elite-900 text-white px-4 py-4 text-xs font-bold uppercase tracking-widest hover:bg-elite-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!leadId || !selectedPack}
            onClick={async () => {
              if (!selectedPack || !leadId) return;

              const items = [
                {
                  sku: selectedPack.id,
                  name: selectedPack.name,
                  qty: 1,
                  unit: "job",
                  unitPrice: selectedPack.typicalRange?.min ?? 500,
                },
              ];

              try {
                await createDraft({
                  leadId: leadId as any,
                  items,
                  tierOptions: selectedPack.typicalRange
                    ? [{ tier: selectedPack.tier, total: selectedPack.typicalRange.min, summary: selectedPack.promise }]
                    : undefined,
                  notes: notes || undefined,
                });

                setNotes("");
                toast.success("Draft Created", "Draft estimate created successfully.");
              } catch (error) {
                handleError(error, { context: "Create draft estimate" });
              }
            }}
          >
            Create Draft Estimate
          </button>
        </div>

        {/* List of Recent Estimates */}
        <div className="rounded-sm border border-slate-200 bg-slate-50 p-8 h-fit">
          <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-4">Active Estimates</div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {estimates.map((est: any) => (
                <div key={est._id} className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm hover:border-elite-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                {new Date(est.createdAt).toLocaleDateString()}
                            </div>
                            <div className="font-serif font-bold text-slate-900 text-lg">
                                ${est.total.toLocaleString()}
                            </div>
                        </div>
                        <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-sm border ${est.status === 'sent' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {est.status}
                        </span>
                    </div>
                    
                    <div className="text-sm text-slate-600 mb-3">
                        {est.items[0]?.name} {est.items.length > 1 ? `+ ${est.items.length-1} more` : ""}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-50 flex-wrap">
                        {est.status === 'draft' && (
                            <button
                                className="flex-1 rounded-sm border border-slate-200 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 min-w-[100px]"
                                onClick={async () => {
                                    try {
                                        await setStatus({ estimateId: est._id, status: 'sent' });
                                        toast.success("Marked Sent", "Estimate marked as sent.");
                                    } catch (error) {
                                        handleError(error, { context: "Mark estimate as sent" });
                                    }
                                }}
                            >
                                Mark Sent
                            </button>
                        )}
                        <button
                            className={`flex-1 rounded-sm px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 min-w-[100px]
                                ${sendingEmail === est._id
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'}`}
                            onClick={() => handleSendEmail(est._id, est.leadId)}
                            disabled={sendingEmail === est._id}
                        >
                            {sendingEmail === est._id ? (
                                <>Sending...</>
                            ) : (
                                <>
                                    <Mail className="w-3 h-3" /> Send Email
                                </>
                            )}
                        </button>
                        <button
                            className="flex-1 rounded-sm bg-elite-900 text-white px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-elite-800 min-w-[100px]"
                            onClick={async () => {
                                try {
                                    // Mark accepted then convert
                                    await setStatus({ estimateId: est._id, status: 'accepted' });
                                    const res: any = await convertToWo({ estimateId: est._id });
                                    toast.success("Work Order Created", `Work Order ID: ${res}`);
                                } catch (error) {
                                    handleError(error, { context: "Convert estimate to work order" });
                                }
                            }}
                        >
                            Convert to Work Order
                        </button>
                    </div>
                </div>
            ))}
            {estimates.length === 0 && (
                <div className="text-center text-slate-400 text-xs italic py-8">No recent estimates.</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}