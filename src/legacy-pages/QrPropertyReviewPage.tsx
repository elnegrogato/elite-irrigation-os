import Link from "next/link";
import Layout from "../components/Layout";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import { FileSearch, Phone, MessageSquare } from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/property-review-qr";
const TITLE = "100+ Point Property Review";
const DESCRIPTION = "Get a comprehensive 100+ point outdoor property review with a written report and photo documentation. Elite Irrigation & Landscaping, Charlotte, NC.";

const faqItems = [
  {
    q: "What is included in the 100+ point property review?",
    a: "A comprehensive outdoor checklist, written report, and photo documentation covering irrigation, drainage, lighting, hardscape, and visible landscape condition issues.",
  },
];

export default function QrPropertyReviewPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={PAGE_PATH}
        jsonLd={[
          makeServiceSchema("100+ Point Outdoor Property Review in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([{ name: "Home", url: "/" }, { name: TITLE, url: PAGE_PATH }]),
        ]}
      />

      <main className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-white">
        <div className="max-w-lg mx-auto px-4 py-8">
          <p className="text-center text-xs uppercase tracking-[0.28em] text-stone-400">Scanned from yard sign</p>

          <section className="mt-6 rounded-[28px] bg-forest-600 px-6 py-10 text-center text-white shadow-lg shadow-forest-900/10 ring-1 ring-forest-500/30">
            <FileSearch className="mx-auto mb-4 h-10 w-10 opacity-90" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest-100">Charlotte outdoor review</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight">100+ Point Property Review</h1>
            <p className="mt-3 text-base text-forest-100">A thorough outdoor inspection with a written report and photos you keep.</p>
          </section>

          <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-lg font-bold text-stone-900">Schedule your review</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Useful before purchase, before listing, or anytime you want a clearer picture of outdoor system condition and upcoming repair priorities.</p>
            <Link
              to="/outdoor-property-review"
              className="mt-5 block w-full rounded-xl bg-forest-600 py-4 text-center text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
            >
              Schedule Your Review →
            </Link>
          </section>

          <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
            <div className="border-b border-stone-100 px-5 py-4">
              <h2 className="text-base font-bold text-stone-900">Review output</h2>
            </div>
            {[
              "Comprehensive checklist",
              "Written report",
              "Photo documentation",
            ].map((item) => (
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
              whatToDoNext="Book the review and tell us whether you're preparing for purchase, sale, budgeting, or general maintenance planning."
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
