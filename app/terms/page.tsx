import type { Metadata } from "next";
import LegalPage from "../../src/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the service terms, estimate expectations, scheduling policies, payment rules, and customer portal terms for Elite Irrigation & Landscaping.",
  alternates: { canonical: "https://eliteirrigation.com/terms" },
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Clear terms for outdoor work that moves without confusion."
      subtitle="These terms explain how estimates, scheduling, approvals, payments, customer communications, and Elite portal access are handled."
      sections={[
        { title: "Estimates and scope", body: "Initial estimates are based on available information, site conditions, photos, and inspection findings. Written scopes define the work to be completed, key assumptions, exclusions, and any customer approvals needed before work begins." },
        { title: "Scheduling", body: "Appointment windows may shift because of weather, emergency service, material availability, utility marking, site access, or safety conditions. Elite communicates meaningful changes as soon as reasonably possible." },
        { title: "Customer responsibilities", body: "Customers are responsible for accurate contact details, property access, utility or HOA constraints they know about, pets, gate codes, and timely approval of estimates, invoices, or change requests." },
        { title: "Payments", body: "Payment terms are stated on the estimate or invoice. Deposits, progress payments, partial payments, and balances may be processed through supported payment providers such as Stripe." },
        { title: "Proof and completion", body: "Photo documentation, technician notes, and manager approvals may be used to verify completion. Some work requires testing windows or follow-up checks before final closeout." },
        { title: "Platform access", body: "Elite administrative, customer, and field portals are provided for operational use. Users must protect credentials, access only authorized data, and report suspected security issues promptly." },
      ]}
    />
  );
}
