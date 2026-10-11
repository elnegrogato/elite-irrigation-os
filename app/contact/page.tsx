import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Our Charlotte Outdoor Services Team",
  description: "Contact Elite for irrigation, drainage, outdoor living, maintenance, billing, account, and support questions in the Charlotte metro.",
  alternates: { canonical: "https://eliteirrigation.com/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
