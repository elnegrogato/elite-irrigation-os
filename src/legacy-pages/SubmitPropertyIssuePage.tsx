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
  AlertTriangle,
  Droplets,
  Waves,
  Lightbulb,
  Trees,
  Layers,
  Phone,
  Camera,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
} from "lucide-react";

const PHONE = "+17048864240";
const PAGE_PATH = "/submit-property-issue";
const PAGE_URL = `https://eliteirrigation.com${PAGE_PATH}`;
const PAGE_TITLE = "Submit an Outdoor Property Issue";
const PAGE_DESCRIPTION =
  "Submit an outdoor property issue — irrigation, drainage, lighting, landscape, hardscape, pool area, storm damage, or common-area complaints.";

const issueTypes = [
  { id: "irrigation-leak", label: "Irrigation leak", icon: Droplets },
  { id: "broken-sprinkler", label: "Broken sprinkler", icon: Droplets },
  { id: "drainage", label: "Drainage / standing water", icon: Waves },
  { id: "lighting", label: "Lighting outage", icon: Lightbulb },
  { id: "lawn", label: "Lawn or turf issue", icon: Trees },
  { id: "landscape", label: "Landscape bed issue", icon: Trees },
  { id: "paver", label: "Paver / walkway issue", icon: Layers },
  { id: "retaining-wall", label: "Retaining wall issue", icon: Layers },
  { id: "pool-area", label: "Pool-area issue", icon: Waves },
  { id: "storm", label: "Storm damage", icon: AlertTriangle },
  { id: "common-area", label: "Common-area complaint", icon: Trees },
  { id: "other", label: "Other", icon: AlertTriangle },
];

const priorities = [
  { value: "urgent", label: "Urgent", desc: "Safety concern, active water, or imminent damage" },
  { value: "high", label: "High", desc: "Needs attention within 1-2 business days" },
  { value: "standard", label: "Standard", desc: "Can wait for next scheduled visit" },
  { value: "cosmetic", label: "Cosmetic / Future", desc: "Not urgent — future improvement" },
];

const faqItems = [
  {
    q: "What types of property issues can I submit?",
    a: "Any outdoor issue: irrigation problems, drainage, hardscape damage, lighting outages, erosion, overgrowth, storm damage, and more.",
  },
  {
    q: "How do I submit photos with my issue?",
    a: "You can text photos to (704) 886-4240 or describe the issue in the form and we'll follow up for photos if needed.",
  },
  {
    q: "What happens after I submit?",
    a: "We review your submission, may ask clarifying questions, then provide a recommended scope and quote.",
  },
];

