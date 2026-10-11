import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle,
  Droplets,
  Eye,
  Layers,
  Leaf,
  Lightbulb,
  Phone,
  Shield,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/office-park-outdoor-services";
const TITLE = "Office Park Outdoor Services Charlotte NC";
const DESCRIPTION = "Professional outdoor maintenance for office parks with tenant-focused presentation, entry drainage support, polished parking lot landscaping, and business-hour scheduling in the Charlotte, NC area.";

const faqItems = [
  {
    q: "Do you work around tenant hours?",
    a: "Yes. We schedule visits to minimize disruption to building occupants while maintaining a polished appearance during business hours and key tenant-facing periods.",
  },
  {
    q: "Can you help office parks improve tenant-facing curb appeal?",
    a: "Yes. We focus on entry sequences, parking lot islands, shared outdoor spaces, and visible drainage issues that affect tenant and visitor perception.",
  },
  {
    q: "Do you handle drainage issues near entries and parking areas?",
    a: "Yes. We identify and prioritize standing water, runoff, and landscape-related drainage issues that create liability and damage pavement over time.",
  },
];

const trustPoints = [
  { icon: Building2, label: "Business-hour presentation" },
  { icon: ShieldCheck, label: "Tenant disruption minimized" },
  { icon: Layers, label: "Entry and parking drainage focus" },
];

export default function OfficeParkOutdoorServicesPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://eliteirrigation.com${PAGE_PATH}`}
        jsonLd={[
          makeServiceSchema("Office Park Outdoor Services in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities", url: "/outdoor-facilities-services" },
            { name: "Office Park Outdoor Services", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Facilities", to: "/outdoor-facilities-services" }, { label: "Office Park Outdoor Services" }]} />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12">
          <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-stone-100 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 ring-1 ring-forest-200">
                Professional grounds for tenant-facing campuses
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte office park outdoor partner</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">Office Park Outdoor Services</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                Professional grounds that make the right impression on tenants, visitors, and prospective lessees every single day.
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

          <section aria-labelledby="op-challenges">
            <div className="mb-8 text-center">
              <h2 id="op-challenges" className="text-3xl font-extrabold text-stone-900">Office Park Outdoor Challenges We Solve</h2>
              <p className="mt-3 text-stone-600">Tailored for professional campuses where appearance, access, and scheduling all matter.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Eye, title: "Professional Appearance", desc: "Overgrown beds and patchy turf signal neglect to tenants and prospects touring the property." },
                { icon: TrendingUp, title: "Tenant Retention", desc: "Exterior quality shapes lease renewal perception in competitive office environments." },
                { icon: Layers, title: "Entry and Exit Drainage", desc: "Standing water at drives and parking areas creates liability and accelerates pavement wear." },
                { icon: Building2, title: "Parking Lot Landscaping", desc: "Island beds and perimeter plantings need consistent care to stay presentable year-round." },
                { icon: AlertCircle, title: "Deferred Maintenance", desc: "Small outdoor issues compound quickly across larger campuses when maintenance is inconsistent." },
                { icon: Users, title: "Vendor Accountability", desc: "Multiple outdoor contractors often create coverage gaps and slower issue resolution." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <item.icon className="mb-3 h-6 w-6 text-forest-600" />
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="op-services" className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="op-services" className="text-3xl font-extrabold text-stone-900">What We Manage for Office Parks</h2>
              <p className="mt-3 text-stone-600">The systems and visible outdoor details that shape workplace perception.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[
                { icon: Droplets, label: "Irrigation Systems" },
                { icon: Layers, label: "Drainage Solutions" },
                { icon: Lightbulb, label: "Landscape Lighting" },
                { icon: Shield, label: "Hardscape Maintenance" },
                { icon: Leaf, label: "Grounds and Turf Care" },
                { icon: CheckCircle, label: "General Outdoor Upkeep" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-4 shadow-sm transition-colors duration-200 hover:border-forest-200">
                  <item.icon className="h-5 w-5 text-forest-600" />
                  <span className="text-sm font-semibold text-stone-700">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="op-process">
            <div className="mb-8 text-center">
              <h2 id="op-process" className="text-3xl font-extrabold text-stone-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request a Facility Review", desc: "We walk your campus and document entrances, parking edges, drainage zones, turf, and lighting conditions." },
                { step: "2", title: "Get a Prioritized Plan", desc: "You receive a written scope organized by tenant experience, visible risk, and maintenance urgency." },
                { step: "3", title: "We Execute and Report", desc: "Work is completed on schedule with photo documentation and service updates for your records." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{item.step}</div>
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="op-benefits" className="rounded-[2rem] bg-stone-900 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="op-benefits" className="text-3xl font-extrabold text-white">Why Office Park Owners Choose Elite</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Tenant-Facing Professionalism", desc: "Consistently maintained grounds reinforce the professionalism tenants expect from the property." },
                { title: "Drainage That Protects Pavement", desc: "Addressing landscape-related water issues early helps extend the life of hardscape and parking surfaces." },
                { title: "Seasonal Consistency", desc: "Year-round planning keeps the campus looking sharp without visible maintenance gaps." },
                { title: "Single Point of Contact", desc: "One partner handling outdoor work reduces coordination friction for property teams." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="op-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="op-faqs" className="text-3xl font-extrabold text-stone-900">Office Park FAQs</h2>
              <p className="mt-3 text-stone-600">Answers for property teams responsible for professional presentation and low-disruption service execution.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              commonCauses={["Tenant arrivals cluster during specific hours", "Visible outdoor work can affect first impressions", "Property teams need service completed without business disruption"]}
              whenToCall="Call when you need outdoor work coordinated around occupancy patterns, tours, or heavily trafficked business hours."
              whatToDoNext="Share tenant-sensitive hours and access constraints so we can plan site work around them."
              relatedQuestions={[faqItems[1].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              commonCauses={["Entry beds feel neglected", "Parking lot islands look inconsistent", "Tenant-facing exterior areas no longer match interior quality"]}
              whenToCall="Call when curb appeal is affecting tours, renewals, or the overall feel of the campus."
              whatToDoNext="Request a review so we can identify the most visible upgrades and maintenance gaps first."
              relatedQuestions={[faqItems[0].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              commonCauses={["Standing water near doors", "Parking lot runoff is creating wear", "Landscape grading is contributing to repeat issues"]}
              whenToCall="Call when water is affecting access, appearance, or pavement condition near high-traffic office areas."
              whatToDoNext="Book the review and point out recurring entry or parking problem areas so we can prioritize them quickly."
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </section>

          <section className="rounded-[2rem] bg-forest-600 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">Grounds That Reflect the Quality of Your Office Park</h2>
            <p className="mx-auto mt-4 max-w-2xl text-green-100">Start with a facility review and get a written plan that supports tenant retention and long-term property value.</p>
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
