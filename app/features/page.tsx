import type { Metadata } from "next";
import { Activity, Bell, CalendarDays, ClipboardCheck, CreditCard, Route } from "lucide-react";
import ProductPage from "../../src/components/ProductPage";

export const metadata: Metadata = {
  title: "Customer & Field Workflow",
  description: "See how Elite Irrigation & Landscaping manages requests, estimates, scheduling, photo proof, invoices, notifications, and field operations.",
  alternates: { canonical: "https://eliteirrigation.com/features" },
  robots: { index: false, follow: true },
};

export default function FeaturesPage() {
  return (
    <ProductPage
      eyebrow="Features"
      title="Run outdoor work from first request to paid invoice."
      subtitle="Elite turns scattered calls, texts, estimates, schedules, proof, and billing into one visible service rhythm."
      chips={["Lead pipeline", "Scheduling", "Photo proof", "Invoices", "Activity log"]}
      directAnswer="Elite's workflow connects the public website, customer forms, field work orders, proof capture, invoices, notifications, and admin reporting so every customer request has a visible next step."
      outcomes={[
        { icon: Activity, title: "Lead pipeline clarity", body: "See new requests, urgency, source, assignment, SLA timing, and follow-up status in one place." },
        { icon: CalendarDays, title: "Schedule with context", body: "Connect appointments, routes, work orders, crews, service type, and property notes." },
        { icon: ClipboardCheck, title: "Proof before closeout", body: "Require before/after media and notes before work is marked complete." },
        { icon: CreditCard, title: "Invoice status visibility", body: "Track draft, sent, paid, partial, and balance-due states for every invoice." },
        { icon: Bell, title: "Operational alerts", body: "Surface approvals, urgent leads, failed messages, and compliance reminders before they become problems." },
        { icon: Route, title: "Route-aware work", body: "Use service area, appointment timing, and crew assignment to keep field work organized." },
      ]}
      steps={[
        { title: "Capture", body: "Forms, calls, texts, and webhooks create structured leads with intent and urgency." },
        { title: "Coordinate", body: "Managers assign, schedule, estimate, and approve work from the admin surfaces." },
        { title: "Close the loop", body: "Crews document completion, invoices update status, and activity stays auditable." },
      ]}
      bullets={["One operating record per customer request", "Admin visibility into live forms and field activity", "Mobile-first workflows for office and field users", "Proof and approvals built into the service lifecycle"]}
      ctaTitle="Launch the dashboard that makes outdoor work visible."
      ctaBody="Start with the public request flow, then manage everything from the operations dashboard."
      ctaHref="/dashboard"
      ctaLabel="Launch My Dashboard"
    />
  );
}
