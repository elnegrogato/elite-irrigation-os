import type { Metadata } from "next";
import TechJobClient from "./TechJobClient";

export const metadata: Metadata = {
  title: "Job Detail | Elite Tech",
  robots: { index: false, follow: false },
};

export default function TechJobPage() {
  return <TechJobClient />;
}
