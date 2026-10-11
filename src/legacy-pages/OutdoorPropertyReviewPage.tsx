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
  ClipboardList,
  Phone,
  Camera,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Droplets,
  Waves,
  Lightbulb,
  Trees,
  Layers,
  BadgeCheck,
} from "lucide-react";

const PHONE = "+17048864240";

const checklistSections = [
  {
    title: "Irrigation",
    icon: Droplets,
    items: [
      "Controller condition", "Controller schedule", "Zone function", "Head condition",
      "Spray coverage", "Overspray", "Leaks", "Valve boxes", "Dry zones", "Wet zones",
      "Rain sensor", "Smart controller opportunity", "Backflow coordination", "Drip irrigation",
      "Seasonal startup/winterization need"
    ],
  },
  {
    title: "Drainage",
    icon: Waves,
    items: [
      "Standing water", "Downspout discharge", "Foundation-adjacent water", "Patio drainage",
      "Pool-area drainage", "Walkway runoff", "Driveway runoff", "Erosion",
      "Retaining wall drainage", "Catch basin condition", "French drain outlet condition",
      "Soggy turf", "Washed mulch", "Low spots", "Post-storm issues"
    ],
  },
  {
    title: "Lawn & Landscape",
    icon: Trees,
    items: [
      "Turf health", "Bare spots", "Drainage-damaged turf", "Irrigation-damaged areas",
      "Bed condition", "Mulch washout", "Shrubs", "Trees", "Privacy screening",
      "Seasonal color", "Curb appeal", "Plant stress", "Weeds", "Overgrowth", "Maintenance gaps"
    ],
  },
  {
    title: "Hardscape",
    icon: Layers,
    items: [
      "Paver movement", "Trip hazards", "Patio slope", "Walkway condition",
      "Retaining wall concerns", "Seat wall condition", "Step condition",
      "Drainage around hardscape", "Pool deck transitions", "Surface cracking",
      "Joint condition", "Edge restraints", "Settlement", "Staining", "Cleaning/sealing needs"
    ],
  },
  {
    title: "Lighting",
    icon: Lightbulb,
    items: [
      "Path lights", "Uplighting", "Transformer", "Timers", "Wiring",
      "Dark areas", "Pool-area lighting", "Entry lighting", "Safety lighting",
      "Fixture damage", "LED upgrades", "Smart controls", "Retaining wall lights",
      "Step lighting", "Outdoor kitchen lights"
    ],
  },
  {
    title: "Pool / Common Areas",
    icon: ClipboardList,
    items: [
      "Pool landscape condition", "Pool privacy", "Pool drainage", "Pool deck pavers",
      "Equipment screening", "Outdoor shower area", "Amenity lawn", "Clubhouse landscaping",
      "Entry monument", "Signage beds", "Walking paths", "Dog areas", "Courtyards",
      "Common-area lighting", "Furniture/patio zones"
    ],
  },
  {
    title: "Commercial / HOA",
    icon: ShieldCheck,
    items: [
      "Complaint-prone areas", "Common-area safety", "Board-visible issues",
      "Deferred maintenance", "Seasonal priorities", "Budget items",
      "Recommended next steps", "Maintenance schedule needs", "Water waste concerns",
      "Drainage risk areas"
    ],
  },
];

const trustItems = ["Licensed", "Insured", "Photo-Documented", "Structured Process"];

const faqItems = [
  {
    q: "What is a 100+ point property review?",
    a: "A comprehensive outdoor property inspection covering irrigation, drainage, hardscapes, lighting, grounds, safety, and general condition — over 100 specific checkpoints.",
  },
  {
    q: "How long does the review take?",
    a: "Residential properties typically 45-90 minutes. Larger commercial or HOA properties may take 2-3 hours.",
  },
  {
    q: "What do I receive after the review?",
    a: "A written report with photos, priority-ranked findings, and recommendations organized by urgency.",
  },
  {
    q: "Is the property review free?",
    a: "The initial property review is free for homeowners in our service area. Commercial and HOA properties — contact us for details.",
  },
];

const totalItems = checklistSections.reduce((sum, s) => sum + s.items.length, 0);

