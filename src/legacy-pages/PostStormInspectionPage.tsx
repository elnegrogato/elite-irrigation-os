import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSeo, {
  makeBreadcrumbSchema,
  makeFaqSchema,
  makeServiceSchema,
} from "../components/PageSeo";
import AeoBlock from "../components/AeoBlock";
import {
  Waves,
  Phone,
  Camera,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Droplets,
  Layers,
  Trees,
  Clock,
  ShieldCheck,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/post-storm-drainage-inspection";
const PAGE_URL = `https://eliteirrigation.com${PAGE_PATH}`;
const PAGE_TITLE = "Post-Storm Outdoor & Drainage Inspection";
const PAGE_DESCRIPTION =
  "Post-storm outdoor inspection for standing water, drainage performance, erosion, hardscape damage, and irrigation issues in the Charlotte metro area.";

const checks = [
  {
    category: "Water & Drainage",
    items: [
      "Standing water locations",
      "Drainage outlet flow",
      "French drain performance",
      "Downspout discharge areas",
      "Erosion patterns",
      "Washed mulch and landscape material",
      "Soggy turf areas",
      "Pool-area runoff",
    ],
  },
  {
    category: "Hardscape",
    items: [
      "Hardscape water pooling",
      "Retaining wall water pressure",
      "Paver movement or settling",
      "Trip hazards from washout",
      "Walkway and driveway runoff",
    ],
  },
  {
    category: "Landscape",
    items: [
      "Tree and shrub damage",
      "Landscape bed washout",
      "Mulch displacement",
      "Turf damage from flooding",
      "Debris accumulation",
    ],
  },
  {
    category: "Irrigation",
    items: [
      "Sprinkler head exposure or damage",
      "Valve box flooding",
      "Controller function after storm",
      "Zone coverage check",
      "Backflow preventer condition",
    ],
  },
];

const faqItems = [
  {
    q: "When should I get a post-storm inspection?",
    a: "After any significant rain event where you notice new standing water, erosion, shifted pavers, or sprinkler damage. The sooner we inspect, the easier and less expensive fixes tend to be.",
  },
  {
    q: "What does the inspection cover?",
    a: "23 checkpoints across 4 categories: drainage & water flow, erosion & ground stability, irrigation system, and hardscape structures.",
  },
  {
    q: "Is post-storm inspection urgent?",
    a: "It can be. Active flooding or erosion should be addressed quickly. Minor issues can wait but should be documented before the next storm.",
  },
];

const categoryIcons = {
  "Water & Drainage": Waves,
  Hardscape: Layers,
  Landscape: Trees,
  Irrigation: Droplets,
};

export default function PostStormInspectionPage() {
  return (
    <Layout>
      <PageSeo
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        canonical={PAGE_URL}
        jsonLd={[
          makeServiceSchema("Post-Storm Outdoor & Drainage Inspection", PAGE_DESCRIPTION, PAGE_PATH),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Post-Storm Inspection", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Post-Storm Inspection" }]} />

      <div className="mx-auto max-w-5xl">
        <section className="mb-8 rounded-[2rem] border border-stone-200 bg-gradient-to-br from-white via-cyan-50 to-stone-50 p-8 shadow-sm md:p-12">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">
            <Waves className="h-7 w-7 text-cyan-600" />
          </div>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Post-Storm Outdoor & <span className="text-cyan-600">Drainage Inspection</span>
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-stone-600">
            After heavy rain, your drainage, irrigation, hardscape, and landscape may need attention. Elite can inspect your property and identify issues before they become bigger problems.
          </p>
        </section>

        <div className="mb-10 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
            <Clock className="h-5 w-5 text-cyan-600" />
            <div>
              <p className="text-sm font-bold text-stone-900">Early damage detection</p>
              <p className="text-xs text-stone-600">Catch storm-related problems before the next weather event worsens them.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-cyan-600" />
            <div>
              <p className="text-sm font-bold text-stone-900">Documented site review</p>
              <p className="text-xs text-stone-600">We inspect drainage, erosion, irrigation, and hardscape conditions together.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
            <Camera className="h-5 w-5 text-cyan-600" />
            <div>
              <p className="text-sm font-bold text-stone-900">Storm photo follow-up</p>
              <p className="text-xs text-stone-600">Text storm photos before or after the visit to speed up review.</p>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <div className="mb-6 max-w-3xl">
            <h2 className="text-2xl font-extrabold text-stone-900 md:text-3xl">23 checkpoints across the property</h2>
            <p className="mt-2 text-stone-600">
              Our inspection looks for storm-driven water movement, erosion, hardscape shifting, and irrigation damage that may not be obvious at first glance.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {checks.map((section) => {
              const Icon = categoryIcons[section.category as keyof typeof categoryIcons];

              return (
                <div key={section.category} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                      <Icon className="h-5 w-5 text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">{section.category}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-stone-700">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-cyan-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-amber-200 bg-amber-50 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 shrink-0 text-amber-600" />
            <div>
              <h2 className="mb-2 text-xl font-bold text-amber-900">Active Water or Safety Concern?</h2>
              <p className="mb-3 text-sm text-amber-800">
                If water is actively flooding, near electrical systems, or causing structural concern, call us immediately rather than filling out a form.
              </p>
              <a
                href={`tel:${PHONE}`}
                aria-label="Call Elite about urgent storm damage"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-amber-700 focus:ring-2 focus:ring-forest-500 focus:outline-none"
              >
                <Phone className="h-4 w-4" /> Call (704) 886-4240
              </a>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 max-w-3xl">
            <h2 className="text-2xl font-extrabold text-stone-900 md:text-3xl">Post-storm inspection FAQs</h2>
            <p className="mt-2 text-stone-600">
              These are the most common questions property owners ask after heavy rain, drainage failures, and storm-related site movement.
            </p>
          </div>
          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={[
              "New standing water where it never used to collect",
              "Fresh erosion, mulch washout, or soil movement",
              "Storm-related irrigation or hardscape damage that appeared after heavy rain",
            ]}
            whatToDoNext="Walk the site, note what changed after the storm, and schedule the inspection while the evidence is still visible."
            relatedQuestions={[faqItems[1].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[1].q}
            shortAnswer={faqItems[1].a}
            whenToCall="Request the inspection when drainage, erosion, irrigation, and hardscape conditions need to be reviewed together instead of as isolated problems."
            whatToDoNext="Text storm photos, then request the inspection so we can compare visible damage with on-site conditions."
            relatedQuestions={[faqItems[0].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[2].q}
            shortAnswer={faqItems[2].a}
            whenToCall="Call quickly for active flooding, fast-moving erosion, pooling near structures, or hazards around pavers, walls, and walkways."
            whatToDoNext="If conditions are stable, document them now and book the review before another storm changes the site."
            relatedQuestions={[faqItems[0].q, faqItems[1].q]}
            showSchema={false}
          />
        </section>

        <section className="rounded-2xl bg-stone-900 p-8 text-center md:p-12">
          <h2 className="mb-4 text-2xl font-extrabold text-white md:text-3xl">Schedule a Post-Storm Drainage Review</h2>
          <p className="mb-8 text-stone-400">
            We'll walk your property, check drainage performance, and document any storm-related issues with photos.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/quick-quote"
              aria-label="Request a post-storm inspection"
              className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:outline-none"
            >
              Request Inspection <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`sms:${PHONE}`}
              aria-label="Text storm photos to Elite"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-bold text-white transition-all duration-200 hover:bg-amber-600 focus:ring-2 focus:ring-forest-500 focus:outline-none"
            >
              <Camera className="h-4 w-4" /> Text Storm Photos
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
