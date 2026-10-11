// src/pages/CostIndexPage.tsx
import Layout from "../components/Layout";
import PageHero from "../components/PageHero";
import Breadcrumbs from "../components/Breadcrumbs";
import { costPages } from "../data/costPages";
import Link from "next/link";

export default function CostIndexPage() {
  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Pricing & Cost" }]} />
      <PageHero title="Pricing Guides" subtitle="Transparent cost estimates for irrigation, drainage, and hardscape projects." />
      <div className="grid md:grid-cols-2 gap-6">
        {costPages.map(c => (
          <Link key={c.slug} href={`/cost/${c.slug}`} className="block p-6 rounded-sm border border-slate-200 bg-white hover:border-elite-500 hover:shadow-md transition-all">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{c.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-3">{c.summary}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}