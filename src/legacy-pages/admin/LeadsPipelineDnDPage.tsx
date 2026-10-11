// src/pages/admin/LeadsPipelineDnDPage.tsx
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import LeadDetailDrawer from "./LeadDetailDrawer";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const STAGES = ["lead","contacted","inspected","estimated","booked","inProgress","completed","reviewed"] as const;
type Stage = typeof STAGES[number];

function stageLabel(s: Stage) {
  if (s === "inProgress") return "In Progress";
  return s[0].toUpperCase() + s.slice(1);
}

export default function LeadsPipelineDnDPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const setStage = useMutation(api.leads.setStage);

  const columns = STAGES.map(stage => ({
    stage,
    leads: useQuery(api.leads.listByStage, { stage, limit: 200 }) ?? [],
  }));

  const selectedLead = useQuery(api.leads.get, selected ? { leadId: selected as any } : "skip" as any);

  async function onDrop(stage: Stage) {
    if (!dragId) return;
    await setStage({ leadId: dragId as any, to: stage, by: "human" });
    setDragId(null);
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold font-serif text-slate-900">Leads Pipeline</h1>
        <div className="text-sm text-zinc-600">Drag a lead card into a new column to update status.</div>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-4 items-start min-h-[calc(100vh-200px)]">
        {columns.map(({ stage, leads }) => (
          <div
            key={stage}
            className="rounded-sm border border-zinc-200 bg-slate-50 p-3 min-w-[280px] w-[280px] flex-shrink-0 flex flex-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(stage)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">{stageLabel(stage)}</div>
              <div className="text-[10px] font-bold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{leads.length}</div>
            </div>

            <div className="space-y-2 flex-1 min-h-[100px]">
              {leads.map(l => (
                <div
                  key={l._id}
                  draggable
                  onDragStart={() => setDragId(l._id)}
                  className="rounded-sm border border-slate-200 bg-white p-3 hover:shadow-md cursor-grab active:cursor-grabbing transition-all group"
                  onClick={() => setSelected(l._id)}
                >
                  <div className="text-sm font-bold text-slate-900 group-hover:text-elite-700 mb-1">{l.name ?? "New lead"}</div>
                  <div className="text-xs text-slate-500 font-medium flex justify-between items-center">
                    <span>{l.surface}</span>
                    <span className={l.urgency === 'emergency' ? 'text-red-600 font-bold' : ''}>{l.urgency}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {l.serviceSlug ?? "unknown"}
                  </div>
                </div>
              ))}
              {leads.length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-200 rounded-sm flex items-center justify-center text-xs text-slate-400 italic">
                  Empty
                </div>
              )}
            </div>
          </div>
        ))}
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