'use client';

import { useState } from "react";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import Breadcrumbs from "../../src/components/Breadcrumbs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Droplets, Waves, Layers, Lightbulb, Trees, Flame,
  Phone, Camera, CheckCircle2, ArrowRight,
  ShieldCheck, MapPin, Zap, Clock, User
} from "lucide-react";

const PHONE = "+17048864240";

const categories = [
  { id: "irrigation", icon: Droplets, label: "Irrigation Problem", desc: "Leaking heads, stuck zones, controller issues, dry spots, seasonal startup", color: "bg-white text-forest-700 border-forest-200" },
  { id: "drainage", icon: Waves, label: "Drainage Problem", desc: "Standing water, soggy lawn, foundation runoff, erosion, patio pooling", color: "bg-white text-forest-700 border-forest-200" },
  { id: "turf-grading", icon: Trees, label: "Lawn / Turf Issue", desc: "Sod, grading, uneven lawn, patchy turf, soil prep, slope restoration", color: "bg-white text-forest-700 border-forest-200" },
  { id: "landscaping", icon: Trees, label: "Landscape Refresh", desc: "Beds, mulch, plantings, edging, construction, curb appeal reset", color: "bg-white text-forest-700 border-forest-200" },
  { id: "hardscapes", icon: Layers, label: "Hardscape Project", desc: "Patios, walkways, retaining walls, hot tub pads, paver repairs", color: "bg-white text-forest-700 border-forest-200" },
  { id: "outdoor-living", icon: Flame, label: "Outdoor Living", desc: "Outdoor kitchen, fire pit, pergola, fireplace, pool area upgrade", color: "bg-white text-forest-700 border-forest-200" },
  { id: "lighting", icon: Lightbulb, label: "Lighting Project", desc: "Path lighting, accent lighting, patio lighting, poolside or Christmas lighting", color: "bg-white text-forest-700 border-forest-200" },
  { id: "maintenance", icon: Trees, label: "Recurring Maintenance", desc: "Lawn care, landscape management, weed control, seasonal service plan", color: "bg-white text-forest-700 border-forest-200" },
  { id: "commercial", icon: ShieldCheck, label: "Commercial / HOA", desc: "Commercial grounds, HOA reporting, estate maintenance, contracts", color: "bg-white text-forest-700 border-forest-200" },
  { id: "seasonal", icon: Clock, label: "Seasonal Service", desc: "Startup, winterization, cleanup, aeration, snow and ice, storm prep", color: "bg-white text-forest-700 border-forest-200" },
  { id: "other", icon: Zap, label: "Not Sure", desc: "Describe what you see and we will route the request", color: "bg-stone-50 text-stone-700 border-stone-200" },
];

const routePrompts: Record<string, string[]> = {
  irrigation: ["Which zones are affected?", "Is water currently running?", "Is the controller showing an error?", "Can you send photos/video?"],
  drainage: ["Where is water collecting?", "How long does it stay?", "Is it near the foundation?", "Are downspouts involved?"],
  "turf-grading": ["Approximate square footage?", "Is irrigation available?", "Are there low spots or drainage issues?", "Need sod, seed, or grading?"],
  landscaping: ["Which area needs work?", "Refresh or full redesign?", "Any plant style preferences?", "Need drip irrigation or lighting?"],
  hardscapes: ["What do you want built or repaired?", "Approximate size?", "Any drainage issue?", "Material preference?"],
  "outdoor-living": ["Which features do you want?", "Approximate budget range?", "Need design help?", "Need lighting or drainage included?"],
  lighting: ["Which areas need lighting?", "Safety, curb appeal, or both?", "Existing transformer?", "Photos of the areas?"],
  maintenance: ["Property type and size?", "Desired frequency?", "Services needed?", "Irrigation system on site?"],
  commercial: ["Property type and size?", "Current vendor situation?", "Reporting requirements?", "RFP or site map available?"],
  seasonal: ["Which season/service?", "Preferred timing?", "Property size?", "One-time or recurring?"],
  other: ["What are you seeing?", "How urgent is it?", "What outcome do you want?", "Photos help us route it."],
};

