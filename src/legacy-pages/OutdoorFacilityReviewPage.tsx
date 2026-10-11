import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSeo, { makeServiceSchema, makeFaqSchema, makeBreadcrumbSchema } from "../components/PageSeo";
import AeoBlock from "../components/AeoBlock";
import {
  Search, Phone, Camera, CheckCircle2, ArrowRight,
  Droplets, Waves, Lightbulb, Trees, Layers, ShieldCheck,
  Clock, MapPin, Building2, ClipboardList
} from "lucide-react";

const PHONE = "+17048864240";
const canonical = "https://eliteirrigation.com/outdoor-facility-review";
const pageTitle = "Outdoor Facility Review — Free Property Assessment";
const pageDescription = "Request a free outdoor facility review in Charlotte NC with a site walkthrough, irrigation check, drainage check, lighting check, photo documentation, and priority-ranked recommendations.";

const reviewIncludes = [
  { icon: Search, title: "Site Walkthrough", desc: "Full property walkthrough of outdoor systems." },
  { icon: Droplets, title: "Irrigation Issue Check", desc: "Controller, zones, heads, coverage, leaks." },
  { icon: Waves, title: "Drainage Issue Check", desc: "Standing water, flow paths, catch basins, erosion." },
  { icon: Lightbulb, title: "Lighting Issue Check", desc: "Fixtures, transformers, timers, coverage." },
  { icon: Trees, title: "Landscape Condition Notes", desc: "Turf, beds, mulch, shrubs, seasonal needs." },
  { icon: Layers, title: "Hardscape Condition Notes", desc: "Pavers, walls, walkways, drainage, trip hazards." },
  { icon: Camera, title: "Photo Documentation", desc: "Photos of every area with condition notes." },
  { icon: ClipboardList, title: "Priority List", desc: "Issues ranked by urgency and recommended action." },
];

const bestFor = [
  "HOAs and community associations",
  "Property managers with multiple sites",
  "Commercial property owners",
  "Multifamily communities",
  "Churches and schools",
  "Builders and developers",
  "Luxury estates",
];

const faqItems = [
  {
    q: "What happens during a free outdoor facility review?",
    a: "We walk the property, inspect major outdoor systems, take photos, document visible conditions, and organize findings into a priority-ranked review for management or board follow-up.",
  },
  {
    q: "How long does the outdoor facility review process take?",
    a: "Most reviews start with a scheduled site walkthrough and are followed by a documented summary shortly after the visit. Timing depends on property size, access, and the number of outdoor systems being reviewed.",
  },
  {
    q: "Who should request a facility review?",
    a: "HOA boards, property managers, multifamily operators, commercial owners, churches, schools, and any organization that needs a documented baseline of outdoor conditions before budgeting or maintenance planning.",
  },
];

const trustPoints = [
  { icon: Clock, label: "Review within 1 week" },
  { icon: MapPin, label: "Charlotte metro area" },
  { icon: ShieldCheck, label: "Free, no obligation" },
];

export default function OutdoorFacilityReviewPage() {
  return (
    <Layout>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonical={canonical}
        jsonLd={[
          makeServiceSchema(pageTitle, pageDescription, "/outdoor-facility-review", "Charlotte metro area"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facility Review", url: "/outdoor-facility-review" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Outdoor Facility Review" }]} />

      <div className="mx-auto max-w-5xl space-y-16 pb-8">
        <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-white px-6 py-10 shadow-sm md:px-10 md:py-14">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700">
              <Building2 className="h-4 w-4" /> Free Property Assessment
            </div>
            <h1 className="mb-3 text-3xl font-extrabold text-stone-900 md:text-4xl">
              Request an
              <br />
              <span className="text-forest-600">Outdoor Facility Review</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-stone-600">
              A site walkthrough with photo documentation covering irrigation, drainage, lighting, landscape, and hardscape conditions. Includes a priority-ranked list of recommended actions.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/quick-quote"
                aria-label="Request outdoor facility review"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
              >
                Request Facility Review <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${PHONE}`}
                aria-label="Call Elite Irrigation and Landscaping for a facility review"
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

        <section aria-labelledby="review-includes-heading">
          <div className="mb-8 text-center">
            <h2 id="review-includes-heading" className="text-2xl font-extrabold text-stone-900 md:text-3xl">What the Review Includes</h2>
            <p className="mt-2 text-stone-600">Each walkthrough is designed to surface visible risks, deferred maintenance, and budget priorities across the property.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reviewIncludes.map((item) => (
              <div key={item.title} className="rounded-2xl border border-forest-200 bg-forest-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                <item.icon className="mb-2 h-6 w-6 text-forest-600" />
                <h3 className="mb-1 text-sm font-bold text-stone-900">{item.title}</h3>
                <p className="text-xs leading-5 text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="best-for-heading" className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h2 id="best-for-heading" className="text-2xl font-extrabold text-stone-900">Best For</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bestFor.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-stone-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-forest-600" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="facility-review-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
          <div className="mb-8 text-center">
            <h2 id="facility-review-faqs" className="text-2xl font-extrabold text-stone-900 md:text-3xl">Outdoor Facility Review FAQs</h2>
            <p className="mt-2 text-stone-600">Fast answers about the review process for managers, boards, and commercial property teams.</p>
          </div>
          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={["Recurring complaints without a clear property-wide baseline", "Multiple vendors working without one documented condition report", "Budget decisions need photos and ranked priorities"]}
            whenToCall="Call when you need a documented snapshot of outdoor conditions before approving repairs or renegotiating service priorities."
            whatToDoNext="Schedule the walkthrough and have any recurring problem areas ready to point out during the visit."
            relatedQuestions={[faqItems[1].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[1].q}
            shortAnswer={faqItems[1].a}
            commonCauses={["Larger sites need more walkthrough time", "Access to gated or shared areas affects scheduling", "More systems reviewed means more documentation to organize"]}
            whenToCall="Call when you need the review completed ahead of a board meeting, budget cycle, vendor transition, or maintenance planning session."
            whatToDoNext="Share your property type, acreage, and any timing requirements so we can plan the site visit and reporting window correctly."
            relatedQuestions={[faqItems[0].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[2].q}
            shortAnswer={faqItems[2].a}
            commonCauses={["Boards need clearer maintenance visibility", "Managers need one report across several outdoor systems", "Properties are preparing for seasonal work or capital planning"]}
            whenToCall="Call when outdoor maintenance decisions are being made by a board, committee, or management group that needs documented findings."
            whatToDoNext="Request the review and we will explain how the property walkthrough and follow-up summary will fit your reporting needs."
            relatedQuestions={[faqItems[0].q, faqItems[1].q]}
            showSchema={false}
          />
        </section>

        <section className="rounded-[2rem] bg-stone-900 p-8 text-center md:p-12">
          <h2 className="mb-4 text-2xl font-extrabold text-white md:text-3xl">Schedule Your Free Facility Review</h2>
          <p className="mb-8 text-stone-300">No obligation. We walk the property, document conditions, and deliver a priority-ranked report.</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/quick-quote"
              aria-label="Request free facility review quote"
              className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-300"
            >
              Request Facility Review <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${PHONE}`}
              aria-label="Call Elite Irrigation and Landscaping at 704 886 4240"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              <Phone className="h-4 w-4" /> (704) 886-4240
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
