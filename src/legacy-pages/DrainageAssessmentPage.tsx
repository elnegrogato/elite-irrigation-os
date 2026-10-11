import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeServiceSchema, makeFaqSchema, makeBreadcrumbSchema } from "../components/PageSeo";
import {
  Waves, Phone, Camera, CheckCircle2, ArrowRight,
  ChevronRight, Clock3, ShieldCheck, MapPin, AlertTriangle,
  Home, Droplets, Layers, BadgeCheck, ClipboardList, FileCheck
} from "lucide-react";

const PHONE = "+17048864240";

const waterLocations = [
  { id: "yard", label: "Yard / lawn area", icon: Home },
  { id: "foundation", label: "Near foundation", icon: AlertTriangle },
  { id: "patio", label: "Patio area", icon: Layers },
  { id: "driveway", label: "Driveway", icon: Home },
  { id: "pool", label: "Pool area", icon: Droplets },
  { id: "walkway", label: "Walkway / path", icon: Home },
  { id: "basement", label: "Basement / crawlspace", icon: AlertTriangle },
  { id: "downspout", label: "Downspout area", icon: Waves },
];

const trustItems = [
  { icon: BadgeCheck, title: "Licensed", detail: "Drainage diagnosis and solution planning" },
  { icon: ShieldCheck, title: "Insured", detail: "Protected residential and site work" },
  { icon: Camera, title: "Photo-Documented", detail: "Water patterns and site conditions captured" },
  { icon: ClipboardList, title: "Structured Process", detail: "Assessment, recommendation, quote, install" },
];

const drainageFaqs = [
  {
    q: "What does a drainage assessment include?",
    a: "We inspect water flow patterns, identify problem areas, check existing drainage, evaluate soil and grading, and provide a written assessment with recommendations.",
  },
  {
    q: "Is the drainage assessment free?",
    a: "Yes. The initial assessment is free. If work is needed, we provide a clear quote before starting.",
  },
  {
    q: "How long does an assessment take?",
    a: "Most residential assessments take 30-60 minutes on site. Larger commercial properties may take longer.",
  },
  {
    q: "What drainage solutions do you offer?",
    a: "French drains, surface drains, channel drains, downspout extensions, grading, retaining walls, dry wells, and erosion control.",
  },
  {
    q: "When should I get a drainage assessment?",
    a: "If you see standing water 24+ hours after rain, soggy ground, erosion, water near your foundation, or basement moisture.",
  },
];

