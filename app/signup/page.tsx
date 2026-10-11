import type { Metadata } from "next";
import AuthPage from "../../src/components/AuthPage";

export const metadata: Metadata = {
  title: "Create Account | Elite Portal",
  description: "Create a secure Elite portal account for operations, field work, and customer request management.",
  alternates: { canonical: "https://eliteirrigation.com/signup" },
};

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
