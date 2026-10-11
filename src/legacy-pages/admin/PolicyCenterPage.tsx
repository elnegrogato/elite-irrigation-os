// src/pages/admin/PolicyCenterPage.tsx
import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const DEFAULT_KEY = "SEC_DEFAULT";

export default function PolicyCenterPage() {
  const policyRow = useQuery(api.policies.get, { key: DEFAULT_KEY });
  const upsert = useMutation(api.policies.upsert);

  const [draft, setDraft] = useState<string>("");

  // init draft once
  const initial = useMemo(() => {
    if (!policyRow) return "";
    return JSON.stringify(policyRow.value, null, 2);
  }, [policyRow]);

  const valueText = draft || initial;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">SEC Policy Center</h1>
      <p className="mt-1 text-sm text-zinc-600 mb-8">
        Configuration for autonomous agents, approval thresholds, and tool permissions.
      </p>

      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <div className="font-bold text-sm text-slate-900">Policy JSON</div>
             <div className="text-xs text-slate-400 font-mono">{DEFAULT_KEY}</div>
          </div>
          
          <textarea
            className="w-full rounded-sm border border-slate-200 p-4 text-xs font-mono bg-slate-50 focus:border-elite-500 outline-none h-[500px]"
            value={valueText}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="{ ... }"
          />

          <button
            className="mt-4 w-full rounded-sm bg-elite-900 text-white px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-elite-800 transition-colors"
            onClick={async () => {
              try {
                const parsed = JSON.parse(valueText);
                await upsert({ key: DEFAULT_KEY, value: parsed, updatedBy: "admin" });
                setDraft("");
                alert("Policy saved successfully.");
              } catch (e: any) {
                alert(`Invalid JSON: ${String(e?.message ?? e)}`);
              }
            }}
          >
            Save Policy Configuration
          </button>
        </div>

        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <div className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-4">Controls & Definitions</div>
          
          <div className="space-y-6 text-sm text-slate-700">
             <div>
                <h4 className="font-bold text-slate-900 mb-2">Approval Thresholds</h4>
                <p className="text-slate-600">Defines financial limits for auto-approval. Agents typically blocked above <code>requireApprovalOver</code>.</p>
             </div>
             
             <div>
                <h4 className="font-bold text-slate-900 mb-2">Tool Permissions</h4>
                <p className="text-slate-600">Explicitly allow tools per agent. Example tools:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs font-mono text-slate-500">
                   <li>queue_sms</li>
                   <li>send_sms (High Risk)</li>
                   <li>advance_stage</li>
                   <li>create_estimate</li>
                </ul>
             </div>

             <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm">
                <h4 className="font-bold text-blue-900 text-xs uppercase tracking-widest mb-1">Tip</h4>
                <p className="text-blue-700 text-xs">
                   Restrict <code>send_sms</code> to AdminUser only. Give agents <code>queue_sms</code> so humans can review before sending.
                </p>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}