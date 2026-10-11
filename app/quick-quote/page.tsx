import type { Metadata } from "next";
import QuickQuoteClient from "./QuickQuoteClient";

export const metadata: Metadata = {
  title: "Quick Outdoor Service Quote Charlotte NC",
  description:
    "Request an irrigation, drainage, landscaping, hardscape, lighting, turf, seasonal, commercial, HOA, or estate maintenance quote from Elite Irrigation & Landscaping.",
  alternates: { canonical: "https://eliteirrigation.com/quick-quote" },
};

export default function QuickQuotePage() {
  return <QuickQuoteClient />;
}
