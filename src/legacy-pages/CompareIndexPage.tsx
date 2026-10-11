// src/pages/CompareIndexPage.tsx
import Layout from "../components/Layout";
import PageHero from "../components/PageHero";
import Breadcrumbs from "../components/Breadcrumbs";
import { comparePages } from "../data/comparePages";
import Link from "next/link";

export default function CompareIndexPage() {
  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Comparisons" }]} />
      <PageHero title="Product & Method Comparisons" subtitle="Expert analysis to help you make the right choice for your property." />
      <div className="grid md:grid-cols-2 gap-6">
        {comparePages.map(c => (
          <Link key={c.slug} href={`/compare/${c.slug}`} className="block p-6 rounded-sm border border-slate-200 bg-white hover:border-elite-500 hover:shadow-md transition-all">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{c.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-3">{c.summary}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}