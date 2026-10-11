"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Layout from "../../src/components/Layout";
import Breadcrumbs from "../../src/components/Breadcrumbs";
import AeoBlock from "../../src/components/AeoBlock";
import PageSeo, { makeServiceSchema, makeFaqSchema, makeBreadcrumbSchema } from "../../src/components/PageSeo";
import {
  Phone, Camera, CheckCircle2, ArrowRight, MapPin,
  Building2, AlertTriangle, Mail, MessageSquare,
  ShieldCheck, BadgeCheck, ClipboardList, FileCheck, Clock3
} from "lucide-react";

const PHONE = "+17048864240";

const formTypes = [
  { id: "general", label: "General Inquiry", icon: MessageSquare, desc: "Question about services, pricing, or availability" },
  { id: "emergency", label: "Emergency Repair", icon: AlertTriangle, desc: "Active water, burst pipe, safety concern" },
  { id: "drainage", label: "Drainage Problem", icon: Building2, desc: "Standing water, erosion, soggy yard" },
  { id: "outdoor-living", label: "Outdoor Living Project", icon: FileCheck, desc: "Patio, outdoor kitchen, fire pit, pool area" },
  { id: "commercial", label: "Commercial / HOA", icon: Building2, desc: "Facilities services, grounds contract, board report" },
  { id: "maintenance", label: "Maintenance Plan", icon: ClipboardList, desc: "Recurring service, seasonal plan, ongoing care" },
];

const trustItems = [
  { icon: BadgeCheck, title: "Licensed", detail: "Outdoor property service specialists" },
  { icon: ShieldCheck, title: "Insured", detail: "Residential, HOA, and commercial coverage" },
  { icon: Camera, title: "Photo-Documented", detail: "Text photos for faster routing and triage" },
  { icon: ClipboardList, title: "Structured Process", detail: "Inquiry intake, review, quote, and scheduling" },
];

const contactFaqs = [
  {
    q: "What's the best way to reach Elite?",
    a: "For fastest response, call (704) 886-4240 or text us photos. You can also fill out any form on our website and we'll respond within one business day.",
  },
  {
    q: "Do you offer free estimates?",
    a: "Yes. All initial estimates and assessments are free with no obligation.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the Greater Charlotte metro area including Harrisburg, Concord, Charlotte, Huntersville, Matthews, Mint Hill, Kannapolis, and surrounding communities.",
  },
  {
    q: "What are your business hours?",
    a: "Monday through Friday 7:00 AM to 5:00 PM, Saturday and Sunday 7:30 AM to 4:00 PM.",
  },
  {
    q: "How quickly will I get a response?",
    a: "Most inquiries receive a response within a few hours during business hours. Urgent issues are prioritized.",
  },
];

