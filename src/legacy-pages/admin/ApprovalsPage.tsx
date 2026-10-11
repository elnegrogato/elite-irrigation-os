// src/pages/admin/ApprovalsPage.tsx
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export default function ApprovalsPage() {
  const rows = useQuery(api.approvals.listPending, { limit: 200 }) ?? [];
  const decide = useMutation(api.approvals.decide);

  const [note, setNote] = useState<string>("");

  return (
    <AdminLayout>
      <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Approvals</h1>
      <p className="mt-1 text-sm text-zinc-600 mb-8">Pending approvals triggered by SEC policy thresholds.</p>

      <div className="space-y-4">
        {rows.map((r: any) => (
          <div key={r._id} className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm hover:border-elite-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <div className="text-lg font-bold text-slate-900">
                    {r.kind} • <span className="font-serif">${r.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{r.reason}</div>
               </div>
               <div className="text-right text-xs text-slate-400">
                  <div>Lead: {r.leadId ?? "—"}</div>
                  <div>Entity: {r.entityId ?? "—"}</div>
               </div>
            </div>

            <pre className="mt-2 text-xs bg-slate-50 border border-slate-100 rounded-sm p-4 overflow-auto font-mono text-slate-600">
              {JSON.stringify(r.details ?? {}, null, 2)}
            </pre>

            <textarea
              className="mt-4 w-full rounded-sm border border-slate-200 p-3 text-sm focus:border-elite-500 outline-none"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Decision note (optional)"
            />

            <div className="mt-4 flex gap-3">
              <button
                className="rounded-sm bg-elite-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-elite-800 transition-colors"
                onClick={async () => {
                  await decide({ approvalId: r._id, decision: "approved", decidedBy: "admin", note: note || undefined });
                  setNote("");
                }}
              >
                Approve
              </button>
              <button
                className="rounded-sm border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                onClick={async () => {
                  await decide({ approvalId: r._id, decision: "rejected", decidedBy: "admin", note: note || undefined });
                  setNote("");
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="rounded-sm border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center text-sm text-slate-500">
            No pending approvals.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}