import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import {
  Accessibility,
  ArrowRight,
  BarChart2,
  CheckCircle,
  Droplets,
  FileText,
  Layers,
  Leaf,
  Lightbulb,
  Phone,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/municipal-outdoor-services";
const TITLE = "Municipal Outdoor Services Charlotte NC";
const DESCRIPTION = "Outdoor maintenance for municipal properties with public safety priorities, ADA-aware reviews, stormwater support, budget transparency, and public-facing documentation in Charlotte, NC.";

const faqItems = [
  {
    q: "Do you handle public bidding requirements?",
    a: "We can work within municipal procurement processes and provide detailed scope documentation that supports review, comparison, and approval workflows.",
  },
  {
    q: "Can you document work for public records and oversight needs?",
    a: "Yes. We provide clear service documentation, photos, and scope detail to support accountability, reporting, and internal review processes.",
  },
  {
    q: "Do you help prioritize outdoor work by public safety and compliance?",
    a: "Yes. We help separate urgent public-facing hazards, ADA-related concerns, and broader maintenance needs so municipal teams can act in the right order.",
  },
];

const trustPoints = [
  { icon: ShieldCheck, label: "Public safety priorities first" },
  { icon: FileText, label: "Documentation for oversight" },
  { icon: BarChart2, label: "Budget transparency support" },
];

export default function MunicipalOutdoorServicesPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://eliteirrigation.com${PAGE_PATH}`}
        jsonLd={[
          makeServiceSchema("Municipal Outdoor Services in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities", url: "/outdoor-facilities-services" },
            { name: "Municipal Outdoor Services", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Facilities", to: "/outdoor-facilities-services" }, { label: "Municipal Outdoor Services" }]} />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12">
          <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-stone-100 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 ring-1 ring-forest-200">
                Outdoor care built for public-facing properties
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte municipal outdoor partner</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">Municipal Outdoor Services</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                Outdoor maintenance for public properties that supports safety, documentation, and the accountability standards municipal stakeholders expect.
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

          <section aria-labelledby="municipal-challenges">
            <div className="mb-8 text-center">
              <h2 id="municipal-challenges" className="text-3xl font-extrabold text-stone-900">Municipal Outdoor Challenges We Address</h2>
              <p className="mt-3 text-stone-600">Built for public entities managing safety, visibility, compliance, and scrutiny across outdoor assets.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Shield, title: "Public Safety", desc: "Uneven walkways, poor drainage, and inadequate lighting create hazards and public liability." },
                { icon: Accessibility, title: "ADA Considerations", desc: "Public properties need accessible routes and outdoor surfaces that remain usable and well maintained." },
                { icon: Layers, title: "Stormwater Support", desc: "Municipal properties often face ongoing drainage and runoff issues that need more consistent attention." },
                { icon: BarChart2, title: "Budget Transparency", desc: "Public funds require clear records and documented reasoning behind outdoor maintenance spending." },
                { icon: FileText, title: "Public-Facing Reporting", desc: "Departments and oversight groups need documentation of how public outdoor spaces are being maintained." },
                { icon: Users, title: "Multi-Site Coordination", desc: "Outdoor maintenance across parks, facilities, and public grounds gets complex without a reliable partner." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <item.icon className="mb-3 h-6 w-6 text-forest-600" />
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="municipal-services" className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="municipal-services" className="text-3xl font-extrabold text-stone-900">What We Manage for Municipal Properties</h2>
              <p className="mt-3 text-stone-600">Outdoor systems and shared public spaces that need clearer visibility and stronger maintenance follow-through.</p>
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

          <section aria-labelledby="municipal-process">
            <div className="mb-8 text-center">
              <h2 id="municipal-process" className="text-3xl font-extrabold text-stone-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request a Facility Review", desc: "We assess public-facing outdoor spaces and document safety, access, drainage, and maintenance concerns." },
                { step: "2", title: "Get a Prioritized Plan", desc: "You receive a scope organized by public visibility, urgency, and likely compliance or oversight importance." },
                { step: "3", title: "We Execute and Report", desc: "Work is completed with documentation suitable for internal tracking, review, and public accountability needs." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{item.step}</div>
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="municipal-benefits" className="rounded-[2rem] bg-stone-900 px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="municipal-benefits" className="text-3xl font-extrabold text-white">Why Municipal Entities Choose Elite</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Safety-First Prioritization", desc: "We help departments focus first on visible hazards affecting the public and staff most directly." },
                { title: "Compliance Documentation", desc: "Photo-backed notes and scope detail support internal review and oversight expectations." },
                { title: "Budget Transparency", desc: "Clear service visibility helps support accountability and better communication around spend." },
                { title: "Reliable Multi-Site Coverage", desc: "Consistent scheduling and reporting help simplify outdoor maintenance across multiple public properties." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="municipal-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="mb-8 text-center">
              <h2 id="municipal-faqs" className="text-3xl font-extrabold text-stone-900">Municipal FAQs</h2>
              <p className="mt-3 text-stone-600">Answers for departments managing public spaces, procurement requirements, and community-facing risk.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              commonCauses={["Scopes need more detail before approval", "Departments require clearer comparison criteria", "Procurement workflows need better project definition"]}
              whenToCall="Call when a municipal project needs a documented scope that can move cleanly through procurement review."
              whatToDoNext="Share the property type, public use case, and approval workflow so we can shape the review around it."
              relatedQuestions={[faqItems[1].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              commonCauses={["Oversight groups need better visibility", "Departments need records for internal review", "Public-facing maintenance activity needs clearer documentation"]}
              whenToCall="Call when maintenance work needs stronger reporting to support transparency and departmental communication."
              whatToDoNext="Request a review and let us know which stakeholders need the reporting so we can tailor the documentation level."
              relatedQuestions={[faqItems[0].q, faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              commonCauses={["Urgent hazards are mixed with lower-priority work", "Teams need a clearer order of operations", "Public access and safety concerns need stronger visibility"]}
              whenToCall="Call when the department needs help separating immediate public concerns from broader outdoor maintenance projects."
              whatToDoNext="Schedule the review and we will organize findings by urgency, visibility, and likely compliance impact."
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </section>

          <section className="rounded-[2rem] bg-forest-600 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">Public Grounds Maintained to Public Standards</h2>
            <p className="mx-auto mt-4 max-w-2xl text-green-100">Start with a facility review and get a documented plan that supports safety, visibility, and budget accountability.</p>
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