export default function QuickQuotePage() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createLead = useMutation(api.leads.createLead);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        addressText: formData.address,
        message: formData.message,
        surfaceHint: "quick-quote",
        serviceSlug: category ?? undefined,
      });
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Error submitting lead:", err);
      alert("Something went wrong. Please try calling us instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-forest-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-4">Assessment Request Received!</h1>
          <p className="text-lg text-stone-600 mb-10">
            Thank you for reaching out. A local Charlotte team member will review your details, route the right service path, and contact you shortly.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-forest-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-forest-700 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Quick Quote" }]} />

      <main role="main" className="max-w-5xl mx-auto pb-24">
        <section aria-label="Quick quote hero" className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full border border-forest-200 bg-white px-4 py-1 text-sm font-semibold text-forest-700">
              Charlotte's Premier Outdoor Property Services
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-stone-900 md:text-5xl">Outdoor Property Assessment</h1>
            <p className="mt-4 text-lg text-stone-600 md:text-xl">Diagnose the issue, share photos or notes, and get routed to the right irrigation, drainage, landscaping, hardscape, maintenance, or commercial service path.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#quote-form"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-6 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
              >
                Start Assessment
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-6 py-3 font-bold text-stone-700 transition-colors hover:bg-stone-50"
              >
                <Phone className="h-5 w-5 text-forest-600" />
                Call (704) 886-4240
              </a>
              <a
                href={`sms:${PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-6 py-3 font-bold text-stone-700 transition-colors hover:bg-stone-50"
              >
                <Camera className="h-5 w-5 text-forest-600" />
                Text Us Photos
              </a>
            </div>
          </div>
        </section>

        <div id="quote-form" className="scroll-mt-24 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
          <div className="flex border-b border-stone-100">
            {["Diagnose", "Property", "Contact"].map((label, i) => (
              <div key={label} aria-current={i === step ? "step" : undefined} className={`flex-1 py-4 px-2 text-center border-b-2 transition-colors ${i === step ? "border-forest-600 bg-white" : "border-transparent"}`}>
                <div className="flex items-center justify-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i <= step ? "bg-forest-600 text-white" : "bg-stone-200 text-stone-500"}`}>
                    {i + 1}
                  </div>
                  <span className={`hidden sm:inline text-xs font-bold uppercase tracking-wider ${i === step ? "text-forest-700" : "text-stone-400"}`}>
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 sm:p-8 md:p-12">
            {step === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-stone-900">What do you need help with?</h2>
                  <p className="text-stone-500">Start with the system, problem, season, or property type.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => { setCategory(cat.id); setStep(1); }}
                      aria-pressed={category === cat.id}
                      className={`group flex min-h-[170px] flex-col rounded-2xl border-2 p-5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 sm:min-h-[190px] sm:p-6 ${category === cat.id ? "border-forest-600 bg-white" : "border-stone-100 bg-white hover:border-forest-200 hover:shadow-md"}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-stone-900 group-hover:text-forest-600">{cat.label}</h3>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="max-w-2xl mx-auto">
                <button type="button" onClick={() => setStep(0)} className="text-stone-400 hover:text-stone-600 text-sm font-bold flex items-center gap-1 mb-6">
                  ← Back to categories
                </button>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-stone-900 mb-2">Tell us what you are seeing</h2>
                  <p className="text-stone-500">These prompts help us route the right crew, diagnostic, or proposal path.</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {(routePrompts[category ?? "other"] ?? routePrompts.other).map((prompt) => (
                      <div key={prompt} className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-600">
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="quick-quote-message" className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest">Issue / Project Description</label>
                    <textarea
                      id="quick-quote-message"
                      rows={4}
                      required
                      placeholder="Tell us what's going on, what you want fixed, or what you'd like to build..."
                      className="w-full rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 text-lg p-4"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="quick-quote-address" className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        id="quick-quote-address"
                        required
                        type="text"
                        placeholder="Property address in Charlotte metro"
                        className="w-full pl-12 rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-4"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.message || !formData.address}
                    aria-describedby="quick-quote-continue-help"
                    className="w-full bg-forest-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-forest-700 transition-colors disabled:opacity-50"
                  >
                    Continue to Contact
                  </button>
                  {(!formData.message || !formData.address) ? (
                    <p id="quick-quote-continue-help" className="text-center text-xs font-semibold text-stone-500">
                      Add a short description and property address so we can route the right service path.
                    </p>
                  ) : null}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-2xl mx-auto">
                <button type="button" onClick={() => setStep(1)} className="text-stone-400 hover:text-stone-600 text-sm font-bold flex items-center gap-1 mb-6">
                  ← Back to project details
                </button>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-stone-900 mb-2">Almost done!</h2>
                  <p className="text-stone-500">How should we get in touch with your estimate?</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="quick-quote-name" className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        id="quick-quote-name"
                        required
                        type="text"
                        className="w-full pl-12 rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-4"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quick-quote-email" className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest">Email</label>
                      <input
                        id="quick-quote-email"
                        required
                        type="email"
                        className="w-full rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-4"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="quick-quote-phone" className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest">Phone</label>
                      <input
                        id="quick-quote-phone"
                        required
                        type="tel"
                        className="w-full rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-4"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-forest-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-forest-700 transition-colors shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Send Quick Quote Request"}
                  </button>
                  <p className="text-center text-xs text-stone-400 mt-4 leading-relaxed">
                    By submitting, you agree to be contacted by Elite Irrigation regarding your request. We value your privacy and never sell your data.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-8">
          {[
            { icon: Clock, title: "Fast Response", desc: "Most estimates returned same or next business day." },
            { icon: ShieldCheck, title: "NC Licensed", desc: "Licensed irrigation work with insured, professional field standards." },
            { icon: Camera, title: "Photo-Proof", desc: "We document everything we see to ensure transparency." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm text-forest-600">
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 mb-1">{item.title}</h4>
              <p className="text-xs text-stone-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
