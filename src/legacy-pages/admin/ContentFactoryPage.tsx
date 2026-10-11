// src/pages/admin/ContentFactoryPage.tsx
import AdminLayout from "./AdminLayout";
import { services } from "../../data/services";
import { locationsFull } from "../../data/locations_full";
import { problems } from "../../data/problems";
import { brands } from "../../data/brands";
import { costPages } from "../../data/costPages";
import { comparePages } from "../../data/comparePages";
import { nearMeVariants } from "../../data/nearMeVariants";

export default function ContentFactoryPage() {
  const spokeCount = services.length * locationsFull.length;
  const problemSpokes = problems.length * locationsFull.length;
  const brandSpokes = brands.length * locationsFull.length;
  const nearMeCount = nearMeVariants.length * locationsFull.length;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Content Factory</h1>

      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
          <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-4">Inventory Counts</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
               <span className="text-sm font-medium text-slate-700">Services Defined</span>
               <span className="font-bold text-slate-900">{services.length}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
               <span className="text-sm font-medium text-slate-700">Locations Mapped</span>
               <span className="font-bold text-slate-900">{locationsFull.length}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-2 bg-elite-50 -mx-2 px-2 rounded-sm">
               <span className="text-sm font-bold text-elite-800">Total Service Spokes</span>
               <span className="font-bold text-elite-800">{spokeCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
               <span className="text-sm font-medium text-slate-700">Problem Spokes</span>
               <span className="font-bold text-slate-900">{problemSpokes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
               <span className="text-sm font-medium text-slate-700">Brand Spokes</span>
               <span className="font-bold text-slate-900">{brandSpokes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
               <span className="text-sm font-medium text-slate-700">Near-Me Variants</span>
               <span className="font-bold text-slate-900">{nearMeCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
          <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-4">Generator Commands</div>
          <pre className="mt-3 text-xs bg-slate-900 text-slate-300 rounded-sm p-4 overflow-x-auto font-mono">
{`# Generate all assets
npm run gen:all

# Build static output
npm run build:static

# Prerender batches (large site)
BATCH_INDEX=0 BATCH_SIZE=5000 CONCURRENCY=8 node scripts/prerender-batched.mjs
`}
          </pre>

          <div className="mt-6 text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Tip:</strong> Enable exclusions (rings/states) in <code>src/data/exclusions.ts</code> to manage the total page count deployed to production.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}