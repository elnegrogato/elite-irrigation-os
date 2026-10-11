// src/pages/admin/CaseStudyDraftsPage.tsx
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function CaseStudyDraftsPage() {
  const drafts = useQuery(api.caseStudyDrafts.listDrafts, { limit: 200 }) ?? [];
  const setPublish = useMutation(api.caseStudies.setPublish);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Case Study Drafts</h1>
      <p className="mt-1 text-sm text-zinc-600 mb-8">
        Auto-generated from completed work orders with proof. Review content and publish to the site.
      </p>

      <div className="space-y-6">
        {drafts.map((cs: any) => (
          <div key={cs._id} className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <div className="text-lg font-bold text-slate-900">{cs.title}</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
                    {cs.serviceSlug} • {cs.locationSlug}
                  </div>
               </div>
               <div className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wide border border-amber-100 rounded-sm">
                  Draft
               </div>
            </div>
            
            <p className="text-sm text-slate-700 mb-6 leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-sm">
               {cs.summary}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">Scope</div>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {cs.scopeBullets.slice(0, 6).map((b: string) => <li key={b}>{b}</li>)}
                </ul>
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">Outcome</div>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {cs.outcomeBullets.slice(0, 6).map((b: string) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            </div>

            {cs.media?.length ? (
              <div className="mb-6">
                 <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">Media</div>
                 <div className="grid grid-cols-4 gap-4">
                    {cs.media.slice(0, 8).map((m: any, i: number) => (
                    <div key={i} className="rounded-sm border border-slate-200 overflow-hidden relative aspect-square group">
                        <img src={m.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={m.kind || "Case study draft photo"} loading="lazy" />
                        <div className="absolute bottom-0 left-0 w-full bg-slate-900/70 text-white text-[10px] p-1 truncate text-center">
                           {m.kind}
                        </div>
                    </div>
                    ))}
                 </div>
              </div>
            ) : null}

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                className="rounded-sm bg-elite-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-elite-800 transition-colors"
                onClick={async () => {
                  await setPublish({ id: cs._id, publish: true, by: "admin" });
                  alert("Published to site.");
                }}
              >
                Publish
              </button>
              <button
                className="rounded-sm border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 text-slate-600 transition-colors"
                onClick={async () => {
                  // Logic to keep as draft or delete could go here
                  alert("Kept as draft.");
                }}
              >
                Edit / Keep Draft
              </button>
            </div>
          </div>
        ))}

        {drafts.length === 0 && (
          <div className="rounded-sm border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center text-sm text-slate-500">
            No drafts available. Complete a work order with before/after photos to generate one.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}