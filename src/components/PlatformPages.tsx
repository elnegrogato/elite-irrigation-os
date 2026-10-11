"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Layers,
  Phone,
  Sparkles,
} from "lucide-react";
import Layout from "./Layout";
import Breadcrumbs from "./Breadcrumbs";
import PageHero from "./PageHero";
import {
  PlatformPillar,
  maintenancePlans,
  phoneDisplay,
  phoneHref,
  platformFlow,
  problemFinderItems,
  siteUrl,
} from "../lib/outdoorPlatform";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-3xl">
      <span className="text-xs font-extrabold uppercase tracking-widest text-forest-700">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-serif font-semibold leading-tight text-stone-950 sm:text-4xl">
        {title}
      </h2>
      {body ? <p className="mt-4 text-base leading-relaxed text-stone-600">{body}</p> : null}
    </div>
  );
}

export function PlatformLandingPage({ pillar }: { pillar: PlatformPillar }) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pillar.title,
    description: pillar.subheadline,
    url: `${siteUrl}/${pillar.slug}`,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "Elite Irrigation & Landscaping",
      telephone: "+1-704-886-4240",
      url: siteUrl,
    },
    areaServed: ["Charlotte", "Harrisburg", "Concord", "Huntersville", "Cornelius", "Matthews"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${pillar.label} service options`,
      itemListElement: pillar.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.label,
          url: `${siteUrl}${service.href}`,
        },
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pillar.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <Layout>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: pillar.label }]} />

      <PageHero
        eyebrow={pillar.eyebrow}
        title={pillar.title}
        subtitle={pillar.subheadline}
        chips={pillar.chips}
        primaryCta={{ href: pillar.primaryHref, label: pillar.primaryCta }}
        secondaryCta={{ href: pillar.secondaryHref, label: pillar.secondaryCta }}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-forest-900 text-forest-100">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-serif font-semibold text-stone-950">
            From “something is wrong outside” to a clear next step.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600">{pillar.transformation}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {pillar.symptoms.map((symptom) => (
              <div key={symptom} className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
                <p className="text-sm font-semibold leading-relaxed text-stone-800">{symptom}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-forest-900/15 bg-[linear-gradient(135deg,#052e16_0%,#11100d_72%,#052e16_100%)] p-5 text-white shadow-2xl shadow-stone-900/15 sm:p-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-forest-200">Fast route</span>
          <h2 className="mt-3 text-2xl font-serif font-semibold leading-tight">Send photos. Get routed.</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-300">
            The fastest way to get clarity is to describe the issue, add the address, and send photos of the affected area.
          </p>
          <div className="mt-5 grid gap-3">
            <Link href={pillar.primaryHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest-500 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-forest-400">
              {pillar.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="sms:+17048864240" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white/10">
              <Camera className="h-4 w-4 text-forest-200" />
              Text Photos
            </a>
            <a href={phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white/10">
              <Phone className="h-4 w-4 text-forest-200" />
              {phoneDisplay}
            </a>
          </div>
        </aside>
      </section>

      <section className="mt-16">
        <SectionHeader
          eyebrow={`${pillar.label} Services`}
          title="Choose the service path that matches the problem."
          body="Each path is organized by symptoms and outcomes, so customers can start with what they are seeing and move toward the right service."
        />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillar.services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-forest-300 hover:shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-forest-700 transition-colors group-hover:bg-forest-600 group-hover:text-white">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold leading-tight text-stone-950 group-hover:text-forest-700">
                {service.label}
              </h3>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-forest-700">
                View service
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
        <SectionHeader
          eyebrow="How The Work Moves"
          title="A practical path from diagnosis to documentation."
          body="Every outdoor request should become easier to understand, price, schedule, and maintain."
        />
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillar.process.map((step, index) => (
            <div key={step} className="rounded-2xl bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-900 text-sm font-black text-white">
                {index + 1}
              </div>
              <p className="mt-5 text-sm font-semibold leading-relaxed text-stone-700">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-8">
          <SectionHeader eyebrow="Pricing Logic" title="Transparent ranges without guessing from the curb." body={pillar.pricing} />
          <Link href="/pricing" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest-600 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-forest-700">
            See Pricing Approach
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-8">
          <SectionHeader eyebrow="Proof System" title="Better outdoor work should leave a clean record." />
          <div className="mt-6 grid gap-3">
            {pillar.proofPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl bg-white p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
                <p className="text-sm font-semibold leading-relaxed text-stone-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader eyebrow="Common Questions" title={`Answers before you request ${pillar.label.toLowerCase()} work.`} />
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {pillar.faqs.map((faq) => (
            <article key={faq.q} className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="text-base font-extrabold leading-tight text-stone-950">{faq.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 overflow-hidden rounded-3xl border border-forest-900/20 bg-[radial-gradient(circle_at_top_right,rgba(52,212,116,0.24),transparent_35%),linear-gradient(135deg,#052e16_0%,#11100d_64%,#052e16_100%)] p-5 text-white shadow-2xl shadow-stone-900/15 sm:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-forest-200">Next Step</span>
            <h2 className="mt-3 text-3xl font-serif font-semibold leading-tight sm:text-4xl">
              Need this handled? Send the details and we will route the right next step.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-300">
              Photos, address, timeline, and what you are seeing help us recommend the right service, visit, plan, or proposal.
            </p>
          </div>
          <div className="grid gap-3">
            <Link href={pillar.primaryHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest-500 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-forest-400">
              {pillar.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white/10">
              <Phone className="h-4 w-4 text-forest-200" />
              Call {phoneDisplay}
            </a>
          </div>
        </div>
      </section>

    </Layout>
  );
}

export function ProblemHubPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Outdoor property problem finder",
    itemListElement: problemFinderItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `${siteUrl}${item.href}`,
    })),
  };

  return (
    <Layout>
      <JsonLd data={schema} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Problems" }]} />
      <PageHero
        eyebrow="Problem Finder"
        title="Find the right outdoor service based on what is happening on your property."
        subtitle="Customers do not always know whether they need irrigation repair, drainage correction, grading, sod, lighting, landscaping, or maintenance. Start with the symptom and move toward the right next step."
        chips={["Irrigation symptoms", "Drainage symptoms", "Hardscape issues", "Maintenance triggers"]}
        primaryCta={{ href: "/quick-quote", label: "Get Diagnosis" }}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {problemFinderItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-forest-300 hover:shadow-xl"
          >
            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-forest-700">
              {item.category}
            </span>
            <h2 className="mt-4 text-xl font-serif font-semibold leading-tight text-stone-950 group-hover:text-forest-700">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.symptom}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-forest-700">
              Find the fix
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-16 rounded-3xl border border-stone-200 bg-white p-5 sm:p-8">
        <SectionHeader
          eyebrow="Diagnostic Engine"
          title="Diagnose the issue. Plan the fix. Keep the property managed."
          body="That sequence helps homeowners, HOAs, estate owners, and property managers stop guessing and start with the right service path."
        />
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {platformFlow.map((item, index) => (
            <div key={item.title} className="rounded-2xl bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-xs font-black text-white">
                  {index + 1}
                </div>
                <h3 className="font-extrabold text-stone-950">{item.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-stone-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export function PlansHubPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Outdoor property maintenance plans",
    itemListElement: maintenancePlans.map((plan, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: plan.title,
    })),
  };

  return (
    <Layout>
      <JsonLd data={schema} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Plans" }]} />
      <PageHero
        eyebrow="Maintenance Plans"
        title="Outdoor property care plans for lawns, landscapes, irrigation, HOAs, commercial sites, and estates."
        subtitle="Choose a recurring plan when the goal is not one repair, but a property that stays managed, monitored, and ready season after season."
        chips={["Residential", "Commercial", "HOA", "Estate", "Irrigation checks"]}
        primaryCta={{ href: "/quick-quote", label: "Get Maintenance Plan" }}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {maintenancePlans.map((plan) => (
          <article key={plan.title} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-forest-900 text-forest-100">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <span className="mt-5 block text-xs font-extrabold uppercase tracking-widest text-forest-700">{plan.audience}</span>
            <h2 className="mt-2 text-2xl font-serif font-semibold leading-tight text-stone-950">{plan.title}</h2>
            <div className="mt-5 grid gap-3">
              {plan.details.map((detail) => (
                <div key={detail} className="flex items-start gap-3 rounded-2xl bg-white p-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" />
                  <p className="text-sm font-semibold leading-relaxed text-stone-700">{detail}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-16 overflow-hidden rounded-3xl border border-forest-900/20 bg-[linear-gradient(135deg,#052e16_0%,#11100d_68%,#052e16_100%)] p-5 text-white shadow-2xl shadow-stone-900/15 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-forest-200">Recurring Care</span>
            <h2 className="mt-3 text-3xl font-serif font-semibold leading-tight">Keep the property looking managed all season.</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-300">
              Lawn care, bed refresh, irrigation checks, seasonal cleanup, weed and pest control, reporting, and priority scheduling can be shaped around the property type.
            </p>
          </div>
          <div className="grid gap-3">
            <Link href="/quick-quote" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest-500 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-forest-400">
              Request Plan Recommendation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white/10">
              <Phone className="h-4 w-4 text-forest-200" />
              Call {phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
