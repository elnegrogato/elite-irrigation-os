// src/pages/BrandsIndexPage.tsx
import Layout from "../components/Layout";
import PageHero from "../components/PageHero";
import Breadcrumbs from "../components/Breadcrumbs";
import { brands } from "../data/brands";
import Link from "next/link";

export default function BrandsIndexPage() {
  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Brands" }]} />
      <PageHero title="Brands We Service" subtitle="We work with top-tier irrigation, hardscape, and lighting manufacturers." />
      <div className="grid md:grid-cols-3 gap-6">
        {brands.map(b => (
          <Link key={b.slug} href={`/brands/${b.slug}`} className="p-6 border border-slate-200 hover:border-elite-500 rounded-sm bg-white transition-all">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">{b.category}</div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{b.name}</h3>
            <p className="text-sm text-slate-600">{b.shortPitch}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}