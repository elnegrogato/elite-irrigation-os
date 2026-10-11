// src/pages/admin/LeadsPipelinePage.tsx
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import LeadDetailDrawer from "./LeadDetailDrawer";

const STAGES = [
  "lead",
  "contacted",
  "inspected",
  "estimated",
  "booked",
  "inProgress",
  "completed",
  "reviewed",
] as const;

type Stage = typeof STAGES[number];

function stageLabel(s: Stage) {
  return s === "inProgress" ? "In Progress" : s[0].toUpperCase() + s.slice(1);
}

export default function LeadsPipelinePage() {
  const [selected, setSelected] = useState<string | null>(null);

  // In a real app we'd likely want one query returning all leads to sort client-side or improved backend grouping
  // For this demo, querying by stage individually or just listing all is fine.
  // Using listRecent for now as a fallback if stages aren't populated in mock data yet.
  const allLeads = useQuery(api.leads.listRecent, { limit: 200 }) ?? [];
  const setStage = useMutation(api.leads.setStage);

  const selectedLead = useQuery(api.leads.get, selected ? { leadId: selected as any } : "skip" as any);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Leads Pipeline</h1>
        <div className="text-sm text-zinc-600">Drag/drop later — click a card to open, then move stage.</div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6">
        {STAGES.map((stage) => {
          const leadsInStage = allLeads.filter((l: any) => l.stage === stage);
          
          return (
            <div key={stage} className="min-w-[280px] w-[280px] flex-shrink-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">{stageLabel(stage)}</div>
                <div className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{leadsInStage.length}</div>
              </div>

              <div className="space-y-3">
                {leadsInStage.map((l: any) => (
                  <button
                    key={l._id}
                    onClick={() => setSelected(l._id)}
                    className="w-full text-left rounded-sm border border-slate-200 bg-white p-4 hover:shadow-md hover:border-elite-300 transition-all group"
                  >
                    <div className="text-sm font-bold text-slate-900 group-hover:text-elite-700">{l.name ?? "New lead"}</div>
                    <div className="mt-2 text-xs text-slate-500 font-medium">
                      {l.surface} • <span className={l.urgency === 'emergency' ? 'text-red-600 font-bold' : ''}>{l.urgency ?? "medium"}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {l.locationSlug ?? "unknown area"} • {l.serviceSlug}
                    </div>
                  </button>
                ))}
                {leadsInStage.length === 0 && (
                  <div className="h-24 border border-dashed border-slate-200 rounded-sm flex items-center justify-center text-xs text-slate-400">
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <LeadDetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        lead={selectedLead ?? null}
        onMoveStage={async (to) => {
          if (!selected) return;
          await setStage({ leadId: selected as any, to, by: "human" });
        }}
      />
    </AdminLayout>
  );
}