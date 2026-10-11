'use client';

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Layout from "../../../src/components/Layout";
import Breadcrumbs from "../../../src/components/Breadcrumbs";
import PageHero from "../../../src/components/PageHero";
import AeoBlock from "../../../src/components/AeoBlock";
import { services } from "../../../data/services";
import { locationsFull } from "../../../data/locations_full";
import {
  Phone, CheckCircle2, ArrowRight, ShieldCheck, Clock, Users,
  MessageSquare, Camera, MapPin, AlertCircle, Calendar, Droplets
} from "lucide-react";

const PHONE = "+17048864240";
const SITE_URL = "https://eliteirrigation.com";

const PROCESS_STEPS = [
  { num: "1", title: "Free Assessment", desc: "We inspect the issue on-site and provide a clear, written estimate." },
  { num: "2", title: "Scope & Schedule", desc: "You approve the plan. We schedule a convenient time." },
  { num: "3", title: "Professional Execution", desc: "Our crew completes the work with quality materials and clean craftsmanship." },
  { num: "4", title: "Walkthrough & Documentation", desc: "We test everything, document before/after, and walk you through the results." },
];

const SYMPTOM_MAP: Record<string, string[]> = {
  Irrigation: ["Dry spots in lawn", "Sprinkler won't shut off", "High water bill", "Leaking valve box", "Uneven watering", "Controller not working"],
  Drainage: ["Standing water after rain", "Soggy backyard", "Water near foundation", "Erosion on slopes", "Downspout flooding", "Wet basement walls"],
  Hardscape: ["Cracked or uneven pavers", "Retaining wall bowing", "Poor patio drainage", "Trip hazards on walkway", "Failing steps", "Shifting wall blocks"],
  OutdoorLiving: ["Unused backyard space", "No outdoor cooking area", "Dark patio at night", "No fire feature for gathering", "Exposed pool equipment", "No shade structure"],
  Lighting: ["Dark walkways at night", "Burned out fixtures", "Glaring spotlights", "No curb appeal after dark", "Unsafe steps", "Inconsistent beam patterns"],
  Turf: ["Brown patches", "Thinning grass", "Weeds overtaking lawn", "Compacted soil", "Grub damage", "Pet damage spots"],
  Maintenance: ["Overgrown beds", "Mulch washed away", "Unkempt appearance", "HOA violation notice", "Dead shrubs", "Seasonal debris buildup"],
  Grading: ["Soggy low spots", "Water flowing toward house", "Uneven yard surface", "Erosion after rain", "New construction settling", "Patio pooling"],
  Landscaping: ["Overgrown beds", "Dead or dying plants", "Bare spots in landscape", "Poor drainage in beds", "Outdated landscape design", "No curb appeal"],
  TreeBrush: ["Low hanging branches", "Overgrown shrubs", "Dead tree limbs", "Brush pile buildup", "Stumps in yard", "Sight line blocked"],
  Seasonal: ["Sprinklers not winterized", "Spring startup needed", "Seasonal debris buildup", "Bed preparation needed", "Mulch refreshed", "Irrigation schedule off"],
};

const SERVICE_IMAGE_RULES = [
  { keys: ["irrigation", "sprinkler", "valve", "controller", "nozzle"], src: "/images/homepage/charlotte-irrigation-systems.webp", alt: "Charlotte irrigation system service and sprinkler repair" },
  { keys: ["drainage", "water", "erosion", "foundation", "downspout", "french-drain", "catch-basin"], src: "/images/homepage/charlotte-drainage-fixes-standing-water.webp", alt: "Charlotte drainage fixes for standing water and runoff" },
  { keys: ["patio", "hardscape", "retaining", "wall", "walkway", "paver"], src: "/images/homepage/charlotte-patio-installs-hardscapes.webp", alt: "Charlotte patio installs and hardscape work" },
  { keys: ["lighting", "christmas", "low-voltage", "path-lighting"], src: "/images/homepage/charlotte-outdoor-lighting-landscape.webp", alt: "Charlotte outdoor lighting and landscape lighting" },
  { keys: ["sod", "grading", "turf", "lawn-renovation", "aeration", "overseeding"], src: "/images/homepage/charlotte-sod-grading-lawn-installation.webp", alt: "Charlotte sod grading and lawn installation" },
  { keys: ["commercial", "hoa", "estate", "maintenance", "lawn-care", "cleanup", "property"], src: "/images/homepage/charlotte-commercial-grounds-maintenance.webp", alt: "Charlotte commercial grounds and property maintenance" },
  { keys: ["landscape", "planting", "mulch", "bed", "tree", "shrub", "design"], src: "/images/homepage/charlotte-landscape-design-installation.webp", alt: "Charlotte landscape design and installation" },
];

