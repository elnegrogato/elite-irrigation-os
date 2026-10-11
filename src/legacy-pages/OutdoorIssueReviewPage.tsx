import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSeo, {
  makeBreadcrumbSchema,
  makeFaqSchema,
  makeServiceSchema,
} from "../components/PageSeo";
import AeoBlock from "../components/AeoBlock";
import {
  Search,
  Droplets,
  Waves,
  Lightbulb,
  Trees,
  Layers,
  Flame,
  Phone,
  Camera,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Clock,
  ShieldCheck,
  MapPin,
  AlertTriangle,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/outdoor-issue-review";
const PAGE_URL = `https://eliteirrigation.com${PAGE_PATH}`;
const PAGE_TITLE = "Outdoor Issue Review — Not Sure What Needs to Be Done?";
const PAGE_DESCRIPTION =
  "Not sure what outdoor service you need? Send Elite photos, notes, or a short description. We'll help determine whether it's sprinkler repair, drainage, lighting, hardscapes, or maintenance.";

const issues = [
  { id: "active-leak", label: "Active water leak", icon: AlertTriangle, urgent: true },
  { id: "broken-sprinkler", label: "Broken sprinkler", icon: Droplets },
  { id: "dry-lawn", label: "Dry lawn area", icon: Trees },
  { id: "standing-water", label: "Standing water", icon: Waves },
  { id: "soggy-yard", label: "Soggy yard", icon: Waves },
  { id: "foundation-water", label: "Water near foundation", icon: AlertTriangle },
  { id: "patio-drainage", label: "Patio drainage", icon: Layers },
  { id: "pool-drainage", label: "Pool-area drainage", icon: Waves },
  { id: "lighting-problem", label: "Landscape lighting problem", icon: Lightbulb },
  { id: "turf-issue", label: "Turf / lawn issue", icon: Trees },
  { id: "hardscape-issue", label: "Hardscape issue", icon: Layers },
  { id: "retaining-wall", label: "Retaining wall concern", icon: Layers },
  { id: "outdoor-living", label: "Outdoor living project", icon: Flame },
  { id: "hoa-common", label: "HOA / common-area problem", icon: Trees },
  { id: "commercial", label: "Commercial maintenance concern", icon: Search },
];

const faqItems = [
  {
    q: "Not sure what outdoor service you need?",
    a: "That's exactly what this page is for. Tell us what you notice — standing water, broken sprinkler, dark pathway, cracked patio — and we'll help identify the right service.",
  },
  {
    q: "Do I need to know the exact problem?",
    a: "No. Just describe what you see. We'll ask follow-up questions and may request photos to narrow it down.",
  },
  {
    q: "How quickly will you respond?",
    a: "Most inquiries are reviewed within a few hours during business hours. We'll recommend next steps or schedule a site visit if needed.",
  },
];

export default function OutdoorIssueReviewPage() {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", town: "", notes: "" });
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const toggleIssue = (id: string) => {
    setSelectedIssues((prev) =>
      prev.includes(id) ? prev.filter((issue) => issue !== id) : [...prev, id],
    );
  };
  const update = (field: string, value: string) => setForm((current) => ({ ...current, [field]: value }));

  if (submitted) {
    return (
      <Layout>
        <PageSeo
          title={PAGE_TITLE}
          description={PAGE_DESCRIPTION}
          canonical={PAGE_URL}
          jsonLd={[
            makeServiceSchema("Outdoor Issue Review", PAGE_DESCRIPTION, PAGE_PATH),
            makeFaqSchema(faqItems),
            makeBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Outdoor Issue Review", url: PAGE_PATH },
            ]),
          ]}
        />
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Issue Review" }]} />
        <div className="mx-auto max-w-2xl py-20 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-forest-100">
            <CheckCircle2 className="h-10 w-10 text-forest-600" />
          </div>
          <h1 className="mb-4 text-3xl font-extrabold text-stone-900">Issue Review Started</h1>
          <p className="mb-2 text-lg text-stone-600">
            Thanks, {form.name}! We'll review your outdoor issue{selectedIssues.length > 1 ? "s" : ""} and help determine whether you need sprinkler repair, drainage, lighting, hardscape work, or a site review.
          </p>
          <p className="mb-8 text-stone-500">We typically respond within the hour during business hours.</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${PHONE}`}
              aria-label="Call Elite Irrigation and Landscaping"
              className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:bg-forest-700 focus:ring-2 focus:ring-forest-500 focus:outline-none"
            >
              <Phone className="h-4 w-4" /> Call (704) 886-4240
            </a>
            <a
              href={`sms:${PHONE}`}
              aria-label="Text photos of your outdoor issue"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-3 font-bold text-white transition-all duration-200 hover:bg-amber-600 focus:ring-2 focus:ring-forest-500 focus:outline-none"
            >
              <Camera className="h-4 w-4" /> Text Photos
            </a>
          </div>
          <div className="mt-8">
            <Link href="/" className="font-semibold text-forest-600 transition-colors duration-200 hover:text-forest-700 hover:underline focus:ring-2 focus:ring-forest-500 focus:outline-none">
              ← Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageSeo
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        canonical={PAGE_URL}
        jsonLd={[
          makeServiceSchema("Outdoor Issue Review", PAGE_DESCRIPTION, PAGE_PATH),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Issue Review", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Issue Review" }]} />

      <div className="mx-auto max-w-4xl">
        <section className="mb-8 rounded-[2rem] border border-stone-200 bg-gradient-to-br from-white via-stone-50 to-forest-50 p-8 shadow-sm md:p-12">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-100">
            <Search className="h-7 w-7 text-forest-600" />
          </div>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Not Sure What Needs to Be Done Outside?
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-stone-600">
            Send Elite photos, notes, or a short description of the outdoor issue. We can help determine whether you need sprinkler repair, irrigation service, drainage, French drains, lighting, hardscape repair, pool-area work, landscape maintenance, or a site review.
          </p>
        </section>

        <div className="mb-10 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
            <Clock className="h-5 w-5 text-forest-600" />
            <div>
              <p className="text-sm font-bold text-stone-900">Guided review</p>
              <p className="text-xs text-stone-600">Tell us what you see and we sort the service path.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-forest-600" />
            <div>
              <p className="text-sm font-bold text-stone-900">Photo-friendly intake</p>
              <p className="text-xs text-stone-600">Text photos for faster diagnosis and scoping.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
            <MapPin className="h-5 w-5 text-forest-600" />
            <div>
              <p className="text-sm font-bold text-stone-900">Charlotte-area support</p>
              <p className="text-xs text-stone-600">Built for irrigation, drainage, lighting, and hardscape needs.</p>
            </div>
          </div>
        </div>

        <div className="mb-10 flex items-center justify-center gap-2">
          {["Describe Issue", "Your Info"].map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index <= step ? "bg-forest-600 text-white" : "bg-stone-200 text-stone-500"}`}
              >
                {index + 1}
              </div>
              <span className={`hidden text-sm font-semibold sm:inline ${index <= step ? "text-forest-600" : "text-stone-400"}`}>
                {label}
              </span>
              {index < 1 && <ChevronRight className="h-4 w-4 text-stone-300" />}
            </div>
          ))}
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-10">
          {step === 0 && (
            <div>
              <h2 className="mb-1 text-2xl font-bold text-stone-900">What are you seeing outside?</h2>
              <p className="mb-6 text-stone-500">
                Select all that apply. Don't worry about picking the "wrong" thing — that's our job to figure out.
              </p>
              <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {issues.map((issue) => (
                  <button
                    key={issue.id}
                    type="button"
                    aria-label={`Select ${issue.label}`}
                    aria-pressed={selectedIssues.includes(issue.id)}
                    onClick={() => toggleIssue(issue.id)}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 focus:ring-2 focus:ring-forest-500 focus:outline-none ${selectedIssues.includes(issue.id) ? "border-forest-500 bg-forest-50" : issue.urgent ? "border-amber-200 bg-amber-50" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"}`}
                  >
                    <issue.icon
                      className={`h-5 w-5 shrink-0 ${selectedIssues.includes(issue.id) ? "text-forest-600" : issue.urgent ? "text-amber-500" : "text-stone-400"}`}
                    />
                    <span className="text-sm font-semibold text-stone-800">{issue.label}</span>
                    {issue.urgent && (
                      <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                        URGENT
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="outdoor-notes" className="mb-1 block text-sm font-semibold text-stone-700">
                  Additional notes
                </label>
                <textarea
                  id="outdoor-notes"
                  aria-label="Additional notes about the outdoor issue"
                  value={form.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                  placeholder="When did it start? Where exactly? Any recent changes?"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-1 text-2xl font-bold text-stone-900">How should we follow up?</h2>
                <p className="mb-6 text-stone-500">We'll review your issue and recommend the right service path.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="outdoor-name" className="mb-1 block text-sm font-semibold text-stone-700">
                    Name *
                  </label>
                  <input
                    id="outdoor-name"
                    aria-label="Your name"
                    type="text"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label htmlFor="outdoor-phone" className="mb-1 block text-sm font-semibold text-stone-700">
                    Phone *
                  </label>
                  <input
                    id="outdoor-phone"
                    aria-label="Your phone number"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label htmlFor="outdoor-email" className="mb-1 block text-sm font-semibold text-stone-700">
                    Email
                  </label>
                  <input
                    id="outdoor-email"
                    aria-label="Your email address"
                    type="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label htmlFor="outdoor-town" className="mb-1 block text-sm font-semibold text-stone-700">
                    Town
                  </label>
                  <input
                    id="outdoor-town"
                    aria-label="Your town"
                    type="text"
                    value={form.town}
                    onChange={(event) => update("town", event.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <Camera className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Send photos for faster review</p>
                  <p className="text-xs text-amber-700">
                    Text photos to <a href={`sms:${PHONE}`} className="font-bold underline">(704) 886-4240</a>. Mention your name so we can match them.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                aria-label="Go back to previous step"
                className="text-sm font-semibold text-stone-500 transition-colors duration-200 hover:text-stone-700 focus:ring-2 focus:ring-forest-500 focus:outline-none"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            {step < 1 ? (
              <button
                type="button"
                onClick={() => selectedIssues.length > 0 && setStep(1)}
                disabled={selectedIssues.length === 0}
                aria-label="Continue to contact information"
                className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all duration-200 focus:ring-2 focus:ring-forest-500 focus:outline-none ${selectedIssues.length > 0 ? "bg-forest-600 text-white hover:bg-forest-700" : "cursor-not-allowed bg-stone-200 text-stone-400"}`}
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => form.name && form.phone && setSubmitted(true)}
                disabled={!form.name || !form.phone}
                aria-label="Start issue review"
                className={`flex items-center gap-2 rounded-lg px-8 py-2.5 text-sm font-bold transition-all duration-200 focus:ring-2 focus:ring-forest-500 focus:outline-none ${form.name && form.phone ? "bg-forest-600 text-white hover:bg-forest-700" : "cursor-not-allowed bg-stone-200 text-stone-400"}`}
              >
                Start Issue Review <CheckCircle2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 max-w-3xl">
            <h2 className="text-2xl font-extrabold text-stone-900 md:text-3xl">Common questions before you submit</h2>
            <p className="mt-2 text-stone-600">
              Use this page whether you know the exact service or just know something outside is not working as it should.
            </p>
          </div>
          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            whenToCall="Use this intake when you're unsure whether the issue is irrigation, drainage, lighting, hardscape, or broader landscape work."
            whatToDoNext="Choose the issue types that look closest, add a few notes, and send photos if you have them."
            relatedQuestions={[faqItems[1].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[1].q}
            shortAnswer={faqItems[1].a}
            commonCauses={[
              "Hidden irrigation leaks or broken sprinkler heads",
              "Drainage failures causing soft turf or standing water",
              "Lighting, hardscape, or grading issues that only show up after weather or heavy use",
            ]}
            whatToDoNext="Give us the symptoms, location, and timing. We can sort the right service from there."
            relatedQuestions={[faqItems[0].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[2].q}
            shortAnswer={faqItems[2].a}
            whenToCall="If water is actively leaking, flooding near structures, or creating a safety concern, call instead of waiting on the form alone."
            whatToDoNext="Submit the form now, then text photos if the issue is visible."
            relatedQuestions={[faqItems[0].q, faqItems[1].q]}
            showSchema={false}
          />
        </section>
      </div>
    </Layout>
  );
}
