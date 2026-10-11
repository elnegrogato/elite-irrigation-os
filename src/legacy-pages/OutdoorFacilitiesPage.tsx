import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSeo, { makeServiceSchema, makeFaqSchema, makeBreadcrumbSchema } from "../components/PageSeo";
import AeoBlock from "../components/AeoBlock";
import {
  Building2, ShieldCheck, ClipboardList, Clock, BarChart3,
  ArrowRight, Phone, MapPin, Users,
  Droplets, Waves, Lightbulb, Trees, Layers, Wrench,
  FileText, Calendar, ChevronRight
} from "lucide-react";

const PHONE = "+17048864240";
const canonical = "https://eliteirrigation.com/outdoor-facilities-services";
const pageTitle = "Outdoor Facilities Services — Managed Outdoor Infrastructure";
const pageDescription = "Managed outdoor facilities services for HOAs, property managers, multifamily, commercial, churches, and country clubs with documented care, board-ready reporting, and budget forecasting in Charlotte NC.";

const serviceLines = [
  { icon: Droplets, label: "Irrigation Management", desc: "System audits, repairs, smart upgrades, seasonal programming" },
  { icon: Waves, label: "Drainage & Stormwater", desc: "French drains, grading, retention, erosion control" },
  { icon: Trees, label: "Grounds & Turf", desc: "Mowing, edging, fertilization, aeration, seasonal color" },
  { icon: Lightbulb, label: "Landscape Lighting", desc: "Maintenance, upgrades, timers, LED conversion" },
  { icon: Layers, label: "Hardscape Care", desc: "Paver repair, sealing, joint stabilization, drainage" },
  { icon: Wrench, label: "General Maintenance", desc: "Trash removal, pressure washing, seasonal cleanup" },
];

const segments = [
  { label: "HOA Communities", to: "/hoa-outdoor-services", desc: "Board-ready reporting, resident complaint reduction" },
  { label: "Property Managers", to: "/property-manager-outdoor-services", desc: "Multi-property oversight, budget forecasting" },
  { label: "Multifamily", to: "/multifamily-outdoor-maintenance", desc: "Tenant satisfaction, curb appeal, liability reduction" },
  { label: "Office & Retail", to: "/office-park-landscape-maintenance", desc: "Professional appearance, tenant retention" },
  { label: "Churches & Schools", to: "/church-grounds-maintenance", desc: "Safe grounds, event-ready outdoor spaces" },
  { label: "Country Clubs", to: "/country-club-outdoor-services", desc: "Premium grounds, member experience" },
];

const offers = [
  { icon: ClipboardList, label: "Outdoor Site Review", desc: "Free 40-point property assessment with priority-ranked recommendations", to: "/outdoor-site-review" },
  { icon: BarChart3, label: "Condition Score Report", desc: "Documented baseline of every outdoor system on your property", to: "/outdoor-site-review" },
  { icon: FileText, label: "Board-Ready Reporting", desc: "Monthly documentation with photos, completed tasks, and budget tracking", to: "/photo-documented-service" },
  { icon: Calendar, label: "Seasonal Service Calendar", desc: "Pre-planned visits aligned to your property's needs", to: "/maintenance-plans" },
];

const faqItems = [
  {
    q: "What is outdoor facilities services?",
    a: "A managed outdoor infrastructure service for commercial properties, HOAs, multifamily communities, and institutional properties. We handle irrigation, drainage, lighting, hardscapes, grounds, and general maintenance with documented reporting.",
  },
  {
    q: "How is this different from commercial landscaping?",
    a: "Traditional landscaping focuses on mowing and planting. Our facilities service treats your outdoor systems as infrastructure — with audits, scheduled maintenance, condition tracking, board-ready reporting, and budget forecasting.",
  },
  {
    q: "What types of properties do you serve?",
    a: "HOAs, property management companies, multifamily communities, office parks, retail centers, churches, schools, country clubs, luxury residential, and municipal properties.",
  },
  {
    q: "Do you offer board-ready reports?",
    a: "Yes. Monthly reports include photos of completed work, condition updates, budget tracking, and priority recommendations for board or management review.",
  },
];

const trustPoints = [
  { icon: Clock, label: "Response within 1 hour" },
  { icon: MapPin, label: "Charlotte metro area" },
  { icon: Users, label: "100+ properties managed" },
];

