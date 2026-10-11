'use client';

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Layout from "../../../src/components/Layout";
import Breadcrumbs from "../../../src/components/Breadcrumbs";
import PageHero from "../../../src/components/PageHero";
import AeoBlock from "../../../src/components/AeoBlock";
import { locationsFull } from "../../../data/locations_full";
import { services } from "../../../data/services";
import {
  Phone, MapPin, CheckCircle2, ArrowRight, Droplets, ShieldCheck, Clock,
  MessageSquare, Camera
} from "lucide-react";

const PHONE = "+17048864240";

export default function AreaClient() {
  const params = useParams();
  const locationSlug = params.locationSlug as string;
  const loc = useMemo(() => locationsFull.find(l => l.slug === locationSlug), [locationSlug]);

  if (!loc) {
    return (
      <Layout>
        <PageHero title="Location not found" subtitle="We couldn't find the area you're looking for." />
        <Link href="/areas-we-serve" className="text-forest-600 font-bold hover:underline" prefetch={false}>Back to all areas</Link>
      </Layout>
    );
  }

  const neighboringTowns = loc.neighbors
    ? locationsFull.filter(n => loc.neighbors?.includes(n.slug)).slice(0, 6)
    : [];

  const zoneLabel = loc.ring === 0 ? "Core Service Area" : loc.ring === 1 ? "Greater Charlotte Metro" : "Extended Metro";

  const faq = [
    { q: `Do you provide irrigation services in ${loc.name}?`, a: `Yes. Elite Irrigation & Landscaping provides sprinkler repair, irrigation installation, drainage solutions, and full landscaping services to ${loc.name}, ${loc.state} homeowners and businesses.` },
    { q: `How far is ${loc.name} from your headquarters?`, a: `We are headquartered in Harrisburg, NC. ${loc.ring === 0 ? loc.name + " is in our core service area — we have crews nearby daily." : loc.ring === 1 ? "We service the greater Charlotte area daily, including " + loc.name + "." : loc.name + " is in our extended service area. We schedule visits regularly throughout the week."}` },
    { q: `What does a free estimate include?`, a: `A free estimate includes a visit to your ${loc.name} property, a thorough assessment of your needs, and a detailed written quote with tiered options when applicable. No obligation.` },
    { q: `Are you licensed to work in ${loc.name}?`, a: `Yes. We hold an NC Irrigation Contractor License (NCICLB) and carry liability insurance. We are fully authorized to perform irrigation, landscaping, and hardscaping work in ${loc.name} and throughout North Carolina.` },
    { q: `Do you offer priority sprinkler repair in ${loc.name}?`, a: `Yes. We prioritize urgent sprinkler and irrigation issues during business hours. ${loc.ring <= 1 ? "We can typically get to " + loc.name + " quickly for priority repairs." : "We schedule priority repairs in " + loc.name + " as soon as our calendar allows."}` },
  ];

  const irrigationServices = services.filter(s => s.category === "Irrigation").slice(0, 6);
  const drainageServices = services.filter(s => s.category === "Drainage").slice(0, 4);
  const outdoorServices = services.filter(s => ["Hardscape", "OutdoorLiving", "Lighting"].includes(s.category)).slice(0, 6);
  const maintenanceServices = services.filter(s => ["Maintenance", "Turf", "Seasonal"].includes(s.category)).slice(0, 4);

  return (
    <Layout>
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Service Areas", href: "/areas-we-serve" },
        { label: loc.name },
      ]} />

      <PageHero
        title={`Irrigation & Landscaping in ${loc.name}, ${loc.state}`}
        subtitle={`Sprinkler repair, irrigation systems, drainage solutions, and professional landscaping for ${loc.name} residential and commercial properties.`}
        chips={[zoneLabel, loc.countyHint || "", ...(loc.tags || [])].filter(Boolean)}
      />

      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: ShieldCheck, label: "NCICLB Licensed" },
          { icon: Camera, label: "Photo-Documented" },
          { icon: CheckCircle2, label: "Free Estimates" },
          { icon: MapPin, label: zoneLabel },
        ].map(t => (
          <div key={t.label} className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3">
            <t.icon className="w-4 h-4 text-forest-600 shrink-0" />
            <span className="text-xs font-bold text-stone-700">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3 xl:gap-10">
        <div className="lg:col-span-2 space-y-12">

          <section className="rounded-2xl border border-forest-100 bg-white p-5 sm:p-8">
            <h2 className="text-xl font-extrabold text-stone-900 mb-3">
              {loc.name}'s Irrigation & Landscaping Contractor
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              {loc.name} property owners trust Elite Irrigation & Landscaping for reliable, professional outdoor services.
              As a locally owned company based in Harrisburg, we understand the soil conditions, climate challenges,
              and neighborhood aesthetics unique to the {loc.name} area.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Residential", "HOA", "Commercial", "Multifamily", "Builder"].map((t) => (
                <span key={t} className="text-xs bg-white text-forest-700 px-3 py-1.5 rounded-full font-medium border border-forest-200">
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-stone-900 mb-6">Irrigation Services in {loc.name}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {irrigationServices.map(s => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group p-5 rounded-xl border-2 border-forest-200 bg-white hover:border-forest-400 hover:shadow-lg transition-all"
                >
                  <h3 className="font-bold text-stone-900 group-hover:text-forest-600 transition-colors text-sm">{s.name}</h3>
                  <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">{s.quickSummary}</p>
                  {s.isEmergencyCapable && (
                    <span className="inline-block mt-2 text-[10px] font-bold bg-white text-forest-600 px-2 py-0.5 rounded-full">Priority Repair</span>
                  )}
                  <span className="text-forest-600 text-xs font-semibold mt-2 inline-flex items-center gap-1">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {drainageServices.length > 0 && (
            <section>
              <h2 className="text-xl font-extrabold text-stone-900 mb-6">Drainage Solutions in {loc.name}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {drainageServices.map(s => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group p-5 rounded-xl border border-forest-200 bg-white hover:border-forest-400 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold text-stone-900 group-hover:text-forest-600 transition-colors text-sm">{s.name}</h3>
                    <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">{s.quickSummary}</p>
                    <span className="text-forest-600 text-xs font-semibold mt-2 inline-flex items-center gap-1">
                      Learn More <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {outdoorServices.length > 0 && (
            <section>
              <h2 className="text-xl font-extrabold text-stone-900 mb-6">Outdoor Living & Hardscapes in {loc.name}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {outdoorServices.map(s => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group p-5 rounded-xl border border-stone-200 bg-white hover:border-forest-300 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold text-stone-900 group-hover:text-forest-600 transition-colors text-sm">{s.name}</h3>
                    <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">{s.quickSummary}</p>
                    <span className="text-forest-600 text-xs font-semibold mt-2 inline-flex items-center gap-1">
                      Learn More <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/services" className="text-forest-600 text-sm font-semibold mt-4 inline-flex items-center gap-1 hover:underline">
                View all services <ArrowRight className="w-3 h-3" />
              </Link>
            </section>
          )}

          {maintenanceServices.length > 0 && (
            <section>
              <h2 className="text-xl font-extrabold text-stone-900 mb-6">Maintenance & Turf in {loc.name}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {maintenanceServices.map(s => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group p-5 rounded-xl border border-stone-200 bg-white hover:border-forest-300 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold text-stone-900 group-hover:text-forest-600 transition-colors text-sm">{s.name}</h3>
                    <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">{s.quickSummary}</p>
                    <span className="text-forest-600 text-xs font-semibold mt-2 inline-flex items-center gap-1">
                      Learn More <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {neighboringTowns.length > 0 && (
            <section>
              <h2 className="text-xl font-extrabold text-stone-900 mb-4">Also Serving Near {loc.name}</h2>
              <div className="flex flex-wrap gap-2">
                {neighboringTowns.map(n => (
                  <Link
                    key={n.slug}
                    href={`/areas/${n.slug}`}
                    className="px-4 py-2.5 text-sm text-stone-600 border border-stone-200 hover:border-forest-400 hover:text-forest-700 hover:bg-forest-50 bg-white transition-all rounded-lg"
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl bg-forest-900 p-5 text-white sm:p-8">
            <h2 className="text-xl font-extrabold text-white mb-6">Why {loc.name} Chooses Elite</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: ShieldCheck, label: "NC Licensed Contractor (NCICLB)", detail: "State-licensed irrigation contractor with liability insurance" },
                { icon: Camera, label: "Photo-Documented Service", detail: "Before, during, and after photos on every visit" },
                { icon: MapPin, label: `${zoneLabel}`, detail: `Harrisburg, NC headquarters — serving ${loc.name} and the greater Charlotte area` },
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

          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-stone-900">Common Questions About {loc.name}</h2>
            {faq.map(f => (
              <AeoBlock key={f.q} question={f.q} shortAnswer={f.a} showSchema={false} />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="sticky top-24 rounded-2xl bg-forest-600 p-5 text-white sm:p-6">
            <h3 className="font-bold text-lg mb-2">Free Estimate in {loc.name}</h3>
            <p className="text-forest-100 text-sm mb-5">
              Get a free, no-obligation quote for your {loc.name} property. Most estimates returned within one business day.
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
              Request Online
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-5 pt-4 border-t border-forest-500">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-forest-200" />
                <h4 className="font-bold text-white text-sm">Text Us Photos</h4>
              </div>
              <p className="text-forest-200 text-xs mb-3">
                Send a photo of the issue. Most problems are easier to quote when we can see them.
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
                {["Residential", "HOA", "Multifamily", "Commercial", "Builder"].map((t) => (
                  <span key={t} className="text-[10px] font-semibold bg-white/15 text-white px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-forest-500 text-xs text-forest-200 space-y-1">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> NC Licensed (NCICLB)</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Free Estimates</div>
              {loc.ring <= 1 && <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Priority Repair Available</div>}
              <div className="flex items-center gap-1.5"><Camera className="w-3 h-3" /> Photo-Documented</div>
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm mb-2">Response Time</h4>
            <div className="text-2xl font-extrabold text-forest-600">
              {loc.ring === 0 ? "Same Day" : loc.ring === 1 ? "1–2 Business Days" : "2–3 Business Days"}
            </div>
            <p className="text-xs text-stone-500 mt-1">typical estimate turnaround for {loc.name}</p>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
