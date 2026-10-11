import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSeo, { makeServiceSchema, makeFaqSchema, makeBreadcrumbSchema } from "../components/PageSeo";
import AeoBlock from "../components/AeoBlock";
import {
  Search, Phone, Camera, CheckCircle2, ArrowRight,
  Droplets, Waves, Lightbulb, Trees, Layers, ShieldCheck,
  MapPin, ClipboardList
} from "lucide-react";

const PHONE = "+17048864240";
const canonical = "https://eliteirrigation.com/outdoor-site-review";
const pageTitle = "Free Outdoor Site Review — 40-Point Property Assessment";
const pageDescription = "Free 40-point outdoor site review in Charlotte NC covering irrigation, drainage, lighting, landscape, and hardscape with photo documentation and priority-ranked recommendations.";

const reviewPoints = [
  { icon: Droplets, category: "Irrigation", items: ["Controller check", "Zone test", "Head condition", "Coverage", "Leaks", "Smart controller opportunity"] },
  { icon: Waves, category: "Drainage", items: ["Standing water", "Downspout discharge", "Erosion", "Catch basins", "French drain outlets", "Low spots"] },
  { icon: Lightbulb, category: "Lighting", items: ["Fixture check", "Transformer", "Timers", "Coverage gaps", "LED opportunity", "Safety lighting"] },
  { icon: Trees, category: "Landscape", items: ["Turf health", "Bed condition", "Mulch level", "Weeds", "Pruning needs", "Seasonal color"] },
  { icon: Layers, category: "Hardscape", items: ["Paver condition", "Trip hazards", "Wall condition", "Joint condition", "Drainage around hardscape", "Cleaning needs"] },
];

const faqItems = [
  {
    q: "What is included in the 40-point outdoor site review?",
    a: "The review covers irrigation, drainage, lighting, landscape, and hardscape conditions. We document visible issues, note performance concerns, and organize findings into a prioritized property assessment.",
  },
  {
    q: "Why is a 40-point assessment useful for commercial and HOA properties?",
    a: "It creates a consistent baseline across multiple outdoor systems so boards, managers, and owners can compare conditions, reduce surprises, and plan repairs in a more organized way.",
  },
  {
    q: "Do you provide photos and recommendations after the site review?",
    a: "Yes. The review is photo-documented and paired with priority-ranked recommendations so decision-makers can see what needs immediate attention, what can be scheduled, and what should be monitored.",
  },
];

const trustPoints = [
  { icon: ClipboardList, label: "40-point assessment" },
  { icon: MapPin, label: "Charlotte metro area" },
  { icon: ShieldCheck, label: "Photo-documented findings" },
];

