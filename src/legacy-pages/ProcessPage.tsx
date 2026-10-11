import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, {
  makeServiceSchema,
  makeFaqSchema,
  makeBreadcrumbSchema,
  makeHowToSchema,
} from "../components/PageSeo";
import {
  Camera,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ClipboardList,
  Search,
  FileText,
  Calendar,
  Wrench,
  MessageSquare,
  BadgeCheck,
} from "lucide-react";

const PHONE = "+17048864240";

const steps = [
  { num: "01", title: "Send Photos or Request Review", desc: "Text photos, send your outdoor list, or request a free site review. No form required — just reach out.", icon: Camera },
  { num: "02", title: "We Identify the Issue Category", desc: "Our team reviews what you sent and categorizes the issue — sprinkler, drainage, lighting, hardscape, or something else.", icon: Search },
  { num: "03", title: "Site Review if Needed", desc: "For most issues, we'll schedule a free site visit to see the problem in person and assess the full scope.", icon: MapPin },
  { num: "04", title: "Diagnosis", desc: "We diagnose the root cause, not just the symptom. Leaky valve vs broken head. Grading issue vs clogged drain.", icon: ClipboardList },
  { num: "05", title: "Written Scope", desc: "You receive a clear written scope of work — what's included, what's not, assumptions, and the recommended fix.", icon: FileText },
  { num: "06", title: "Proposal", desc: "We provide a straightforward proposal with clear pricing. No hidden line items. No surprise add-ons after approval.", icon: FileText },
  { num: "07", title: "Scheduling", desc: "Pick a time that works. We confirm the schedule and send a reminder before we arrive.", icon: Calendar },
  { num: "08", title: "Work Completed", desc: "Our crew shows up on time, completes the work per the agreed scope, and keeps you informed throughout.", icon: Wrench },
  { num: "09", title: "Photo Documentation", desc: "We photograph conditions before, during, and after. You see exactly what was done and how it looks.", icon: Camera },
  { num: "10", title: "Punch-List Closeout", desc: "We walk through completed work together. If anything isn't right, we address it before calling the job done.", icon: CheckCircle2 },
  { num: "11", title: "Maintenance Recommendation", desc: "We suggest ongoing maintenance based on what we found — seasonal checks, drainage monitoring, lighting upkeep.", icon: ShieldCheck },
  { num: "12", title: "Follow-Up", desc: "After the job, we follow up to make sure everything is working as expected and you're satisfied.", icon: MessageSquare },
];

const trustItems = ["Licensed", "Insured", "Photo-Documented", "Structured Process"];

const faqItems = [
  {
    q: "What is Elite's service process?",
    a: "Our 12-step process covers everything from initial request through closeout: request, photos, site review, diagnosis, proposal, scheduling, field work, documentation, walkthrough, closeout, follow-up, and maintenance planning.",
  },
  {
    q: "How long does a typical outdoor project take?",
    a: "Simple repairs may be same-day. Standard projects like drainage or hardscapes typically take 1-5 days. Larger projects like outdoor kitchens or full irrigation installs may take 1-3 weeks.",
  },
  {
    q: "Do I get a written proposal before work starts?",
    a: "Yes. Every project gets a clear written scope with options before any work begins. No surprises.",
  },
  {
    q: "Will I get photos of the work?",
    a: "Yes. Every visit includes before, during, and after photos documenting what was found, what was done, and the completed result.",
  },
];

