// src/components/CallToAction.tsx
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CallToAction(props: { title: string; bullets: string[]; primaryTo: string; primaryLabel: string }) {
  return (
    <section className="mt-16 rounded-2xl border border-forest-200 bg-white p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h3 className="break-words text-2xl font-serif font-bold leading-tight text-stone-900 sm:text-3xl">{props.title}</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {props.bullets.map(b => (
              <li key={b} className="flex items-start text-sm text-stone-700">
                <CheckCircle2 className="mr-3 mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={props.primaryTo}
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-forest-600 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-forest-700"
        >
          {props.primaryLabel}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </section>
  );
}
