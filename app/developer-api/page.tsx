import type { Metadata } from "next";
import { Code2, KeyRound, LockKeyhole, RadioTower, ScrollText, ShieldCheck } from "lucide-react";
import ProductPage from "../../src/components/ProductPage";

export const metadata: Metadata = {
  title: "Developer API",
  description: "Developer-facing API and webhook overview for Elite Irrigation & Landscaping integrations, API keys, security, and operational events.",
  alternates: { canonical: "https://eliteirrigation.com/developer-api" },
  robots: { index: false, follow: true },
};

export default function DeveloperApiPage() {
  return (
    <ProductPage
      eyebrow="Developer API"
      title="Build integrations without losing operational control."
      subtitle="Use structured webhooks, API keys, and activity events to connect Elite workflows to external systems while preserving auditability."
      chips={["API keys", "Webhooks", "Audit log", "Rate limits", "Secure secrets"]}
      directAnswer="The Elite developer API is designed around secure API keys, provider webhooks, structured operational events, and Convex-backed records. Production API keys should be generated, scoped, rotated, and audited from the admin area."
      outcomes={[
        { icon: KeyRound, title: "Scoped API keys", body: "Prepare keys by purpose: intake, reporting, billing, or internal automation." },
        { icon: RadioTower, title: "Webhook events", body: "Stripe, Twilio, and internal system events can update records automatically." },
        { icon: ScrollText, title: "Activity trail", body: "Operational events stay visible for support, debugging, and compliance review." },
        { icon: LockKeyhole, title: "Secret hygiene", body: "Keys belong in deployment env vars and secret stores, never committed source." },
        { icon: ShieldCheck, title: "Validation layer", body: "Payloads, signatures, and rate limits protect public entry points." },
        { icon: Code2, title: "Typed backend", body: "Convex functions keep data contracts close to the database schema." },
      ]}
      steps={[
        { title: "Create key", body: "Generate a scoped key in the API Keys area after auth is configured." },
        { title: "Connect endpoint", body: "Point providers or internal automations at the documented HTTP routes." },
        { title: "Audit activity", body: "Review event logs and admin records after each integration test." },
      ]}
      ctaHref="/api-keys"
      ctaLabel="Manage API Keys"
    />
  );
}
