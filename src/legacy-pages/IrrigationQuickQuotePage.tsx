import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeServiceSchema, makeFaqSchema, makeBreadcrumbSchema } from "../components/PageSeo";
import {
  Droplets, Phone, Camera, CheckCircle2, ArrowRight,
  ChevronRight, Clock3, ShieldCheck, MapPin, AlertTriangle,
  BadgeCheck, ClipboardList, FileCheck
} from "lucide-react";

const PHONE = "+17048864240";

const problemTypes = [
  { id: "broken-head", label: "Broken / Leaking Head", icon: "💧" },
  { id: "dry-spot", label: "Dry Spots", icon: "🏜️" },
  { id: "zone-issue", label: "Zone Won't Turn On/Off", icon: "⚡" },
  { id: "timer-issue", label: "Controller / Timer Problem", icon: "🕐" },
  { id: "low-pressure", label: "Low Water Pressure", icon: "📉" },
  { id: "high-bill", label: "High Water Bill", icon: "💰" },
  { id: "new-system", label: "Need New System", icon: "🆕" },
  { id: "upgrade", label: "Upgrade Existing System", icon: "⬆️" },
  { id: "winterize", label: "Winterization / Blowout", icon: "❄️" },
  { id: "spring-start", label: "Spring Startup", icon: "🌱" },
  { id: "other", label: "Something Else", icon: "🔧" },
];

const systemTypes = [
  "I don't know", "Rain Bird", "Hunter", "Weathermatic", "Rachio (Smart)",
  "Orbit", "Toro", "Other / Custom"
];

const zones = [
  "1-3 zones", "4-6 zones", "7-10 zones", "11+ zones", "Not sure"
];

const trustItems = [
  { icon: BadgeCheck, title: "Licensed", detail: "Residential and commercial irrigation work" },
  { icon: ShieldCheck, title: "Insured", detail: "Crews prepared for repair and installation" },
  { icon: Camera, title: "Photo-Documented", detail: "Text photos for faster issue review" },
  { icon: ClipboardList, title: "Structured Process", detail: "Diagnosis, quote, approval, repair" },
];

const irrigationFaqs = [
  {
    q: "How do I know if my sprinkler system needs repair?",
    a: "Common signs include dry spots, water shooting in wrong directions, stuck heads, pooling water, or zones not turning on.",
  },
  {
    q: "Can you repair any irrigation brand?",
    a: "Yes. We work with Hunter, Rain Bird, Weathermatic, Irritrol, and most other residential and commercial brands.",
  },
  {
    q: "Do you install smart controllers?",
    a: "Yes. We install and configure Rachio, Hunter Hydrawise, Rain Bird LNK2, and other WiFi-enabled controllers.",
  },
  {
    q: "How much does sprinkler repair cost?",
    a: "Simple repairs like head replacement start around $75-150. More complex issues like valve or wiring repair range higher. We quote before any work.",
  },
  {
    q: "Do you offer seasonal startup and winterization?",
    a: "Yes. We offer spring startup, fall winterization, and mid-season checks as part of our irrigation maintenance plans.",
  },
];

