import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function DirectAnswer({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10 rounded-2xl border border-forest-200 bg-white p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-forest-700">{title ?? "Direct Answer"}</p>
      <div className="mt-3 text-base leading-relaxed text-stone-700 sm:text-lg">{children}</div>
    </section>
  );
}

export function OutcomeGrid({ items }: { items: Array<{ icon: LucideIcon; title: string; body: string }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-forest-700">
            <item.icon className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-lg font-extrabold text-stone-900">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

export function StepGrid({ steps }: { steps: Array<{ title: string; body: string }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <article key={step.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-black text-white">
            {index + 1}
          </div>
          <h3 className="mt-5 text-lg font-extrabold text-stone-900">{step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{step.body}</p>
        </article>
      ))}
    </div>
  );
}

export function ConversionPanel({
  title,
  body,
  bullets,
  href = "/quick-quote",
  label = "Get a Quick Quote",
}: {
  title: string;
  body: string;
  bullets?: string[];
  href?: string;
  label?: string;
}) {
  return (
    <section className="mt-16 rounded-2xl bg-forest-900 p-6 text-white sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-3 lg:items-center">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-serif font-bold leading-tight sm:text-3xl">{title}</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-forest-100">{body}</p>
          {bullets?.length ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-sm text-forest-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-300" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Link
          href={href}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-forest-900 transition-colors hover:bg-forest-50"
        >
          {label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
