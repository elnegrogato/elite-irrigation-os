'use client';

import { useState } from "react";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import Breadcrumbs from "../../src/components/Breadcrumbs";
import PageHero from "../../src/components/PageHero";
import AeoBlock from "../../src/components/AeoBlock";
import { servicesByCategory, Service } from "../../data/services";
import { platformPillars } from "../../src/lib/outdoorPlatform";
import {
  Droplets, Waves, Layers, Lightbulb, Flower2, Wrench, Zap,
  Building2, ClipboardList, Trees, Flame, ShieldCheck, Phone,
  ArrowRight, CheckCircle2, Camera, MessageSquare
} from "lucide-react";

const PHONE = "+17048864240";

const categoryMeta: Record<string, { icon: any; description: string; tagline: string }> = {
  Irrigation: { icon: Droplets, description: "Irrigation systems, repairs, smart controllers, and water management services", tagline: "Keep every zone running right" },
  Drainage: { icon: Waves, description: "Drainage fixes, French drains, grading, standing water solutions, and erosion control", tagline: "Move water where it belongs" },
  Hardscape: { icon: Layers, description: "Patio installs, retaining walls, walkways, and hardscape repairs", tagline: "Built to last, designed to impress" },
  OutdoorLiving: { icon: Flame, description: "Outdoor kitchens, fire pits, and entertainment spaces", tagline: "Extend your living space outside" },
  Lighting: { icon: Lightbulb, description: "Low-voltage LED landscape lighting design and installation", tagline: "Safety and curb appeal after dark" },
  Maintenance: { icon: Trees, description: "Lawn care, property maintenance, seasonal cleanups, and weed and pest control treatments", tagline: "Consistent upkeep without the hassle" },
  Landscaping: { icon: Flower2, description: "Landscape design and installation, construction, plantings, and renovation", tagline: "From concept to completed landscape" },
  Turf: { icon: Flower2, description: "Sod installation, overseeding, and lawn renovation", tagline: "A lawn worth maintaining" },
  Grading: { icon: Wrench, description: "Property grading, leveling, and erosion control", tagline: "The foundation for everything else" },
  Seasonal: { icon: Flower2, description: "Winterization, spring startups, and seasonal service visits", tagline: "Right service, right season" },
  Commercial: { icon: Building2, description: "Commercial grounds, property maintenance, and irrigation contracts", tagline: "Professional outdoor management" },
  HOA: { icon: Building2, description: "HOA grounds management and board-ready reporting", tagline: "Common areas that look managed" },
  Builder: { icon: ClipboardList, description: "New construction irrigation and landscaping installation", tagline: "Outdoor systems done right from day one" },
  Design: { icon: Zap, description: "Professional landscape design and planning services", tagline: "Plan it before you plant it" },
  TreeBrush: { icon: Trees, description: "Tree trimming, brush clearing, and stump grinding", tagline: "Clean up the overgrowth" },
};

const categoryOrder = ["Irrigation", "Drainage", "Hardscape", "OutdoorLiving", "Lighting", "Maintenance", "Landscaping", "Turf", "Grading", "Seasonal", "Commercial", "HOA", "Builder", "Design", "TreeBrush"];
const categoryLabels: Record<string, string> = {
  OutdoorLiving: "Outdoor Living",
  TreeBrush: "Tree & Brush",
  Hardscape: "Hardscapes",
};

const faqItems = [
  {
    q: "What outdoor services does Elite offer in Charlotte?",
    a: "Elite provides landscape design and installation, irrigation systems, irrigation and water management, lawn care and maintenance, tree and shrub care, weed and pest control treatments, patio installs, retaining walls, drainage fixes, hardscapes, outdoor lighting, commercial grounds, seasonal cleanup, sod / grading, and property maintenance across the Charlotte metro area.",
  },
  {
    q: "Do you provide free estimates?",
    a: "Yes. All initial estimates and assessments are free with no obligation. You can request a quote online, call (704) 886-4240, or text photos of your outdoor issue directly.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the Greater Charlotte metro area including Harrisburg, Concord, Charlotte, Huntersville, Cornelius, Matthews, Mint Hill, Kannapolis, Waxhaw, Weddington, Davidson, Mooresville, Pineville, and surrounding communities.",
  },
];

