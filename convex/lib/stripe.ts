// convex/lib/stripe.ts
import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key, { apiVersion: "2024-06-20" as any });
}

export function siteUrl() {
  const u = process.env.SITE_URL;
  if (!u) throw new Error("SITE_URL not set");
  return u.replace(/\/+$/, "");
}