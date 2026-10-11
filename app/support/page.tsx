import type { Metadata } from "next";
import { Headphones, Mail, MessageSquare, Phone, Search, ShieldCheck } from "lucide-react";
import ProductPage from "../../src/components/ProductPage";

export const metadata: Metadata = {
  title: "Customer Support",
  description: "Get help with estimates, invoices, service records, account access, and Elite Irrigation & Landscaping operational questions.",
  alternates: { canonical: "https://eliteirrigation.com/support" },
};

export default function SupportPage() {
  return (
    <ProductPage
      eyebrow="Support"
      title="Get unstuck without repeating the whole story."
      subtitle="Support starts with context: who you are, what property or account is affected, and what next step you need."
      chips={["Account help", "Billing support", "Service records", "Estimate questions"]}
      directAnswer="For service requests, use Quick Quote. For account, invoice, support, or operations questions, contact support with your name, email, property address, and the specific record or issue."
      outcomes={[
        { icon: Headphones, title: "Account help", body: "Get assistance with dashboard access, profile details, and role-related questions." },
        { icon: Mail, title: "Invoice questions", body: "Clarify invoice status, payment links, balances, and receipt records." },
        { icon: Search, title: "Record lookup", body: "Use lead, work order, property, or invoice context to find the right answer faster." },
        { icon: MessageSquare, title: "Photo context", body: "For property issues, sending photos can reduce back-and-forth." },
        { icon: Phone, title: "Urgent help", body: "Call for same-day operational issues or active service disruptions." },
        { icon: ShieldCheck, title: "Private handling", body: "Support avoids sensitive data in public channels and uses verified records when configured." },
      ]}
      steps={[
        { title: "Choose request type", body: "Service issue, invoice, account access, or integration question." },
        { title: "Include identifiers", body: "Add email, property address, invoice, or lead context when you have it." },
        { title: "Get the next step", body: "Support routes the issue to the right operational owner." },
      ]}
      ctaHref="/contact"
      ctaLabel="Contact Support"
    />
  );
}
