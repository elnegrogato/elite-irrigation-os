import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSeo, { makeServiceSchema, makeFaqSchema, makeBreadcrumbSchema } from "../components/PageSeo";
import AeoBlock from "../components/AeoBlock";
import {
  FileText, Phone, Camera, CheckCircle2, ArrowRight,
  BarChart3, Calendar, Clock, ShieldCheck, MapPin
} from "lucide-react";

const PHONE = "+17048864240";
const canonical = "https://eliteirrigation.com/outdoor-site-reports";
const pageTitle = "Monthly Outdoor Site Reports — Photo-Documented Property Reports";
const pageDescription = "Monthly outdoor site reports for Charlotte NC HOAs, property managers, and commercial properties with photo documentation, open issue tracking, completed work summaries, and seasonal reminders.";

const reportFeatures = [
  { icon: Calendar, title: "Monthly Site Visit", desc: "Scheduled visit to inspect all outdoor systems and document current conditions." },
  { icon: Camera, title: "Photo Documentation", desc: "Photos of every area inspected — irrigation, drainage, lighting, landscape, hardscape." },
  { icon: FileText, title: "Open Issue List", desc: "Tracking of unresolved issues with priority levels and recommended actions." },
  { icon: CheckCircle2, title: "Completed Work Summary", desc: "Log of all work performed since last report, with before/after photos." },
  { icon: BarChart3, title: "Recommended Repairs", desc: "Priority-ranked repair recommendations with budget context." },
  { icon: ShieldCheck, title: "Seasonal Reminders", desc: "Proactive alerts for seasonal tasks — winterization, spring startup, drainage prep." },
];

const reportItems = [
  "Irrigation system status", "Drainage system check", "Landscape lighting status",
  "Turf and landscape condition", "Hardscape condition notes", "Pool/common-area status",
  "Open issues from last month", "New issues identified", "Completed work log",
  "Before/after photos", "Priority-ranked recommendations", "Seasonal reminders",
  "Budget context for repairs", "Next visit scheduled", "Emergency contacts",
];

const faqItems = [
  {
    q: "What is included in a monthly outdoor site report?",
    a: "Monthly reports include photo documentation, current site conditions, open issue tracking, completed work summaries, priority recommendations, and seasonal planning notes across major outdoor systems.",
  },
  {
    q: "Who uses monthly outdoor reporting?",
    a: "HOA boards, property managers, multifamily operators, office and retail managers, and commercial owners use monthly reporting to track outdoor conditions and communicate updates to stakeholders.",
  },
  {
    q: "How do monthly site reports help with budgeting and maintenance planning?",
    a: "They create a month-by-month record of property conditions, completed work, and unresolved issues so teams can prioritize repairs, explain costs, and plan future maintenance with better documentation.",
  },
];

const trustPoints = [
  { icon: Calendar, label: "Monthly reporting cadence" },
  { icon: MapPin, label: "Charlotte metro properties" },
  { icon: Clock, label: "Clear maintenance history" },
];

export default function OutdoorSiteReportsPage() {
  return (
    <Layout>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonical={canonical}
        jsonLd={[
          makeServiceSchema(pageTitle, pageDescription, "/outdoor-site-reports", "Charlotte metro area"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Site Reports", url: "/outdoor-site-reports" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Outdoor Site Reports" }]} />

      <div className="mx-auto max-w-5xl space-y-16 pb-8">
        <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-white px-6 py-10 shadow-sm md:px-10 md:py-14">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-100">
              <FileText className="h-7 w-7 text-forest-600" />
            </div>
            <h1 className="mb-3 text-3xl font-extrabold text-stone-900 md:text-4xl">
              Monthly Outdoor
              <br />
              <span className="text-forest-600">Site Reports</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-stone-600">
              Photo-documented monthly reports for HOAs, property managers, and commercial properties. Know exactly what's happening across your outdoor systems.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/quick-quote"
                aria-label="Get started with monthly outdoor site reports"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${PHONE}`}
                aria-label="Call Elite Irrigation and Landscaping about monthly site reports"
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

        <section aria-labelledby="report-features-heading">
          <div className="mb-8 text-center">
            <h2 id="report-features-heading" className="text-2xl font-extrabold text-stone-900 md:text-3xl">What the Monthly Reporting Program Covers</h2>
            <p className="mt-2 text-stone-600">Built for recurring oversight across irrigation, drainage, lighting, landscape, and common-area conditions.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportFeatures.map((item) => (
              <div key={item.title} className="rounded-2xl border border-forest-200 bg-forest-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                <item.icon className="mb-2 h-6 w-6 text-forest-600" />
                <h3 className="mb-1 text-sm font-bold text-stone-900">{item.title}</h3>
                <p className="text-xs leading-5 text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="report-contents-heading" className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h2 id="report-contents-heading" className="text-2xl font-extrabold text-stone-900">What's in Each Report</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {reportItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-stone-700">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-forest-600" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="site-reports-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
          <div className="mb-8 text-center">
            <h2 id="site-reports-faqs" className="text-2xl font-extrabold text-stone-900 md:text-3xl">Monthly Reporting FAQs</h2>
            <p className="mt-2 text-stone-600">Quick answers for managers and boards comparing recurring outdoor reporting options.</p>
          </div>
          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={["Properties need a regular record of visible site conditions", "Stakeholders want proof of completed work", "Open issues need to stay visible from month to month"]}
            whenToCall="Call when your team needs more than verbal updates and wants a report format that can be shared internally."
            whatToDoNext="Ask about a reporting cadence that matches your property and the outdoor systems you want reviewed each month."
            relatedQuestions={[faqItems[1].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[1].q}
            shortAnswer={faqItems[1].a}
            commonCauses={["Boards need meeting-ready updates", "Managers oversee several outdoor systems or sites", "Commercial teams want cleaner vendor communication"]}
            whenToCall="Call when multiple stakeholders need the same site update presented in a simple, repeatable format."
            whatToDoNext="Share your property type and reporting audience so we can outline the level of detail that makes the most sense."
            relatedQuestions={[faqItems[0].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[2].q}
            shortAnswer={faqItems[2].a}
            commonCauses={["Deferred maintenance becomes harder to explain without history", "Budget planning improves when issue age and severity are tracked", "Seasonal work is easier to schedule with a running record"]}
            whenToCall="Call when you need better documentation for repair timing, budget forecasting, and annual planning conversations."
            whatToDoNext="Request a consultation so we can show how monthly documentation supports ongoing maintenance planning and repair prioritization."
            relatedQuestions={[faqItems[0].q, faqItems[1].q]}
            showSchema={false}
          />
        </section>

        <section className="rounded-[2rem] bg-stone-900 p-8 text-center md:p-12">
          <h2 className="mb-4 text-2xl font-extrabold text-white">Ask About Monthly Site Reports</h2>
          <p className="mb-8 text-stone-300">For HOAs, property managers, and commercial properties in the Charlotte metro area.</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/quick-quote"
              aria-label="Get started with monthly site reporting"
              className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-300"
            >
              Get Started <ArrowRight className="h-4 w-4" />
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
