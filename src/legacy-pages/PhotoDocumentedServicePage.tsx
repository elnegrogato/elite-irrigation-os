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
  Camera,
  CheckCircle2,
  ArrowRight,
  Eye,
  FileText,
  BadgeCheck,
} from "lucide-react";

const PHONE = "+17048864240";

const trustItems = ["Licensed", "Insured", "Photo-Documented", "Structured Process"];

const faqItems = [
  {
    q: "Why does Elite photograph every visit?",
    a: "Photo documentation creates a visual record of what was found, what was done, and what the result looks like. This protects both you and our team.",
  },
  {
    q: "What photos do you take?",
    a: "Before photos showing the starting condition, in-progress photos showing the work being done, and completion photos showing the finished result. We also photograph any issues discovered during the visit.",
  },
  {
    q: "Do I receive the photos?",
    a: "Yes. All photos are shared with you via your preferred method — email, text, or through your customer portal (coming soon).",
  },
  {
    q: "Is this included in the service cost?",
    a: "Yes. Photo documentation is standard on every Elite visit at no extra charge.",
  },
];

export default function PhotoDocumentedServicePage() {
  return (
    <Layout>
      <PageSeo
        title="Photo-Documented Outdoor Service"
        description="Elite documents every outdoor service visit with before, during, and after photos so Charlotte-area owners can see exactly what was found and completed."
        canonical="/photo-documented-service"
        jsonLd={[
          makeServiceSchema(
            "Photo-Documented Outdoor Service",
            "Elite Irrigation & Landscaping provides photo-documented outdoor service visits for irrigation, drainage, lighting, hardscape, HOA, and commercial properties.",
            "/photo-documented-service",
          ),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([{ name: "Home", url: "/" }, { name: "Photo-Documented Service" }]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Photo-Documented Service" }]} />

      <div className="mx-auto max-w-5xl">
        <section className="py-20" aria-label="Photo documented service introduction">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-100">
              <Camera className="h-7 w-7 text-forest-600" />
            </div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-2 text-sm font-bold text-forest-700">
              <BadgeCheck className="h-4 w-4" /> Visual proof on every Elite visit
            </div>
            <h1 className="mb-3 text-4xl font-extrabold text-stone-900 md:text-5xl">
              Photo-Documented <span className="text-forest-600">Outdoor Service</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-stone-600">
              Every Elite service visit is photographed and logged. Before, during, and after — so you see exactly what was done, what was found, and how it looks when we leave.
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

        <section className="py-20" aria-label="Documentation process highlights">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { icon: Camera, title: "Before Photos", desc: "We photograph conditions when we arrive so there's a clear baseline." },
              { icon: Eye, title: "During Documentation", desc: "Key steps and findings are photographed as work progresses." },
              { icon: CheckCircle2, title: "After Photos", desc: "Completed work is documented so you can see the result without being home." },
              { icon: FileText, title: "Service Report", desc: "A written summary accompanies the photos with notes, findings, and recommendations." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-forest-200 bg-forest-50 p-5 text-center shadow-sm">
                <item.icon className="mx-auto mb-3 h-8 w-8 text-forest-600" />
                <h2 className="mb-1 text-base font-bold text-stone-900">{item.title}</h2>
                <p className="text-sm leading-6 text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24" aria-label="Why documentation matters">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 md:text-4xl">Why photo documentation matters</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { title: "For Homeowners", desc: "See what was done without needing to be home. Know the exact condition of your sprinkler heads, drainage, and landscape after every visit.", icon: "🏠" },
              { title: "For HOA Boards", desc: "Board-ready photo reports for every service visit. Show residents exactly what was addressed and the current condition of common areas.", icon: "📋" },
              { title: "For Property Managers", desc: "Documented proof of maintenance for tenant complaints, owner reporting, and vendor accountability across multiple properties.", icon: "🏢" },
              { title: "For Commercial Owners", desc: "Photo-documented outdoor facilities care with timestamped records for compliance, budgeting, and vendor review.", icon: "🏗️" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="text-xl font-bold text-stone-900">{item.title}</h3>
                </div>
                <p className="text-sm leading-7 text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20" aria-label="What is included in documentation">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 md:text-4xl">What's included in documentation</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Before condition photos",
              "During-work progress photos",
              "After completion photos",
              "Issue identification photos",
              "Recommended repair photos",
              "Site condition notes",
              "Work performed summary",
              "Materials used log",
              "Findings and observations",
              "Priority recommendations",
              "Maintenance suggestions",
              "Next-step recommendations",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-4 text-sm text-stone-700 shadow-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-forest-600" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="py-20" aria-label="Quick answers about photo documented service">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 md:text-4xl">Quick answers clients search for</h2>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-stone-600">
              Use these answers when comparing outdoor contractors, documenting vendor work, or explaining Elite's reporting standard to stakeholders.
            </p>
          </div>

          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={[
              "Outdoor issues are easier to explain visually than with generic notes.",
              "Owners and managers are not always on-site during service.",
              "Documentation reduces disputes about what was found and completed.",
            ]}
            whenToCall="Call Elite when you need documented evidence for repairs, ongoing maintenance, or board and owner reporting."
            whatToDoNext="Schedule service and tell us how you'd like photos delivered after the visit."
            relatedQuestions={[faqItems[1].q, faqItems[2].q]}
          />

          <AeoBlock
            question={faqItems[1].q}
            shortAnswer={faqItems[1].a}
            commonCauses={[
              "Baseline images help confirm starting conditions.",
              "Progress photos clarify hidden repairs and underground findings.",
              "Completion photos show the final condition for records and follow-up.",
            ]}
            whenToCall="Call when you want full visual reporting for irrigation, drainage, lighting, and outdoor living work."
            whatToDoNext="Text photos of the issue now, then we'll add before, during, and after images once service starts."
            relatedQuestions={[faqItems[0].q, faqItems[3].q]}
          />

          <AeoBlock
            question={faqItems[2].q}
            shortAnswer={faqItems[2].a}
            commonCauses={[
              "Some clients need fast text updates while others prefer email records.",
              "Multiple stakeholders often need the same documentation.",
              "Photo history helps with budgeting and recurring maintenance decisions.",
            ]}
            whenToCall="Call Elite when you want service updates sent directly to owners, managers, or board contacts."
            whatToDoNext="Ask us to note your preferred delivery method when you request the visit."
            relatedQuestions={[faqItems[1].q, faqItems[3].q]}
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

        <section className="py-20" aria-label="Request photo documented service">
          <div className="rounded-3xl bg-stone-900 p-8 text-center md:p-12">
            <h2 className="mb-4 text-2xl font-extrabold text-white md:text-3xl">See what was done. Not just a bill.</h2>
            <p className="mb-8 text-stone-300">Photo documentation comes standard with every Elite service visit. No extra charge.</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/quick-quote"
                aria-label="Request service from Elite"
                className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-8 py-3 font-bold text-white transition-all hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"
              >
                Request Service <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`sms:${PHONE}`}
                aria-label="Text photos to Elite"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-bold text-white transition-all hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"
              >
                <Camera className="h-4 w-4" /> Text Photos
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
