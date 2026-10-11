import type { Metadata } from "next";
import Layout from "../../src/components/Layout";
import PageHero from "../../src/components/PageHero";
import { ConversionPanel, DirectAnswer, OutcomeGrid, StepGrid } from "../../src/components/MarketingSections";
import { BadgeDollarSign, Camera, CheckCircle2, ClipboardCheck, ShieldCheck, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing & Estimate Options",
  description: "See how Elite handles free estimates, scoped outdoor projects, service tiers, and payment expectations for Charlotte-area property owners.",
  alternates: { canonical: "https://eliteirrigation.com/pricing" },
};

export default function PricingPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Pricing Clarity"
        title="Know the outdoor fix before you approve the spend."
        subtitle="No guessing, vague ranges, or surprise handoffs. Elite starts with a free estimate, then turns your outdoor issue into a clear scope, schedule, and price path."
        chips={["Free initial estimates", "Written scope", "Tiered options when useful", "Photo-documented closeout"]}
      />

      <DirectAnswer>
        Elite provides free initial estimates for Charlotte-area irrigation, drainage, hardscape, lighting, and maintenance work. Final pricing depends on property conditions, materials, access, urgency, and scope. You receive a clear written recommendation before work starts.
      </DirectAnswer>

      <OutcomeGrid
        items={[
          { icon: BadgeDollarSign, title: "No mystery pricing", body: "You see the expected range, assumptions, and next step before committing to work." },
          { icon: ClipboardCheck, title: "Scope before spend", body: "Estimates separate symptoms, recommended work, materials, and proof needed for closeout." },
          { icon: Camera, title: "Proof-backed delivery", body: "Photos and work notes help you verify what was fixed, installed, tested, or improved." },
        ]}
      />

      <section className="mt-16">
        <h2 className="text-3xl font-serif font-bold text-stone-900">How pricing decisions work</h2>
        <div className="mt-6">
          <StepGrid
            steps={[
              { title: "Share the problem", body: "Send service type, address, photos, and a short description so we can route the right person." },
              { title: "Confirm the scope", body: "We inspect or triage the property and define what needs to happen now versus later." },
              { title: "Approve with confidence", body: "You get a written estimate, schedule expectation, and proof plan before the job moves forward." },
            ]}
          />
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-stone-200 bg-white p-5 sm:p-8">
        <h2 className="text-2xl font-serif font-bold text-stone-900">Typical price drivers</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            "Property size, grade, access, and existing system condition",
            "Material type, fixture count, pipe length, controller requirements, or paver square footage",
            "Emergency response, seasonal timing, and coordination with other trades",
            "Proof requirements, board reporting, warranty needs, and closeout documentation",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl bg-stone-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" />
              <p className="text-sm leading-relaxed text-stone-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <ConversionPanel
        title="Turn the unknown into a scoped outdoor plan."
        body="Send the issue now. We will route it to the right service path and give you the clearest next step."
        bullets={["No obligation", "Photos welcome", "Charlotte metro routing", "Clear written follow-up"]}
        href="/quick-quote"
        label="Start My Estimate"
      />
    </Layout>
  );
}
