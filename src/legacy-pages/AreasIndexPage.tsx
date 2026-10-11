import Link from "next/link";
import Layout from "../components/Layout";
import PageSeo, { makeBreadcrumbSchema, makeFaqSchema, makeServiceSchema } from "../components/PageSeo";
import Breadcrumbs from "../components/Breadcrumbs";
import PageHero from "../components/PageHero";
import AeoBlock from "../components/AeoBlock";
import { locationsByRing } from "../../data/locations_full";
import { MapPin, Phone, ShieldCheck, Camera, CheckCircle2, ArrowRight, MessageSquare } from "lucide-react";

const PHONE = "+17048864240";

const ringMeta: Record<string, { title: string; subtitle: string }> = {
  "0": { title: "Core Area", subtitle: "Harrisburg & NE Charlotte — our home base" },
  "1": { title: "Greater Charlotte Metro", subtitle: "Concord, Charlotte, Huntersville, Matthews, and surrounding areas" },
  "2": { title: "Extended Metro", subtitle: "Lake Norman, Davidson, Mooresville, Waxhaw, and beyond" },
};

const faqItems = [
  {
    q: "What areas does Elite Irrigation serve?",
    a: "We serve the Greater Charlotte metro area including Harrisburg, Concord, Charlotte, Huntersville, Cornelius, Matthews, Mint Hill, Kannapolis, Waxhaw, Weddington, Davidson, Mooresville, Pineville, and surrounding communities. Based in Harrisburg, NC.",
  },
  {
    q: "Is there a trip charge for service calls?",
    a: "No separate trip charge within our standard service area. All initial estimates and assessments are free with no obligation.",
  },
  {
    q: "Do you serve commercial properties outside the Charlotte area?",
    a: "We primarily serve the Charlotte metro region. For larger commercial or HOA contracts outside the metro, contact us to discuss scope and availability.",
  },
];

export default function AreasIndexPage() {
  return (
    <Layout>
      <PageSeo
        title="Service Areas — Elite Irrigation & Landscaping"
        description="Irrigation, drainage, hardscaping, and outdoor services throughout the Charlotte metro area. Based in Harrisburg, NC — serving Concord, Charlotte, Huntersville, Cornelius, Matthews, and beyond."
        canonical="https://eliteirrigation.com/areas-we-serve"
        jsonLd={[
          makeServiceSchema("Outdoor Services Throughout Charlotte Metro", "Irrigation, drainage, hardscaping, outdoor living, lighting, and maintenance services throughout the Charlotte metro area.", "/areas-we-serve", "Charlotte Metro, NC"),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Service Areas", url: "/areas-we-serve" },
          ]),
        ]}
      />

      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Service Areas" }]} />

      <PageHero
        title="Service Areas"
        subtitle="We provide irrigation, drainage, hardscaping, outdoor living, lighting, and maintenance services throughout the Charlotte metro region. Based in Harrisburg, NC."
        chips={["Harrisburg HQ", "Charlotte Metro", "Lake Norman", "Free Estimates"]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { icon: ShieldCheck, label: "NCICLB Licensed" },
          { icon: Camera, label: "Photo-Documented" },
          { icon: CheckCircle2, label: "Free Estimates" },
          { icon: MapPin, label: "Charlotte Metro Based" },
        ].map(t => (
          <div key={t.label} className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3">
            <t.icon className="w-4 h-4 text-forest-600 shrink-0" />
            <span className="text-xs font-bold text-stone-700">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-forest-50 border border-forest-200 rounded-xl p-6 mb-12 flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-forest-600 rounded-xl flex items-center justify-center text-white">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-stone-900">Headquarters</div>
            <div className="text-sm text-stone-600">4502 Rocky River Rd, Harrisburg, NC 28075</div>
          </div>
        </div>
        <div className="md:ml-auto flex gap-3">
          <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-forest-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-forest-700 transition-colors">
            <Phone className="w-4 h-4" />
            (704) 886-4240
          </a>
          <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-amber-400 transition-colors">
            <MessageSquare className="w-4 h-4" />
            Text Us
          </a>
        </div>
      </div>

      <div className="space-y-12">
        {[0, 1, 2].map((ring) => {
          const cities = locationsByRing[String(ring)] || [];
          const meta = ringMeta[String(ring)] || { title: "Service Area", subtitle: "" };
          return (
            <section key={ring}>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-stone-900">{meta.title}</h2>
                <p className="text-stone-500 text-sm">{meta.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {cities.map((loc: any) => (
                  <Link
                    key={loc.slug}
                    to={`/areas/${loc.slug}`}
                    className="group p-4 rounded-xl border border-stone-200 bg-white hover:border-forest-400 hover:shadow-md transition-all text-center"
                  >
                    <MapPin className="w-4 h-4 mx-auto text-stone-400 group-hover:text-forest-600 transition-colors mb-2" />
                    <div className="font-bold text-sm text-stone-900 group-hover:text-forest-600 transition-colors">{loc.name}</div>
                    <div className="text-xs text-stone-400 mt-1">{loc.state}</div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-16 space-y-6">
        <h2 className="text-2xl font-extrabold text-stone-900">Common Questions</h2>
        {faqItems.map(f => (
          <AeoBlock key={f.q} question={f.q} shortAnswer={f.a} showSchema={false} />
        ))}
      </div>

      <section className="mt-16 bg-forest-600 rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-extrabold text-white mb-3">Don't See Your Town?</h2>
        <p className="text-forest-100 mb-6">We may still cover your area. Call or text us and we'll let you know.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-white text-forest-700 px-8 py-3 rounded-lg font-bold hover:bg-forest-50 transition-colors">
            <Phone className="w-4 h-4" />
            Call (704) 886-4240
          </a>
          <Link href="/quick-quote" className="inline-flex items-center gap-2 bg-forest-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-forest-800 transition-colors border border-forest-500">
            Quick Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
