import type { Metadata } from "next";
import LegalPage from "../../src/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Understand how Elite Irrigation & Landscaping may use cookies and similar technologies for security, preferences, analytics, and service improvement.",
  alternates: { canonical: "https://eliteirrigation.com/cookies" },
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Cookies"
      title="Cookies should support a better visit, not get in the way."
      subtitle="This policy explains how cookies and similar technologies can support security, preferences, analytics, and service request performance."
      sections={[
        { title: "What cookies do", body: "Cookies can remember preferences, support secure sessions, measure page performance, understand traffic sources, and improve forms or scheduling workflows." },
        { title: "Types of cookies", body: "Essential cookies support security and core functionality. Analytics cookies help understand aggregate behavior. Preference cookies remember choices that make repeat visits easier." },
        { title: "Third-party tools", body: "Production deployments may include providers for analytics, payments, chat, email, SMS, or security. These tools may set cookies or similar identifiers according to their own policies." },
        { title: "Managing cookies", body: "Most browsers allow you to block, delete, or limit cookies. Blocking essential cookies may affect authentication, forms, payment flows, or saved preferences." },
        { title: "Consent", body: "Where required, deployments should include a consent banner or preference center that respects applicable privacy requirements and user choices." },
      ]}
    />
  );
}
