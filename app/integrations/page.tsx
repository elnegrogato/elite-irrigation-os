import type { Metadata } from "next";
import { CalendarDays, CreditCard, Mail, MessageSquare, ShieldCheck, Webhook } from "lucide-react";
import ProductPage from "../../src/components/ProductPage";

export const metadata: Metadata = {
  title: "Operations Integrations",
  description: "Stripe, Twilio, Resend, Google Calendar, webhooks, and Convex integrations for Elite Irrigation & Landscaping operations.",
  alternates: { canonical: "https://eliteirrigation.com/integrations" },
  robots: { index: false, follow: true },
};

export default function IntegrationsPage() {
  return (
    <ProductPage
      eyebrow="Integrations"
      title="Connect the tools that move customers, crews, and cash."
      subtitle="Elite's operations workflow uses integrations that create records, send updates, sync calendars, and close payment loops."
      chips={["Stripe", "Twilio", "Resend", "Google Calendar", "Convex", "Webhooks"]}
      directAnswer="Elite integrates with Stripe for payments, Twilio for SMS and voice intake, Resend for transactional email, Google Calendar for scheduling, and Convex for realtime operational data."
      outcomes={[
        { icon: CreditCard, title: "Stripe payments", body: "Checkout sessions and payment webhooks update invoice status and balances." },
        { icon: MessageSquare, title: "Twilio intake", body: "Inbound calls and messages can become leads with timeline events." },
        { icon: Mail, title: "Resend email", body: "Transactional estimate, invoice, reminder, and confirmation emails use consistent templates." },
        { icon: CalendarDays, title: "Calendar sync", body: "Appointments can sync with field schedules and calendar status tracking." },
        { icon: Webhook, title: "Webhook-ready", body: "HTTP endpoints handle provider events and keep backend records current." },
        { icon: ShieldCheck, title: "Security controls", body: "Rate limits, validation, CSRF helpers, and audit logging support safer integrations." },
      ]}
      steps={[
        { title: "Configure secrets", body: "Add provider keys in the deployment environment, not the repo." },
        { title: "Validate webhooks", body: "Confirm public URLs, webhook signatures, and expected payloads." },
        { title: "Watch activity", body: "Use admin timelines and logs to verify records update after provider events." },
      ]}
      ctaHref="/developer-api"
      ctaLabel="View Developer API"
    />
  );
}
