import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSeo, { makeServiceSchema, makeFaqSchema, makeBreadcrumbSchema } from "../components/PageSeo";
import AeoBlock from "../components/AeoBlock";
import {
  FileText, Phone, CheckCircle2, ArrowRight, Camera,
  BarChart3, ShieldCheck, Clock, Building2, MapPin
} from "lucide-react";

const PHONE = "+17048864240";
const canonical = "https://eliteirrigation.com/board-ready-outdoor-reports";
const pageTitle = "Board-Ready Outdoor Reports for HOAs & Managed Properties";
const pageDescription = "Board-ready outdoor reports for Charlotte NC HOA boards and property managers with executive summaries, photos, priority levels, completed work, open issues, and budget context.";

const reportFeatures = [
  { icon: FileText, title: "Executive Summary", desc: "One-page overview of outdoor property conditions, key findings, and recommended actions." },
  { icon: Camera, title: "Site Photos", desc: "Organized photos of every area inspected with condition annotations." },
  { icon: BarChart3, title: "Issue Categories", desc: "Issues grouped by type — irrigation, drainage, lighting, landscape, hardscape, common areas." },
  { icon: ShieldCheck, title: "Priority Levels", desc: "Each issue rated by urgency — urgent, high, standard, cosmetic." },
  { icon: CheckCircle2, title: "Completed Work", desc: "Log of all work performed with before/after photos." },
  { icon: FileText, title: "Open Issues", desc: "Unresolved items with status, age, and recommended next step." },
  { icon: ArrowRight, title: "Recommended Actions", desc: "Clear next steps with optional budget ranges and timeline." },
  { icon: Clock, title: "Maintenance Recommendations", desc: "Seasonal calendar and proactive maintenance suggestions." },
];

const whyBoardsRequest = [
  { title: "Resident Complaint Reduction", desc: "Documented maintenance shows residents that outdoor issues are being tracked and addressed." },
  { title: "Budget Planning", desc: "See deferred maintenance, upcoming needs, and recommended repair budgets before they become emergencies." },
  { title: "Vendor Accountability", desc: "Photo-documented proof of work performed. Know exactly what was done and what still needs attention." },
];

const faqItems = [
  {
    q: "What makes a report board-ready for an HOA or managed property?",
    a: "A board-ready report is organized for decision-makers. It combines a clear summary, supporting photos, open issues, completed work, priority levels, and budget context so boards can review outdoor conditions quickly.",
  },
  {
    q: "How are outdoor issues presented in the board reporting format?",
    a: "Issues are grouped by category, ranked by urgency, and supported with photos and notes so managers and board members can understand what happened, what still needs attention, and what should be scheduled next.",
  },
  {
    q: "Can board-ready reports support budgeting and vendor accountability?",
    a: "Yes. The format helps boards compare completed work to open items, understand repair priorities, and track maintenance history with documentation that is easier to review during meetings and budget planning.",
  },
];

const trustPoints = [
  { icon: Building2, label: "Built for board review" },
  { icon: MapPin, label: "Charlotte metro properties" },
  { icon: ShieldCheck, label: "Photo-documented updates" },
];

export default function BoardReadyReportsPage() {
  return (
    <Layout>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonical={canonical}
        jsonLd={[
          makeServiceSchema(pageTitle, pageDescription, "/board-ready-outdoor-reports", "Charlotte metro area"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Board-Ready Reports", url: "/board-ready-outdoor-reports" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Board-Ready Reports" }]} />

      <div className="mx-auto max-w-5xl space-y-16 pb-8">
        <section className="rounded-[2rem] border border-forest-100 bg-gradient-to-br from-white via-forest-50 to-white px-6 py-10 shadow-sm md:px-10 md:py-14">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700">
              <Building2 className="h-4 w-4" /> For HOA Boards & Property Managers
            </div>
            <h1 className="mb-3 text-3xl font-extrabold text-stone-900 md:text-4xl">
              Board-Ready
              <br />
              <span className="text-forest-600">Outdoor Reports</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-stone-600">
              Monthly outdoor reports designed for board meetings, owner updates, and property committee reviews. No surprises — just documented facts about your outdoor systems.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/quick-quote"
                aria-label="Request a board-ready outdoor report"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
              >
                Request Report <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${PHONE}`}
                aria-label="Call Elite Irrigation and Landscaping about board-ready reports"
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

        <section aria-labelledby="board-report-features-heading">
          <div className="mb-8 text-center">
            <h2 id="board-report-features-heading" className="text-2xl font-extrabold text-stone-900 md:text-3xl">What a Board-Ready Report Includes</h2>
            <p className="mt-2 text-stone-600">Structured so managers and board members can review conditions, completed work, and next steps without sorting through disconnected notes.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {reportFeatures.map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-forest-200 bg-forest-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                <item.icon className="mt-0.5 h-6 w-6 shrink-0 text-forest-600" />
                <div>
                  <h3 className="mb-1 text-sm font-bold text-stone-900">{item.title}</h3>
                  <p className="text-xs leading-5 text-stone-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="why-boards-heading" className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h2 id="why-boards-heading" className="text-2xl font-extrabold text-stone-900">Why Boards Request Elite Reports</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {whyBoardsRequest.map((item) => (
              <div key={item.title}>
                <h3 className="mb-2 font-bold text-stone-900">{item.title}</h3>
                <p className="text-sm leading-6 text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="board-report-faqs" className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8">
          <div className="mb-8 text-center">
            <h2 id="board-report-faqs" className="text-2xl font-extrabold text-stone-900 md:text-3xl">Board Reporting FAQs</h2>
            <p className="mt-2 text-stone-600">Fast answers about the reporting format used for HOA boards, committees, and managed properties.</p>
          </div>
          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={["Boards need a summary that is fast to scan", "Photos help committees understand severity and location", "Outdoor updates need to be presented consistently from meeting to meeting"]}
            whenToCall="Call when your board packets need a clearer way to explain outdoor conditions, work completed, and recommended next steps."
            whatToDoNext="Request a review so we can show how your outdoor reporting can be organized for board meetings and management follow-up."
            relatedQuestions={[faqItems[1].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[1].q}
            shortAnswer={faqItems[1].a}
            commonCauses={["Different issue types need different levels of urgency", "Committees need category-based organization", "Managers need a simpler way to explain status changes month to month"]}
            whenToCall="Call when meetings get slowed down by unclear issue descriptions or scattered maintenance updates."
            whatToDoNext="Ask about a report format that groups outdoor issues by system, urgency, and recommended action."
            relatedQuestions={[faqItems[0].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[2].q}
            shortAnswer={faqItems[2].a}
            commonCauses={["Budget planning needs documented repair history", "Boards want proof of completed work", "Vendor accountability improves when updates are recorded consistently"]}
            whenToCall="Call when your board wants clearer support for repair timing, reserve discussions, and maintenance accountability."
            whatToDoNext="Start with a site review and we will outline how reporting can support both board communication and maintenance planning."
            relatedQuestions={[faqItems[0].q, faqItems[1].q]}
            showSchema={false}
          />
        </section>

        <section className="rounded-[2rem] bg-stone-900 p-8 text-center md:p-12">
          <h2 className="mb-4 text-2xl font-extrabold text-white">Request a Board-Ready Report</h2>
          <p className="mb-8 text-stone-300">Start with a free Outdoor Site Review. We'll deliver your first report within one week of the site visit.</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/quick-quote"
              aria-label="Request a board-ready report quote"
              className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-300"
            >
              Request Report <ArrowRight className="h-4 w-4" />
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
