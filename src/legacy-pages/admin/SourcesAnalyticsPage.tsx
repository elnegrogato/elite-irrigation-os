// src/pages/admin/SourcesAnalyticsPage.tsx
import { useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function SourcesAnalyticsPage() {
  const leads = useQuery(api.leads.listRecent, { limit: 500 }) ?? [];

  const bySurface = useMemo(() => {
    const m = new Map<string, { count: number; emergencies: number; completed: number }>();
    for (const l of leads) {
      const key = l.surface ?? "unknown";
      const cur = m.get(key) ?? { count: 0, emergencies: 0, completed: 0 };
      cur.count += 1;
      if (l.urgency === "emergency") cur.emergencies += 1;
      if (l.stage === "completed") cur.completed += 1;
      m.set(key, cur);
    }
    return Array.from(m.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [leads]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Source Analytics</h1>

      <div className="rounded-sm border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="p-4">Surface</th>
              <th className="p-4 text-right">Leads</th>
              <th className="p-4 text-right">Emergencies</th>
              <th className="p-4 text-right">Completed</th>
              <th className="p-4 text-right">Conv. Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bySurface.map(([surface, s]) => (
              <tr key={surface} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-900">{surface}</td>
                <td className="p-4 text-right text-slate-600">{s.count}</td>
                <td className="p-4 text-right text-red-600 font-medium">{s.emergencies}</td>
                <td className="p-4 text-right text-emerald-600 font-medium">{s.completed}</td>
                <td className="p-4 text-right text-slate-600">{s.count > 0 ? ((s.completed / s.count) * 100).toFixed(1) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}