export default function DrainageAssessmentPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    locations: [] as string[],
    afterEveryRain: "",
    duration: "",
    erosion: "",
    propertyType: "",
    town: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleLoc = (id: string) => {
    setForm((f) => ({
      ...f,
      locations: f.locations.includes(id) ? f.locations.filter((l) => l !== id) : [...f.locations, id],
    }));
  };
  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  if (submitted) {
    return (
      <Layout>
        <PageSeo
          title="Drainage Assessment — Standing Water & Yard Drainage Solutions"
          description="Request a free drainage assessment for standing water, soggy yards, foundation runoff, erosion, and poor grading across the Charlotte metro area."
          canonical="/drainage-assessment"
          jsonLd={[
            makeServiceSchema("Drainage Assessment", "Drainage diagnosis and solution planning for standing water, erosion, runoff, and grading issues.", "/drainage-assessment"),
            makeFaqSchema(drainageFaqs),
            makeBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Drainage Assessment" },
            ]),
          ]}
        />
        <Breadcrumbs items={[{ label: "Drainage Assessment" }]} />
        <main role="main" className="max-w-2xl mx-auto py-20 text-center">
          <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-forest-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-4">Drainage Assessment Requested</h1>
          <p className="text-lg text-stone-600 mb-2">Thanks, {form.name}! We&apos;ll review your drainage situation and reach out to discuss solutions.</p>
          <p className="text-stone-500 mb-8">Common solutions include French drains, catch basins, grading, and downspout extensions.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-8 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Phone className="w-4 h-4" /> Call (704) 886-4240</a>
            <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-3 font-bold text-white transition-colors hover:bg-amber-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Camera className="w-4 h-4" /> Text Photos</a>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageSeo
        title="Drainage Assessment — Standing Water & Yard Drainage Solutions"
        description="Request a free drainage assessment for standing water, soggy yards, foundation runoff, erosion, and poor grading across the Charlotte metro area."
        canonical="/drainage-assessment"
        jsonLd={[
          makeServiceSchema("Drainage Assessment", "Drainage diagnosis and solution planning for standing water, erosion, runoff, and grading issues.", "/drainage-assessment"),
          makeFaqSchema(drainageFaqs),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Drainage Assessment" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Drainage Assessment" }]} />

      <main role="main" className="max-w-6xl mx-auto">
        <section aria-label="Drainage assessment hero" className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">
              <Waves className="h-7 w-7 text-cyan-600" />
            </div>
            <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-sm font-semibold text-cyan-800">
              Free standing-water and runoff assessment
            </span>
            <h1 className="mt-5 text-4xl font-extrabold text-stone-900 md:text-5xl">Standing Water, Soggy Yard, or Drainage Problem?</h1>
            <p className="mt-4 text-lg text-stone-600 max-w-3xl mx-auto">Elite helps Charlotte-area homeowners, HOAs, and commercial properties identify outdoor water-flow problems and recommend drainage solutions before they lead to bigger landscape or foundation issues.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-6 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Phone className="h-4 w-4" /> Call for Drainage Help</a>
              <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-6 py-3 font-bold text-amber-800 transition-colors hover:bg-amber-100 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Camera className="h-4 w-4" /> Text Photos of Water Patterns</a>
            </div>
          </div>
        </section>

        <section aria-label="Trust signals" className="pb-20">
          <div className="grid grid-cols-1 gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-4 md:p-8">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4">
                <div className="rounded-xl bg-forest-100 p-2 text-forest-700"><item.icon className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-stone-900">{item.title}</h2>
                  <p className="mt-1 text-sm text-stone-600">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Drainage assessment form" className="pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 flex items-center justify-center gap-2" aria-label="Drainage assessment progress">
              {["Water Location", "Details", "Contact"].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i <= step ? "bg-forest-600 text-white" : "bg-stone-200 text-stone-500"}`}>{i + 1}</div>
                  <span className={`hidden text-sm font-semibold sm:inline ${i <= step ? "text-forest-600" : "text-stone-400"}`}>{label}</span>
                  {i < 2 && <ChevronRight className="h-4 w-4 text-stone-300" />}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-10">
              {step === 0 && (
                <section aria-label="Water collection areas">
                  <h2 className="text-2xl font-bold text-stone-900 mb-1">Where is water collecting?</h2>
                  <p className="mb-6 text-stone-500">Select all that apply.</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {waterLocations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => toggleLoc(loc.id)}
                        className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.locations.includes(loc.id) ? "border-forest-500 bg-forest-50" : loc.id === "foundation" || loc.id === "basement" ? "border-amber-200 bg-amber-50/50 hover:border-amber-300" : "border-stone-200 hover:border-stone-300"}`}
                      >
                        <loc.icon className={`h-5 w-5 shrink-0 ${form.locations.includes(loc.id) ? "text-forest-600" : "text-stone-400"}`} />
                        <h3 className="text-sm font-semibold text-stone-800">{loc.label}</h3>
                        {(loc.id === "foundation" || loc.id === "basement") && (
                          <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">PRIORITY</span>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {step === 1 && (
                <section aria-label="Drainage issue details" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-1">More about the water issue</h2>
                    <p className="text-stone-500">These details help us recommend the right drainage solution.</p>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-stone-800">Does it happen after every rain?</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Every rain", "Only heavy rain", "Takes days to drain", "Constantly wet"
                      ].map((opt) => (
                        <button key={opt} type="button" onClick={() => update("afterEveryRain", opt)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.afterEveryRain === opt ? "border-forest-600 bg-forest-600 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-forest-300"}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-stone-800">How long does water stay?</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Hours", "1-2 days", "3-5 days", "Over a week", "Constant"
                      ].map((opt) => (
                        <button key={opt} type="button" onClick={() => update("duration", opt)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.duration === opt ? "border-forest-600 bg-forest-600 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-forest-300"}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-stone-800">Visible erosion?</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Yes", "No", "Not sure"].map((opt) => (
                        <button key={opt} type="button" onClick={() => update("erosion", opt)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.erosion === opt ? "border-forest-600 bg-forest-600 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-forest-300"}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-stone-800">Property type</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Residential", "HOA", "Commercial", "Multifamily", "Church / School"].map((opt) => (
                        <button key={opt} type="button" onClick={() => update("propertyType", opt)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.propertyType === opt ? "border-forest-600 bg-forest-600 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-forest-300"}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="drainage-town" className="mb-1 block text-sm font-semibold text-stone-700">Town / Location</label>
                    <input id="drainage-town" type="text" value={form.town} onChange={(e) => update("town", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="Harrisburg, Concord, Charlotte..." />
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <Camera className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-amber-800">Text photos of the water problem</h3>
                      <p className="text-xs text-amber-700">Standing water, erosion, wet areas — text to <a href={`sms:${PHONE}`} className="font-bold underline transition-colors hover:text-amber-900 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">(704) 886-4240</a>.</p>
                    </div>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section aria-label="Drainage contact information" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-1">Your contact info</h2>
                    <p className="text-stone-500">We&apos;ll review your drainage situation and reach out with recommendations.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="drainage-name" className="mb-1 block text-sm font-semibold text-stone-700">Name *</label>
                      <input id="drainage-name" type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="drainage-phone" className="mb-1 block text-sm font-semibold text-stone-700">Phone *</label>
                      <input id="drainage-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="(704) 555-0000" />
                    </div>
                    <div>
                      <label htmlFor="drainage-email" className="mb-1 block text-sm font-semibold text-stone-700">Email</label>
                      <input id="drainage-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="you@email.com" />
                    </div>
                    <div>
                      <label htmlFor="drainage-notes" className="mb-1 block text-sm font-semibold text-stone-700">Additional Notes</label>
                      <input id="drainage-notes" type="text" value={form.notes} onChange={(e) => update("notes", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="Anything else about the drainage..." />
                    </div>
                  </div>
                </section>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6">
                {step > 0 ? <button type="button" onClick={() => setStep(step - 1)} className="text-sm font-semibold text-stone-500 transition-colors hover:text-stone-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">← Back</button> : <div />}
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 0 && form.locations.length > 0) setStep(1);
                      if (step === 1) setStep(2);
                    }}
                    disabled={step === 0 && form.locations.length === 0}
                    className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-colors focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${(step === 0 && form.locations.length > 0) || step === 1 ? "bg-forest-600 text-white hover:bg-forest-700" : "cursor-not-allowed bg-stone-200 text-stone-400"}`}
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="button" onClick={() => form.name && form.phone && setSubmitted(true)} disabled={!form.name || !form.phone} className={`flex items-center gap-2 rounded-lg px-8 py-2.5 text-sm font-bold transition-colors focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.name && form.phone ? "bg-forest-600 text-white hover:bg-forest-700" : "cursor-not-allowed bg-stone-200 text-stone-400"}`}>
                    Request Drainage Assessment <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Response highlights" className="pb-20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Clock3, label: "Fast drainage review and triage" },
              { icon: ShieldCheck, label: "Free initial assessment" },
              { icon: MapPin, label: "Charlotte metro property coverage" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm text-stone-600 shadow-sm">
                <item.icon className="h-4 w-4 text-forest-600" />
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Drainage FAQ" className="pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-stone-900">Drainage questions we answer most often</h2>
              <p className="mt-3 text-stone-600">Built for better search visibility and clearer homeowner decision-making.</p>
            </div>
            <AeoBlock
              question="What does a drainage assessment include?"
              shortAnswer="We inspect water flow patterns, identify problem areas, check existing drainage, evaluate soil and grading, and provide a written assessment with recommendations."
              commonCauses={["Water is moving toward structures", "Existing drains are undersized or clogged", "Grading keeps water trapped in low spots"]}
              whenToCall="Call when water threatens your foundation, creates slip hazards, or causes repeat landscape damage after rain."
              whatToDoNext="Mark where water sits, note how long it lasts, and send photos before your scheduled assessment."
              relatedQuestions={["What drainage solutions do you offer?", "When should I get a drainage assessment?"]}
              showSchema={false}
            />
            <AeoBlock
              question="Is the drainage assessment free?"
              shortAnswer="Yes. The initial assessment is free. If work is needed, we provide a clear quote before starting."
              commonCauses={["Homeowners need diagnosis before committing", "Commercial sites need budget clarity", "Drainage issues often have multiple solution paths"]}
              whenToCall="Call if the problem is causing immediate property damage and you need live guidance now."
              whatToDoNext="Complete the assessment request form, then text a few photos of the affected areas and nearby drainage points."
              relatedQuestions={["How long does an assessment take?", "What does a drainage assessment include?"]}
              showSchema={false}
            />
            <AeoBlock
              question="How long does an assessment take?"
              shortAnswer="Most residential assessments take 30-60 minutes on site. Larger commercial properties may take longer."
              commonCauses={["More drainage zones require more inspection", "Runoff sources may span multiple areas", "Commercial layouts take longer to document"]}
              whenToCall="Call if you need a coordinated site walk with property managers, board members, or maintenance staff."
              whatToDoNext="List all wet areas, note recent rain timing, and be ready to explain where the water starts and where it ends up."
              relatedQuestions={["What does a drainage assessment include?", "What drainage solutions do you offer?"]}
              showSchema={false}
            />
            <AeoBlock
              question="What drainage solutions do you offer?"
              shortAnswer="French drains, surface drains, channel drains, downspout extensions, grading, retaining walls, dry wells, and erosion control."
              commonCauses={["Surface runoff from slope changes", "Overflowing downspouts", "Persistent ponding in compacted areas"]}
              whenToCall="Call when you need help comparing repair options instead of guessing which drain type fits the problem."
              whatToDoNext="Request the assessment, then show us the highest-priority problem spots first so we can recommend the right fix path."
              relatedQuestions={["When should I get a drainage assessment?", "Is the drainage assessment free?"]}
              showSchema={false}
            />
            <AeoBlock
              question="When should I get a drainage assessment?"
              shortAnswer="If you see standing water 24+ hours after rain, soggy ground, erosion, water near your foundation, or basement moisture."
              commonCauses={["Slow drainage after storms", "Runoff collecting near structures", "Repeated soil washout or muddy areas"]}
              whenToCall="Call as soon as you see water near the foundation, crawlspace, basement entry, or other structural risk areas."
              whatToDoNext="Document the issue after the next rain, include how long it lasts, and submit the form so we can review quickly."
              relatedQuestions={["What does a drainage assessment include?", "What drainage solutions do you offer?"]}
              showSchema={false}
            />
          </div>
        </section>

        <section aria-label="Final drainage call to action" className="pb-24">
          <div className="max-w-4xl mx-auto rounded-3xl bg-stone-900 px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-extrabold">Stop guessing why water is staying on your property</h2>
            <p className="mt-3 text-stone-300">Show us where it collects, how long it lasts, and what it threatens. We&apos;ll help you move toward the right drainage fix.</p>
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