export default function SubmitPropertyIssuePage() {
  const [form, setForm] = useState({
    issueType: "",
    priority: "",
    propertyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    propertyType: "",
    town: "",
    issueLocation: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) => setForm((current) => ({ ...current, [field]: value }));

  if (submitted) {
    return (
      <Layout>
        <PageSeo
          title={PAGE_TITLE}
          description={PAGE_DESCRIPTION}
          canonical={PAGE_URL}
          jsonLd={[
            makeServiceSchema("Submit Property Issue", PAGE_DESCRIPTION, PAGE_PATH),
            makeFaqSchema(faqItems),
            makeBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Submit Property Issue", url: PAGE_PATH },
            ]),
          ]}
        />
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Submit Property Issue" }]} />
        <div className="mx-auto max-w-2xl py-20 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-forest-100">
            <CheckCircle2 className="h-10 w-10 text-forest-600" />
          </div>
          <h1 className="mb-4 text-3xl font-extrabold text-stone-900">Property Issue Submitted</h1>
          <p className="mb-2 text-lg text-stone-600">
            Thanks, {form.contactPerson}. Your {issueTypes.find((issue) => issue.id === form.issueType)?.label} issue has been logged.
          </p>
          <p className="mb-8 text-stone-500">We'll review and reach out with the recommended next step.</p>
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
              aria-label="Text photos of your property issue"
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
          makeServiceSchema("Submit Property Issue", PAGE_DESCRIPTION, PAGE_PATH),
          makeFaqSchema(faqItems),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Submit Property Issue", url: PAGE_PATH },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Submit Property Issue" }]} />

      <div className="mx-auto max-w-4xl">
        <section className="mb-8 rounded-[2rem] border border-stone-200 bg-gradient-to-br from-white via-stone-50 to-forest-50 p-8 shadow-sm md:p-12">
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Submit an Outdoor <span className="text-forest-600">Property Issue</span>
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-stone-600">
            Report an outdoor issue on your property. We'll review and recommend the right next step.
          </p>
        </section>

        <div className="mb-10 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
            <Clock className="h-5 w-5 text-forest-600" />
            <div>
              <p className="text-sm font-bold text-stone-900">Structured intake</p>
              <p className="text-xs text-stone-600">Log location, urgency, and issue type in one step.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-forest-600" />
            <div>
              <p className="text-sm font-bold text-stone-900">Property-ready workflow</p>
              <p className="text-xs text-stone-600">Works for HOA, commercial, multifamily, and residential properties.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
            <Camera className="h-5 w-5 text-forest-600" />
            <div>
              <p className="text-sm font-bold text-stone-900">Photo follow-up</p>
              <p className="text-xs text-stone-600">Text issue photos to speed up scoping and quoting.</p>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-stone-900">Tell us what needs attention</h2>
            <p className="mt-2 text-stone-500">Choose the issue type, set priority, and share enough detail for a faster recommendation.</p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-lg font-bold text-stone-900">Issue type</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {issueTypes.map((issue) => (
                  <button
                    key={issue.id}
                    type="button"
                    aria-label={`Select ${issue.label}`}
                    aria-pressed={form.issueType === issue.id}
                    onClick={() => update("issueType", issue.id)}
                    className={`flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all duration-200 focus:ring-2 focus:ring-forest-500 focus:outline-none ${form.issueType === issue.id ? "border-forest-500 bg-forest-50" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"}`}
                  >
                    <issue.icon className={`h-4 w-4 shrink-0 ${form.issueType === issue.id ? "text-forest-600" : "text-stone-400"}`} />
                    <span className="text-xs font-semibold text-stone-800">{issue.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-stone-900">Priority</h3>
              <div className="space-y-2">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    aria-label={`Select ${priority.label} priority`}
                    aria-pressed={form.priority === priority.value}
                    onClick={() => update("priority", priority.value)}
                    className={`w-full rounded-xl border-2 p-3 text-left transition-all duration-200 focus:ring-2 focus:ring-forest-500 focus:outline-none ${form.priority === priority.value ? "border-forest-500 bg-forest-50" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"}`}
                  >
                    <span className="text-sm font-bold text-stone-800">{priority.label}</span>
                    <p className="text-xs text-stone-500">{priority.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="property-name" className="mb-1 block text-sm font-semibold text-stone-700">
                  Property Name / Community
                </label>
                <input
                  id="property-name"
                  aria-label="Property name or community"
                  type="text"
                  value={form.propertyName}
                  onChange={(event) => update("propertyName", event.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                  placeholder="e.g. Oakwood HOA, 123 Main St"
                />
              </div>
              <div>
                <label htmlFor="contact-person" className="mb-1 block text-sm font-semibold text-stone-700">
                  Contact Person *
                </label>
                <input
                  id="contact-person"
                  aria-label="Contact person"
                  type="text"
                  value={form.contactPerson}
                  onChange={(event) => update("contactPerson", event.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div>
                <label htmlFor="property-phone" className="mb-1 block text-sm font-semibold text-stone-700">
                  Phone *
                </label>
                <input
                  id="property-phone"
                  aria-label="Phone number"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div>
                <label htmlFor="property-email" className="mb-1 block text-sm font-semibold text-stone-700">
                  Email
                </label>
                <input
                  id="property-email"
                  aria-label="Email address"
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div>
                <label htmlFor="property-type" className="mb-1 block text-sm font-semibold text-stone-700">
                  Property Type
                </label>
                <select
                  id="property-type"
                  aria-label="Property type"
                  value={form.propertyType}
                  onChange={(event) => update("propertyType", event.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                >
                  <option value="">Select...</option>
                  <option>HOA Community</option>
                  <option>Multifamily</option>
                  <option>Commercial</option>
                  <option>Retail Center</option>
                  <option>Office Park</option>
                  <option>Church / School</option>
                  <option>Country Club</option>
                  <option>Single Family Home</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="property-town" className="mb-1 block text-sm font-semibold text-stone-700">
                  Town
                </label>
                <input
                  id="property-town"
                  aria-label="Town"
                  type="text"
                  value={form.town}
                  onChange={(event) => update("town", event.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="issue-location" className="mb-1 block text-sm font-semibold text-stone-700">
                Issue Location on Property
              </label>
              <input
                id="issue-location"
                aria-label="Issue location on property"
                type="text"
                value={form.issueLocation}
                onChange={(event) => update("issueLocation", event.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                placeholder="e.g. Building 3 north side, pool area, entry monument"
              />
            </div>

            <div>
              <label htmlFor="issue-description" className="mb-1 block text-sm font-semibold text-stone-700">
                Description
              </label>
              <textarea
                id="issue-description"
                aria-label="Issue description"
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500"
                placeholder="Describe the issue. When did it start? How severe is it? Any safety concerns?"
              />
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Camera className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Attach photos by text</p>
                <p className="text-xs text-amber-700">
                  Text photos of the issue to <a href={`sms:${PHONE}`} className="font-bold underline">(704) 886-4240</a>. Mention the property name.
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-stone-100 pt-4">
              <button
                type="button"
                onClick={() => form.issueType && form.phone && form.contactPerson && setSubmitted(true)}
                disabled={!form.issueType || !form.phone || !form.contactPerson}
                aria-label="Submit property issue"
                className={`flex items-center gap-2 rounded-lg px-8 py-2.5 text-sm font-bold transition-all duration-200 focus:ring-2 focus:ring-forest-500 focus:outline-none ${form.issueType && form.phone && form.contactPerson ? "bg-forest-600 text-white hover:bg-forest-700" : "cursor-not-allowed bg-stone-200 text-stone-400"}`}
              >
                Submit Issue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 max-w-3xl">
            <h2 className="text-2xl font-extrabold text-stone-900 md:text-3xl">Answers for property managers and homeowners</h2>
            <p className="mt-2 text-stone-600">
              Submit anything from a single broken sprinkler to larger drainage or storm-related property concerns.
            </p>
          </div>
          <AeoBlock
            question={faqItems[0].q}
            shortAnswer={faqItems[0].a}
            commonCauses={[
              "Irrigation leaks, broken heads, and coverage problems",
              "Drainage failures, erosion, and water pooling",
              "Lighting outages, hardscape damage, and storm cleanup needs",
            ]}
            whatToDoNext="Choose the closest issue type, set the priority, and tell us exactly where it is happening."
            relatedQuestions={[faqItems[1].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[1].q}
            shortAnswer={faqItems[1].a}
            whenToCall="Photos help most when damage is visible, expanding, or tied to standing water or safety concerns."
            whatToDoNext="Submit the form, then text photos with the property name so we can match them quickly."
            relatedQuestions={[faqItems[0].q, faqItems[2].q]}
            showSchema={false}
          />
          <AeoBlock
            question={faqItems[2].q}
            shortAnswer={faqItems[2].a}
            whenToCall="If the issue creates active flooding, a trip hazard, or a safety risk, call right away instead of waiting on follow-up alone."
            whatToDoNext="Send the key details now so we can review the issue location, urgency, and likely scope."
            relatedQuestions={[faqItems[0].q, faqItems[1].q]}
            showSchema={false}
          />
        </section>
      </div>
    </Layout>
  );
}
