import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import {
  Accessibility,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Droplets,
  Heart,
  Layers,
  Leaf,
  Lightbulb,
  Phone,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/church-school-outdoor-services";
const TITLE = "Church & School Outdoor Services Charlotte NC";
const DESCRIPTION = "Outdoor maintenance for churches and schools with safe grounds, ADA-aware outdoor reviews, budget-conscious planning, and event-ready upkeep in Charlotte, NC.";

const faqItems = [
  {
    q: "Are you familiar with ADA compliance for outdoor spaces?",
    a: "Yes. We assess pathways, lighting, drainage, and access points for ADA-related considerations so leadership teams can prioritize the most visible and important outdoor barriers first.",
  },
  {
    q: "Can you work within tight church or school budgets?",
    a: "Yes. We help prioritize the highest-impact outdoor needs first so organizations can improve safety and presentation without trying to do everything at once.",
  },
  {
    q: "Can you coordinate around major campus events?",
    a: "Yes. We plan outdoor work around services, graduations, festivals, games, and other high-attendance events so grounds are ready when the campus is busiest.",
  },
];

const trustPoints = [
  { icon: ShieldCheck, label: "Safety-first outdoor priorities" },
  { icon: Accessibility, label: "ADA-aware site reviews" },
  { icon: Heart, label: "Mission-friendly planning" },
];

export default function ChurchSchoolOutdoorServicesPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://eliteirrigation.com${PAGE_PATH}`}
        jsonLd={[
          makeServiceSchema("Church and School Outdoor Services in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities", url: "/outdoor-facilities-services" },
            { name: "Church and School Outdoor Services", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Facilities", to: "/outdoor-facilities-services" }, { label: "Church & School Outdoor Services" }]} />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12">
          <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-stone-100 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 ring-1 ring-forest-200">
                Outdoor care for mission-driven campuses
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte church and school outdoor partner</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">Church and School Outdoor Services</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                Safe, welcoming grounds for your congregation, students, and community maintained with the budget realities of mission-driven organizations in mind.
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

          <section aria-labelledby="cs-challenges">
            <div className="mb-8 text-center">
              <h2 id="cs-challenges" className="text-3xl font-extrabold text-stone-900">Challenges Churches and Schools Face Outdoors</h2>
              <p className="mt-3 text-stone-600">Priorities shaped by safety, events, stewardship, and community use of the campus.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Shield, title: "Safe Grounds for Events", desc: "Uneven turf, standing water, and poor lighting create hazards during services, games, and community events." },
                { icon: Heart, title: "Safe Play Areas", desc: "School grounds need consistent maintenance so outdoor spaces stay safe and usable for students." },
                { icon: Accessibility, title: "ADA Considerations", desc: "Walkways, ramps, and accessible routes should remain clear, visible, and well maintained." },
                { icon: DollarSign, title: "Budget-Conscious Solutions", desc: "Tight budgets require clear prioritization and the ability to phase improvements intelligently." },
                { icon: Users, title: "Volunteer Coordination", desc: "We can work alongside volunteer teams and help leadership focus professional effort where it matters most." },
                { icon: AlertCircle, title: "Seasonal Event Readiness", desc: "Grounds need to look right for Easter, graduation, fall festivals, and other major campus moments." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <item.icon className="mb-3 h-6 w-6 text-forest-600" />
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="cs-services" className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="cs-services" className="text-3xl font-extrabold text-stone-900">What We Manage for Churches and Schools</h2>
              <p className="mt-3 text-stone-600">Outdoor systems that affect safety, usability, and the way your campus is experienced.</p>
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

          <section aria-labelledby="cs-process">
            <div className="mb-8 text-center">
              <h2 id="cs-process" className="text-3xl font-extrabold text-stone-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request a Facility Review", desc: "We walk your campus and document pathways, play areas, drainage, lighting, and visible grounds concerns." },
                { step: "2", title: "Get a Prioritized Plan", desc: "You receive a written scope organized by safety impact, event readiness, and budget practicality." },
                { step: "3", title: "We Execute and Report", desc: "Work is completed on schedule with updates leadership teams can use internally and for planning." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{item.step}</div>
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="cs-benefits" className="rounded-[2rem] bg-stone-900 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="cs-benefits" className="text-3xl font-extrabold text-white">Why Churches and Schools Choose Elite</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Safety-First Approach", desc: "We help leadership teams prioritize drainage, lighting, and walkway conditions that affect guests and students directly." },
                { title: "Budget-Sensitive Planning", desc: "Improvements can be phased and prioritized so resources go where they help the campus most." },
                { title: "Volunteer-Friendly Partnership", desc: "We can support volunteer efforts by clarifying which outdoor tasks need professional attention first." },
                { title: "Event-Ready Grounds", desc: "Maintenance timing can align with your calendar so the campus looks right when attendance is highest." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="cs-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="cs-faqs" className="text-3xl font-extrabold text-stone-900">Church and School FAQs</h2>
              <p className="mt-3 text-stone-600">Answers for leadership teams balancing safety, stewardship, and campus presentation.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              commonCauses={["Accessible routes are affected by drainage or surface wear", "Campus lighting leaves visibility gaps", "Leadership needs clearer outdoor priorities tied to access and safety"]}
              whenToCall="Call when pathways, site access, or visibility concerns need a more structured outdoor review."
              whatToDoNext="Request a facility review and point out any known access routes or gathering areas that need special attention."
              relatedQuestions={[faqItems[1].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              commonCauses={["Too many outdoor needs compete for limited funds", "Leadership wants to phase work responsibly", "Safety and presentation priorities need separation"]}
              whenToCall="Call before annual planning, fundraising pushes, or whenever outdoor work needs a more practical sequence."
              whatToDoNext="Book a review so we can separate immediate priorities from improvements that can be phased later."
              relatedQuestions={[faqItems[0].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              commonCauses={["Major attendance days need stronger curb appeal", "Outdoor spaces are used heavily during special events", "Grounds prep timing keeps getting squeezed"]}
              whenToCall="Call before large services, graduations, festivals, tournaments, or other high-traffic campus dates."
              whatToDoNext="Share your event calendar and we can help prioritize outdoor work around the biggest public-facing moments."
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </section>

          <section className="rounded-[2rem] bg-forest-600 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">Safe, Welcoming Grounds for Your Community</h2>
            <p className="mx-auto mt-4 max-w-2xl text-green-100">Start with a facility review and get a prioritized plan that fits your mission, calendar, and budget reality.</p>
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