export default function OutdoorPropertyReviewPage() {
  return (
    <Layout>
      <PageSeo
        title="100+ Point Outdoor Property Review"
        description="Book Elite's outdoor property review for Charlotte-area homes, HOA communities, and commercial sites with photos, priority-ranked findings, and next steps."
        canonical="/outdoor-property-review"
        jsonLd={[
          makeServiceSchema(
            "100+ Point Outdoor Property Review",
            "Elite Irrigation & Landscaping provides a comprehensive outdoor property review covering irrigation, drainage, hardscape, lighting, lawn, landscape, and common areas.",
            "/outdoor-property-review",
          ),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([{ name: "Home", url: "/" }, { name: "100+ Point Outdoor Property Review" }]),
        ]}
      />
      <Breadcrumbs items={[{ label: "100+ Point Outdoor Property Review" }]} />

      <div className="mx-auto max-w-6xl">
        <section className="py-20" aria-label="Outdoor property review introduction">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700">
              <ClipboardList className="h-4 w-4" /> {totalItems}-Point Checklist
            </div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-2 text-sm font-bold text-forest-700">
              <BadgeCheck className="h-4 w-4" /> Review irrigation, drainage, hardscape, lighting, and common areas in one visit
            </div>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight text-stone-900 md:text-6xl">
              100+ Point <span className="text-forest-600">Outdoor Property Review</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-stone-600">
              Elite reviews irrigation, drainage, lawn, landscape, hardscape, lighting, pool areas, common areas, and outdoor maintenance needs — so property owners understand exactly what needs attention.
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

        <section className="py-20" aria-label="Property review highlights">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center shadow-sm">
              <h2 className="mb-1 text-lg font-bold text-stone-900">{totalItems} inspection points</h2>
              <p className="text-sm leading-6 text-stone-600">Across 7 outdoor system categories.</p>
            </div>
            <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center shadow-sm">
              <h2 className="mb-1 text-lg font-bold text-stone-900">Photo-documented</h2>
              <p className="text-sm leading-6 text-stone-600">Every finding photographed with priority ranking.</p>
            </div>
            <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center shadow-sm">
              <h2 className="mb-1 text-lg font-bold text-stone-900">Priority-ranked report</h2>
              <p className="text-sm leading-6 text-stone-600">Know what needs attention first, second, and later.</p>
            </div>
          </div>
        </section>

        <section className="py-24" aria-label="Review checklist categories">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 md:text-4xl">What we inspect during the review</h2>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-stone-600">
              The review is built to surface hidden risks, deferred maintenance, and upgrade opportunities across the entire outdoor environment.
            </p>
          </div>

          <div className="space-y-8">
            {checklistSections.map((section) => (
              <div key={section.title} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-100">
                    <section.icon className="h-5 w-5 text-forest-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-stone-900">{section.title}</h3>
                  <span className="rounded-full bg-forest-100 px-2 py-1 text-xs font-bold text-forest-600">{section.items.length} items</span>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 py-1 text-sm text-stone-700">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-forest-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20" aria-label="Quick answers about property reviews">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 md:text-4xl">Questions property owners ask before booking</h2>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-stone-600">
              These answers help homeowners, HOA boards, and commercial managers understand the scope, timing, deliverables, and cost of the review.
            </p>
          </div>

          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={[
              "Outdoor properties often have overlapping irrigation, drainage, and safety issues.",
              "Owners need one review that covers systems, surfaces, and grounds together.",
              "A checkpoint-based inspection helps prioritize rather than guess.",
            ]}
            whenToCall="Call Elite when you want a full-picture view of outdoor risk, maintenance gaps, and upgrade priorities."
            whatToDoNext="Book the review and tell us whether the property is residential, HOA, or commercial so we can scope the visit correctly."
            relatedQuestions={[faqItems[1].q, faqItems[2].q]}
          />

          <AeoBlock
            question={faqItems[2].q}
            shortAnswer={faqItems[2].a}
            commonCauses={[
              "Photos make hidden or dispersed issues easier to explain.",
              "Priority ranking helps owners budget and stage work logically.",
              "Written recommendations make follow-up proposals easier to compare.",
            ]}
            whenToCall="Call when you need a documented outdoor report for planning, budgeting, board review, or resale preparation."
            whatToDoNext="Ask us to note any known trouble spots so we can pay special attention during the walkthrough."
            relatedQuestions={[faqItems[0].q, faqItems[3].q]}
          />

          <AeoBlock
            question={faqItems[3].q}
            shortAnswer={faqItems[3].a}
            commonCauses={[
              "Residential review pricing is different from larger multi-stakeholder properties.",
              "Commercial and HOA sites may need longer site time and more reporting detail.",
              "Property type changes how the review is scoped and scheduled.",
            ]}
            whenToCall="Call Elite when you want to confirm whether your property qualifies for the free homeowner review or needs a custom commercial scope."
            whatToDoNext="Share the address, property type, and any current outdoor concerns so we can confirm the right next step."
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

        <section className="py-20" aria-label="Request your property review">
          <div className="mb-8 rounded-3xl bg-stone-900 p-8 text-center md:p-12">
            <h2 className="mb-4 text-2xl font-extrabold text-white md:text-3xl">Request your property review</h2>
            <p className="mb-8 text-stone-300">Free for Charlotte metro properties. Includes photo documentation and priority-ranked findings.</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/quick-quote"
                aria-label="Request a property review from Elite"
                className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-8 py-3 font-bold text-white transition-all hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"
              >
                Request Property Review <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${PHONE}`}
                aria-label="Call Elite to request a property review"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-stone-900 transition-all hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"
              >
                <Phone className="h-4 w-4" /> (704) 886-4240
              </a>
              <a
                href={`sms:${PHONE}`}
                aria-label="Text photos to Elite for a property review"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-bold text-white transition-all hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"
              >
                <Camera className="h-4 w-4" /> Text Photos
              </a>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4 text-sm text-stone-500">Best for: homeowners planning projects, HOA boards, property managers, commercial owners, realtors, and builders.</p>
            <div className="flex flex-wrap items-center justify-center gap-3" aria-label="Related pages">
              <Link
                to="/outdoor-facilities-services"
                aria-label="View commercial and HOA services"
                className="text-sm font-semibold text-forest-600 transition-colors hover:text-forest-700 hover:underline focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
              >
                Commercial & HOA Services →
              </Link>
              <Link
                to="/photo-documented-service"
                aria-label="View photo documented service page"
                className="text-sm font-semibold text-forest-600 transition-colors hover:text-forest-700 hover:underline focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
              >
                Photo Documentation →
              </Link>
              <Link
                to="/process"
                aria-label="View Elite service process"
                className="text-sm font-semibold text-forest-600 transition-colors hover:text-forest-700 hover:underline focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
              >
                Our Process →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
