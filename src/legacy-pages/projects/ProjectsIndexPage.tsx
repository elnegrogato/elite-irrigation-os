// src/pages/projects/ProjectsIndexPage.tsx
import Layout from "../../components/Layout";
import PageHero from "../../components/PageHero";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getRecentCaseStudiesStatic } from "../../lib/proofStatic";

function ProjectsList({ items }: { items: any[] }) {
  return (
    <Layout>
      <PageHero title="Projects Portfolio" subtitle="Real proof: documented before/after work and outcomes." />
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((cs: any) => (
          <Link key={cs._id} href={`/projects/case/${cs._id}`} className="group rounded-sm border border-slate-200 p-6 hover:border-elite-500 hover:shadow-lg transition-all bg-white">
            <div className="flex justify-between items-start mb-2">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-elite-600 transition-colors">
                    {cs.serviceSlug}
                </div>
                <div className="text-xs text-slate-400">{cs.locationSlug}</div>
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{cs.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{cs.summary}</p>
            
            {cs.media?.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-hidden h-24">
                    {cs.media.slice(0,3).map((m: any, i: number) => (
                        <img key={i} src={m.url} className="w-24 h-24 object-cover rounded-sm border border-slate-100" alt={m.caption || m.kind || "Project gallery image"} loading="lazy" />
                    ))}
                </div>
            )}
          </Link>
        ))}
        {items.length === 0 && (
            <div className="col-span-2 text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-sm">
                No published projects yet.
            </div>
        )}
      </div>
    </Layout>
  );
}

function ProjectsIndexLive() {
  const items = useQuery(api.caseStudies.listRecent, { limit: 30 }) ?? [];
  return <ProjectsList items={items} />;
}

function ProjectsIndexStatic() {
  const items = getRecentCaseStudiesStatic(30);
  return <ProjectsList items={items} />;
}

export default function ProjectsIndexPage() {
  return (import.meta as any).env.SSR ? <ProjectsIndexStatic /> : <ProjectsIndexLive />;
}
