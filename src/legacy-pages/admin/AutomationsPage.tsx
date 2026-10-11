// src/pages/admin/AutomationsPage.tsx
import { useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Bot, Clock, ToggleLeft, ToggleRight, Activity, AlertTriangle } from "lucide-react";
import Link from "next/link";

const AGENTS = [
  { id: "SLAWatcher", name: "SLA Watcher", desc: "Monitors response times and escalates urgent leads if neglected." },
  { id: "FollowUpAgent", name: "Estimate Follow-up", desc: "Sends drip SMS to leads with 'estimated' status to close deals." },
  { id: "ReviewAgent", name: "Review Request", desc: "Asks for reviews after payment or job completion." },
];

const DEFAULT_POLICY_KEY = "SEC_DEFAULT";

export default function AutomationsPage() {
  const policyRow = useQuery(api.policies.get, { key: DEFAULT_POLICY_KEY });
  const recentRuns = useQuery(api.agentRuns.listRecent, { limit: 50 }) ?? [];
  const updatePolicy = useMutation(api.policies.upsert);

  const policy = policyRow?.value;

  const agentStatus = useMemo(() => {
    return AGENTS.map(agent => {
      const enabled = policy?.agentSettings?.[agent.id]?.enabled ?? true; // default true
      
      const lastRun = recentRuns.find((r: any) => r.agentName === agent.id);
      return { ...agent, enabled, lastRun };
    });
  }, [policy, recentRuns]);

  async function toggleAgent(agentId: string, current: boolean) {
    if (!policy) return;
    const newPolicy = { ...policy };
    newPolicy.agentSettings = {
      ...(newPolicy.agentSettings ?? {}),
      [agentId]: { ...(newPolicy.agentSettings?.[agentId] ?? {}), enabled: !current }
    };
    await updatePolicy({ key: DEFAULT_POLICY_KEY, value: newPolicy, updatedBy: "admin" });
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Automations</h1>
          <p className="text-sm text-zinc-500 mt-1">Autonomous agents managing background operations.</p>
        </div>
        <Link href="/admin/agent-runs" className="text-xs font-bold text-elite-600 hover:underline uppercase tracking-widest">
          View Full Logs
        </Link>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {agentStatus.map((agent) => (
          <div key={agent.id} className={`rounded-sm border p-6 transition-all ${agent.enabled ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-75'}`}>
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${agent.enabled ? 'bg-elite-50 text-elite-600' : 'bg-slate-200 text-slate-400'}`}>
                     <Bot className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-900 text-sm">{agent.name}</h3>
                     <span className={`text-[10px] uppercase tracking-wider font-bold ${agent.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {agent.enabled ? 'Active' : 'Paused'}
                     </span>
                  </div>
               </div>
               <button onClick={() => toggleAgent(agent.id, agent.enabled)} className="text-slate-400 hover:text-elite-600 transition-colors">
                  {agent.enabled ? <ToggleRight className="w-8 h-8 text-elite-600" /> : <ToggleLeft className="w-8 h-8" />}
               </button>
            </div>
            
            <p className="text-xs text-slate-500 mb-6 h-10 leading-relaxed">{agent.desc}</p>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
               <div className="flex items-center text-slate-400">
                  <Clock className="w-3 h-3 mr-1.5" />
                  {agent.lastRun ? (
                    <span>Last run: {new Date(agent.lastRun.ts).toLocaleTimeString()}</span>
                  ) : (
                    <span>No recent activity</span>
                  )}
               </div>
               {agent.lastRun?.status === 'blocked' && (
                 <span className="text-amber-600 font-bold flex items-center" title="Action blocked by SEC Policy">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Blocked
                 </span>
               )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-8">
         <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-elite-600" /> Recent Activity
         </h3>
         <div className="space-y-4">
            {recentRuns.slice(0, 5).map((run: any) => (
               <div key={run._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-sm border border-slate-100">
                  <div className="flex items-center gap-4">
                     <div className={`w-2 h-2 rounded-full ${run.status === 'ok' ? 'bg-emerald-500' : run.status === 'blocked' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                     <div>
                        <div className="text-sm font-bold text-slate-900">{run.agentName} <span className="text-slate-400 font-normal">→</span> {run.action}</div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono opacity-80">{JSON.stringify(run.payload).slice(0, 80)}...</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">{run.status}</div>
                     <div className="text-[10px] text-slate-400">{new Date(run.ts).toLocaleTimeString()}</div>
                  </div>
               </div>
            ))}
            {recentRuns.length === 0 && <div className="text-sm text-slate-400 italic">No agent runs recorded yet.</div>}
         </div>
      </div>
    </AdminLayout>
  );
}