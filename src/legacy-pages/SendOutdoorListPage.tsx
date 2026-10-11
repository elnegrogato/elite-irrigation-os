import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import AeoBlock from "../components/AeoBlock";
import PageSeo, { makeServiceSchema, makeFaqSchema, makeBreadcrumbSchema } from "../components/PageSeo";
import {
  ClipboardList, Phone, Camera, CheckCircle2, ArrowRight,
  ChevronRight, Clock3, ShieldCheck, MapPin, Upload,
  Droplets, Waves, Lightbulb, Trees, Layers, Flame, Zap,
  Building2, AlertTriangle, FileText, BadgeCheck, FileCheck
} from "lucide-react";

const PHONE = "+17048864240";

const intakeCategories = [
  { id: "sprinkler", label: "Sprinkler / Irrigation Issue", icon: Droplets },
  { id: "drainage", label: "Drainage / Standing Water", icon: Waves },
  { id: "french-drain", label: "French Drain Request", icon: Waves },
  { id: "lighting", label: "Outdoor Lighting Issue", icon: Lightbulb },
  { id: "lawn", label: "Lawn / Landscape Issue", icon: Trees },
  { id: "hardscape", label: "Patio / Hardscape Issue", icon: Layers },
  { id: "pool", label: "Pool-Area Issue", icon: Flame },
  { id: "outdoor-living", label: "Outdoor Living Project", icon: Flame },
  { id: "hoa", label: "HOA / Common-Area Complaint", icon: Building2 },
  { id: "commercial", label: "Commercial Property Issue", icon: Building2 },
  { id: "builder-punch", label: "Builder Outdoor Punch List", icon: ClipboardList },
  { id: "realtor", label: "Realtor Pre-Listing List", icon: FileText },
  { id: "storm", label: "Storm Damage / Post-Rain Issue", icon: Zap },
  { id: "maintenance", label: "Maintenance Plan Request", icon: Trees },
  { id: "other", label: "Other Outdoor Issue", icon: AlertTriangle },
];

const urgencyOptions = [
  { value: "active-water", label: "Active water running / emergency" },
  { value: "urgent", label: "Urgent — need help soon" },
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "Within a month" },
  { value: "exploring", label: "Just exploring options" },
];

const contactMethods = ["Phone call", "Text message", "Email", "Any method"];

const trustItems = [
  { icon: BadgeCheck, title: "Licensed", detail: "Outdoor service and project coordination" },
  { icon: ShieldCheck, title: "Insured", detail: "Protected site visits and field work" },
  { icon: Camera, title: "Photo-Documented", detail: "Photos, videos, reports, and notes accepted" },
  { icon: ClipboardList, title: "Structured Process", detail: "List review, follow-up, scope, and quote" },
];

const outdoorListFaqs = [
  {
    q: "What kind of outdoor issues can I send?",
    a: "Anything outside: sprinkler problems, drainage issues, patio damage, lighting outages, landscape needs, erosion, standing water, and more.",
  },
  {
    q: "How do I send my list?",
    a: "Fill out the form on this page, call us, or text photos to (704) 886-4240. We accept descriptions, photos, and videos.",
  },
  {
    q: "What happens after I send my list?",
    a: "We review it, may ask follow-up questions, then provide a clear scope and quote. For urgent issues, we respond within hours.",
  },
  {
    q: "Can I send photos of multiple issues?",
    a: "Yes. Multiple photos of different problems are actually helpful. Just note what each photo shows.",
  },
  {
    q: "Is there a limit to how many issues I can list?",
    a: "No limit. The more complete your list, the more accurate our response will be.",
  },
];

