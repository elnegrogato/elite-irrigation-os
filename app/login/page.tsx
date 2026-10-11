import type { Metadata } from "next";
import AuthPage from "../../src/components/AuthPage";

export const metadata: Metadata = {
  title: "Login | Elite Portal",
  description: "Secure login for Elite Irrigation & Landscaping operations dashboard.",
  alternates: { canonical: "https://eliteirrigation.com/login" },
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
