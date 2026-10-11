// src/pages/admin/RouteWeekPlannerPage.tsx
import AdminLayout from "./AdminLayout";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { buildClusters, assignWeek } from "../../lib/weekPlanner";
import { locationsFull } from "../../data/locations_full";

function name(slug: string) {
  const l = locationsFull.find(x => x.slug === slug);
  return l ? `${l.name}` : slug;
}

export default function RouteWeekPlannerPage() {
  const density = useQuery(api.routes.density, { daysBack: 14 }) ?? {};

  const clusters = buildClusters(density as any);
  const { plan, totals } = assignWeek(clusters);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Week Route Planner</h1>
      <p className="mt-1 text-sm text-zinc-600 mb-8">
        Auto-clustered by neighbor groups and density score. Use this map to assign crew focus zones by day.
      </p>

      <div className="grid md:grid-cols-5 gap-4">
        {(["Mon","Tue","Wed","Thu","Fri"] as const).map(day => (
          <div key={day} className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="font-bold text-slate-900 text-sm uppercase tracking-widest">{day}</div>
              <div className="text-[10px] font-bold bg-elite-50 text-elite-700 px-2 py-0.5 rounded-sm">Score {totals[day].toFixed(0)}</div>
            </div>

            <div className="space-y-3 flex-1">
              {plan[day].slice(0, 8).map(c => (
                <div key={c.seed} className="rounded-sm border border-slate-100 bg-slate-50 p-3 hover:border-elite-300 transition-colors">
                  <div className="text-sm font-bold text-slate-900 mb-1">{name(c.seed)}</div>
                  <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wide mb-2">
                     <span>Score {c.score.toFixed(0)}</span>
                     <span>Ring {c.ringAvg.toFixed(1)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {c.members.slice(0, 6).map(name).join(" • ")}
                  </div>
                </div>
              ))}
              {plan[day].length === 0 && (
                 <div className="text-xs text-slate-400 italic text-center py-8">No clusters assigned</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}