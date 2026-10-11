import type { Metadata } from "next";
import { Camera, ClipboardCheck, HardHat, MapPin, ShieldCheck, Users } from "lucide-react";
import ProductPage from "../../src/components/ProductPage";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join a Charlotte-area outdoor services team built around craftsmanship, documentation, and reliable property work.",
  alternates: { canonical: "https://eliteirrigation.com/careers" },
};

export default function CareersPage() {
  return (
    <ProductPage
      eyebrow="Careers"
      title="Do outdoor work you can stand behind."
      subtitle="Elite is built for people who value clean execution, clear communication, and property work that looks better after the crew leaves."
      chips={["Field crews", "Operations", "Irrigation", "Drainage", "Maintenance"]}
      directAnswer="Elite hires field and operations team members who can show up reliably, communicate clearly, work safely, and document job results. Open roles should be confirmed directly with the office before applying."
      outcomes={[
        { icon: HardHat, title: "Field craftsmanship", body: "Work on irrigation, drainage, hardscape, lighting, turf, and maintenance projects." },
        { icon: Camera, title: "Documented pride", body: "Use proof photos and notes to show the work was completed correctly." },
        { icon: Users, title: "Crew rhythm", body: "Join teams that depend on timing, preparation, and clean handoffs." },
        { icon: ClipboardCheck, title: "Process support", body: "Use scopes, checklists, and closeout standards instead of guesswork." },
        { icon: ShieldCheck, title: "Safety first", body: "Follow safe practices around equipment, materials, driving, and job sites." },
        { icon: MapPin, title: "Charlotte metro routes", body: "Serve Harrisburg, Charlotte, Concord, Lake Norman, and surrounding communities." },
      ]}
      ctaHref="/contact"
      ctaLabel="Ask About Open Roles"
    />
  );
}
