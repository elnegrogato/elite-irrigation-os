import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import { ClipboardCheck, Droplets, Zap, FileText, Phone, CheckCircle, ArrowRight, AlertTriangle, Clock, Home } from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/realtor-outdoor-punch-list";
const TITLE = "Outdoor Punch List for Realtors";
const DESCRIPTION = "Pre-listing outdoor assessment for Charlotte realtors. Irrigation, drainage, lighting checks with written report. Prevent inspection surprises and close faster.";

const faqItems = [
  {
    q: "What is a pre-listing outdoor punch list?",
    a: "A 40-point outdoor property assessment before listing, identifying irrigation, drainage, lighting, and hardscape issues that could delay closing.",
  },
  {
    q: "How quickly can you complete the review?",
    a: "Typically within 48 hours of request. Written report delivered same day as the visit.",
  },
  {
    q: "Do you work with real estate agents regularly?",
    a: "Yes. We're a resource for Charlotte-area agents who want their listings to pass outdoor inspection without surprises.",
  },
];

export default function RealtorOutdoorPunchListPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={PAGE_PATH}
        jsonLd={[
          makeServiceSchema("Outdoor Punch List for Realtors in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: TITLE, url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: TITLE }]} />

      <main className="bg-white">
        <section className="bg-gradient-to-b from-white via-stone-50 to-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200">For Real Estate Agents</span>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte pre-listing partner</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-forest-700 sm:text-5xl">Outdoor Punch List for Realtors</h1>
            <p className="mt-4 text-xl text-stone-600">Pre-Listing Outdoor Assessment — So Your Sale Doesn't Stall Over a Sprinkler Head</p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600">Give sellers a clearer scope, reduce inspection friction, and walk into closing with written documentation for irrigation, drainage, lighting, and hardscape conditions.</p>
            <a
              href={`tel:${PHONE}`}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-forest-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 hover:shadow-md focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
            >
              <Phone size={18} />
              Request Pre-Listing Outdoor Review
            </a>
          </div>
        </section>

        <section className="bg-stone-50 py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">Why outdoor issues kill deals</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">These are the small outdoor problems that become large negotiation points once a property goes under contract.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: AlertTriangle, text: "Buyers flagging irrigation and drainage problems during inspection — after you're already under contract" },
                { icon: AlertTriangle, text: "Sellers blindsided by outdoor repair costs they didn't know existed" },
                { icon: AlertTriangle, text: "Closings delayed over 'minor' drainage issues that weren't caught early" },
                { icon: AlertTriangle, text: "No reliable contractor to call for fast outdoor assessments before listing" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 transition-transform duration-200 hover:-translate-y-0.5">
                  <Icon size={20} className="mt-0.5 shrink-0 text-amber-500" />
                  <p className="text-sm leading-6 text-stone-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">What's included in the assessment</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">A structured outdoor review built to help agents surface issues before they become closing delays.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: ClipboardCheck, label: "40-point outdoor property checklist" },
                { icon: Droplets, label: "Full irrigation system test and zone check" },
                { icon: Droplets, label: "Drainage flow assessment across the property" },
                { icon: Zap, label: "Outdoor lighting condition check" },
                { icon: Home, label: "Hardscape condition report (walkways, patios, edging)" },
                { icon: FileText, label: "Written summary formatted for disclosure" },
                { icon: FileText, label: "Estimated repair cost ranges (no inflated quotes)" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200 transition-colors duration-200 hover:bg-white">
                  <CheckCircle size={18} className="shrink-0 text-forest-700" />
                  <Icon size={16} className="shrink-0 text-stone-400" />
                  <span className="text-sm font-medium text-stone-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-stone-50 py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">How it works</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">Simple intake, fast scheduling, and a written report you can use the same day.</p>
            <div className="flex flex-col gap-4">
              {[
                { step: "1", title: "Agent calls or texts us", desc: "Reach out with the property address and your preferred timing. No lengthy intake forms." },
                { step: "2", title: "We visit within 48 hours", desc: "A technician walks the full property and runs every outdoor system." },
                { step: "3", title: "Written report delivered same day", desc: "You get a clear, shareable document — ready for disclosure or seller conversations." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">{step}</span>
                  <div>
                    <h3 className="font-semibold text-stone-800">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-stone-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">What agents get out of this</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">The goal is fewer surprises, faster disclosure conversations, and more confidence before listing day.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Faster closings with fewer last-minute surprises",
                "Fewer inspection objections from buyers",
                "Professional documentation ready for disclosure",
                "You look proactive — not reactive — to your clients",
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-2 rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200 transition-colors duration-200 hover:bg-white">
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-forest-700" />
                  <span className="text-sm text-stone-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-stone-50 py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-forest-700">Quick answers for listing prep</h2>
              <p className="mt-3 text-stone-600">Helpful copy for buyers, sellers, and Charlotte real estate teams comparing outdoor prep options.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              whenToCall="Use the review before photography, before active listing, or as soon as an inspection concern comes up."
              whatToDoNext="Send the property address and target listing date. We'll coordinate the walk and return a same-day written report."
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              relatedQuestions={[faqItems[2].q]}
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[2].q}
              shortAnswer={faqItems[2].a}
              relatedQuestions={[faqItems[0].q, faqItems[1].q]}
              showSchema={false}
            />
          </div>
        </section>

        <section className="bg-forest-600 py-14 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Clock size={32} className="mx-auto mb-4 text-white" />
            <h2 className="text-2xl font-bold text-white">Ready before your next listing?</h2>
            <p className="mb-6 mt-3 text-green-100">Call or text us with the address. We'll schedule the visit and have a report back to you the same day.</p>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-forest-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-100 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
            >
              <Phone size={18} />
              Request Pre-Listing Outdoor Review
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