export default function ContactPage() {
  const createLead = useMutation(api.leads.createLead);
  const [activeForm, setActiveForm] = useState("general");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", message: "", propertyType: "", urgency: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const submit = async () => {
    if (!form.name || !form.phone || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await createLead({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        addressText: form.address || undefined,
        message: [
          form.message,
          form.propertyType ? `Property type: ${form.propertyType}` : "",
          `Inquiry type: ${formTypes.find((item) => item.id === activeForm)?.label ?? activeForm}`,
        ].filter(Boolean).join("\n\n"),
        surfaceHint: "contact",
        intent: activeForm,
        urgency: activeForm === "emergency" ? "emergency" : form.urgency || undefined,
      });
      setSubmitted(true);
    } catch {
      setError("We could not send the form just now. Please call or text (704) 886-4240.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <PageSeo
          title="Contact — Free Estimates & Service Requests"
          description="Contact Elite Irrigation & Landscaping for sprinkler repair, drainage, outdoor projects, HOA needs, and maintenance service across the Charlotte metro area."
          canonical="/contact"
          jsonLd={[
            makeServiceSchema("Contact & Estimate Requests", "Contact and estimate request page for irrigation, drainage, landscape, outdoor living, and commercial property services.", "/contact"),
            makeFaqSchema(contactFaqs),
            makeBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Contact" },
            ]),
          ]}
        />
        <Breadcrumbs items={[{ label: "Contact" }]} />
        <main role="main" className="max-w-2xl mx-auto py-20 text-center">
          <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-forest-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-4">Message Received</h1>
          <p className="text-lg text-stone-600 mb-2">Thanks, {form.name}! We&apos;ll review your message and reach out shortly.</p>
          <p className="text-stone-500 mb-8">For faster response, call or text us directly.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-8 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Phone className="w-5 h-5" /> Call (704) 886-4240</a>
            <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-8 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Camera className="w-5 h-5" /> Text Photos</a>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageSeo
        title="Contact — Free Estimates & Service Requests"
        description="Contact Elite Irrigation & Landscaping for sprinkler repair, drainage, outdoor projects, HOA needs, and maintenance service across the Charlotte metro area."
        canonical="/contact"
        jsonLd={[
          makeServiceSchema("Contact & Estimate Requests", "Contact and estimate request page for irrigation, drainage, landscape, outdoor living, and commercial property services.", "/contact"),
          makeFaqSchema(contactFaqs),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Contact" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <main role="main" className="max-w-6xl mx-auto">
        <section aria-label="Contact hero" className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full border border-forest-200 bg-white px-4 py-1 text-sm font-semibold text-forest-700">
              Free estimates, service questions, and urgent repair routing
            </span>
            <h1 className="mt-5 text-4xl font-extrabold text-stone-900 md:text-5xl">Get in Touch</h1>
            <p className="mt-4 text-lg text-stone-600">Choose the type of inquiry and we&apos;ll route you to the right team for faster follow-up, clearer scope, and the right next step.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-6 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Phone className="h-4 w-4" /> Call (704) 886-4240</a>
              <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl border border-forest-300 bg-white px-6 py-3 font-bold text-forest-800 transition-colors hover:bg-forest-100 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Camera className="h-4 w-4" /> Text Photos</a>
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

        <section aria-label="Contact forms and business details" className="pb-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <section aria-label="Inquiry type selector">
                <h2 className="mb-4 text-2xl font-bold text-stone-900">Choose your inquiry type</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  {formTypes.map((ft) => (
                    <button
                      key={ft.id}
                      type="button"
                      onClick={() => setActiveForm(ft.id)}
                      className={`rounded-xl border-2 p-3 text-center transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${activeForm === ft.id ? "border-forest-500 bg-white" : "border-stone-200 hover:border-stone-300"}`}
                    >
                      <ft.icon className={`mx-auto mb-1 h-5 w-5 ${activeForm === ft.id ? "text-forest-600" : "text-stone-400"}`} />
                      <h3 className={`text-xs font-bold ${activeForm === ft.id ? "text-forest-700" : "text-stone-600"}`}>{ft.label}</h3>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-stone-500">{formTypes.find((item) => item.id === activeForm)?.desc}</p>
              </section>

              <section aria-label="Contact form" className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-6 text-2xl font-bold text-stone-900">Tell us what you need</h2>
                {activeForm === "emergency" && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-forest-200 bg-white p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" />
                    <div>
                      <h3 className="text-sm font-bold text-forest-800">Active water or safety concern?</h3>
                      <p className="text-xs text-forest-700">Call us immediately at <a href={`tel:${PHONE}`} className="font-bold underline transition-colors hover:text-forest-900 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">(704) 886-4240</a> instead of filling out this form.</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold text-stone-700">Name *</label>
                    <input id="contact-name" type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-1 block text-sm font-semibold text-stone-700">Phone *</label>
                    <input id="contact-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1 block text-sm font-semibold text-stone-700">Email</label>
                    <input id="contact-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" />
                  </div>
                  <div>
                    <label htmlFor="contact-address" className="mb-1 block text-sm font-semibold text-stone-700">Property Address / Town</label>
                    <input id="contact-address" type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" />
                  </div>
                </div>

                {(activeForm === "commercial" || activeForm === "maintenance") && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-stone-700">Property Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {["HOA", "Multifamily", "Commercial", "Office Park", "Retail", "Church / School", "Country Club", "Residential"].map((pt) => (
                        <button key={pt} type="button" onClick={() => update("propertyType", pt)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.propertyType === pt ? "border-forest-600 bg-forest-600 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-forest-300"}`}>{pt}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold text-stone-700">
                    {activeForm === "drainage" ? "Describe the drainage problem" :
                     activeForm === "outdoor-living" ? "Describe your outdoor living project" :
                     activeForm === "emergency" ? "Describe the emergency" :
                     activeForm === "commercial" ? "Describe your commercial/HOA needs" :
                     activeForm === "maintenance" ? "Describe your maintenance needs" :
                     "How can we help?"}
                  </label>
                  <textarea id="contact-message" value={form.message} onChange={(e) => update("message", e.target.value)} rows={4} className="w-full resize-none rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2" placeholder="Tell us about the issue, project, or question..." />
                </div>

                <div className="mb-6 flex items-start gap-2 rounded-xl border border-forest-200 bg-white p-3">
                  <Camera className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
                  <p className="text-xs text-forest-800">Have photos? Text them to <a href={`sms:${PHONE}`} className="font-bold underline transition-colors hover:text-forest-900 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">(704) 886-4240</a> for faster response.</p>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={submit} disabled={!form.name || !form.phone || submitting} className={`flex items-center gap-2 rounded-lg px-8 py-2.5 text-sm font-bold transition-colors focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${form.name && form.phone && !submitting ? "bg-forest-600 text-white hover:bg-forest-700" : "cursor-not-allowed bg-stone-200 text-stone-400"}`}>
                    {submitting ? "Sending..." : "Send Message"} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {error && <p className="mt-3 text-right text-sm font-semibold text-forest-700">{error}</p>}
              </section>
            </div>

            <aside className="space-y-4">
              <section aria-label="Contact information" className="rounded-xl border border-forest-200 bg-white p-5">
                <h2 className="mb-3 text-xl font-bold text-stone-900">Contact Info</h2>
                <div className="space-y-3">
                  <a href={`tel:${PHONE}`} className="flex items-center gap-2 text-sm text-stone-700 transition-colors hover:text-forest-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Phone className="h-4 w-4 text-forest-600" /> (704) 886-4240</a>
                  <a href={`sms:${PHONE}`} className="flex items-center gap-2 text-sm text-stone-700 transition-colors hover:text-forest-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Camera className="h-4 w-4 text-forest-600" /> Text Photos</a>
                  <a href="mailto:info@eliteirrigation.com" className="flex items-center gap-2 text-sm text-stone-700 transition-colors hover:text-forest-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><Mail className="h-4 w-4 text-forest-600" /> info@eliteirrigation.com</a>
                </div>
              </section>

              <section aria-label="Business hours" className="rounded-xl border border-stone-200 bg-white p-5">
                <h2 className="mb-3 text-xl font-bold text-stone-900">Business Hours</h2>
                <div className="space-y-1.5 text-sm text-stone-600">
                  <p>Monday: 7:00 AM - 5:00 PM</p>
                  <p>Tuesday: 7:00 AM - 5:00 PM</p>
                  <p>Wednesday: 7:00 AM - 5:00 PM</p>
                  <p>Thursday: 7:00 AM - 5:00 PM</p>
                  <p>Friday: 7:00 AM - 5:00 PM</p>
                  <p>Saturday: 7:30 AM - 4:00 PM</p>
                  <p>Sunday: 7:30 AM - 4:00 PM</p>
                </div>
                <p className="mt-2 flex items-center gap-2 text-xs text-stone-500"><Clock3 className="h-3.5 w-3.5 text-forest-600" /> Emergency repair available during business hours.</p>
              </section>

              <section aria-label="Service area" className="rounded-xl border border-stone-200 bg-white p-5">
                <h2 className="mb-3 text-xl font-bold text-stone-900">Service Area</h2>
                <div className="flex items-start gap-2 text-sm text-stone-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
                  <p>Harrisburg, Concord, Charlotte, Huntersville, Cornelius, Matthews, Mint Hill, Kannapolis, and surrounding areas.</p>
                </div>
                <Link href="/areas-we-serve" className="mt-2 block text-sm font-semibold text-forest-600 transition-colors hover:text-forest-700 hover:underline focus:ring-2 focus:ring-forest-500 focus:ring-offset-2">View all service areas →</Link>
              </section>

              <section aria-label="Quick links" className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                <h2 className="mb-3 text-xl font-bold text-stone-900">Quick Links</h2>
                <div className="space-y-2">
                  <Link href="/quick-quote" className="flex items-center gap-2 text-sm text-stone-700 transition-colors hover:text-forest-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><ArrowRight className="h-3.5 w-3.5" /> Quick Quote</Link>
                  <Link href="/send-us-your-outdoor-list" className="flex items-center gap-2 text-sm text-stone-700 transition-colors hover:text-forest-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><ArrowRight className="h-3.5 w-3.5" /> Send Outdoor List</Link>
                  <Link href="/outdoor-issue-review" className="flex items-center gap-2 text-sm text-stone-700 transition-colors hover:text-forest-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><ArrowRight className="h-3.5 w-3.5" /> Outdoor Issue Review</Link>
                  <Link href="/drainage-assessment" className="flex items-center gap-2 text-sm text-stone-700 transition-colors hover:text-forest-600 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"><ArrowRight className="h-3.5 w-3.5" /> Drainage Assessment</Link>
                </div>
              </section>
            </aside>
          </div>
        </section>

        <section aria-label="Contact FAQ" className="pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-stone-900">Questions before you contact us?</h2>
              <p className="mt-3 text-stone-600">Quick answers for homeowners, property managers, and anyone comparing next steps.</p>
            </div>
            <AeoBlock
              question="What's the best way to reach Elite?"
              shortAnswer="For fastest response, call (704) 886-4240 or text us photos. You can also fill out any form on our website and we'll respond within one business day."
              commonCauses={["Urgent issues need live triage", "Photos speed up diagnosis", "Forms help route non-urgent requests correctly"]}
              whenToCall="Call when water is actively running, a repair is urgent, or you need immediate direction during business hours."
              whatToDoNext="Choose the contact method that fits your urgency, then include clear photos and a short summary of the issue."
              relatedQuestions={["How quickly will I get a response?", "Do you offer free estimates?"]}
              showSchema={false}
            />
            <AeoBlock
              question="Do you offer free estimates?"
              shortAnswer="Yes. All initial estimates and assessments are free with no obligation."
              commonCauses={["Comparing project budgets", "Need a starting scope", "Want clarity before scheduling work"]}
              whenToCall="Call if you need to talk through whether your situation needs a quote, assessment, or immediate repair visit."
              whatToDoNext="Use the form above or text photos so we can recommend the right estimate path for your property."
              relatedQuestions={["What's the best way to reach Elite?", "What areas do you serve?"]}
              showSchema={false}
            />
            <AeoBlock
              question="What areas do you serve?"
              shortAnswer="We serve the Greater Charlotte metro area including Harrisburg, Concord, Charlotte, Huntersville, Matthews, Mint Hill, Kannapolis, and surrounding communities."
              commonCauses={["Homeowners checking local coverage", "HOA managers confirming board service area", "Commercial sites needing recurring service"]}
              whenToCall="Call if you are just outside the listed area and want to confirm scheduling availability."
              whatToDoNext="Share your property address or town in the form so we can confirm service routing and timing."
              relatedQuestions={["Do you offer free estimates?", "How quickly will I get a response?"]}
              showSchema={false}
            />
            <AeoBlock
              question="What are your business hours?"
              shortAnswer="Monday through Friday 7:00 AM to 5:00 PM, Saturday and Sunday 7:30 AM to 4:00 PM."
              commonCauses={["Planning callbacks", "Scheduling estimate windows", "Coordinating property access"]}
              whenToCall="Call during business hours for the fastest live response, especially for urgent irrigation or drainage issues."
              whatToDoNext="If you contact us after hours, send photos and a short summary so we can prioritize your message the next business day."
              relatedQuestions={["What's the best way to reach Elite?", "How quickly will I get a response?"]}
              showSchema={false}
            />
            <AeoBlock
              question="How quickly will I get a response?"
              shortAnswer="Most inquiries receive a response within a few hours during business hours. Urgent issues are prioritized."
              commonCauses={["Urgent leaks move to the front", "Detailed submissions are easier to review fast", "Photos reduce follow-up questions"]}
              whenToCall="Call immediately if the issue could damage your home, landscape, or common area before we can reply normally."
              whatToDoNext="Submit the form, text supporting photos, and note whether your issue is urgent, routine, or tied to a scheduling deadline."
              relatedQuestions={["What's the best way to reach Elite?", "What are your business hours?"]}
              showSchema={false}
            />
          </div>
        </section>

        <section aria-label="Final contact call to action" className="pb-24">
          <div className="max-w-4xl mx-auto rounded-3xl bg-stone-900 px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-extrabold">Ready to get the right outdoor team involved?</h2>
            <p className="mt-3 text-stone-300">Call, text, or send your request through the form above and we&apos;ll help you move from question to action quickly.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-6 py-3 font-bold text-white transition-colors hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"><Phone className="h-4 w-4" /> Call (704) 886-4240</a>
              <Link href="/quick-quote" className="inline-flex items-center gap-2 rounded-xl border border-stone-600 px-6 py-3 font-bold text-white transition-colors hover:bg-stone-800 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-stone-900"><ArrowRight className="h-4 w-4" /> Start a Quick Quote</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