export default function SendOutdoorListPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    category: "",
    urgency: "",
    name: "",
    phone: "",
    email: "",
    town: "",
    propertyType: "",
    description: "",
    contactMethod: "",
    bestTime: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const canNext = () => {
    if (step === 0) return !!form.category;
    if (step === 1) return !!form.urgency && !!form.description;
    if (step === 2) return !!form.name && !!form.phone;
    return true;
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <Layout>
        <PageSeo
          title="Send Us Your Outdoor List"
          description="Send outdoor issue lists, punch lists, irrigation notes, drainage concerns, and property photos to Elite for organized review and next-step guidance."
          canonical="/send-us-your-outdoor-list"
          jsonLd={[
            makeServiceSchema("Outdoor Issue Review Intake", "Structured outdoor issue intake for irrigation, drainage, hardscape, landscape, HOA, maintenance, and property improvement needs.", "/send-us-your-outdoor-list"),
            makeFaqSchema(outdoorListFaqs),
            makeBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Send Us Your Outdoor List" },
            ]),
          ]}
        />
        <Breadcrumbs items={[{ label: "Send Us Your Outdoor List" }]} />
        <main role="main" className="max-w-2xl mx-auto py-20 text-center">
          <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-forest-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-4">Outdoor List Received</h1>
          <p className="text-lg text-stone-600 mb-2">Thanks, {form.name}! We&apos;ll review your outdoor issue and help you choose the right next step.</p>
          <p className="text-stone-500 mb-8">If this is urgent or water is actively running, call us now:</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">
              <Phone className="w-5 h-5" /> Call (704) 886-4240
            </a>
            <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-amber-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">
              <Camera className="w-5 h-5" /> Text Photos
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
        title="Send Us Your Outdoor List"
        description="Send outdoor issue lists, punch lists, irrigation notes, drainage concerns, and property photos to Elite for organized review and next-step guidance."
        canonical="/send-us-your-outdoor-list"
        jsonLd={[
          makeServiceSchema("Outdoor Issue Review Intake", "Structured outdoor issue intake for irrigation, drainage, hardscape, landscape, HOA, maintenance, and property improvement needs.", "/send-us-your-outdoor-list"),
          makeFaqSchema(outdoorListFaqs),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Send Us Your Outdoor List" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Send Us Your Outdoor List" }]} />

      <main role="main" className="max-w-6xl mx-auto">
        <section aria-label="Outdoor list hero" className="py-20">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full border border-forest-200 bg-forest-50 px-4 py-1 text-sm font-semibold text-forest-700">
              Multi-issue outdoor intake for homes, HOAs, and commercial properties
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-stone-900 md:text-6xl">Send Us Your <span className="text-forest-600">Outdoor List</span></h1>
            <p className="mt-4 text-lg text-stone-600 max-w-3xl mx-auto">
              Have a sprinkler issue, drainage problem, outdoor punch list, HOA complaint list, property photos, inspection notes, or maintenance request? Send it to Elite. We&apos;ll help organize the issue, identify the right service path, and recommend the next step.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <a href={`tel:${PHONE}`} className="flex items-center justify-center gap-2 rounded-xl bg-forest-600 px-6 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Phone className="w-5 h-5" /> Call Now</a>
              <a href={`sms:${PHONE}`} className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-bold text-white transition-colors hover:bg-amber-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Camera className="w-5 h-5" /> Text Photos</a>
              <Link href="/quick-quote" className="flex items-center justify-center gap-2 rounded-xl border-2 border-forest-600 bg-white px-6 py-3 font-bold text-forest-700 transition-colors hover:bg-forest-50 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><ClipboardList className="w-5 h-5" /> Quick Quote</Link>
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

        <section aria-label="Outdoor list form" className="pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 flex items-center justify-center gap-2" aria-label="Outdoor list progress">
              {["Your List", "Details", "Contact"].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i <= step ? "bg-forest-600 text-white" : "bg-stone-200 text-stone-500"}`}>{i + 1}</div>
                  <span className={`hidden text-sm font-semibold sm:inline ${i <= step ? "text-forest-600" : "text-stone-400"}`}>{label}</span>
                  {i < 2 && <ChevronRight className="h-4 w-4 text-stone-300" />}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-10">
              {step === 0 && (
                <section aria-label="Outdoor issue categories">
                  <h2 className="text-2xl font-bold text-stone-900 mb-1">What&apos;s on your outdoor list?</h2>
                  <p className="mb-6 text-stone-500">Select the category that best describes your issue or request.</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {intakeCategories.map((cat) => (
                      <button key={cat.id} type="button" onClick={() => update("category", cat.id)} className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.category === cat.id ? "border-forest-500 bg-forest-50" : "border-stone-200 hover:border-stone-300"}`}>
                        <cat.icon className={`h-5 w-5 shrink-0 ${form.category === cat.id ? "text-forest-600" : "text-stone-400"}`} />
                        <h3 className="text-sm font-semibold text-stone-800">{cat.label}</h3>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {step === 1 && (
                <section aria-label="Outdoor list details" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-1">Tell us more</h2>
                    <p className="text-stone-500">Describe the issue and how urgent it is.</p>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-stone-800">Urgency</h3>
                    <div className="space-y-2">
                      {urgencyOptions.map((opt) => (
                        <button key={opt.value} type="button" onClick={() => update("urgency", opt.value)} className={`w-full rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.urgency === opt.value ? "border-forest-500 bg-forest-50" : "border-stone-200 hover:border-stone-300"}`}>
                          <span className="text-sm font-semibold text-stone-800">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="outdoor-list-description" className="mb-2 block text-lg font-bold text-stone-800">Describe the issue or upload your list</label>
                    <textarea
                      id="outdoor-list-description"
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      rows={5}
                      className="w-full resize-none rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
                      placeholder="Tell us what's going on outside. Include locations, symptoms, what you've noticed, what you've tried. Or paste your punch list, inspection notes, or board complaint list."
                    />
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <Upload className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-amber-800">Have photos or a document?</h3>
                      <p className="text-xs text-amber-700">Text photos, PDFs, or reports to <a href={`sms:${PHONE}`} className="font-bold underline transition-colors hover:text-amber-900 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">(704) 886-4240</a>. Mention your name and we&apos;ll match them to this request.</p>
                    </div>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section aria-label="Outdoor list contact information" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-1">Your contact info</h2>
                    <p className="text-stone-500">We&apos;ll review your list and reach out with the right next step.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="outdoor-list-name" className="mb-1 block text-sm font-semibold text-stone-700">Name *</label>
                      <input id="outdoor-list-name" type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="outdoor-list-phone" className="mb-1 block text-sm font-semibold text-stone-700">Phone *</label>
                      <input id="outdoor-list-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="(704) 555-0000" />
                    </div>
                    <div>
                      <label htmlFor="outdoor-list-email" className="mb-1 block text-sm font-semibold text-stone-700">Email</label>
                      <input id="outdoor-list-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="you@email.com" />
                    </div>
                    <div>
                      <label htmlFor="outdoor-list-town" className="mb-1 block text-sm font-semibold text-stone-700">Town / Property Location</label>
                      <input id="outdoor-list-town" type="text" value={form.town} onChange={(e) => update("town", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="Harrisburg, Concord, Charlotte..." />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-stone-700">Property Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Single Family Home", "Townhome", "HOA Community", "Multifamily", "Commercial", "Church / School", "Other"].map((pt) => (
                        <button key={pt} type="button" onClick={() => update("propertyType", pt)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.propertyType === pt ? "border-forest-600 bg-forest-600 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-forest-300"}`}>
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-stone-700">Preferred Contact Method</h3>
                      <div className="flex flex-wrap gap-2">
                        {contactMethods.map((cm) => (
                          <button key={cm} type="button" onClick={() => update("contactMethod", cm)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.contactMethod === cm ? "border-forest-600 bg-forest-600 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-forest-300"}`}>
                            {cm}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="outdoor-list-best-time" className="mb-1 block text-sm font-semibold text-stone-700">Best Time to Contact</label>
                      <input id="outdoor-list-best-time" type="text" value={form.bestTime} onChange={(e) => update("bestTime", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="Morning, afternoon, evenings..." />
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
                    Send Outdoor List <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Response highlights" className="pb-20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Clock3, label: "Fast triage for multi-issue requests" },
              { icon: ShieldCheck, label: "No-obligation scope and next step" },
              { icon: MapPin, label: "Charlotte metro property coverage" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm text-stone-600 shadow-sm">
                <item.icon className="h-4 w-4 text-forest-600" />
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Outdoor list FAQ" className="pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-stone-900">Common questions before you send your list</h2>
              <p className="mt-3 text-stone-600">Useful search-ready answers for homeowners, HOA managers, and commercial contacts.</p>
            </div>
            <AeoBlock
              question="What kind of outdoor issues can I send?"
              shortAnswer="Anything outside: sprinkler problems, drainage issues, patio damage, lighting outages, landscape needs, erosion, standing water, and more."
              commonCauses={["Multiple trade issues after storms", "Punch lists for moves or sales", "Recurring maintenance concerns"]}
              whenToCall="Call when water is actively running, damage is spreading, or you need live help sorting urgent issues."
              whatToDoNext="Pick the closest category, describe every issue you want reviewed, and send supporting photos or notes."
              relatedQuestions={["How do I send my list?", "Can I send photos of multiple issues?"]}
              showSchema={false}
            />
            <AeoBlock
              question="How do I send my list?"
              shortAnswer="Fill out the form on this page, call us, or text photos to (704) 886-4240. We accept descriptions, photos, and videos."
              commonCauses={["Phone notes copied into the form", "Photos sent by text", "Inspection notes or PDFs shared after submission"]}
              whenToCall="Call if you have a time-sensitive property issue or if you need help deciding which submission path is best."
              whatToDoNext="Submit the form first so we have contact details, then text any files or media and mention your name."
              relatedQuestions={["What happens after I send my list?", "Is there a limit to how many issues I can list?"]}
              showSchema={false}
            />
            <AeoBlock
              question="What happens after I send my list?"
              shortAnswer="We review it, may ask follow-up questions, then provide a clear scope and quote. For urgent issues, we respond within hours."
              commonCauses={["Some issues need clarification", "Photos may reveal multiple root causes", "Commercial lists often need staged scope planning"]}
              whenToCall="Call if the property is unsafe, a leak is active, or a board or tenant needs an immediate update."
              whatToDoNext="Watch for a callback, text, or email from our team and be ready to confirm the highest-priority items first."
              relatedQuestions={["Can I send photos of multiple issues?", "How do I send my list?"]}
              showSchema={false}
            />
            <AeoBlock
              question="Can I send photos of multiple issues?"
              shortAnswer="Yes. Multiple photos of different problems are actually helpful. Just note what each photo shows."
              commonCauses={["Different yard zones with separate symptoms", "Lighting, irrigation, and drainage issues on one property", "Before-and-after storm documentation"]}
              whenToCall="Call if you are unsure how to organize the images or if a problem is worsening while you document it."
              whatToDoNext="Send wide shots and close-ups, then label the issue in your form notes or text message."
              relatedQuestions={["What kind of outdoor issues can I send?", "Is there a limit to how many issues I can list?"]}
              showSchema={false}
            />
            <AeoBlock
              question="Is there a limit to how many issues I can list?"
              shortAnswer="No limit. The more complete your list, the more accurate our response will be."
              commonCauses={["Seasonal maintenance lists", "HOA common-area concerns", "Property turnover punch lists"]}
              whenToCall="Call if you need us to prioritize the most urgent items first or separate immediate repairs from later projects."
              whatToDoNext="Send the full list now, then tell us which items are urgent, which are optional, and which need quotes for budgeting."
              relatedQuestions={["What happens after I send my list?", "How do I send my list?"]}
              showSchema={false}
            />
          </div>
        </section>

        <section aria-label="Final outdoor list call to action" className="pb-24">
          <div className="max-w-4xl mx-auto rounded-3xl bg-stone-900 px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-extrabold">Got a list instead of a single issue?</h2>
            <p className="mt-3 text-stone-300">Send it once, send it clearly, and let our team break it into the right next steps for scope, quoting, and scheduling.</p>
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
