import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Droplets,
  Eye,
  Layers,
  Leaf,
  Lightbulb,
  Phone,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sun,
  TrendingUp,
  Wrench,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/retail-center-outdoor-services";
const TITLE = "Retail Center Outdoor Services Charlotte NC";
const DESCRIPTION = "Outdoor maintenance for retail centers with stronger customer first impressions, signage area upkeep, stormwater support, and seasonal color planning in Charlotte, NC.";

const faqItems = [
  {
    q: "How do outdoor conditions affect a retail center's first impression?",
    a: "Shoppers often judge the center before they park. Clean entrances, maintained signage areas, and healthy landscape beds help reinforce that tenants and ownership care about the property.",
  },
  {
    q: "Can you support seasonal color programs for retail centers?",
    a: "Yes. We can help plan and maintain seasonal plantings that keep the center looking fresh and visually active throughout the year.",
  },
  {
    q: "Do you help with drainage and stormwater-related outdoor issues?",
    a: "Yes. We identify landscape and drainage issues that contribute to runoff, standing water, and presentation problems around storefront and parking areas.",
  },
];

const trustPoints = [
  { icon: Eye, label: "Shopper-first curb appeal" },
  { icon: ShieldCheck, label: "Stormwater issue visibility" },
  { icon: Sun, label: "Seasonal color support" },
];

export default function RetailCenterOutdoorServicesPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://eliteirrigation.com${PAGE_PATH}`}
        jsonLd={[
          makeServiceSchema("Retail Center Outdoor Services in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities", url: "/outdoor-facilities-services" },
            { name: "Retail Center Outdoor Services", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Facilities", to: "/outdoor-facilities-services" }, { label: "Retail Center Outdoor Services" }]} />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12">
          <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-stone-100 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 ring-1 ring-forest-200">
                Outdoor presentation built for shopper traffic
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte retail center outdoor partner</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">Retail Center Outdoor Services</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                Shoppers decide whether to stop before they park. Grounds that look sharp drive foot traffic and help tenants feel more confident about the center.
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

          <section aria-labelledby="retail-challenges">
            <div className="mb-8 text-center">
              <h2 id="retail-challenges" className="text-3xl font-extrabold text-stone-900">Retail Outdoor Challenges We Address</h2>
              <p className="mt-3 text-stone-600">Focused on the visible outdoor details that shape shopper behavior and tenant confidence.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Eye, title: "Customer First Impression", desc: "Overgrown or dead landscaping at the entrance signals neglect before customers enter a store." },
                { icon: ShoppingBag, title: "Signage Area Maintenance", desc: "Weeds and declining plantings around monument signs weaken tenant brand presentation." },
                { icon: AlertCircle, title: "Stormwater Support", desc: "Drainage issues around storefronts and parking areas hurt both appearance and usability." },
                { icon: Sun, title: "Seasonal Color Programs", desc: "Rotating plantings keep the center feeling fresh and visually active throughout the year." },
                { icon: TrendingUp, title: "Tenant Satisfaction", desc: "Tenants care about how the center feels to customers and how ownership supports that image." },
                { icon: Wrench, title: "Irrigation Waste", desc: "Broken or inefficient irrigation creates muddy zones, overspray, and avoidable water expense." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <item.icon className="mb-3 h-6 w-6 text-forest-600" />
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="retail-services" className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="retail-services" className="text-3xl font-extrabold text-stone-900">What We Manage for Retail Centers</h2>
              <p className="mt-3 text-stone-600">Systems and spaces that affect traffic, storefront presentation, and curb appeal consistency.</p>
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

          <section aria-labelledby="retail-process">
            <div className="mb-8 text-center">
              <h2 id="retail-process" className="text-3xl font-extrabold text-stone-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request a Facility Review", desc: "We inspect entrances, signage areas, parking islands, drainage zones, and highly visible landscape beds." },
                { step: "2", title: "Get a Prioritized Plan", desc: "You receive a written scope organized by customer-facing impact, visual urgency, and maintenance value." },
                { step: "3", title: "We Execute and Report", desc: "Work is completed on schedule with documentation that helps ownership and management track progress." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{item.step}</div>
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="retail-benefits" className="rounded-[2rem] bg-stone-900 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="retail-benefits" className="text-3xl font-extrabold text-white">Why Retail Center Owners Choose Elite</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Shopper-First Curb Appeal", desc: "We prioritize entrances, signage, and high-traffic visuals that shape customer impressions first." },
                { title: "Stormwater Issue Visibility", desc: "Drainage-related landscape problems are easier to prioritize when they are documented clearly and early." },
                { title: "Seasonal Color Programs", desc: "Strategic plantings help keep the center feeling maintained, current, and worth revisiting." },
                { title: "Tenant Retention Through Presentation", desc: "A cleaner, sharper center supports tenant pride and helps reinforce leasing confidence." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="retail-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="retail-faqs" className="text-3xl font-extrabold text-stone-900">Retail Center FAQs</h2>
              <p className="mt-3 text-stone-600">Helpful answers for retail property teams comparing outdoor partners and visual improvement priorities.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              commonCauses={["Entrances feel dated or neglected", "Signage surroundings undercut tenant branding", "Landscaping does not match the quality of the tenant mix"]}
              whenToCall="Call when curb appeal is affecting traffic, leasing confidence, or tenant perception of the center."
              whatToDoNext="Book a facility review so we can identify the outdoor areas with the biggest visual impact first."
              relatedQuestions={[faqItems[1].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              commonCauses={["The center feels visually flat", "Ownership wants more seasonal freshness", "Key beds need a stronger visual program throughout the year"]}
              whenToCall="Call before major seasonal transitions or when ownership wants the center to feel more current and active."
              whatToDoNext="Request a review and we can identify the best high-visibility zones for seasonal color updates."
              relatedQuestions={[faqItems[0].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              commonCauses={["Runoff collects near storefronts", "Parking lot edges hold water", "Landscape grading is contributing to visible wet spots"]}
              whenToCall="Call when water issues are affecting appearance, customer access, or the condition of nearby hardscape."
              whatToDoNext="Schedule a facility review and flag any repeat drainage trouble spots so we can assess them on site."
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </section>

          <section className="rounded-[2rem] bg-forest-600 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">Grounds That Drive Foot Traffic and Tenant Confidence</h2>
            <p className="mx-auto mt-4 max-w-2xl text-green-100">Start with a facility review and get a plan that puts your retail center&apos;s best face forward.</p>
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
