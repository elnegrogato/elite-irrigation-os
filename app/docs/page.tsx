import type { Metadata } from "next";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import PageHero from "../../src/components/PageHero";
import { ConversionPanel, DirectAnswer, OutcomeGrid, StepGrid } from "../../src/components/MarketingSections";
import { BookOpenCheck, Camera, ClipboardList, FileText, ShieldCheck, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Docs & Help Center",
  description: "Customer help center for Elite Irrigation & Landscaping estimates, scheduling, photo proof, invoices, service areas, and outdoor property workflows.",
  alternates: { canonical: "https://eliteirrigation.com/docs" },
};

export default function DocsPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Help Center"
        title="Understand the process before the crew arrives."
        subtitle="A practical guide to quotes, scheduling, documentation, invoices, and service handoffs for Elite customers and property managers."
        chips={["Estimate workflow", "Photo proof", "Scheduling", "Invoices", "Support"]}
      />

      <DirectAnswer>
        Elite's service process is simple: submit the issue, confirm scope, schedule the work, receive photo-documented completion notes, and pay through the approved invoice path when applicable.
      </DirectAnswer>

      <OutcomeGrid
        items={[
          { icon: ClipboardList, title: "For customers", body: "Know what to send, what happens next, and how to prepare for a visit." },
          { icon: Camera, title: "For property managers", body: "Use proof notes, scopes, and service records to keep stakeholders aligned." },
          { icon: ShieldCheck, title: "For operations", body: "Keep field work tied to documented approvals, invoices, and compliance rules." },
        ]}
      />

      <section className="mt-16">
        <h2 className="text-3xl font-serif font-bold text-stone-900">Popular guides</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { title: "How to request a quote", body: "What details and photos help us route your request quickly.", href: "/quick-quote" },
            { title: "How photo documentation works", body: "What gets captured before, during, and after service.", href: "/projects" },
            { title: "How service areas are routed", body: "See core, metro, and extended service-area expectations.", href: "/areas-we-serve" },
            { title: "How invoices and payment work", body: "Understand invoice status, balances, and payment expectations.", href: "/billing" },
          ].map((guide) => (
            <Link key={guide.title} href={guide.href} className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:border-forest-300 hover:shadow-md">
              <FileText className="h-5 w-5 text-forest-600" />
              <h3 className="mt-4 text-lg font-extrabold text-stone-900 group-hover:text-forest-700">{guide.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{guide.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-serif font-bold text-stone-900">How to get help fast</h2>
        <div className="mt-6">
          <StepGrid
            steps={[
              { title: "Send context", body: "Include address, service type, urgency, and photos if available." },
              { title: "Watch for triage", body: "The office routes the issue by location, category, and response need." },
              { title: "Approve the path", body: "You get the estimate, schedule, or service recommendation that fits the property." },
            ]}
          />
        </div>
      </section>

      <ConversionPanel
        title="Need a human instead of a help article?"
        body="Use support for account or billing questions, or start a quote for property work."
        href="/support"
        label="Open Support"
      />
    </Layout>
  );
}
