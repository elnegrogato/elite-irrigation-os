import type { Metadata } from "next";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import PageHero from "../../src/components/PageHero";
import { DirectAnswer } from "../../src/components/MarketingSections";
import { ArrowRight, Droplets, Lightbulb, MapPin, Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "Outdoor Service Resources",
  description: "Practical resources for irrigation, drainage, outdoor lighting, service areas, and property maintenance in the Charlotte metro.",
  alternates: { canonical: "https://eliteirrigation.com/resources" },
};

const resources = [
  { icon: Droplets, title: "Sprinkler repair guide", body: "Learn what dry spots, stuck valves, and high water bills usually mean.", href: "/services/sprinkler-repair" },
  { icon: Waves, title: "Drainage problem guide", body: "Understand standing water, erosion, and foundation-adjacent runoff before it worsens.", href: "/services/drainage-assessment" },
  { icon: Lightbulb, title: "Landscape lighting guide", body: "Plan safe, clean lighting for walkways, patios, trees, and entries.", href: "/services/landscape-lighting-installation" },
  { icon: MapPin, title: "Service area guide", body: "See how response expectations differ across core, metro, and extended routes.", href: "/areas-we-serve" },
];

export default function ResourcesPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Resources"
        title="Make better outdoor decisions before you spend."
        subtitle="Use these guides to identify the problem, understand the service path, and know what to send when requesting help."
        chips={["Irrigation", "Drainage", "Lighting", "Maintenance", "Charlotte Metro"]}
      />
      <DirectAnswer>
        Elite resources are written to help property owners understand symptoms, options, costs, proof needs, and next steps before booking outdoor service.
      </DirectAnswer>
      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((item) => (
          <Link key={item.title} href={item.href} className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:border-forest-300 hover:shadow-md sm:p-6">
            <item.icon className="h-6 w-6 text-forest-600" />
            <h2 className="mt-5 text-xl font-extrabold text-stone-900 group-hover:text-forest-700">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.body}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-forest-700">
              Read guide <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
