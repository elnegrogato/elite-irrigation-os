import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ClipboardList,
  Droplets,
  HardHat,
  Layers,
  Leaf,
  Lightbulb,
  Phone,
  Shield,
  ShieldCheck,
  Shovel,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/construction-outdoor-services";
const TITLE = "Construction Outdoor Services Charlotte NC";
const DESCRIPTION = "Outdoor services for new construction with punch list completion, grading and drainage support, irrigation commissioning, and schedule-aware landscape installation in the Charlotte, NC area.";

const faqItems = [
  {
    q: "Can you handle punch list items for new builds?",
    a: "Yes. We handle outdoor punch list work including irrigation commissioning, drainage verification, final grade review, and visible closeout items that can delay handoff.",
  },
  {
    q: "Do you coordinate outdoor work with the construction schedule?",
    a: "Yes. We align outdoor scope with construction phases and inspection timing so landscape, irrigation, and drainage work does not create avoidable delays.",
  },
  {
    q: "Can you help reduce post-close drainage and irrigation issues?",
    a: "Yes. Early verification of grading, drainage flow, and irrigation performance helps reduce the chance of warranty-driven callbacks later.",
  },
];

const trustPoints = [
  { icon: ClipboardList, label: "Closeout and punch list support" },
  { icon: ShieldCheck, label: "Schedule-aware execution" },
  { icon: Shovel, label: "Drainage and grading visibility" },
];

export default function ConstructionOutdoorServicesPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://eliteirrigation.com${PAGE_PATH}`}
        jsonLd={[
          makeServiceSchema("Construction Outdoor Services in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities", url: "/outdoor-facilities-services" },
            { name: "Construction Outdoor Services", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Facilities", to: "/outdoor-facilities-services" }, { label: "Construction Outdoor Services" }]} />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12">
          <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-stone-100 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 ring-1 ring-forest-200">
                Outdoor scope support from rough-in to closeout
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte construction outdoor partner</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">Construction Outdoor Services</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                From irrigation rough-in to final landscape installation, we help keep outdoor scope moving in step with the project and ready for closeout.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
                >
                  Request Facility Review <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:${PHONE}`}
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

          <section aria-labelledby="construction-challenges">
            <div className="mb-8 text-center">
              <h2 id="construction-challenges" className="text-3xl font-extrabold text-stone-900">Construction Outdoor Challenges We Solve</h2>
              <p className="mt-3 text-stone-600">Focused on keeping outdoor scope aligned with build schedules, closeout, and long-term performance.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: ClipboardList, title: "Outdoor Punch Lists", desc: "Incomplete outdoor items delay occupancy and handoff. We help close visible punch list items quickly and clearly." },
                { icon: Shovel, title: "Grading and Drainage", desc: "Improper grading creates post-close drainage failures that turn into expensive callbacks." },
                { icon: Droplets, title: "Irrigation Rough-In", desc: "Early irrigation planning and installation can save cost and simplify later landscape commissioning." },
                { icon: Leaf, title: "Landscape Installation", desc: "Final installation has to match site readiness, inspections, and closeout timing." },
                { icon: AlertCircle, title: "Erosion Control", desc: "Active sites often need better visibility into erosion and runoff-related outdoor concerns." },
                { icon: HardHat, title: "Schedule Coordination", desc: "Outdoor work has to fit the broader construction timeline without slowing other trades." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <item.icon className="mb-3 h-6 w-6 text-forest-600" />
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="construction-services" className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="construction-services" className="text-3xl font-extrabold text-stone-900">What We Handle on Construction Projects</h2>
              <p className="mt-3 text-stone-600">Outdoor scopes that affect inspections, closeout, and long-term site performance.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[
                { icon: Droplets, label: "Irrigation Rough-In and Install" },
                { icon: Layers, label: "Grading and Drainage" },
                { icon: Lightbulb, label: "Landscape Lighting" },
                { icon: Shield, label: "Hardscape Installation" },
                { icon: Leaf, label: "Landscape Installation" },
                { icon: CheckCircle, label: "Punch List Completion" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-4 shadow-sm transition-colors duration-200 hover:border-forest-200">
                  <item.icon className="h-5 w-5 text-forest-600" />
                  <span className="text-sm font-semibold text-stone-700">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="construction-process">
            <div className="mb-8 text-center">
              <h2 id="construction-process" className="text-3xl font-extrabold text-stone-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request a Facility Review", desc: "We review plans and site conditions to assess outdoor scope, drainage, irrigation, and closeout needs." },
                { step: "2", title: "Get a Prioritized Plan", desc: "You receive a scope organized by construction phase, inspection milestones, and project timing." },
                { step: "3", title: "We Execute and Report", desc: "Work is completed in step with the project and documented for inspection and closeout use." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{item.step}</div>
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="construction-benefits" className="rounded-[2rem] bg-stone-900 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="construction-benefits" className="text-3xl font-extrabold text-white">Why Builders and Developers Choose Elite</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Schedule-Integrated Execution", desc: "Outdoor work is coordinated with broader project timing so it supports progress instead of slowing it down." },
                { title: "Drainage Done Right the First Time", desc: "Better grading and drainage verification helps reduce costly post-close corrections." },
                { title: "Irrigation Rough-In Savings", desc: "Early irrigation integration often makes more sense than retrofitting after project completion." },
                { title: "Closeout-Ready Documentation", desc: "Photo-backed records and scope visibility help support final punch list and handoff conversations." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="construction-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="construction-faqs" className="text-3xl font-extrabold text-stone-900">Construction Outdoor FAQs</h2>
              <p className="mt-3 text-stone-600">Answers for builders and developers managing outdoor scope near inspection, closeout, and turnover.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              commonCauses={["Outdoor closeout items remain unfinished", "Drainage verification has not been documented", "Visible irrigation or grade issues are holding up handoff"]}
              whenToCall="Call when final outdoor items are threatening inspection timing, occupancy, or project closeout."
              whatToDoNext="Share the project stage and the outstanding items so we can prioritize the most time-sensitive outdoor work first."
              relatedQuestions={[faqItems[1].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              commonCauses={["Outdoor work is being squeezed by other trades", "Inspection timing keeps shifting", "Project teams need cleaner sequencing between site work and closeout"]}
              whenToCall="Call when outdoor scope needs tighter alignment with the broader construction schedule."
              whatToDoNext="Request a review and send the current project timeline so we can fit outdoor work into the right phase."
              relatedQuestions={[faqItems[0].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              commonCauses={["Drainage flow has not been fully validated", "Irrigation performance is unverified", "Warranty risk is forming before turnover"]}
              whenToCall="Call before final turnover when outdoor systems need one more verification pass to reduce callbacks later."
              whatToDoNext="Book the review and we will help identify the outdoor issues most likely to become post-close problems."
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </section>

          <section className="rounded-[2rem] bg-forest-600 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">Outdoor Work That Keeps Your Project on Schedule</h2>
            <p className="mx-auto mt-4 max-w-2xl text-green-100">Start with a facility review and get a plan that fits the construction timeline from rough-in to final inspection.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-forest-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                Request Facility Review <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
