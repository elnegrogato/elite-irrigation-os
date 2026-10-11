import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import Layout from "./Layout";
import PageHero from "./PageHero";
import { ConversionPanel, DirectAnswer, OutcomeGrid, StepGrid } from "./MarketingSections";

type ProductPageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  chips: string[];
  directAnswer: string;
  outcomes: Array<{ icon: LucideIcon; title: string; body: string }>;
  steps?: Array<{ title: string; body: string }>;
  bullets?: string[];
  ctaTitle?: string;
  ctaBody?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function ProductPage({
  eyebrow,
  title,
  subtitle,
  chips,
  directAnswer,
  outcomes,
  steps,
  bullets,
  ctaTitle = "Ready to move from guessing to a clear next step?",
  ctaBody = "Start with a quick request. Elite will route the work, clarify the scope, and help you act with confidence.",
  ctaHref = "/quick-quote",
  ctaLabel = "Start My Request",
}: ProductPageProps) {
  return (
    <Layout>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} chips={chips} />
      <DirectAnswer>{directAnswer}</DirectAnswer>
      <OutcomeGrid items={outcomes} />

      {steps?.length ? (
        <section className="mt-16">
          <h2 className="text-3xl font-serif font-bold text-stone-900">How it works</h2>
          <div className="mt-6">
            <StepGrid steps={steps} />
          </div>
        </section>
      ) : null}

      {bullets?.length ? (
        <section className="mt-16 rounded-2xl border border-stone-200 bg-white p-5 sm:p-8">
          <h2 className="text-2xl font-serif font-bold text-stone-900">What this unlocks</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3 rounded-xl bg-stone-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" />
                <p className="text-sm leading-relaxed text-stone-700">{bullet}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <ConversionPanel title={ctaTitle} body={ctaBody} href={ctaHref} label={ctaLabel} />
    </Layout>
  );
}
