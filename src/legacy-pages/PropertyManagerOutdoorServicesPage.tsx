import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import {
  ArrowRight,
  BarChart2,
  Building2,
  CheckCircle,
  ClipboardList,
  Droplets,
  Layers,
  Leaf,
  Lightbulb,
  Phone,
  Shield,
  ShieldCheck,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/property-manager-outdoor-services";
const TITLE = "Property Manager Outdoor Services Charlotte NC";
const DESCRIPTION = "Outdoor maintenance for property managers with multi-property oversight, vendor consolidation, budget forecasting, and tenant satisfaction support in the Charlotte, NC area.";

const faqItems = [
  {
    q: "Can you manage multiple properties?",
    a: "Yes. We provide consolidated reporting across your portfolio with per-property detail so you can see priorities, service history, and site-specific issues in one place.",
  },
  {
    q: "How does budget forecasting work?",
    a: "We assess current conditions, project recurring maintenance needs, and provide annual budget recommendations based on property condition, visibility, and risk.",
  },
  {
    q: "Do you help reduce time spent coordinating vendors?",
    a: "Yes. Consolidating outdoor scopes under one accountable partner reduces scheduling overlap, invoice sprawl, and follow-up time for managers.",
  },
];

const trustPoints = [
  { icon: Building2, label: "Portfolio-level visibility" },
  { icon: ShieldCheck, label: "One accountable outdoor partner" },
  { icon: BarChart2, label: "Budget planning support" },
];

export default function PropertyManagerOutdoorServicesPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://eliteirrigation.com${PAGE_PATH}`}
        jsonLd={[
          makeServiceSchema("Property Manager Outdoor Services in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities", url: "/outdoor-facilities-services" },
            { name: "Property Manager Outdoor Services", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Facilities", to: "/outdoor-facilities-services" }, { label: "Property Manager Outdoor Services" }]} />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12">
          <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-stone-100 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 ring-1 ring-forest-200">
                Multi-site outdoor operations support
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte property management partner</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">Property Manager Outdoor Services</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                Manage outdoor maintenance across multiple properties without juggling multiple vendors, missed visits, or budget surprises.
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

          <section aria-labelledby="pm-challenges">
            <div className="mb-8 text-center">
              <h2 id="pm-challenges" className="text-3xl font-extrabold text-stone-900">Challenges Property Managers Face</h2>
              <p className="mt-3 text-stone-600">Built for managers balancing owner expectations, tenant experience, and property-by-property execution.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Building2, title: "Multi-Property Oversight", desc: "Tracking outdoor conditions across a portfolio is time-consuming without a reliable reporting structure." },
                { icon: Users, title: "Vendor Fragmentation", desc: "Multiple contractors create multiple invoices, conflicting schedules, and accountability gaps." },
                { icon: BarChart2, title: "Budget Forecasting", desc: "Unplanned repairs make annual budgets unreliable and owner reporting harder than it should be." },
                { icon: TrendingUp, title: "Tenant Satisfaction Scores", desc: "Exterior appearance directly affects renewals and overall tenant perception of the property." },
                { icon: ClipboardList, title: "Owner Reporting", desc: "Owners expect documentation. We make it easier to pass along what happened and what is next." },
                { icon: Wrench, title: "Deferred Maintenance Risk", desc: "Small irrigation or drainage issues become expensive when they multiply across multiple sites." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <item.icon className="mb-3 h-6 w-6 text-forest-600" />
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="pm-services" className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="pm-services" className="text-3xl font-extrabold text-stone-900">What We Manage Across Your Portfolio</h2>
              <p className="mt-3 text-stone-600">One outdoor partner across the systems that affect presentation, cost control, and risk.</p>
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

          <section aria-labelledby="pm-process">
            <div className="mb-8 text-center">
              <h2 id="pm-process" className="text-3xl font-extrabold text-stone-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request a Facility Review", desc: "We assess each property and document outdoor conditions, risks, and deferred maintenance priorities." },
                { step: "2", title: "Get a Prioritized Plan", desc: "Receive a consolidated scope with property-specific detail and clear cost planning logic." },
                { step: "3", title: "We Execute and Report", desc: "Work is completed on schedule with updates you can forward directly to ownership groups." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{item.step}</div>
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="pm-benefits" className="rounded-[2rem] bg-stone-900 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="pm-benefits" className="text-3xl font-extrabold text-white">Why Property Managers Choose Elite</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Portfolio-Wide Consolidation", desc: "One point of accountability across every outdoor service line and property you oversee." },
                { title: "Predictable Cost Forecasting", desc: "Annual planning becomes easier when outdoor needs are documented before they become urgent." },
                { title: "Tenant Retention Support", desc: "Sharper curb appeal and quicker issue resolution support better tenant perception across the portfolio." },
                { title: "Owner-Ready Documentation", desc: "Service notes and photo-backed reporting are easier to share with owners and asset managers." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="pm-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="pm-faqs" className="text-3xl font-extrabold text-stone-900">Property Manager FAQs</h2>
              <p className="mt-3 text-stone-600">Practical answers for managers responsible for multiple sites, budgets, and ownership communication.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              commonCauses={["Multiple sites have inconsistent outdoor conditions", "Managers need one reporting workflow", "Ownership teams want clearer site-by-site visibility"]}
              whenToCall="Call when your portfolio has too many outdoor vendors or too little visibility into what each site needs next."
              whatToDoNext="Send your property list and priority locations so we can structure the review and reporting around your portfolio."
              relatedQuestions={[faqItems[1].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              commonCauses={["Reactive repairs keep disrupting budgets", "Managers need better visibility into future spend", "Ownership expects budget recommendations, not guesswork"]}
              whenToCall="Call before annual planning, owner reporting, or when outdoor maintenance costs are becoming inconsistent across sites."
              whatToDoNext="Book the facility review and we will organize needs by urgency, recurring cost, and property-specific visibility."
              relatedQuestions={[faqItems[0].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              commonCauses={["Invoices are fragmented across vendors", "Scheduling conflicts waste manager time", "Issue ownership is unclear when problems span multiple scopes"]}
              whenToCall="Call when coordination overhead is becoming as big a problem as the outdoor issues themselves."
              whatToDoNext="Request a review so we can identify where consolidation will save the most time and reduce the most confusion."
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </section>

          <section className="rounded-[2rem] bg-forest-600 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">Simplify Outdoor Maintenance Across Your Entire Portfolio</h2>
            <p className="mx-auto mt-4 max-w-2xl text-green-100">One review, one plan, and one partner covering the properties you manage most closely.</p>
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
