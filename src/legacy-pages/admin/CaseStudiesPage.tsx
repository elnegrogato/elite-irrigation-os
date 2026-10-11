// src/pages/admin/CaseStudiesPage.tsx
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { locationsFull } from "../../data/locations_full";
import { services } from "../../data/services";

export default function CaseStudiesPage() {
  const create = useMutation(api.caseStudies.create);
  const exportAll = useQuery(api.caseStudies.exportAllPublished, {});

  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug ?? "sprinkler-repair");
  const [locationSlug, setLocationSlug] = useState(locationsFull[0]?.slug ?? "charlotte");
  const [title, setTitle] = useState("Sprinkler leak repair + coverage tune");
  const [summary, setSummary] = useState("Diagnosed leak and coverage issues, repaired failed components, tuned arcs/radius, and verified uniform watering.");
  const [scope, setScope] = useState("Zone test\nLeak isolation\nValve/head repair\nController schedule tune\nBefore/after photos");
  const [outcomes, setOutcomes] = useState("Water waste stopped\nCoverage restored\nDocumented functional test\nFollow-up plan set");
  const [media, setMedia] = useState("https://example.com/before1.jpg|before|Before (wide)\nhttps://example.com/after1.jpg|after|After (wide)");
  const [publish, setPublish] = useState(true);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Case Studies</h1>
      <p className="mt-1 text-sm text-zinc-600 mb-8">
        Create proof projects to automatically embed into relevant service and location pages.
      </p>

      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
          <div className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-4">New Case Study</div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
               <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Service</label>
               <select className="w-full rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none" value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)}>
                 {services.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Location</label>
               <select className="w-full rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none" value={locationSlug} onChange={(e) => setLocationSlug(e.target.value)}>
                 {locationsFull.map(l => <option key={l.slug} value={l.slug}>{l.name}, {l.state}</option>)}
               </select>
            </div>
          </div>

          <div className="mb-4">
             <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Project Title</label>
             <input className="w-full rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          
          <div className="mb-4">
             <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Summary</label>
             <textarea className="w-full rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>

          <div className="mb-4">
             <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Scope Bullets (one per line)</label>
             <textarea className="w-full rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none" rows={4} value={scope} onChange={(e) => setScope(e.target.value)} />
          </div>

          <div className="mb-4">
             <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Outcome Bullets (one per line)</label>
             <textarea className="w-full rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none" rows={4} value={outcomes} onChange={(e) => setOutcomes(e.target.value)} />
          </div>

          <div className="mb-4">
             <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Media (url|kind|caption)</label>
             <textarea className="w-full rounded-sm border border-slate-200 p-2 text-xs font-mono focus:border-elite-500 outline-none" rows={4} value={media} onChange={(e) => setMedia(e.target.value)} />
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="accent-elite-600 w-4 h-4" />
            Publish immediately (embeds into pages)
          </label>

          <button
            className="mt-6 w-full rounded-sm bg-elite-900 text-white px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-elite-800 transition-colors"
            onClick={async () => {
              const scopeBullets = scope.split("\n").map(s => s.trim()).filter(Boolean);
              const outcomeBullets = outcomes.split("\n").map(s => s.trim()).filter(Boolean);
              const mediaArr = media.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
                const [url, kind, caption] = line.split("|");
                return { url, kind, caption };
              });

              await create({
                serviceSlug,
                locationSlug,
                neighborSlugs: [],
                title,
                summary,
                scopeBullets,
                outcomeBullets,
                media: mediaArr as any,
                publish,
              });

              alert("Case study created successfully.");
            }}
          >
            Save Case Study
          </button>
        </div>

        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <div className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-4">Published Export</div>
          <p className="text-xs text-slate-500 mb-4">
             Raw JSON of published case studies. Useful for static builds or verifying data.
          </p>
          <textarea
            className="w-full rounded-sm border border-slate-200 p-3 text-xs font-mono bg-slate-50 h-[500px] outline-none"
            readOnly
            value={JSON.stringify(exportAll ?? [], null, 2)}
          />
        </div>
      </div>
    </AdminLayout>
  );
}