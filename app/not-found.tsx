'use client';

import Link from "next/link";
import Layout from "../src/components/Layout";
import { Phone, MessageSquare, Droplets, ArrowRight, Wrench, Lightbulb, Trees } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Droplets className="w-10 h-10 text-forest-600" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 mb-4">
            We can't find this page, but we can fix your yard.
          </h1>

          <p className="text-lg text-stone-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            The page you're looking for doesn't exist. But if you're a Charlotte-area homeowner looking for award-winning irrigation, expert drainage, or custom hardscapes, you're exactly where you need to be.
          </p>

          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="tel:+17048864240"
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-forest-600 px-6 py-3 font-bold text-white transition-colors hover:bg-forest-700"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href="sms:+17048864240"
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-forest-600 bg-white px-6 py-3 font-bold text-forest-700 transition-colors hover:bg-forest-50"
            >
              <MessageSquare className="w-5 h-5" />
              Text Us Photos
            </a>
            <Link
              href="/quick-quote"
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-forest-500 px-6 py-3 font-bold text-white transition-colors hover:bg-forest-700"
            >
              Request Free Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wrench, label: "Emergency Sprinkler Repair", to: "/services/sprinkler-repair" },
              { icon: Droplets, label: "Drainage Solutions", to: "/services/drainage-assessment" },
              { icon: Lightbulb, label: "Landscape Lighting", to: "/services/landscape-lighting-installation" },
              { icon: Trees, label: "Outdoor Living", to: "/services/paver-patio-installation" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.to}
                className="group p-4 rounded-xl border border-stone-200 hover:border-forest-300 hover:shadow-md transition-all"
              >
                <link.icon className="w-6 h-6 text-forest-600 mb-2" />
                <div className="font-bold text-stone-900 text-sm">{link.label}</div>
                <span className="text-forest-600 text-xs font-semibold mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn More →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Link href="/" className="text-forest-600 font-bold hover:underline text-sm">
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
