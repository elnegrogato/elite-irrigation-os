import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Droplets,
  Layers,
  Leaf,
  Lightbulb,
  Phone,
  Shield,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  Wrench,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/country-club-outdoor-services";
const TITLE = "Country Club Outdoor Services Charlotte NC";
const DESCRIPTION = "Premium outdoor maintenance for country clubs with member-ready grounds, event calendar coordination, irrigation precision, and high-standard presentation in the Charlotte, NC area.";

const faqItems = [
  {
    q: "Can you coordinate around events?",
    a: "Yes. We work with your event calendar so grounds, entries, terraces, and member-facing spaces are event-ready when timing matters most.",
  },
  {
    q: "What makes country club outdoor maintenance different?",
    a: "Member expectations are higher, visible standards are tighter, and timing around tournaments, dining, and private events matters much more than on standard commercial properties.",
  },
  {
    q: "Do you help maintain premium landscape presentation year-round?",
    a: "Yes. We support irrigation performance, bed detail, seasonal presentation, and proactive maintenance so outdoor quality stays consistent across the property.",
  },
];

const trustPoints = [
  { icon: Star, label: "Member-facing presentation" },
  { icon: Calendar, label: "Event calendar coordination" },
  { icon: ShieldCheck, label: "Premium standards maintained" },
];

export default function CountryClubOutdoorServicesPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://eliteirrigation.com${PAGE_PATH}`}
        jsonLd={[
          makeServiceSchema("Country Club Outdoor Services in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities", url: "/outdoor-facilities-services" },
            { name: "Country Club Outdoor Services", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Facilities", to: "/outdoor-facilities-services" }, { label: "Country Club Outdoor Services" }]} />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12">
          <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-stone-100 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 ring-1 ring-forest-200">
                Premium grounds support for member experience
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte country club outdoor partner</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">Country Club Outdoor Services</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                Premium grounds maintenance that matches member expectations with precise irrigation, immaculate outdoor spaces, and event-ready presentation year-round.
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

          <section aria-labelledby="cc-challenges">
            <div className="mb-8 text-center">
              <h2 id="cc-challenges" className="text-3xl font-extrabold text-stone-900">Country Club Outdoor Challenges We Solve</h2>
              <p className="mt-3 text-stone-600">Designed for clubs where member perception and event timing shape every outdoor standard.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Star, title: "Member Experience", desc: "Members notice outdoor quality immediately, and visible maintenance gaps reflect directly on the club." },
                { icon: Calendar, title: "Event-Ready Outdoor Spaces", desc: "Tournaments, weddings, and private events require the property to look exceptional on exact dates." },
                { icon: Target, title: "Irrigation Precision", desc: "Turf quality depends on precise irrigation performance across large and highly visible areas." },
                { icon: Trophy, title: "Premium Grounds Standards", desc: "Entry drives, terraces, and outdoor dining zones need a higher level of detail than ordinary commercial spaces." },
                { icon: Wrench, title: "System Reliability", desc: "Irrigation and lighting failures during peak season create member complaints and operational pressure." },
                { icon: Award, title: "Seasonal Presentation", desc: "Seasonal color and bed detail must stay aligned with the club's premium brand all year." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <item.icon className="mb-3 h-6 w-6 text-forest-600" />
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="cc-services" className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="cc-services" className="text-3xl font-extrabold text-stone-900">What We Manage for Country Clubs</h2>
              <p className="mt-3 text-stone-600">Outdoor systems and member-facing details that protect the standard your club projects.</p>
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

          <section aria-labelledby="cc-process">
            <div className="mb-8 text-center">
              <h2 id="cc-process" className="text-3xl font-extrabold text-stone-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request a Facility Review", desc: "We inspect entry drives, terraces, dining areas, bed detail, irrigation, and lighting conditions." },
                { step: "2", title: "Get a Prioritized Plan", desc: "You receive a scope organized by member visibility, event timing, and operational importance." },
                { step: "3", title: "We Execute and Report", desc: "Work is completed with premium attention to detail and reporting your operations team can act on." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{item.step}</div>
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="cc-benefits" className="rounded-[2rem] bg-stone-900 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="cc-benefits" className="text-3xl font-extrabold text-white">Why Country Clubs Choose Elite</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Member-Grade Presentation", desc: "We understand that country club grounds must perform at a visibly higher standard and we work accordingly." },
                { title: "Event Calendar Coordination", desc: "Outdoor work can be timed around tournaments, dining events, and member gatherings that matter most." },
                { title: "Irrigation Precision", desc: "Better system performance helps protect premium turf quality while reducing inconsistency and waste." },
                { title: "Reliable System Performance", desc: "Proactive maintenance reduces the chance of visible failures during your busiest seasons." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="cc-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="cc-faqs" className="text-3xl font-extrabold text-stone-900">Country Club FAQs</h2>
              <p className="mt-3 text-stone-600">Answers for club leadership teams balancing member expectations, event readiness, and premium grounds standards.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              commonCauses={["Tournament dates lock in presentation deadlines", "Wedding and dining events require high-detail prep", "Outdoor maintenance timing affects member experience directly"]}
              whenToCall="Call when the event calendar is driving outdoor priorities or when major dates need tighter maintenance coordination."
              whatToDoNext="Share your major event schedule and key member-facing spaces so we can prioritize them first."
              relatedQuestions={[faqItems[1].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              commonCauses={["Standard commercial maintenance feels too generic", "Highly visible spaces need more detail", "Operational timing is more sensitive than on typical properties"]}
              whenToCall="Call when the club needs a more premium outdoor standard than its current maintenance model is delivering."
              whatToDoNext="Request a review so we can identify where presentation, timing, and systems need to be elevated."
              relatedQuestions={[faqItems[0].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              commonCauses={["Irrigation consistency is slipping", "Beds need more refinement", "Seasonal presentation is not staying ahead of expectations"]}
              whenToCall="Call when premium outdoor quality feels harder to maintain consistently across the full property."
              whatToDoNext="Book the facility review and we will identify the most visible standards gaps and system priorities first."
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </section>

          <section className="rounded-[2rem] bg-forest-600 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">Grounds That Match Your Members&apos; Expectations</h2>
            <p className="mx-auto mt-4 max-w-2xl text-green-100">Start with a facility review and get a plan that delivers the premium outdoor experience your club expects.</p>
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
