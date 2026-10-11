import type { Metadata } from "next";
import LegalPage from "../../src/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Elite Irrigation & Landscaping collects, uses, protects, and retains customer, lead, payment, communication, and operational data.",
  alternates: { canonical: "https://eliteirrigation.com/privacy" },
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Your property details should help the job, not create uncertainty."
      subtitle="This policy explains what Elite collects, why it is collected, and how it supports estimates, scheduling, communication, billing, and service proof."
      sections={[
        { title: "Information we collect", body: "We may collect name, phone, email, address, service request details, photos, messages, scheduling preferences, payment status, and operational notes needed to respond to and complete work." },
        { title: "How information is used", body: "Information is used to create leads, route requests, prepare estimates, schedule crews, communicate updates, process payments, maintain records, and improve service quality." },
        { title: "Service providers", body: "Elite may use trusted providers for hosting, payments, email, SMS, analytics, security, and operational tooling. These providers are used to support the requested service and business operations." },
        { title: "Data protection", body: "Access should be limited to authorized users. Production deployments should use secure headers, encrypted transport, strong secrets, webhook verification, logging, and role-based access controls." },
        { title: "Retention", body: "Operational records may be retained for customer history, warranty reference, compliance, accounting, security, and business reporting unless deletion is required by applicable law." },
        { title: "Choices", body: "Customers can request updates, corrections, communication preference changes, or privacy questions through the contact page or published business contact channels." },
      ]}
    />
  );
}
