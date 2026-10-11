import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import { Droplets, Zap, Camera, ClipboardList, Phone, CheckCircle, ArrowRight, AlertTriangle, Wrench, FileCheck } from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/builder-outdoor-punch-list";
const TITLE = "Outdoor Punch List for Builders";
const DESCRIPTION = "New construction outdoor finishing for Charlotte builders. Irrigation commissioning, drainage, landscape install, and photo-documented completion before handoff.";

const faqItems = [
  {
    q: "What outdoor work do you handle for builders?",
    a: "Irrigation commissioning, drainage verification, final grade check, landscape installation, outdoor lighting, and photo-documented completion reports.",
  },
  {
    q: "Can you handle multiple lots?",
    a: "Yes. We work with builders on single-lot and community-scale projects with coordinated scheduling.",
  },
  {
    q: "Do you provide photo-documented completion reports?",
    a: "Yes. We document final outdoor punch list completion with photos and closeout notes to support handoff and reduce warranty confusion.",
  },
];

export default function BuilderOutdoorPunchListPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={PAGE_PATH}
        jsonLd={[
          makeServiceSchema("Outdoor Punch List for Builders in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
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
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200">For Home Builders</span>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte new construction support</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-forest-700 sm:text-5xl">Outdoor Punch List for Builders</h1>
            <p className="mt-4 text-xl text-stone-600">New Construction Outdoor Finishing — Irrigation, Drainage, and Landscape Done Right Before Handoff</p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600">Use one outdoor partner to coordinate commissioning, grading, landscape finish work, and closeout documentation before the home turns over to the buyer.</p>
            <a
              href={`tel:${PHONE}`}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-forest-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 hover:shadow-md focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
            >
              <Phone size={18} />
              Get Builder Outdoor Quote
            </a>
          </div>
        </section>

        <section className="bg-stone-50 py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">What slows down your closing</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">Outdoor punch list gaps often stay invisible until the last week of the job. That's where delays and warranty headaches start.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: AlertTriangle, text: "Landscaper no-shows pushing your closing date back at the last minute" },
                { icon: AlertTriangle, text: "Irrigation systems installed but never properly commissioned or tested" },
                { icon: AlertTriangle, text: "Drainage issues that only surface after the first heavy rain — post-handoff" },
                { icon: AlertTriangle, text: "Punch list items stacking up with no single contractor to own them" },
                { icon: AlertTriangle, text: "Warranty callbacks from homeowners unhappy with outdoor performance" },
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
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">What we handle before handoff</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">Keep the lot finish coordinated and documented from final grade through homeowner-ready outdoor systems.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Droplets, label: "Irrigation system commissioning and full zone test" },
                { icon: Droplets, label: "Drainage flow verification across the lot" },
                { icon: Wrench, label: "Final grade check and correction" },
                { icon: ClipboardList, label: "Landscape installation per plan" },
                { icon: Zap, label: "Outdoor lighting setup and test" },
                { icon: Camera, label: "Photo-documented completion report" },
                { icon: FileCheck, label: "Homeowner walkthrough documentation" },
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
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">Share the plan, align the schedule, and get photo-documented outdoor completion before final handoff.</p>
            <div className="flex flex-col gap-4">
              {[
                { step: "1", title: "Builder sends plan and specs", desc: "Share the lot plan, irrigation layout, and any drainage requirements. We review before quoting." },
                { step: "2", title: "We review and quote", desc: "You get a clear scope and price — no surprises. We coordinate around your construction schedule." },
                { step: "3", title: "Coordinated install with photo-documented completion", desc: "We show up when we say we will. Every item is photographed and logged before we sign off." },
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
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">Why builders work with us</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">Reliable scheduling and stronger documentation help protect your handoff and reduce post-close friction.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Reliable schedule — we show up when committed",
                "One contractor for all outdoor punch list items",
                "Documented completion protects you on warranty claims",
                "Fewer callbacks from homeowners after closing",
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
              <h2 className="text-2xl font-bold text-forest-700">Builder partnership FAQs</h2>
              <p className="mt-3 text-stone-600">Structured answers for superintendents, project managers, and closeout teams comparing outdoor partners.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              whenToCall="Bring us in before closeout scheduling so irrigation, drainage, and landscape punch items are sequenced with the rest of the build."
              whatToDoNext="Send the lot count, site plans, and timeline. We'll scope the work and align with your construction calendar."
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
            <FileCheck size={32} className="mx-auto mb-4 text-white" />
            <h2 className="text-2xl font-bold text-white">Close on schedule. Every time.</h2>
            <p className="mb-6 mt-3 text-green-100">Send us your plan and we'll put together a quote. No outdoor punch list item left open at handoff.</p>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-forest-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-100 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
            >
              <Phone size={18} />
              Get Builder Outdoor Quote
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