export default function OutdoorSiteReviewPage() {
  return (
    <Layout>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonical={canonical}
        jsonLd={[
          makeServiceSchema(pageTitle, pageDescription, "/outdoor-site-review", "Charlotte metro area"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Site Review", url: "/outdoor-site-review" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Outdoor Site Review" }]} />

      <div className="mx-auto max-w-5xl space-y-16 pb-8">
        <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-white px-6 py-10 shadow-sm md:px-10 md:py-14">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-100">
              <Search className="h-7 w-7 text-forest-600" />
            </div>
            <h1 className="mb-3 text-3xl font-extrabold text-stone-900 md:text-4xl">
              Free Outdoor
              <br />
              <span className="text-forest-600">Site Review</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-stone-600">
              A 40-point property assessment covering irrigation, drainage, lighting, landscape, and hardscape. Photo-documented with priority-ranked recommendations. Free for Charlotte metro properties.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/quick-quote"
                aria-label="Request free outdoor site review"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
              >
                Request Free Site Review <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${PHONE}`}
                aria-label="Call Elite Irrigation and Landscaping for a site review"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 font-bold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-forest-300 hover:text-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
              >
                <Phone className="h-4 w-4" /> (704) 886-4240
              </a>
            </div>
          </div>
        </section>

        <section aria-label="Trust indicators" className="rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
            {trustPoints.map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-2 text-sm font-medium text-stone-600">
                <item.icon className="h-4 w-4 text-forest-600" />
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="site-review-highlights" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <ClipboardList className="mx-auto mb-3 h-8 w-8 text-forest-600" />
            <h2 id="site-review-highlights" className="mb-1 text-lg font-bold text-stone-900">40-Point Assessment</h2>
            <p className="text-sm text-stone-600">5 outdoor system categories reviewed systematically.</p>
          </div>
          <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <Camera className="mx-auto mb-3 h-8 w-8 text-forest-600" />
            <h2 className="mb-1 text-lg font-bold text-stone-900">Photo-Documented</h2>
            <p className="text-sm text-stone-600">Every finding photographed with condition notes.</p>
          </div>
          <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-forest-600" />
            <h2 className="mb-1 text-lg font-bold text-stone-900">Priority-Ranked</h2>
            <p className="text-sm text-stone-600">Know what needs attention first, second, and later.</p>
          </div>
        </section>

        <section aria-labelledby="review-categories-heading" className="space-y-6">
          <div className="text-center">
            <h2 id="review-categories-heading" className="text-2xl font-extrabold text-stone-900 md:text-3xl">Assessment Categories</h2>
            <p className="mt-2 text-stone-600">Each category is reviewed the same way every time so management teams can compare conditions more easily.</p>
          </div>
          {reviewPoints.map((section) => (
            <div key={section.category} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-100">
                  <section.icon className="h-5 w-5 text-forest-600" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">{section.category}</h3>
                <span className="rounded-full bg-forest-100 px-2 py-1 text-xs font-bold text-forest-600">{section.items.length} points</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {section.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-stone-700">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-forest-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section aria-labelledby="site-review-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
          <div className="mb-8 text-center">
            <h2 id="site-review-faqs" className="text-2xl font-extrabold text-stone-900 md:text-3xl">40-Point Site Review FAQs</h2>
            <p className="mt-2 text-stone-600">Common questions from HOAs, multifamily communities, and commercial properties about how the assessment works.</p>
          </div>
          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={["Outdoor systems age at different rates", "Visible problems often overlap between irrigation, drainage, and hardscape", "Teams need one organized baseline instead of disconnected notes"]}
            whenToCall="Call when you want a property-wide review instead of reacting to outdoor issues one at a time."
            whatToDoNext="Schedule the site visit and identify any recurring trouble spots so we can confirm them during the walkthrough."
            relatedQuestions={[faqItems[1].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[1].q}
            shortAnswer={faqItems[1].a}
            commonCauses={["Boards need one repeatable reporting standard", "Managers need better documentation for vendor accountability", "Capital planning works better with a condition baseline"]}
            whenToCall="Call before budget meetings, board reviews, vendor transitions, or seasonal maintenance planning."
            whatToDoNext="Request the review so we can establish a clear current-condition baseline for your outdoor infrastructure."
            relatedQuestions={[faqItems[0].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[2].q}
            shortAnswer={faqItems[2].a}
            commonCauses={["Photos clarify severity faster than notes alone", "Prioritization helps reduce reactive spending", "Documented findings help teams sequence work more effectively"]}
            whenToCall="Call when you need recommendations organized for action instead of a simple walkthrough summary."
            whatToDoNext="Ask for the review and we will explain how findings are documented, ranked, and prepared for follow-up maintenance planning."
            relatedQuestions={[faqItems[0].q, faqItems[1].q]}
            showSchema={false}
          />
        </section>

        <section className="rounded-[2rem] bg-stone-900 p-8 text-center md:p-12">
          <h2 className="mb-4 text-2xl font-extrabold text-white">Request Your Free Site Review</h2>
          <p className="mb-8 text-stone-300">Available for residential, HOA, commercial, and managed properties in the Charlotte metro area.</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/quick-quote"
              aria-label="Request free site review quote"
              className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-300"
            >
              Request Free Site Review <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${PHONE}`}
              aria-label="Call Elite Irrigation and Landscaping at 704 886 4240"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              <Phone className="h-4 w-4" /> (704) 886-4240
            </a>
            <a
              href={`sms:${PHONE}`}
              aria-label="Text photos to Elite Irrigation and Landscaping"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
            >
              <Camera className="h-4 w-4" /> Text Photos
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
