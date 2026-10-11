import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, {
  makeServiceSchema,
  makeFaqSchema,
  makeBreadcrumbSchema,
} from "../components/PageSeo";
import {
  Droplets,
  Waves,
  Lightbulb,
  Flame,
  Phone,
  CheckCircle2,
  ArrowRight,
  Building2,
  Star,
  BadgeCheck,
} from "lucide-react";

const PHONE = "+17048864240";

const plans = [
  {
    icon: Droplets,
    title: "Sprinkler Repair Follow-Up",
    desc: "After a sprinkler service visit, keep your system running with seasonal checks.",
    includes: ["Seasonal zone test", "Controller review", "Head adjustment", "Coverage check", "Leak inspection"],
    bestFor: "Homeowners after sprinkler repair",
  },
  {
    icon: Waves,
    title: "Drainage Monitoring",
    desc: "Keep drainage systems flowing after installation or repair.",
    includes: ["Post-storm check", "Drain outlet review", "Erosion inspection", "Photo report", "Catch basin clearing"],
    bestFor: "Properties with French drains or drainage systems",
  },
  {
    icon: Lightbulb,
    title: "Lighting Maintenance",
    desc: "Keep your landscape lighting system working and looking its best.",
    includes: ["Timer check", "Fixture inspection", "Transformer review", "Bulb replacement", "Night visibility test"],
    bestFor: "Properties with landscape lighting",
  },
  {
    icon: Flame,
    title: "Outdoor Living Care",
    desc: "Maintain your patio, fire feature, and outdoor living investment.",
    includes: ["Paver inspection", "Drainage check", "Fire feature check", "Lighting check", "Seasonal prep"],
    bestFor: "Homeowners with outdoor living spaces",
  },
  {
    icon: Building2,
    title: "HOA Outdoor Facilities",
    desc: "Recurring inspection and reporting for HOA common areas and outdoor systems.",
    includes: ["Monthly/quarterly visit", "Photo documentation", "Open issue list", "Repair proposals", "Seasonal calendar"],
    bestFor: "HOA boards and community managers",
  },
  {
    icon: Star,
    title: "Commercial Outdoor Facilities",
    desc: "Recurring site visits with documented issue tracking and maintenance recommendations.",
    includes: ["Recurring site visits", "Issue tracking", "Irrigation/drainage/lighting reviews", "Budget forecasting", "Proposal support"],
    bestFor: "Commercial property owners and managers",
  },
];

const trustItems = ["Licensed", "Insured", "Photo-Documented", "Structured Process"];

const faqItems = [
  {
    q: "What maintenance plans does Elite offer?",
    a: "We offer 6 plans: Sprinkler System Care, Drainage Maintenance, Landscape Lighting, Outdoor Living, HOA Grounds, and Commercial Facilities. Each includes seasonal visits, priority scheduling, and documented service.",
  },
  {
    q: "How much does a maintenance plan cost?",
    a: "Plans are customized to your property and needs. Contact us for a free assessment and personalized quote.",
  },
  {
    q: "Do maintenance plan customers get priority?",
    a: "Yes. Plan customers receive priority scheduling, discounted rates on repairs, and pre-planned seasonal visits.",
  },
  {
    q: "Can I customize a maintenance plan?",
    a: "Yes. Every plan is tailored to your property's specific systems, size, and needs.",
  },
];