function getServiceImage(svc: (typeof services)[number]) {
  const text = `${svc.slug} ${svc.category} ${svc.name}`.toLowerCase();
  return SERVICE_IMAGE_RULES.find((rule) => rule.keys.some((key) => text.includes(key))) ?? SERVICE_IMAGE_RULES[SERVICE_IMAGE_RULES.length - 1];
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function ServiceClient() {
  const { slug } = useParams<{ slug: string }>();
  const svc = useMemo(() => services.find(s => s.slug === slug), [slug]);

  if (!svc) {
    return (
      <Layout>
        <PageHero title="Service not found" subtitle="We couldn't find the service you're looking for." />
        <Link href="/services" className="text-forest-600 font-bold hover:underline">Back to all services</Link>
      </Layout>
    );
  }

  const faq = [
    { q: `What does ${svc.name.toLowerCase()} include?`, a: `Our ${svc.name.toLowerCase()} service follows a documented process: initial assessment, detailed scope of work, professional execution, photo documentation, and a function test walkthrough with you.` },
    { q: `How much does ${svc.name.toLowerCase()} cost?`, a: svc.pricingBand ? `Pricing typically ranges from $${svc.pricingBand.min} to $${svc.pricingBand.max} per ${svc.pricingBand.unit.replace("_", " ")}. We provide free estimates so you know the exact cost before we start.` : `Pricing varies by property and scope. We offer free estimates — call us at (704) 886-4240 or request one online.` },
    { q: `Do you offer ${svc.name.toLowerCase()} near me?`, a: `Yes. We serve the entire Charlotte metro area including Harrisburg, Concord, Huntersville, Cornelius, Davidson, Kannapolis, and surrounding communities.` },
    { q: `How quickly can you start?`, a: svc.isEmergencyCapable ? `For emergencies, we prioritize urgent ${svc.name.toLowerCase()} calls during business hours. For standard requests, we typically schedule within 3-5 business days.` : `We typically schedule within 3-5 business days. For urgent needs, call us directly at (704) 886-4240.` },
    { q: `What documentation do you provide?`, a: `Every visit includes before, during, and after photos. You receive work notes, materials used, and function test results — all documented and shared with you.` },
  ];

  const relatedServices = services.filter(s =>
    s.slug !== svc.slug && (s.category === svc.category || (svc.upsellSlugs ?? []).includes(s.slug))
  ).slice(0, 3);

  const featuredLocs = locationsFull.filter(l => l.ring <= 1).slice(0, 16);
  const serviceImage = getServiceImage(svc);
  const serviceUrl = `${SITE_URL}/services/${svc.slug}`;
  const tocItems = [
    { id: "who-needs-this", label: "Who needs this" },
    ...(SYMPTOM_MAP[svc.category] ? [{ id: "signs", label: "Signs you need help" }] : []),
    { id: "what-we-do", label: "What we do" },
    ...(svc.pricingBand && !svc.packs?.length ? [{ id: "pricing", label: "Pricing" }] : []),
    ...(svc.packs?.length ? [{ id: "service-tiers", label: "Service tiers" }] : []),
    { id: "process", label: "Process" },
    ...(svc.proofChecklist?.length ? [{ id: "documentation", label: "Documentation" }] : []),
    { id: "faqs", label: "FAQs" },
    { id: "service-area", label: "Service area" },
    ...(relatedServices.length ? [{ id: "related-services", label: "Related services" }] : []),
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${svc.name} in Charlotte NC`,
    serviceType: svc.name,
    description: svc.quickSummary,
    url: serviceUrl,
    image: `${SITE_URL}${serviceImage.src}`,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "Elite Irrigation & Landscaping",
      telephone: "+1-704-886-4240",
      url: SITE_URL,
    },
    areaServed: ["Charlotte", "Harrisburg", "Concord", "Huntersville", "Cornelius", "Matthews"],
    offers: svc.pricingBand ? {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: svc.pricingBand.min,
        maxPrice: svc.pricingBand.max,
        priceCurrency: "USD",
        unitText: svc.pricingBand.unit.replace("_", " "),
      },
    } : undefined,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <Layout>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: svc.name },
      ]} />

      <PageHero
        title={`${svc.name} in Charlotte, NC`}
        subtitle={svc.quickSummary}
        chips={[
          svc.category,
          ...(svc.seasonality ?? []).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
          ...(svc.isEmergencyCapable ? ["Priority Repair"] : []),
        ]}
      />

      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: ShieldCheck, label: "NCICLB Licensed" },
          { icon: Camera, label: "Photo-Documented" },
          { icon: CheckCircle2, label: "Free Estimates" },
          { icon: Clock, label: svc.isEmergencyCapable ? "Priority Repair" : "3-5 Day Scheduling" },
        ].map(t => (
          <div key={t.label} className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3">
            <t.icon className="w-4 h-4 text-forest-600 shrink-0" />
            <span className="text-xs font-bold text-stone-700">{t.label}</span>
          </div>
        ))}
      </div>

      <nav aria-label="On this page" className="mb-10 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <details className="group" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-extrabold uppercase tracking-widest text-stone-900">
            On this page
            <span className="text-xs font-bold normal-case tracking-normal text-forest-700 group-open:hidden">Show</span>
            <span className="hidden text-xs font-bold normal-case tracking-normal text-forest-700 group-open:inline">Hide</span>
          </summary>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-forest-300 hover:bg-forest-50 hover:text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
              >
                {item.label}
              </a>
            ))}
          </div>
        </details>
      </nav>

      <section className="mb-10 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[240px] overflow-hidden bg-stone-100 sm:min-h-[320px] lg:min-h-full">
            <Image
              src={serviceImage.src}
              alt={serviceImage.alt}
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
              priority={false}
            />
          </div>
          <div className="p-5 sm:p-8 lg:p-10">
            <p className="text-xs font-extrabold uppercase tracking-widest text-forest-700">What changes after the visit</p>
            <h2 className="mt-3 text-2xl font-serif font-semibold leading-tight text-stone-950 sm:text-3xl">
              From guessing what is wrong to knowing the next right step.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
              We diagnose the property condition, explain the repair or project path, document what we find, and leave you with clear next steps for {svc.name.toLowerCase()}.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Problem diagnosed", "Photos documented", "Scope explained", "Schedule path clear"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-bold text-stone-700">
                  <CheckCircle2 className="h-4 w-4 text-forest-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-10">
        <div className="min-w-0 space-y-12">

          <section id="who-needs-this" className="scroll-mt-28 rounded-2xl border border-forest-100 bg-white p-5 sm:p-8">
            <h2 className="text-xl font-extrabold text-stone-900 mb-3">Who Needs {svc.name}?</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              {svc.name} is ideal for {(svc.b2bFit ?? ["homeowners and property managers"]).join(", ").toLowerCase()}
              {" "}in the Charlotte metro area who need {svc.intents.join(", ").toLowerCase()} services.
              {svc.isEmergencyCapable && " We prioritize emergency calls during business hours."}
            </p>
            <div className="flex flex-wrap gap-2">
              {(svc.b2bFit ?? ["Residential"]).map((fit) => (
                <span key={fit} className="text-xs bg-white text-forest-700 px-3 py-1.5 rounded-full font-medium border border-forest-200">
                  {fit}
                </span>
              ))}
            </div>
          </section>

          {SYMPTOM_MAP[svc.category] && (
            <section id="signs" className="scroll-mt-28">
              <h2 className="text-xl font-extrabold text-stone-900 mb-4">Signs You May Need {svc.name}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {SYMPTOM_MAP[svc.category].map((symptom) => (
                  <div key={symptom} className="flex items-center gap-3 p-4 rounded-lg bg-white border border-stone-200 hover:border-forest-300 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                    <span className="text-sm text-stone-700 font-medium">{symptom}</span>
                  </div>
                ))}
              </div>
              <p className="text-stone-500 text-sm mt-4">
                Not sure if you need {svc.name.toLowerCase()}? <a href={`sms:${PHONE}`} className="text-forest-600 font-semibold hover:underline">Text us a photo</a> and we will help you figure it out.
              </p>
            </section>
          )}

          <section id="what-we-do" className="scroll-mt-28 rounded-2xl bg-stone-50 p-5 sm:p-8">
            <h2 className="text-xl font-extrabold text-stone-900 mb-4">What We Do</h2>
            <ul className="space-y-3">
              {svc.whatWeDoBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-700">
                  <CheckCircle2 className="w-5 h-5 text-forest-600 mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>

          {svc.packs && svc.packs.length > 0 && (
            <section id="service-tiers" className="scroll-mt-28">
              <h2 className="text-xl font-extrabold text-stone-900 mb-6">Service Tiers</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {svc.packs.map((pack, i) => (
                  <div key={i} className={`rounded-xl border-2 p-6 ${i === 1 ? "border-forest-500 bg-white" : "border-stone-200 bg-white"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-stone-900">{pack.tier}</h3>
                      {pack.typicalRange && (
                        <span className="text-xs text-stone-500">${pack.typicalRange.min}–${pack.typicalRange.max}</span>
                      )}
                    </div>
                    <p className="text-sm text-stone-600 mb-4">{pack.promise}</p>
                    <ul className="space-y-2">
                      {pack.includes.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-stone-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {svc.pricingBand && !svc.packs?.length && (
            <section id="pricing" className="scroll-mt-28 rounded-2xl bg-stone-50 p-5 sm:p-8">
              <h2 className="text-xl font-extrabold text-stone-900 mb-2">Typical Pricing</h2>
              <div className="text-3xl font-extrabold text-forest-600 mb-1">
                ${svc.pricingBand.min} – ${svc.pricingBand.max}
              </div>
              <div className="text-sm text-stone-500 mb-4">per {svc.pricingBand.unit.replace("_", " ")}</div>
              {svc.pricingBand.notes && <p className="text-sm text-stone-500 italic mb-4">{svc.pricingBand.notes}</p>}
              <p className="text-sm text-stone-500">Final pricing based on on-site assessment. Estimates are always free.</p>
            </section>
          )}

          <section id="process" className="scroll-mt-28">
            <h2 className="text-xl font-extrabold text-stone-900 mb-6">Our Process</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROCESS_STEPS.map((step) => (
                <div key={step.num} className="bg-white border border-stone-200 rounded-xl p-5 relative">
                  <div className="w-8 h-8 bg-forest-600 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {svc.proofChecklist && svc.proofChecklist.length > 0 && (
            <section id="documentation" className="scroll-mt-28 rounded-2xl border border-forest-100 bg-white p-5 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-forest-600" />
                <h2 className="text-xl font-extrabold text-stone-900">What We Document</h2>
              </div>
              <ul className="grid sm:grid-cols-2 gap-2">
                {svc.proofChecklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-forest-600 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {svc.complianceNotes && svc.complianceNotes.length > 0 && (
            <section className="rounded-2xl border border-forest-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-forest-600" />
                <h3 className="font-bold text-stone-900 text-sm">Important Notes</h3>
              </div>
              <ul className="space-y-2">
                {svc.complianceNotes.map((note, i) => (
                  <li key={i} className="text-sm text-stone-700">{note}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl bg-forest-900 p-5 text-white sm:p-8">
            <h2 className="text-xl font-extrabold text-white mb-6">Why Choose Elite for {svc.name}</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: ShieldCheck, label: "NC Licensed & Insured", detail: "Licensed irrigation work with insured, professional field standards" },
                { icon: Camera, label: "Photo-Documented Service", detail: "Before, during, and after photos on every visit" },
                { icon: MapPin, label: "Charlotte Metro Based", detail: "Harrisburg, NC headquarters serving the greater Charlotte area" },
                { icon: CheckCircle2, label: "Structured Process", detail: "Free assessment, written scope, professional execution, documented results" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-forest-800 text-forest-300 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{item.label}</div>
                    <div className="text-forest-400 text-xs mt-0.5">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div id="faqs" className="scroll-mt-28 space-y-6">
            <h2 className="text-2xl font-extrabold text-stone-900">Common Questions</h2>
            {faq.map(f => (
              <AeoBlock key={f.q} question={f.q} shortAnswer={f.a} showSchema={false} />
            ))}
          </div>

          <section id="service-area" className="scroll-mt-28">
            <h2 className="text-xl font-extrabold text-stone-900 mb-4">Service Area</h2>
            <p className="text-stone-600 mb-6">We provide {svc.name.toLowerCase()} throughout the Charlotte metro area:</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {featuredLocs.map(l => (
                <Link key={l.slug} href={`/areas/${l.slug}`} className="px-4 py-2.5 text-sm text-stone-600 border border-stone-200 hover:border-forest-400 hover:text-forest-700 hover:bg-forest-50 bg-white transition-all rounded-lg text-center">
                  {l.name}
                </Link>
              ))}
            </div>
            <Link href="/areas-we-serve" className="text-forest-600 text-sm font-semibold mt-4 inline-flex items-center gap-1 hover:underline">
              See all service areas <ArrowRight className="w-3 h-3" />
            </Link>
          </section>

          {relatedServices.length > 0 && (
            <section id="related-services" className="scroll-mt-28">
              <h2 className="text-xl font-extrabold text-stone-900 mb-4">Related Services</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedServices.map((rs) => (
                  <Link key={rs.slug} href={`/services/${rs.slug}`} className="group border border-stone-200 rounded-xl p-5 hover:border-forest-300 hover:shadow-md transition-all">
                    <h3 className="font-bold text-stone-900 text-sm group-hover:text-forest-600 transition-colors">{rs.name}</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{rs.quickSummary}</p>
                    <span className="text-forest-600 text-xs font-semibold mt-3 inline-flex items-center gap-1">
                      Learn More <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="min-w-0 space-y-6 xl:self-start">
          <div className="rounded-2xl bg-forest-600 p-5 text-white sm:p-6 xl:sticky xl:top-24">
            <h3 className="font-bold text-lg mb-2">Get a Free Estimate</h3>
            <p className="text-forest-100 text-sm mb-5">
              No-obligation quote for {svc.name.toLowerCase()}. Most estimates returned within one business day.
            </p>
            <a
              href={`tel:${PHONE}`}
              className="flex items-center justify-center gap-2 w-full bg-white text-forest-700 px-6 py-3 rounded-lg font-bold text-sm hover:bg-forest-50 transition-colors mb-3"
            >
              <Phone className="w-4 h-4" />
              Call (704) 886-4240
            </a>
            <Link
              href="/quick-quote"
              className="flex items-center justify-center gap-2 w-full bg-forest-700 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-forest-800 transition-colors border border-forest-500 shadow-sm"
            >
              Request Your Free Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-5 pt-4 border-t border-forest-500">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-forest-200" />
                <h4 className="font-bold text-white text-sm">Text Us Photos</h4>
              </div>
              <p className="text-forest-200 text-xs mb-3">
                Not sure what is wrong? Text us photos and we will recommend the right next step.
              </p>
              <a
                href={`sms:${PHONE}`}
                className="flex items-center justify-center gap-2 w-full bg-forest-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-forest-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Text (704) 886-4240
              </a>
            </div>
            <div className="mt-4 pt-3 border-t border-forest-500">
              <h4 className="font-bold text-white text-xs mb-2">Ideal For</h4>
              <div className="flex flex-wrap gap-1.5">
                {(svc.b2bFit ?? ["Residential"]).map((t) => (
                  <span key={t} className="text-[10px] font-semibold bg-white/15 text-white px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-forest-500 text-xs text-forest-200 space-y-1">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> NC Licensed (NCICLB)</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Free Estimates</div>
              {svc.isEmergencyCapable && <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Priority Emergency Repair</div>}
              <div className="flex items-center gap-1.5"><Camera className="w-3 h-3" /> Photo-Documented</div>
            </div>
          </div>

          {svc.pricingBand && !svc.packs?.length && (
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
              <h4 className="font-bold text-stone-900 text-sm mb-2">Typical Pricing</h4>
              <div className="text-2xl font-extrabold text-forest-600">
                ${svc.pricingBand.min} – ${svc.pricingBand.max}
              </div>
              <div className="text-xs text-stone-500 mt-1">per {svc.pricingBand.unit.replace("_", " ")}</div>
              {svc.pricingBand.notes && <p className="text-xs text-stone-400 mt-2 italic">{svc.pricingBand.notes}</p>}
              <p className="text-xs text-stone-500 mt-3">Final pricing based on on-site assessment. Estimates are always free.</p>
            </div>
          )}

          {svc.seasonality && svc.seasonality.length > 0 && (
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
              <h4 className="font-bold text-stone-900 text-sm mb-2">Seasonal Availability</h4>
              <div className="flex flex-wrap gap-2">
                {svc.seasonality.map(s => (
                  <span key={s} className="text-xs bg-white text-forest-700 px-3 py-1 rounded-full font-medium capitalize">{s}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </Layout>
  );
}
