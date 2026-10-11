// src/pages/ProblemsIndexPage.tsx
import Layout from "../components/Layout";
import PageHero from "../components/PageHero";
import Breadcrumbs from "../components/Breadcrumbs";
import { problems } from "../data/problems";
import Link from "next/link";

export default function ProblemsIndexPage() {
  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Problems" }]} />
      <PageHero title="Troubleshooting Guide" subtitle="Identify common landscape and irrigation issues and find professional solutions." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map(p => (
          <Link key={p.slug} href={`/problems/${p.slug}`} className="block p-6 rounded-sm border border-slate-200 bg-white hover:border-elite-500 hover:shadow-md transition-all group">
            <div className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${p.severity === 'emergency' ? 'text-red-600' : 'text-slate-500'}`}>
              {p.severity} Priority
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-elite-700 mb-2">{p.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-3">{p.aeoShortAnswer}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}