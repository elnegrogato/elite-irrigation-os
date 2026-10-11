// src/components/Checklists.tsx
import { CheckCircle2 } from "lucide-react";

export default function Checklists(props: { preArrival: string[]; onSite: string[]; closeout: string[] }) {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-serif font-bold text-stone-900">Execution Checklists</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Before we arrive", items: props.preArrival, bg: "bg-white" },
          { title: "On-site process", items: props.onSite, bg: "bg-stone-50" },
          { title: "Closeout proof", items: props.closeout, bg: "bg-white" },
        ].map(col => (
          <div key={col.title} className={`rounded-2xl border border-stone-200 p-5 sm:p-6 ${col.bg}`}>
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">{col.title}</div>
            <ul className="space-y-3">
              {col.items.map(i => (
                <li key={i} className="flex items-start text-sm text-stone-700">
                  <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-forest-600" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
