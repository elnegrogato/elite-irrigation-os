import type { Metadata } from "next";
import AuthPage from "../../src/components/AuthPage";

export const metadata: Metadata = {
  title: "Reset Password | Elite Portal",
  description: "Recover access to an Elite portal account.",
  alternates: { canonical: "https://eliteirrigation.com/forgot-password" },
};

export default function ForgotPasswordPage() {
  return <AuthPage mode="forgot" />;
}
