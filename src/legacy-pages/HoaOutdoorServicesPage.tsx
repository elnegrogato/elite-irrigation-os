import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import {
  AlertCircle,
  ArrowRight,
  BarChart2,
  Calendar,
  CheckCircle,
  ClipboardList,
  Droplets,
  Layers,
  Leaf,
  Lightbulb,
  Phone,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/hoa-outdoor-services";
const TITLE = "HOA Outdoor Services Charlotte NC";
const DESCRIPTION = "Outdoor maintenance built for HOA boards with common area care, board-ready reporting, resident complaint reduction, and annual budget planning in Charlotte, NC.";

const faqItems = [
  {
    q: "How do you report to HOA boards?",
    a: "We provide monthly board-ready reports with photos, completed tasks, condition updates, and budget tracking so board members can review progress without chasing down details.",
  },
  {
    q: "Can you reduce resident complaints?",
    a: "Yes. Proactive maintenance, documented service visits, and quicker response to visible outdoor issues significantly reduce common resident complaints.",
  },
  {
    q: "Do you help with annual HOA budget planning?",
    a: "Yes. We identify recurring maintenance needs, flag larger outdoor issues early, and help boards prioritize spending before problems turn into surprise costs.",
  },
];

const trustPoints = [
  { icon: ClipboardList, label: "Board-ready monthly reporting" },
  { icon: ShieldCheck, label: "Common-area risk reduction" },
  { icon: Calendar, label: "Seasonal planning support" },
];

export default function HoaOutdoorServicesPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://eliteirrigation.com${PAGE_PATH}`}
        jsonLd={[
          makeServiceSchema("HOA Outdoor Services in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities", url: "/outdoor-facilities-services" },
            { name: "HOA Outdoor Services", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Facilities", to: "/outdoor-facilities-services" }, { label: "HOA Outdoor Services" }]} />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12">
          <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-stone-100 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 ring-1 ring-forest-200">
                HOA board support for common-area operations
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte HOA outdoor partner</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">HOA Outdoor Services</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                Keep common areas pristine, residents satisfied, and your board prepared without chasing vendors or fielding avoidable complaint calls.
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

          <section aria-labelledby="hoa-pain-points">
            <div className="mb-8 text-center">
              <h2 id="hoa-pain-points" className="text-3xl font-extrabold text-stone-900">Common HOA Pain Points We Solve</h2>
              <p className="mt-3 text-stone-600">Structured outdoor management for boards that need fewer surprises and stronger documentation.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Users, title: "Resident Complaints", desc: "Overgrown beds, broken sprinklers, and dead turf generate board emails. We help prevent them before they escalate." },
                { icon: BarChart2, title: "Annual Budget Pressure", desc: "Surprise repair bills blow budgets. We help boards plan ahead with clearer maintenance visibility." },
                { icon: ClipboardList, title: "Board Reporting", desc: "Boards need documentation. We deliver service updates with photos and clear notes." },
                { icon: Calendar, title: "Annual Meeting Prep", desc: "We coordinate seasonal cleanup timing around the dates that matter most to the community." },
                { icon: AlertCircle, title: "Vendor Accountability", desc: "One outdoor partner means faster follow-through and fewer gaps between scopes." },
                { icon: Shield, title: "Liability Exposure", desc: "Uneven hardscapes and drainage issues create risk. We help identify and prioritize them." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <item.icon className="mb-3 h-6 w-6 text-forest-600" />
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="hoa-services" className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="hoa-services" className="text-3xl font-extrabold text-stone-900">What We Manage for HOAs</h2>
              <p className="mt-3 text-stone-600">Comprehensive support across the outdoor systems residents notice first.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[
                { icon: Droplets, label: "Irrigation Systems" },
                { icon: Layers, label: "Drainage Solutions" },
                { icon: Lightbulb, label: "Landscape Lighting" },
                { icon: Shield, label: "Hardscape Maintenance" },
                { icon: Leaf, label: "Grounds & Turf Care" },
                { icon: CheckCircle, label: "General Outdoor Upkeep" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-4 shadow-sm transition-colors duration-200 hover:border-forest-200">
                  <item.icon className="h-5 w-5 text-forest-600" />
                  <span className="text-sm font-semibold text-stone-700">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="hoa-process">
            <div className="mb-8 text-center">
              <h2 id="hoa-process" className="text-3xl font-extrabold text-stone-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request a Facility Review", desc: "We walk your common areas and document irrigation, drainage, turf, lighting, and hardscape concerns." },
                { step: "2", title: "Get a Prioritized Plan", desc: "You receive a written scope with cost guidance organized by urgency so board decisions are easier." },
                { step: "3", title: "We Execute and Report", desc: "Work is completed on schedule with photo-backed updates ready for your next board conversation." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{item.step}</div>
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="hoa-why-elite" className="rounded-[2rem] bg-stone-900 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="hoa-why-elite" className="text-3xl font-extrabold text-white">Why HOA Boards Choose Elite</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Board-Ready Documentation", desc: "Every visit produces reporting your board can use without reformatting or chasing follow-up." },
                { title: "Predictable Annual Budgets", desc: "We help surface outdoor needs early so planning happens before costs become urgent." },
                { title: "Resident Satisfaction", desc: "Cleaner common areas and better follow-through reduce the outdoor issues residents notice most." },
                { title: "Single Vendor Accountability", desc: "One partner for outdoor systems simplifies communication, approvals, and service visibility." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="hoa-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="hoa-faqs" className="text-3xl font-extrabold text-stone-900">HOA Outdoor Services FAQs</h2>
              <p className="mt-3 text-stone-600">Fast answers for boards and managers comparing outdoor service partners.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              commonCauses={["Board members need photo-backed updates", "Communities need clearer service history", "Management wants easier meeting prep"]}
              whenToCall="Call when the board needs better visibility before budget meetings, annual meetings, or vendor reviews."
              whatToDoNext="Share your property size, current vendors, and reporting pain points so we can tailor the review."
              relatedQuestions={[faqItems[1].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              commonCauses={["Recurring irrigation issues", "Visible turf decline", "Complaint patterns around entrances or common spaces"]}
              whenToCall="Call when resident complaints are increasing or common-area appearance is affecting board confidence."
              whatToDoNext="Request a facility review so we can document complaint hotspots and prioritize the fixes with the highest impact."
              relatedQuestions={[faqItems[0].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              commonCauses={["Deferred repairs are building up", "Boards need clearer capital planning", "Annual budgets keep getting hit by reactive work"]}
              whenToCall="Call before budget season or whenever the board wants a clearer outdoor roadmap for the next 12 months."
              whatToDoNext="Book the review and we will organize needs by urgency, visibility, and likely budget timing."
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </section>

          <section className="rounded-[2rem] bg-forest-600 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">Ready to Simplify Your HOA&apos;s Outdoor Operations?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-green-100">Schedule a no-obligation facility review and get a written plan your board can act on with confidence.</p>
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
