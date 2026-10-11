import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Legal",
  description: "Legal policies for Elite Irrigation & Landscaping, including terms, privacy, and cookie information.",
  alternates: { canonical: "https://eliteirrigation.com/legal" },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  redirect("/terms");
}
