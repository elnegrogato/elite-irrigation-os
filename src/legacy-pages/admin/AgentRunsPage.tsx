// src/pages/admin/AgentRunsPage.tsx
import AdminLayout from "./AdminLayout";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function AgentRunsPage() {
  const rows = useQuery(api.agentRuns.listRecent, { limit: 200 }) ?? [];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Agent Runs</h1>
      <p className="mt-1 text-sm text-zinc-600 mb-8">
        Audit log of all autonomous and automated actions performed by the system.
      </p>

      <div className="space-y-3">
        {rows.map((r: any) => (
          <div key={r._id} className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm hover:border-elite-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
               <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-sm">{r.agentName}</span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-slate-600 text-sm font-mono">{r.action}</span>
               </div>
               <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                  r.status === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  r.status === 'blocked' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-red-50 text-red-700 border-red-100'
               }`}>
                  {r.status}
               </span>
            </div>
            
            <div className="text-xs text-slate-500 mb-3 flex gap-4">
               <span>Time: {new Date(r.ts).toLocaleString()}</span>
               {r.leadId && <span>Lead: {r.leadId}</span>}
               {r.policyKey && <span>Policy: {r.policyKey}</span>}
            </div>

            <pre className="mt-2 text-[10px] bg-slate-50 border border-slate-100 rounded-sm p-3 overflow-x-auto text-slate-600 font-mono">
               {JSON.stringify(r.payload, null, 2)}
            </pre>
            
            {r.error && (
               <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-sm border border-red-100 font-mono">
                  Error: {r.error}
               </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}