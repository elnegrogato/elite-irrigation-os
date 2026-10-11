// src/pages/admin/LeadsPipelineBulkPage.tsx
import { useMemo, useState } from "react";
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

export default function LeadsPipelineBulkPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const [bulkMode, setBulkMode] = useState<boolean>(false);
  const [bulkSet, setBulkSet] = useState<Set<string>>(new Set());

  const setStage = useMutation(api.leads.setStage);
  const bulkSetStage = useMutation(api.leadsBulk.bulkSetStage);
  const bulkQueueSms = useMutation(api.messagesBulk.bulkQueueSms);

  const columns = STAGES.map(stage => ({
    stage,
    leads: useQuery(api.leads.listByStage, { stage, limit: 200 }) ?? [],
  }));

  const selectedLead = useQuery(api.leads.get, selected ? { leadId: selected as any } : "skip" as any);

  const bulkIds = useMemo(() => Array.from(bulkSet), [bulkSet]);

  async function onDrop(stage: Stage) {
    if (!dragId) return;
    await setStage({ leadId: dragId as any, to: stage, by: "human" });
    setDragId(null);
  }

  function toggleBulk(id: string) {
    setBulkSet(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold font-serif text-slate-900">Leads Pipeline</h1>

        <div className="flex items-center gap-2">
          <button
            className={`rounded-sm border px-3 py-2 text-sm uppercase tracking-widest font-bold transition-colors ${bulkMode ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            onClick={() => {
              setBulkMode(!bulkMode);
              setBulkSet(new Set());
            }}
          >
            {bulkMode ? "Bulk Mode: ON" : "Bulk Mode: OFF"}
          </button>
          <div className="text-xs text-zinc-500 hidden sm:block">Drag/drop works either way.</div>
        </div>
      </div>

      {/* Bulk action bar */}
      {bulkMode && bulkIds.length > 0 ? (
        <div className="mt-6 rounded-sm border border-slate-200 bg-white p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between shadow-sm animate-fade-in-up">
          <div className="text-sm font-bold text-slate-900">
            Selected: <span className="text-elite-600">{bulkIds.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["contacted","estimated","booked","completed"] as const).map(s => (
              <button
                key={s}
                className="rounded-sm border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-elite-50 hover:text-elite-700 hover:border-elite-200 transition-colors"
                onClick={async () => {
                  await bulkSetStage({ leadIds: bulkIds as any, to: s, by: "human" });
                  setBulkSet(new Set());
                }}
              >
                Move → {s}
              </button>
            ))}

            <button
              className="rounded-sm bg-elite-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-elite-800 transition-colors"
              onClick={async () => {
                const template = "Elite here — quick question about {service} in {location}: would you like to schedule this week? Reply YES and we’ll send time windows.";
                await bulkQueueSms({ leadIds: bulkIds as any, bodyTemplate: template, scheduledFor: Date.now() + 60_000, meta: { kind: "bulk_followup" } });
                setBulkSet(new Set());
                alert("Queued SMS follow-ups.");
              }}
            >
              Queue SMS Follow-up
            </button>

            <button
              className="rounded-sm border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              onClick={() => setBulkSet(new Set())}
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}

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
                  className={`rounded-sm border p-3 transition-all hover:shadow-md cursor-grab active:cursor-grabbing group ${bulkMode && bulkSet.has(l._id) ? "border-elite-500 bg-elite-50 shadow-md" : "border-slate-200 bg-white"}`}
                >
                  <div className="flex items-start gap-2">
                    {bulkMode ? (
                      <input
                        type="checkbox"
                        checked={bulkSet.has(l._id)}
                        onChange={() => toggleBulk(l._id)}
                        className="mt-1 accent-elite-600 w-4 h-4 cursor-pointer"
                      />
                    ) : null}

                    <button className="w-full text-left" onClick={() => setSelected(l._id)}>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-elite-700 mb-1">{l.name ?? "New lead"}</div>
                      <div className="text-xs text-slate-500 font-medium flex justify-between items-center">
                        <span>{l.surface}</span>
                        <span className={l.urgency === 'emergency' ? 'text-red-600 font-bold' : ''}>{l.urgency}</span>
                      </div>
                      <div className="mt-1 text-[10px] text-slate-400">
                        {l.locationSlug ?? "unknown area"}
                      </div>
                    </button>
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