export default function MaintenancePlansPage() {
  return (
    <Layout>
      <PageSeo
        title="Outdoor Maintenance Plans"
        description="Explore Elite maintenance plans for irrigation, drainage, lighting, outdoor living, HOA grounds, and commercial properties across the Charlotte area."
        canonical="/maintenance-plans"
        jsonLd={[
          makeServiceSchema(
            "Outdoor Maintenance Plans",
            "Elite Irrigation & Landscaping offers customized maintenance plans for irrigation, drainage, lighting, outdoor living, HOA, and commercial properties.",
            "/maintenance-plans",
          ),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([{ name: "Home", url: "/" }, { name: "Maintenance Plans" }]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Maintenance Plans" }]} />

      <div className="mx-auto max-w-6xl">
        <section className="py-20" aria-label="Maintenance plans introduction">
          <div className="text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-2 text-sm font-bold text-forest-700">
              <BadgeCheck className="h-4 w-4" /> Recurring care with documented visits and priority scheduling
            </div>
            <h1 className="mb-4 text-4xl font-extrabold text-stone-900 md:text-6xl">
              Outdoor <span className="text-forest-600">Maintenance Plans</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-stone-600">
              Keep your irrigation, drainage, lighting, landscape, and outdoor systems maintained year-round. Seasonal checks, photo reports, and priority scheduling.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-4" aria-label="Trust indicators">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center justify-center gap-2 rounded-2xl bg-stone-50 px-4 py-4 text-center text-sm font-semibold text-stone-700">
                <CheckCircle2 className="h-4 w-4 text-forest-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24" aria-label="Available maintenance plans">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 md:text-4xl">Choose the plan that fits your property</h2>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-stone-600">
              Each plan keeps recurring outdoor issues visible, scheduled, and documented instead of waiting for seasonal surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.title} className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-100">
                    <plan.icon className="h-5 w-5 text-forest-600" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900">{plan.title}</h3>
                </div>
                <p className="mb-4 text-sm leading-6 text-stone-600">{plan.desc}</p>
                <ul className="mb-4 flex-1 space-y-1.5">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-stone-700">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-forest-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-stone-100 pt-4">
                  <p className="mb-3 text-xs text-stone-500">Best for: {plan.bestFor}</p>
                  <Link
                    to="/quick-quote"
                    aria-label={`Ask about the ${plan.title} maintenance plan`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
                  >
                    Ask About This Plan <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20" aria-label="Why maintenance matters">
          <div className="rounded-3xl border border-forest-200 bg-forest-50 p-8 md:p-12">
            <h2 className="mb-6 text-center text-3xl font-extrabold text-stone-900 md:text-4xl">Why maintenance matters</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { title: "Catch Small Issues Early", desc: "A $50 head adjustment now prevents a $500 zone repair later. Seasonal checks catch problems before they become emergencies." },
                { title: "Documented Property Care", desc: "Photo-documented visits create a record of your property's outdoor condition over time — useful for resale, insurance, and board reporting." },
                { title: "Priority Scheduling", desc: "Maintenance plan clients get priority scheduling for service calls, seasonal startups, and emergency repairs." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-2 text-xl font-bold text-stone-900">{item.title}</h3>
                  <p className="text-sm leading-7 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" aria-label="Quick answers about maintenance plans">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 md:text-4xl">Frequently searched maintenance plan questions</h2>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-stone-600">
              Use these answers to compare plan structures, understand scheduling benefits, and decide how much recurring care your property needs.
            </p>
          </div>

          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={[
              "Different properties need recurring care for different outdoor systems.",
              "HOA and commercial clients often need reporting as much as field service.",
              "Seasonal planning reduces reactive emergency visits.",
            ]}
            whenToCall="Call Elite when you want recurring oversight for irrigation, drainage, lighting, or outdoor living assets."
            whatToDoNext="Tell us what systems are on the property and how often issues usually appear so we can recommend the right plan structure."
            relatedQuestions={[faqItems[2].q, faqItems[3].q]}
          />

          <AeoBlock
            question={faqItems[2].q}
            shortAnswer={faqItems[2].a}
            commonCauses={[
              "Priority scheduling helps reduce downtime during peak outdoor service seasons.",
              "Plan clients benefit from pre-planned seasonal site visits.",
              "Ongoing relationships improve repair speed because the property history is already documented.",
            ]}
            whenToCall="Call before startup season, heavy rain periods, or peak summer demand if scheduling priority matters for your property."
            whatToDoNext="Ask us which visit cadence and priority benefits make the most sense for your property type."
            relatedQuestions={[faqItems[0].q, faqItems[1].q]}
          />

          <AeoBlock
            question={faqItems[3].q}
            shortAnswer={faqItems[3].a}
            commonCauses={[
              "Property size, system count, and stakeholder expectations vary widely.",
              "Some owners need one system covered while others want full-property oversight.",
              "Recurring plans work best when they match seasonal risk and budget priorities.",
            ]}
            whenToCall="Call Elite when you need a plan built around your exact equipment, grounds, common areas, or outdoor living investment."
            whatToDoNext="Request a free assessment so we can build a plan around your systems, schedule, and service goals."
            relatedQuestions={[faqItems[0].q, faqItems[1].q]}
          />

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Frequently asked questions list">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900">{item.q}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20" aria-label="Ask about maintenance plans">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-extrabold text-stone-900">Not sure which plan?</h2>
            <p className="mb-6 text-stone-600">Tell us about your property and we'll recommend the right maintenance plan.</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/quick-quote"
                aria-label="Ask Elite about maintenance plans"
                className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-8 py-3 font-bold text-white transition-all hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
              >
                Ask About Maintenance Plans <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${PHONE}`}
                aria-label="Call Elite about maintenance plans"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-stone-200 bg-white px-6 py-3 font-bold text-stone-900 transition-all hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
              >
                <Phone className="h-4 w-4" /> (704) 886-4240
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
