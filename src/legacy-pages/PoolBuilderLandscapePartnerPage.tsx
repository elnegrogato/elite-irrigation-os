import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import { Droplets, Zap, Layers, Phone, CheckCircle, ArrowRight, AlertTriangle, Shovel, TreePine } from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/pool-builder-landscape-partner";
const TITLE = "Landscape Partner for Pool Builders";
const DESCRIPTION = "Pool-area drainage, irrigation restoration, landscape install, and lighting for Charlotte pool builders. One outdoor contractor from coping to property line.";

const faqItems = [
  {
    q: "Why partner with Elite for pool-area work?",
    a: "We handle everything outside the coping — drainage, irrigation restoration, landscaping, lighting, and hardscape surfaces. One contractor for the full pool surround.",
  },
  {
    q: "Can you coordinate with our pool construction timeline?",
    a: "Yes. We scope and schedule pool-adjacent drainage, irrigation, landscape, and lighting work around excavation, deck work, and final finish milestones.",
  },
];

export default function PoolBuilderLandscapePartnerPage() {
  return (
    <Layout>
      <PageSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={PAGE_PATH}
        jsonLd={[
          makeServiceSchema("Landscape Partner for Pool Builders in Charlotte, NC", DESCRIPTION, PAGE_PATH, "Charlotte, NC"),
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
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200">For Pool Builders</span>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-forest-700">Charlotte pool surround partner</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-forest-700 sm:text-5xl">Landscape Partner for Pool Builders</h1>
            <p className="mt-4 text-xl text-stone-600">You Build the Pool. We Handle Everything Outside the Coping.</p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600">Coordinate drainage, irrigation restoration, lighting, grading, and hardscape finish work with one outdoor contractor who understands the full pool-adjacent environment.</p>
            <a
              href={`tel:${PHONE}`}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-forest-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 hover:shadow-md focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
            >
              <Phone size={18} />
              Discuss Partnership
            </a>
          </div>
        </section>

        <section className="bg-stone-50 py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">What goes wrong without a landscape partner</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">Pool projects need more than the shell and deck. The outdoor surround has to drain, light, and perform well after the first season.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: AlertTriangle, text: "Pool-area drainage problems causing deck settling and water intrusion after the first season" },
                { icon: AlertTriangle, text: "Irrigation lines cut during excavation with no plan for restoration" },
                { icon: AlertTriangle, text: "Landscape lighting not coordinated with pool equipment — conflicting circuits, mismatched aesthetics" },
                { icon: AlertTriangle, text: "No single contractor to own pool-adjacent outdoor work from start to finish" },
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
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">What we handle outside the coping</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">The pool gets the spotlight, but the surrounding grade, drainage, lighting, and planting are what make the project perform as a finished environment.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Droplets, label: "Pool-area drainage design and installation" },
                { icon: Droplets, label: "Irrigation rerouting and full system restoration" },
                { icon: TreePine, label: "Landscape installation around pool surround" },
                { icon: Zap, label: "Pool-area lighting coordinated with pool equipment" },
                { icon: Layers, label: "Retaining walls and grading for pool-adjacent areas" },
                { icon: Shovel, label: "Paver deck drainage and slope correction" },
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
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">How the partnership works</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">Bring us in early enough to coordinate grading, irrigation restoration, and lighting so the final outdoor result feels intentional instead of patched together.</p>
            <div className="flex flex-col gap-4">
              {[
                { step: "1", title: "Pool builder shares the pool plan", desc: "Send us the pool layout, equipment placement, and any drainage or grading notes. We review before scoping." },
                { step: "2", title: "We design the outdoor surround", desc: "Drainage, irrigation, landscape, and lighting designed to work with the pool — not around it." },
                { step: "3", title: "Coordinated install and seamless handoff", desc: "We schedule around your pool construction timeline. The client gets one cohesive outdoor space, not a patchwork." },
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
            <h2 className="text-2xl font-bold text-forest-700 mb-3 text-center">What pool builders get</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">Better coordination, fewer surprises after the first rain, and a finished project that feels cohesive to the homeowner.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Single point of contact for all outdoor work outside the coping",
                "Coordinated scheduling that doesn't hold up your pool timeline",
                "No drainage callbacks after the first rain season",
                "Pool clients who are happy with the full outdoor result",
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
              <h2 className="text-2xl font-bold text-forest-700">Pool builder partnership FAQs</h2>
              <p className="mt-3 text-stone-600">Clear answers for builders who want one outdoor team to own the surround beyond the pool shell and deck.</p>
            </div>
            <AeoBlock
              question={faqItems[0].q}
              shortAnswer={faqItems[0].a}
              whenToCall="Bring us in during planning or as soon as excavation impacts irrigation, grading, or drainage around the pool area."
              whatToDoNext="Share the pool plan and target sequence. We'll outline the drainage, irrigation, landscape, and lighting scope that fits the build."
              showSchema={false}
            />
            <AeoBlock
              question={faqItems[1].q}
              shortAnswer={faqItems[1].a}
              relatedQuestions={[faqItems[0].q]}
              showSchema={false}
            />
          </div>
        </section>

        <section className="bg-forest-600 py-14 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Droplets size={32} className="mx-auto mb-4 text-white" />
            <h2 className="text-2xl font-bold text-white">Let's talk about your next pool project</h2>
            <p className="mb-6 mt-3 text-green-100">Send us the pool plan and we'll walk through how we can handle the outdoor surround — drainage, landscape, lighting, and all of it.</p>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-forest-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-100 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
            >
              <Phone size={18} />
              Discuss Partnership
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
