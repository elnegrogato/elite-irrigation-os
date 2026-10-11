import type { Metadata } from "next";
import { OnboardingPage } from "../../src/components/OperationsPages";

export const metadata: Metadata = {
  title: "Onboarding | Elite Portal",
  description: "Configure Convex, Stripe, Twilio, email, service routing, approvals, proof requirements, and operational launch settings.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OnboardingPage />;
}
