import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import {
  ArrowRight,
  Award,
  CheckCircle,
  ClipboardList,
  Droplets,
  Eye,
  Layers,
  Leaf,
  Lightbulb,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/luxury-hoa-outdoor-services";
const TITLE = "Luxury HOA Outdoor Services Charlotte NC";
const DESCRIPTION = "Premium outdoor maintenance for luxury HOAs with concierge-level reporting, gate entry landscaping, lighting upkeep, and exceptional common-area presentation in Charlotte, NC.";

const faqItems = [
  {
    q: "What makes your luxury service different?",
    a: "Our luxury HOA service emphasizes concierge-level reporting, premium finishes, gate entry landscaping, lighting detail, and dedicated account-level communication for communities with higher presentation standards.",
  },
  {
    q: "Can you maintain the gate entry and signature common areas to a higher standard?",
    a: "Yes. We focus heavily on the visual experience at entries, monuments, and other signature spaces that shape resident and guest perception first.",
  },
  {
    q: "Do luxury HOA boards receive more detailed reporting?",
    a: "Yes. Reporting is more polished and more specific so boards have stronger visibility into property condition, service quality, and next-step recommendations.",
  },
];

const trustPoints = [
  { icon: Star, label: "Concierge-level reporting" },
  { icon: Eye, label: "Gate entry presentation focus" },
  { icon: ShieldCheck, label: "Premium community standards" },
];

export default function LuxuryHoaOutdoorServicesPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://eliteirrigation.com${PAGE_PATH}`}
        jsonLd={[
          makeServiceSchema("Luxury HOA Outdoor Services in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities", url: "/outdoor-facilities-services" },
            { name: "Luxury HOA Outdoor Services", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Facilities", to: "/outdoor-facilities-services" }, { label: "Luxury HOA Outdoor Services" }]} />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12">
          <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-stone-100 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 ring-1 ring-forest-200">
                Premium outdoor care for high-standard communities
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte luxury HOA outdoor partner</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">Luxury HOA Outdoor Services</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                Premium outdoor maintenance that reflects the standard your residents expect, from gate entry landscaping to concierge-level reporting for your board.
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

          <section aria-labelledby="lhoa-challenges">
            <div className="mb-8 text-center">
              <h2 id="lhoa-challenges" className="text-3xl font-extrabold text-stone-900">Luxury HOA Outdoor Challenges We Address</h2>
              <p className="mt-3 text-stone-600">Built for communities where small presentation gaps feel large and resident expectations stay high.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Star, title: "Premium Finish Standards", desc: "Luxury residents notice details quickly and visible maintenance gaps generate immediate escalations." },
                { icon: Eye, title: "Gate Entry Landscaping", desc: "The community entry defines the entire arrival experience and must stay consistently polished." },
                { icon: Lightbulb, title: "Lighting Design and Upkeep", desc: "Architectural and landscape lighting requires precise maintenance to preserve the community aesthetic." },
                { icon: ClipboardList, title: "Concierge-Level Reporting", desc: "Luxury HOA boards expect more than proof of service. They want stronger visibility and better presentation." },
                { icon: Award, title: "Property Value Protection", desc: "Outdoor presentation contributes directly to the premium feel homeowners expect to protect." },
                { icon: Sparkles, title: "Seasonal Showcase Moments", desc: "Holiday, event, and seasonal landscape moments require a partner who plans ahead and executes cleanly." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <item.icon className="mb-3 h-6 w-6 text-forest-600" />
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="lhoa-services" className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="lhoa-services" className="text-3xl font-extrabold text-stone-900">What We Manage for Luxury HOAs</h2>
              <p className="mt-3 text-stone-600">Outdoor systems and visual details that reinforce a premium community experience.</p>
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

          <section aria-labelledby="lhoa-process">
            <div className="mb-8 text-center">
              <h2 id="lhoa-process" className="text-3xl font-extrabold text-stone-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request a Facility Review", desc: "We inspect gate entries, common areas, lighting, irrigation, and signature outdoor spaces." },
                { step: "2", title: "Get a Prioritized Plan", desc: "You receive a detailed scope organized by resident-facing impact and board approval visibility." },
                { step: "3", title: "We Execute and Report", desc: "Work is completed to premium standards with photo-backed updates and polished follow-up reporting." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{item.step}</div>
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="lhoa-benefits" className="rounded-[2rem] bg-stone-900 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="lhoa-benefits" className="text-3xl font-extrabold text-white">Why Luxury HOAs Choose Elite</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Premium-Grade Execution", desc: "We understand that luxury communities require more precision, stronger follow-through, and cleaner visual standards." },
                { title: "Concierge Reporting", desc: "Boards get more polished service visibility with photos, notes, and clearer next-step communication." },
                { title: "Gate Entry Excellence", desc: "We prioritize the spaces that shape resident and guest perception the moment they arrive." },
                { title: "Lighting Detail", desc: "Architectural and landscape lighting receives the ongoing attention needed to preserve the intended look and feel." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="lhoa-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="lhoa-faqs" className="text-3xl font-extrabold text-stone-900">Luxury HOA FAQs</h2>
              <p className="mt-3 text-stone-600">Answers for communities that expect a higher outdoor standard and more polished communication.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              commonCauses={["Standard reporting feels too thin", "Entry presentation needs more refinement", "The community expects stronger outdoor detail overall"]}
              whenToCall="Call when your community needs outdoor service that feels more aligned with luxury residential expectations."
              whatToDoNext="Request a facility review and share the highest-visibility areas where presentation standards matter most."
              relatedQuestions={[faqItems[1].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              commonCauses={["Gate entries set the tone for the whole neighborhood", "Signature spaces receive the most resident scrutiny", "Premium landscapes require tighter maintenance detail"]}
              whenToCall="Call when entry presentation or major common areas are not reflecting the standard homeowners expect."
              whatToDoNext="Book a review so we can identify the most visible opportunities for lift across your community."
              relatedQuestions={[faqItems[0].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              commonCauses={["Board members want clearer visibility", "Premium communities need more polished communication", "Higher-end outdoor work requires stronger documentation"]}
              whenToCall="Call when the board needs more confidence in what was done, what is next, and how the property is trending."
              whatToDoNext="Schedule the review and let us tailor a reporting approach that matches your board's expectations."
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </section>

          <section className="rounded-[2rem] bg-forest-600 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">Outdoor Maintenance That Matches Your Community&apos;s Standard</h2>
            <p className="mx-auto mt-4 max-w-2xl text-green-100">Start with a facility review and get a plan that supports the premium experience your residents expect.</p>
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
