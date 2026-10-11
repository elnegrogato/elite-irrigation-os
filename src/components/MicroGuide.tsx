// src/components/MicroGuide.tsx
import { Info } from "lucide-react";

export default function MicroGuide(props: { title: string; paragraphs: string[]; bullets?: string[] }) {
  return (
    <section className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-forest-600 sm:flex">
           <Info className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className="break-words text-xl font-serif font-bold leading-tight text-stone-900">{props.title}</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-stone-700">
            {props.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {props.bullets?.length ? (
            <ul className="mt-4 space-y-2 text-sm font-medium text-stone-700">
              {props.bullets.map(b => <li key={b}>{b}</li>)}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