export default function ServicesClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = activeCategory
    ? { [activeCategory]: servicesByCategory[activeCategory] || [] }
    : servicesByCategory;

  const sortedEntries = Object.entries(categories).sort(([a], [b]) => {
    const ai = categoryOrder.indexOf(a);
    const bi = categoryOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />

      <PageHero
        title="Outdoor Services"
        subtitle="Full-service outdoor property care for the Charlotte metro: landscaping, irrigation, drainage, hardscapes, outdoor lighting, commercial grounds, seasonal cleanup, sod / grading, and property maintenance — all photo-documented."
        chips={["Free Estimates", "NC Licensed", "Photo-Documented", "Charlotte Metro"]}
      />

      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: ShieldCheck, label: "NCICLB Licensed" },
          { icon: Camera, label: "Photo-Documented" },
          { icon: CheckCircle2, label: "Free Estimates" },
          { icon: MessageSquare, label: "Text Us Photos" },
        ].map(t => (
          <div key={t.label} className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3">
            <t.icon className="w-4 h-4 text-forest-600 shrink-0" />
            <span className="text-xs font-bold text-stone-700">{t.label}</span>
          </div>
        ))}
      </div>

      <section className="mb-12 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <span className="text-xs font-extrabold uppercase tracking-widest text-forest-700">Service paths</span>
          <h2 className="mt-3 text-3xl font-serif font-semibold leading-tight text-stone-950">
            Start by property system, problem, season, or managed-care need.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Elite is organized around the way property problems actually show up: irrigation, drainage, hardscapes, outdoor living, lighting, maintenance, landscaping, turf, seasonal service, commercial, HOA, estate, design, and tree/brush care.
          </p>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {platformPillars.map((pillar) => (
            <Link
              key={pillar.slug}
              href={`/${pillar.slug}`}
              className="group rounded-2xl border border-stone-200 bg-white p-4 transition-all hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg"
            >
              <h3 className="font-extrabold leading-tight text-stone-950 group-hover:text-forest-700">{pillar.label}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-600">{pillar.subheadline}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mb-10 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          aria-pressed={activeCategory === null}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeCategory === null ? "bg-forest-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
        >
          All Services
        </button>
        {categoryOrder.map(cat => {
          if (!servicesByCategory[cat]) return null;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              aria-pressed={activeCategory === cat}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeCategory === cat ? "bg-forest-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
            >
              {categoryLabels[cat] ?? cat}
            </button>
          );
        })}
      </div>

      <div className="space-y-16">
        {sortedEntries.map(([cat, list]) => {
          const meta = categoryMeta[cat] || { icon: Flower2, description: "", tagline: "" };
          const Icon = meta.icon;
          return (
            <section key={cat}>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-white text-forest-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-stone-900">{categoryLabels[cat] ?? cat}</h2>
                  <p className="text-stone-500 text-sm">{meta.tagline}</p>
                </div>
              </div>
              <p className="text-stone-500 text-sm mb-6 ml-[52px]">{meta.description}</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(list as Service[]).map(s => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group p-5 rounded-xl border border-stone-200 bg-white hover:border-forest-300 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold text-stone-900 group-hover:text-forest-600 transition-colors text-sm">{s.name}</h3>
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2">{s.quickSummary}</p>
                    {s.pricingBand && (
                      <div className="text-xs text-forest-600 font-bold mt-2">
                        ${s.pricingBand.min} – ${s.pricingBand.max}
                        <span className="text-stone-400 font-normal"> / {s.pricingBand.unit.replace("_", " ")}</span>
                      </div>
                    )}
                    <span className="text-forest-600 text-xs font-semibold mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn More <ArrowRight className="w-3 h-3" />
                    </span>
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

      <section className="mt-16 rounded-2xl bg-forest-600 p-6 text-center sm:p-10">
        <h2 className="text-2xl font-extrabold text-white mb-3">Not Sure What You Need?</h2>
        <p className="text-forest-100 mb-6">
          Send us your outdoor list or text photos — we will recommend the right next step.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/quick-quote"
            className="inline-flex items-center gap-2 bg-white text-forest-700 px-8 py-3 rounded-lg font-bold hover:bg-forest-50 transition-colors"
          >
            Get a Quick Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`sms:${PHONE}`}
            className="inline-flex items-center gap-2 bg-forest-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-forest-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Text Us Photos
          </a>
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center gap-2 bg-forest-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-forest-800 transition-colors border border-forest-500"
          >
            <Phone className="w-4 h-4" />
            (704) 886-4240
          </a>
        </div>
      </section>
    </Layout>
  );
}
