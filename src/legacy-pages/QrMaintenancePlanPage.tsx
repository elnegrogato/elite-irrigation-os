import Link from "next/link";
import Layout from "../components/Layout";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import { RefreshCw, Phone, MessageSquare } from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/maintenance-plan-qr";
const TITLE = "Outdoor Maintenance Plans";
const DESCRIPTION = "Keep your outdoor systems running with a seasonal maintenance plan from Elite Irrigation & Landscaping in Charlotte, NC.";

const faqItems = [
  {
    q: "What is included in a maintenance plan?",
    a: "Maintenance plans typically include seasonal service visits, documented notes, and priority scheduling for irrigation, drainage, lighting, and landscape system upkeep.",
  },
];

export default function QrMaintenancePlanPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={PAGE_PATH}
        jsonLd={[
          makeServiceSchema("Outdoor Maintenance Plans in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([{ name: "Home", url: "/" }, { name: TITLE, url: PAGE_PATH }]),
        ]}
      />

      <main className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-white">
        <div className="max-w-lg mx-auto px-4 py-8">
          <p className="text-center text-xs uppercase tracking-[0.28em] text-stone-400">Scanned from door hanger</p>

          <section className="mt-6 rounded-[28px] bg-forest-600 px-6 py-10 text-center text-white shadow-lg shadow-forest-900/10 ring-1 ring-forest-500/30">
            <RefreshCw className="mx-auto mb-4 h-10 w-10 opacity-90" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest-100">Charlotte maintenance plans</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight">Keep Your Outdoor Systems Running</h1>
            <p className="mt-3 text-base text-forest-100">Seasonal maintenance plans that prevent problems before they start.</p>
          </section>

          <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-lg font-bold text-stone-900">Explore maintenance plans</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Great for property owners who want reliable seasonal checkups, cleaner documentation, and priority response before small issues become expensive repairs.</p>
            <Link
              to="/maintenance-plans"
              className="mt-5 block w-full rounded-xl bg-forest-600 py-4 text-center text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
            >
              View Maintenance Plans →
            </Link>
          </section>

          <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
            <div className="border-b border-stone-100 px-5 py-4">
              <h2 className="text-base font-bold text-stone-900">Plan benefits</h2>
            </div>
            {["Seasonal service visits", "Priority scheduling", "Documented visits with notes"].map((item) => (
              <div key={item} className="flex items-start gap-3 border-t border-stone-100 px-5 py-4 first:border-t-0">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-600 text-xs font-bold text-white">✓</span>
                <p className="text-sm text-stone-700">{item}</p>
              </div>
            ))}
          </section>

          <section className="mt-6">
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              whatToDoNext="Ask about the systems you want covered so we can point you toward the right seasonal visit schedule."
              showSchema={false}
            />
          </section>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${PHONE}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-3 text-sm font-medium text-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-forest-600 hover:text-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
            >
              <Phone className="h-4 w-4" /> Call Us
            </a>
            <a
              href={`sms:${PHONE}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-3 text-sm font-medium text-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-forest-600 hover:text-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
            >
              <MessageSquare className="h-4 w-4" /> Text Us
            </a>
          </div>
        </div>
      </main>
    </Layout>
  );
}
