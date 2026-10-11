"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../../src/components/AuthProvider";

export default function TechJobsClient() {
  const { user } = useAuth();
  const assignedTo = user?.email || user?._id || user?.name || "unassigned";
  const jobs = useQuery(
    api.workOrders.listForAssignee,
    assignedTo ? { assignedTo, limit: 200 } : "skip" as any
  ) ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">My Jobs</h1>
          <p className="text-xs text-zinc-500">Assigned to {assignedTo}</p>
        </div>
        <button
          className="text-xs font-bold uppercase tracking-widest hover:text-elite-600"
          onClick={() => window.location.reload()}
          type="button"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {jobs.map((wo: any) => (
          <Link
            key={wo._id}
            className="block rounded-sm border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all hover:border-elite-500 active:scale-[0.98]"
            href={`/tech/${wo._id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-bold text-slate-900">{wo.serviceSlug}</div>
              <span className={`shrink-0 rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${wo.proofComplete ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-500"}`}>
                {wo.proofComplete ? "Ready" : "Incomplete"}
              </span>
            </div>

            <div className="mt-2 flex flex-col gap-1 text-xs text-zinc-500">
              <span className="font-medium text-slate-700">{wo.locationSlug ?? "No location"}</span>
              <span>{wo.addressText ?? "No address"}</span>
            </div>
            {wo.scheduledFor ? (
              <div className="mt-3 border-t border-slate-50 pt-3 text-xs font-bold uppercase tracking-wide text-elite-700">
                {new Date(wo.scheduledFor).toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" })}
              </div>
            ) : null}
          </Link>
        ))}

        {jobs.length === 0 ? (
          <div className="rounded-sm border-2 border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-500">
            No active jobs assigned to <strong>{assignedTo}</strong>.
          </div>
        ) : null}
      </div>
    </div>
  );
}