export default function IrrigationQuickQuotePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    problem: "",
    systemType: "",
    zoneCount: "",
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const canNext = () => {
    if (step === 0) return !!form.problem;
    if (step === 1) return !!form.systemType && !!form.zoneCount;
    if (step === 2) return !!form.name && !!form.phone;
    return true;
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <Layout>
        <PageSeo
          title="Irrigation Quick Quote — Sprinkler Repair & Installation"
          description="Get a fast irrigation quote for sprinkler repair, controller upgrades, new installs, startup, or winterization across the Charlotte metro area."
          canonical="/irrigation-quick-quote"
          jsonLd={[
            makeServiceSchema("Irrigation Quick Quote", "Fast quote request service for sprinkler repair, irrigation upgrades, smart controllers, seasonal service, and new irrigation installations.", "/irrigation-quick-quote"),
            makeFaqSchema(irrigationFaqs),
            makeBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Irrigation Quick Quote" },
            ]),
          ]}
        />
        <Breadcrumbs items={[{ label: "Irrigation Quick Quote" }]} />
        <main role="main" className="max-w-2xl mx-auto py-20 text-center">
          <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-forest-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-4">Irrigation Quote on the Way</h1>
          <p className="text-lg text-stone-600 mb-2">Thanks, {form.name}! We&apos;ll review your irrigation issue and call you back shortly.</p>
          <p className="text-stone-500 mb-8">Most irrigation quotes are ready same-day.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-6 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">
              <Phone className="w-4 h-4" /> Call (704) 886-4240
            </a>
            <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-bold text-white transition-colors hover:bg-amber-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">
              <Camera className="w-4 h-4" /> Text Photos
            </a>
          </div>
          <div className="mt-8">
            <Link href="/" className="font-semibold text-forest-600 transition-colors hover:text-forest-700 hover:underline focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">← Back to Home</Link>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageSeo
        title="Irrigation Quick Quote — Sprinkler Repair & Installation"
        description="Get a fast irrigation quote for sprinkler repair, controller upgrades, new installs, startup, or winterization across the Charlotte metro area."
        canonical="/irrigation-quick-quote"
        jsonLd={[
          makeServiceSchema("Irrigation Quick Quote", "Fast quote request service for sprinkler repair, irrigation upgrades, smart controllers, seasonal service, and new irrigation installations.", "/irrigation-quick-quote"),
          makeFaqSchema(irrigationFaqs),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Irrigation Quick Quote" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Irrigation Quick Quote" }]} />

      <main role="main" className="max-w-6xl mx-auto">
        <section aria-label="Irrigation quote hero" className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-100">
              <Droplets className="h-7 w-7 text-forest-600" />
            </div>
            <span className="inline-flex items-center rounded-full border border-forest-200 bg-forest-50 px-4 py-1 text-sm font-semibold text-forest-700">
              Sprinkler repair, upgrades, and installs
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-stone-900 md:text-5xl">Irrigation Quick Quote</h1>
            <p className="mt-4 text-lg text-stone-600 md:text-xl">Tell us what your sprinkler system is doing, what brand you have, and how many zones you manage. We&apos;ll respond with a practical next step and estimate direction.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-6 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Phone className="h-4 w-4" /> Call for Immediate Irrigation Help</a>
              <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-6 py-3 font-bold text-amber-800 transition-colors hover:bg-amber-100 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Camera className="h-4 w-4" /> Text Photos of Heads or Controller</a>
            </div>
          </div>
        </section>

        <section aria-label="Trust signals" className="pb-20">
          <div className="grid grid-cols-1 gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-4 md:p-8">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4">
                <div className="rounded-xl bg-forest-100 p-2 text-forest-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-stone-900">{item.title}</h2>
                  <p className="mt-1 text-sm text-stone-600">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Irrigation quick quote form" className="pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 flex items-center justify-center gap-2" aria-label="Irrigation quote progress">
              {["Problem", "System", "Contact"].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i <= step ? "bg-forest-600 text-white" : "bg-stone-200 text-stone-500"}`}>{i + 1}</div>
                  <span className={`hidden text-sm font-semibold sm:inline ${i <= step ? "text-forest-600" : "text-stone-400"}`}>{label}</span>
                  {i < 2 && <ChevronRight className="h-4 w-4 text-stone-300" />}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-10">
              {step === 0 && (
                <section aria-label="Irrigation problem selection">
                  <h2 className="text-2xl font-bold text-stone-900 mb-1">What&apos;s the irrigation issue?</h2>
                  <p className="mb-6 text-stone-500">Select the problem that best matches your situation.</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {problemTypes.map((pt) => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => update("problem", pt.id)}
                        className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.problem === pt.id ? "border-forest-500 bg-forest-50" : "border-stone-200 hover:border-stone-300"}`}
                      >
                        <span className="text-xl">{pt.icon}</span>
                        <h3 className="text-sm font-semibold text-stone-800">{pt.label}</h3>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-xs text-amber-800">Active flooding or burst pipe? <a href={`tel:${PHONE}`} className="font-bold underline transition-colors hover:text-amber-900 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">Call us now</a> instead of filling out this form.</p>
                  </div>
                </section>
              )}

              {step === 1 && (
                <section aria-label="Irrigation system details" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-1">About your system</h2>
                    <p className="text-stone-500">This helps us prepare the right equipment and common replacement parts.</p>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-stone-800">What brand is your system?</h3>
                    <div className="flex flex-wrap gap-2">
                      {systemTypes.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => update("systemType", st)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.systemType === st ? "border-forest-600 bg-forest-600 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-forest-300"}`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-stone-800">How many zones?</h3>
                    <div className="flex flex-wrap gap-2">
                      {zones.map((z) => (
                        <button
                          key={z}
                          type="button"
                          onClick={() => update("zoneCount", z)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.zoneCount === z ? "border-forest-600 bg-forest-600 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-forest-300"}`}
                        >
                          {z}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section aria-label="Irrigation contact information" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-1">Your info</h2>
                    <p className="text-stone-500">We&apos;ll call or text you back with an irrigation estimate.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="irrigation-quote-name" className="mb-1 block text-sm font-semibold text-stone-700">Name *</label>
                      <input id="irrigation-quote-name" type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="irrigation-quote-phone" className="mb-1 block text-sm font-semibold text-stone-700">Phone *</label>
                      <input id="irrigation-quote-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="(704) 555-0000" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="irrigation-quote-address" className="mb-1 block text-sm font-semibold text-stone-700">Property Address</label>
                    <input id="irrigation-quote-address" type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="123 Main St, Harrisburg NC" />
                  </div>
                  <div>
                    <label htmlFor="irrigation-quote-notes" className="mb-1 block text-sm font-semibold text-stone-700">Additional Details</label>
                    <textarea id="irrigation-quote-notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} className="w-full resize-none rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="When does it happen? Which zones? Any recent changes?" />
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-forest-200 bg-forest-50 p-4">
                    <Camera className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-forest-800">Text photos of the problem</h3>
                      <p className="text-xs text-forest-700">Send photos of broken heads, dry spots, or your controller to <a href={`sms:${PHONE}`} className="font-bold underline transition-colors hover:text-forest-900 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">(704) 886-4240</a>.</p>
                    </div>
                  </div>
                </section>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="text-sm font-semibold text-stone-500 transition-colors hover:text-stone-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">← Back</button>
                ) : <div />}
                {step < 2 ? (
                  <button type="button" onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-colors focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${canNext() ? "bg-forest-600 text-white hover:bg-forest-700" : "cursor-not-allowed bg-stone-200 text-stone-400"}`}>
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} className="flex items-center gap-2 rounded-lg bg-forest-600 px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">
                    Get My Irrigation Quote <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Response highlights" className="pb-20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Clock3, label: "Same-day irrigation quote review" },
              { icon: ShieldCheck, label: "Free quote before any repair" },
              { icon: MapPin, label: "Charlotte metro irrigation coverage" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm text-stone-600 shadow-sm">
                <item.icon className="h-4 w-4 text-forest-600" />
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Irrigation FAQ" className="pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-stone-900">Irrigation answers homeowners ask first</h2>
              <p className="mt-3 text-stone-600">Built to support search visibility, voice answers, and faster quote decisions.</p>
            </div>
            <AeoBlock
              question="How do I know if my sprinkler system needs repair?"
              shortAnswer="Common signs include dry spots, water shooting in wrong directions, stuck heads, pooling water, or zones not turning on."
              commonCauses={["Broken or clogged spray heads", "Valve or wiring failures", "Pressure loss or underground leaks"]}
              whenToCall="Call when zones stop responding, water is running continuously, or you notice water waste or landscape stress."
              whatToDoNext="Select the issue type above, then text photos of the affected area or controller for faster diagnosis."
              relatedQuestions={["Can you repair any irrigation brand?", "How much does sprinkler repair cost?"]}
              showSchema={false}
            />
            <AeoBlock
              question="Can you repair any irrigation brand?"
              shortAnswer="Yes. We work with Hunter, Rain Bird, Weathermatic, Irritrol, and most other residential and commercial brands."
              commonCauses={["Older controller replacements", "Mixed-brand repairs on legacy systems", "Commercial properties with custom setups"]}
              whenToCall="Call if you are unsure what brand you have or if parts have already been replaced by another contractor."
              whatToDoNext="Send a controller photo, valve box photo, or close-up of the damaged head so we can identify likely parts."
              relatedQuestions={["Do you install smart controllers?", "How do I know if my sprinkler system needs repair?"]}
              showSchema={false}
            />
            <AeoBlock
              question="Do you install smart controllers?"
              shortAnswer="Yes. We install and configure Rachio, Hunter Hydrawise, Rain Bird LNK2, and other WiFi-enabled controllers."
              commonCauses={["Need mobile control", "Want weather-based scheduling", "Replacing older timer systems"]}
              whenToCall="Call when you want to upgrade control, reduce water use, or replace a failing timer."
              whatToDoNext="Choose controller or timer problem in the form and note whether you want repair, replacement, or a smart upgrade."
              relatedQuestions={["Can you repair any irrigation brand?", "Do you offer seasonal startup and winterization?"]}
              showSchema={false}
            />
            <AeoBlock
              question="How much does sprinkler repair cost?"
              shortAnswer="Simple repairs like head replacement start around $75-150. More complex issues like valve or wiring repair range higher. We quote before any work."
              commonCauses={["Simple part swaps cost less", "Valve and wire tracing takes more time", "Multiple zone issues increase labor and materials"]}
              whenToCall="Call when water is actively running, a zone is stuck on, or you suspect a hidden leak."
              whatToDoNext="Submit your quote request with notes about the symptoms, then text photos so we can narrow the likely repair range."
              relatedQuestions={["How do I know if my sprinkler system needs repair?", "Can you repair any irrigation brand?"]}
              showSchema={false}
            />
            <AeoBlock
              question="Do you offer seasonal startup and winterization?"
              shortAnswer="Yes. We offer spring startup, fall winterization, and mid-season checks as part of our irrigation maintenance plans."
              commonCauses={["Seasonal shutdown protection", "Spring leaks after reactivation", "Routine performance tuning"]}
              whenToCall="Call before freezing weather, early in spring startup season, or if you want a recurring irrigation maintenance plan."
              whatToDoNext="Use this form to tell us whether you need startup, winterization, or ongoing irrigation maintenance."
              relatedQuestions={["Do you install smart controllers?", "How much does sprinkler repair cost?"]}
              showSchema={false}
            />
          </div>
        </section>

        <section aria-label="Final irrigation quote call to action" className="pb-24">
          <div className="max-w-4xl mx-auto rounded-3xl bg-stone-900 px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-extrabold">Need help before your lawn or beds get worse?</h2>
            <p className="mt-3 text-stone-300">Send the problem, the brand, and a few photos. We&apos;ll help you move from symptoms to scope quickly.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-6 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"><Phone className="h-4 w-4" /> Call (704) 886-4240</a>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-stone-600 px-6 py-3 font-bold text-white transition-colors hover:bg-stone-800 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"><FileCheck className="h-4 w-4" /> Contact the Team</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
