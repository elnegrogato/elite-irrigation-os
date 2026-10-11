import type { Metadata } from "next";
import BookNowClient from "./BookNowClient";

export const metadata: Metadata = {
  title: "Book Irrigation, Drainage & Landscaping Service",
  description:
    "Book irrigation repair, drainage help, landscaping, maintenance, lighting, hardscape, seasonal, commercial, HOA, or estate service with Elite Irrigation & Landscaping.",
  alternates: { canonical: "https://eliteirrigation.com/book-now" },
};

export default function BookNowPage() {
  return <BookNowClient />;
}