export default function OutdoorFacilitiesPage() {
  return (
    <Layout>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonical={canonical}
        jsonLd={[
          makeServiceSchema(pageTitle, pageDescription, "/outdoor-facilities-services", "Charlotte metro area"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Facilities Services", url: "/outdoor-facilities-services" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Outdoor Facilities Services" }]} />

      <div className="mx-auto max-w-6xl space-y-16 pb-8">
        <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-white px-6 py-10 shadow-sm md:px-10 md:py-14">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700">
              <Building2 className="h-4 w-4" /> For Commercial Properties & HOAs
            </div>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-stone-900 md:text-5xl">
              Not Just Landscaping.
              <br />
              <span className="text-forest-600">Documented Outdoor Facilities Care.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-stone-600">
              We manage your outdoor infrastructure the way you manage your building — with documentation, service logs, condition tracking, and board-ready reports.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/quick-quote"
                aria-label="Request a free outdoor site review"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
              >
                Request Free Site Review <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${PHONE}`}
                aria-label="Call Elite Irrigation and Landscaping"
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

        <section aria-labelledby="outdoor-facilities-benefits" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-forest-600" />
            <h2 id="outdoor-facilities-benefits" className="mb-1 text-lg font-bold text-stone-900">Photo-Documented Service</h2>
            <p className="text-sm text-stone-600">Every visit photographed and logged. You see exactly what was done.</p>
          </div>
          <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <ClipboardList className="mx-auto mb-3 h-8 w-8 text-forest-600" />
            <h2 className="mb-1 text-lg font-bold text-stone-900">Board-Ready Reports</h2>
            <p className="text-sm text-stone-600">Monthly documentation ready to present. No surprises at board meetings.</p>
          </div>
          <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <BarChart3 className="mx-auto mb-3 h-8 w-8 text-forest-600" />
            <h2 className="mb-1 text-lg font-bold text-stone-900">Budget Forecasting</h2>
            <p className="text-sm text-stone-600">Predict annual costs with documented condition baselines.</p>
          </div>
        </section>

        <section aria-labelledby="service-lines-heading">
          <div className="mb-8 text-center">
            <h2 id="service-lines-heading" className="text-2xl font-extrabold text-stone-900 md:text-3xl">6 Outdoor Service Lines</h2>
            <p className="mt-2 text-stone-600">One team manages every outdoor system on your property.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceLines.map((sl) => (
              <div key={sl.label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-100">
                    <sl.icon className="h-5 w-5 text-forest-600" />
                  </div>
                  <h3 className="font-bold text-stone-900">{sl.label}</h3>
                </div>
                <p className="text-sm leading-6 text-stone-600">{sl.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="property-types-heading">
          <div className="mb-8 text-center">
            <h2 id="property-types-heading" className="text-2xl font-extrabold text-stone-900 md:text-3xl">Built For Your Property Type</h2>
            <p className="mt-2 text-stone-600">Each segment has tailored service packages and reporting.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {segments.map((seg) => (
              <Link
                key={seg.label}
                to={seg.to}
                aria-label={`View ${seg.label} outdoor services`}
                className="group flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-forest-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 transition-colors group-hover:bg-forest-100">
                  <ChevronRight className="h-4 w-4 text-stone-400 transition-colors group-hover:text-forest-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 transition-colors group-hover:text-forest-600">{seg.label}</h3>
                  <p className="text-xs leading-5 text-stone-500">{seg.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="assessment-heading">
          <div className="mb-8 text-center">
            <h2 id="assessment-heading" className="text-2xl font-extrabold text-stone-900 md:text-3xl">Start With a Free Assessment</h2>
            <p className="mt-2 text-stone-600">Every engagement begins with understanding your property.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {offers.map((offer) => (
              <Link
                key={offer.label}
                to={offer.to}
                aria-label={`Learn more about ${offer.label}`}
                className="group rounded-2xl border border-forest-200 bg-forest-50 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-forest-100 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
              >
                <div className="mb-2 flex items-center gap-3">
                  <offer.icon className="h-6 w-6 text-forest-600" />
                  <h3 className="font-bold text-forest-800">{offer.label}</h3>
                </div>
                <p className="text-sm leading-6 text-forest-700">{offer.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-forest-600">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="faq-heading" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
          <div className="mb-8 text-center">
            <h2 id="faq-heading" className="text-2xl font-extrabold text-stone-900 md:text-3xl">Commercial Outdoor Facilities FAQs</h2>
            <p className="mt-2 text-stone-600">Short answers for boards, managers, and property owners comparing outdoor infrastructure services in Charlotte.</p>
          </div>
          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={["Multiple outdoor systems need one accountable vendor", "Properties require documented maintenance history", "Management teams need fewer surprises and clearer priorities"]}
            whenToCall="Call when your property has recurring irrigation, drainage, lighting, or grounds issues that need one coordinated management plan."
            whatToDoNext="Schedule a site review so we can baseline your outdoor systems and show what should be handled now versus planned later."
            relatedQuestions={[faqItems[1].q, faqItems[3].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[1].q}
            shortAnswer={faqItems[1].a}
            commonCauses={["Landscape contracts often stop at appearance-based tasks", "Infrastructure issues go undocumented until costs rise", "Boards need maintenance records and capital planning context"]}
            whenToCall="Call when outdoor issues keep resurfacing even though routine landscaping is already being performed."
            whatToDoNext="Ask for a documented assessment that separates routine care, deferred maintenance, and priority repairs."
            relatedQuestions={[faqItems[0].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[3].q}
            shortAnswer={faqItems[3].a}
            commonCauses={["Boards need a summary they can review quickly", "Managers need proof of completed work", "Budget conversations need photos and condition context"]}
            whenToCall="Call when you need a cleaner reporting format for management meetings, board packets, or owner updates."
            whatToDoNext="Request a free review and we will outline how monthly reporting, photo documentation, and priority recommendations would be structured for your property."
            relatedQuestions={[faqItems[2].q, faqItems[1].q]}
            showSchema={false}
          />
        </section>

        <section className="rounded-[2rem] bg-stone-900 p-8 text-center md:p-12">
          <h2 className="mb-4 text-2xl font-extrabold text-white md:text-3xl">Ready to Document Your Outdoor Systems?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-stone-300">
            Get a free Outdoor Site Review with a 40-point property assessment. No obligation — just documented clarity about your outdoor infrastructure.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/quick-quote"
              aria-label="Request free site review quote"
              className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-300"
            >
              Request Free Site Review <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${PHONE}`}
              aria-label="Call Elite Irrigation and Landscaping at 704 886 4240"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              <Phone className="h-4 w-4" /> (704) 886-4240
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