export default function ProcessPage() {
  return (
    <Layout>
      <PageSeo
        title="Our Outdoor Service Process"
        description="See Elite's 12-step outdoor service process for Charlotte properties, from request and diagnosis to written scope, photos, closeout, and follow-up."
        canonical="/process"
        jsonLd={[
          makeServiceSchema(
            "Outdoor Service Process",
            "Elite Irrigation & Landscaping uses a structured 12-step process for irrigation, drainage, lighting, hardscape, and outdoor maintenance work.",
            "/process",
          ),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([{ name: "Home", url: "/" }, { name: "Our Process" }]),
          makeHowToSchema(
            "How Elite handles outdoor service projects",
            "A 12-step process covering request, diagnosis, proposal, scheduling, field work, documentation, and closeout.",
            steps.map((step) => ({ name: step.title, text: step.desc })),
          ),
        ]}
      />
      <Breadcrumbs items={[{ label: "Our Process" }]} />

      <div className="mx-auto max-w-5xl">
        <section className="py-20" aria-label="Service process introduction">
          <div className="text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-2 text-sm font-bold text-forest-700">
              <BadgeCheck className="h-4 w-4" /> Structured outdoor service from first call to closeout
            </div>
            <h1 className="mb-4 text-4xl font-extrabold text-stone-900 md:text-6xl">
              A Clearer Process for <span className="text-forest-600">Outdoor Work</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-stone-600">
              From sprinkler repair to drainage, lighting, patios, pool areas, and HOA maintenance — Elite helps turn outdoor issues into scoped, scheduled, documented work.
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

        <section className="py-20" aria-label="Process overview highlights">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center">
              <h2 className="mb-1 text-lg font-bold text-stone-900">Clear Scopes</h2>
              <p className="text-sm leading-6 text-stone-600">Written scope before work starts. No vague yard-work promises.</p>
            </div>
            <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center">
              <h2 className="mb-1 text-lg font-bold text-stone-900">Photo Documentation</h2>
              <p className="text-sm leading-6 text-stone-600">Before, during, and after photos on every job.</p>
            </div>
            <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center">
              <h2 className="mb-1 text-lg font-bold text-stone-900">Professional Closeout</h2>
              <p className="text-sm leading-6 text-stone-600">Walk through completed work together. Address anything before calling it done.</p>
            </div>
          </div>
        </section>

        <section className="py-24" aria-label="12 step service process">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 md:text-4xl">Our 12-step service workflow</h2>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-stone-600">
              Every stage is designed to reduce confusion, document the work, and give you a clear next step.
            </p>
          </div>

          <div className="space-y-0 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-10">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">
                    {step.num}
                  </div>
                  {i < steps.length - 1 && <div className="mt-2 w-0.5 flex-1 bg-forest-200" />}
                </div>
                <div className="pb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <step.icon className="h-5 w-5 text-forest-600" />
                    <h3 className="text-lg font-bold text-stone-900">{step.title}</h3>
                  </div>
                  <p className="text-sm leading-7 text-stone-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20" aria-label="Quick answers about the process">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 md:text-4xl">Quick answers before you book</h2>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-stone-600">
              These are the common questions Charlotte-area homeowners, property managers, and HOA leaders ask before work begins.
            </p>
          </div>

          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={[
              "Property owners want to know exactly what happens after they call.",
              "Multi-trade outdoor work needs a clear handoff between review, scope, and field work.",
              "Documentation matters when multiple stakeholders are involved.",
            ]}
            whenToCall="Call Elite when you want a single process for irrigation, drainage, lighting, hardscape, and ongoing outdoor maintenance work."
            whatToDoNext="Send your outdoor list or text photos so we can identify the issue category and recommend the next step."
            relatedQuestions={[faqItems[2].q, faqItems[3].q]}
          />

          <AeoBlock
            question={faqItems[1].q}
            shortAnswer={faqItems[1].a}
            commonCauses={[
              "Smaller irrigation and drainage repairs can often be diagnosed and completed quickly.",
              "Projects involving layout, materials, or multiple crews need more scheduling and coordination.",
              "Weather and scope changes can affect outdoor timelines.",
            ]}
            whenToCall="Call before the issue spreads or before an outdoor project needs to fit a specific calendar window."
            whatToDoNext="Tell us the property type, the issue, and any deadline so we can recommend a realistic schedule."
            relatedQuestions={[faqItems[0].q, faqItems[2].q]}
          />

          <AeoBlock
            question={faqItems[3].q}
            shortAnswer={faqItems[3].a}
            commonCauses={[
              "Hidden valve, grading, drainage, and lighting issues are easier to explain visually.",
              "Owners are not always on-site during service visits.",
              "Photos create a clean record for follow-up and maintenance planning.",
            ]}
            whenToCall="Call Elite when you need documented proof of the issue, the repair, and the final condition."
            whatToDoNext="Request service and tell us whether you prefer photo updates by text, email, or during walkthrough."
            relatedQuestions={[faqItems[1].q, faqItems[2].q]}
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

        <section className="py-20" aria-label="Start the process">
          <div className="rounded-3xl bg-stone-900 p-8 text-center md:p-12">
            <h2 className="mb-4 text-2xl font-extrabold text-white md:text-3xl">Ready to start?</h2>
            <p className="mb-8 text-stone-300">Send us your outdoor list, text photos, or request a free site review.</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/send-us-your-outdoor-list"
                aria-label="Send Elite your outdoor project list"
                className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-8 py-3 font-bold text-white transition-all hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"
              >
                Send Us Your Outdoor List <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${PHONE}`}
                aria-label="Call Elite Irrigation and Landscaping"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-stone-900 transition-all hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"
              >
                <Phone className="h-4 w-4" /> Call (704) 886-4240
              </a>
              <a
                href={`sms:${PHONE}`}
                aria-label="Text photos to Elite Irrigation and Landscaping"
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
