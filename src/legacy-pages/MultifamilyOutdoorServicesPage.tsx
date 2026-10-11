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
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/multifamily-outdoor-services";
const TITLE = "Multifamily Outdoor Services Charlotte NC";
const DESCRIPTION = "Outdoor maintenance for multifamily properties with stronger curb appeal for leasing, irrigation efficiency, liability reduction, and resident satisfaction support in Charlotte, NC.";

const faqItems = [
  {
    q: "How does outdoor maintenance affect leasing?",
    a: "Well-maintained outdoor spaces directly impact curb appeal, prospect tours, and resident satisfaction scores, which makes leasing teams more effective and renewals easier.",
  },
  {
    q: "Can you help reduce water waste at multifamily properties?",
    a: "Yes. Irrigation reviews, controller adjustments, and repairs help reduce overspray, runoff, and unnecessary utility spend across the property.",
  },
  {
    q: "Do you document liability-related outdoor issues?",
    a: "Yes. We identify and document visible issues involving drainage, lighting, and walkable surfaces so management teams can prioritize risk reduction faster.",
  },
];

const trustPoints = [
  { icon: Eye, label: "Leasing-focused curb appeal" },
  { icon: ShieldCheck, label: "Risk reduction support" },
  { icon: TrendingUp, label: "Resident experience focus" },
];

export default function MultifamilyOutdoorServicesPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://eliteirrigation.com${PAGE_PATH}`}
        jsonLd={[
          makeServiceSchema("Multifamily Outdoor Services in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities", url: "/outdoor-facilities-services" },
            { name: "Multifamily Outdoor Services", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Facilities", to: "/outdoor-facilities-services" }, { label: "Multifamily Outdoor Services" }]} />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12">
          <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-stone-100 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 ring-1 ring-forest-200">
                Leasing-ready grounds and resident-facing upkeep
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte multifamily outdoor partner</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">Multifamily Outdoor Services</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                Curb appeal that drives leasing, irrigation that cuts water bills, and grounds that keep residents proud to call your property home.
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

          <section aria-labelledby="mf-challenges">
            <div className="mb-8 text-center">
              <h2 id="mf-challenges" className="text-3xl font-extrabold text-stone-900">Multifamily Outdoor Challenges We Address</h2>
              <p className="mt-3 text-stone-600">Built around the realities of tours, renewals, utility costs, and shared-space upkeep.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Eye, title: "Curb Appeal for Leasing", desc: "Prospective residents form opinions at the entrance. Neglected grounds cost you tours and leasing momentum." },
                { icon: AlertCircle, title: "Liability Reduction", desc: "Uneven walkways, standing water, and poor lighting create exposure in highly trafficked resident areas." },
                { icon: Droplets, title: "Irrigation Efficiency", desc: "Outdated or broken irrigation systems waste water and inflate utility costs across the property." },
                { icon: Trash2, title: "Trash Area Maintenance", desc: "Vegetation around service areas can create odor, pest, and cleanliness issues residents notice quickly." },
                { icon: TrendingUp, title: "Resident Retention", desc: "Well-maintained outdoor spaces support lease renewals and reinforce the feeling of a well-managed community." },
                { icon: Users, title: "Vendor Coordination", desc: "Large properties get harder to manage when outdoor scopes are split between too many contractors." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <item.icon className="mb-3 h-6 w-6 text-forest-600" />
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="mf-services" className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="mf-services" className="text-3xl font-extrabold text-stone-900">What We Manage for Multifamily Properties</h2>
              <p className="mt-3 text-stone-600">Systems and spaces that affect tours, resident experience, and maintenance costs.</p>
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

          <section aria-labelledby="mf-process">
            <div className="mb-8 text-center">
              <h2 id="mf-process" className="text-3xl font-extrabold text-stone-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request a Facility Review", desc: "We walk entrances, amenity zones, common areas, parking edges, and utility areas to document conditions." },
                { step: "2", title: "Get a Prioritized Plan", desc: "You receive a scope organized by leasing impact, resident visibility, and longer-term maintenance value." },
                { step: "3", title: "We Execute and Report", desc: "Work is completed on schedule with photo documentation and service summaries for your records." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{item.step}</div>
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="mf-benefits" className="rounded-[2rem] bg-stone-900 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="mf-benefits" className="text-3xl font-extrabold text-white">Why Multifamily Operators Choose Elite</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Leasing-Driven Curb Appeal", desc: "We focus on the spaces prospects and residents notice first, from entrances to shared common areas." },
                { title: "Water Cost Reduction", desc: "Better irrigation performance helps reduce waste and improve consistency across the property." },
                { title: "Liability Documentation", desc: "Photo-backed reporting helps management teams prioritize drainage, lighting, and walkway concerns faster." },
                { title: "Resident Pride", desc: "Clean, well-maintained grounds signal that management cares and help support long-term resident satisfaction." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="mf-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="mf-faqs" className="text-3xl font-extrabold text-stone-900">Multifamily Outdoor FAQs</h2>
              <p className="mt-3 text-stone-600">Answers for operators balancing leasing, maintenance, and resident-facing outdoor presentation.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              commonCauses={["Prospects judge the property before entering the leasing office", "Shared outdoor spaces shape resident perception", "Neglected curb appeal hurts renewal confidence"]}
              whenToCall="Call when tours are increasing, curb appeal is slipping, or you need outdoor presentation to support occupancy goals."
              whatToDoNext="Schedule a review so we can identify the outdoor issues affecting first impressions and resident satisfaction most."
              relatedQuestions={[faqItems[1].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              commonCauses={["Overspray on hardscapes", "Broken heads or poor zone coverage", "Controllers running longer than needed"]}
              whenToCall="Call when water bills are rising or when you notice muddy areas, runoff, or uneven turf performance."
              whatToDoNext="Request a facility review and include any known irrigation hotspots so we can document them during the walkthrough."
              relatedQuestions={[faqItems[0].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              commonCauses={["High-traffic paths have visible wear", "Drainage complaints keep recurring", "Property teams need a clearer risk-priority list"]}
              whenToCall="Call when safety, resident complaints, or inspection concerns are becoming harder to track across the site."
              whatToDoNext="Book the review and we will organize visible risks by urgency, location, and resident impact."
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </section>

          <section className="rounded-[2rem] bg-forest-600 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">Outdoor Grounds That Support Your Leasing Goals</h2>
            <p className="mx-auto mt-4 max-w-2xl text-green-100">Start with a facility review and get a plan that prioritizes what matters most to your residents and your bottom line.</p>
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
