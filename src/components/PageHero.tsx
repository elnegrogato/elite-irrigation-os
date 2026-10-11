import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

type PageHeroCta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export default function PageHero(props: {
  title: string;
  subtitle?: string;
  chips?: string[];
  eyebrow?: string;
  primaryCta?: PageHeroCta | null;
  secondaryCta?: PageHeroCta | null;
}) {
  const primaryCta = props.primaryCta === undefined
    ? { href: "/quick-quote", label: "Get a Quick Quote", variant: "primary" as const }
    : props.primaryCta;
  const secondaryCta = props.secondaryCta === undefined
    ? { href: "tel:+17048864240", label: "Call (704) 886-4240", variant: "secondary" as const }
    : props.secondaryCta;

  return (
    <section className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(52,212,116,0.26),transparent_34%),linear-gradient(135deg,#052e16_0%,#11100d_62%,#052e16_100%)] p-6 shadow-2xl shadow-stone-900/10 md:mb-12 md:p-8 lg:p-10">
      <div className="grid gap-6 lg:grid-cols-3 lg:items-end">
        <div className="min-w-0 lg:col-span-2">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest-100">
            {props.eyebrow ?? "Elite Outdoor Services"}
          </span>
          <h1 className="mt-4 max-w-5xl break-words text-4xl font-serif font-semibold leading-tight text-white sm:text-5xl lg:text-6xl [text-wrap:balance]">
            {props.title}
          </h1>
          {props.subtitle && (
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-stone-200 sm:text-lg">
              {props.subtitle}
            </p>
          )}
        </div>

        {(primaryCta || secondaryCta) && (
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-forest-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:ring-offset-2 focus:ring-offset-forest-950"
              >
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:ring-offset-2 focus:ring-offset-forest-950"
              >
                <Phone className="h-4 w-4 text-forest-200" />
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>

      {props.chips?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {props.chips.map(c => (
            <span key={c} className="max-w-full break-words rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-stone-100">
              {c}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
