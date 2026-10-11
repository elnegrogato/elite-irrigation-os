import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Camera, ClipboardCheck, MapPin, ShieldCheck } from 'lucide-react';
import Layout from '../../src/components/Layout';
import PageHero from '../../src/components/PageHero';
import Breadcrumbs from '../../src/components/Breadcrumbs';
import CaseStudiesBlock from '../../src/components/CaseStudiesBlock';
import { getRecentCaseStudiesStatic } from '../../src/lib/proofStatic';

export const metadata: Metadata = {
  title: 'Charlotte Outdoor Project Portfolio',
  description: 'Documented irrigation, drainage, lighting, hardscape, and landscape work across the Charlotte metro area.',
  alternates: {
    canonical: 'https://eliteirrigation.com/projects',
  },
};

const proofCards = [
  {
    icon: Camera,
    title: 'Photo-documented work',
    body: 'Crews capture the before, during, and after details that matter for homeowners, managers, and boards.',
  },
  {
    icon: ClipboardCheck,
    title: 'Clear scope and outcomes',
    body: 'Projects are organized around the problem, the work performed, and the final result.',
  },
  {
    icon: MapPin,
    title: 'Local service proof',
    body: 'The portfolio supports nearby service pages with evidence from Charlotte-area properties.',
  },
  {
    icon: ShieldCheck,
    title: 'Professional standards',
    body: 'Licensed, insured exterior work with clean handoffs from estimate through completion.',
  },
];

export default function ProjectsPage() {
  const caseStudies = getRecentCaseStudiesStatic(12);

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects' }]} />
      <PageHero
        title="Projects Portfolio"
        subtitle="Documented irrigation, drainage, lighting, hardscape, and landscape work across the Charlotte metro area."
        chips={['Before & After Proof', 'Charlotte Metro', 'Photo Documentation']}
      />

      {caseStudies.length > 0 ? (
        <CaseStudiesBlock title="Recent documented projects" items={caseStudies} />
      ) : (
        <section className="mb-16 grid gap-5 md:grid-cols-2">
          {proofCards.map((card) => (
            <div key={card.title} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <card.icon className="w-6 h-6 text-forest-600 mb-5" />
              <h2 className="text-lg font-extrabold text-stone-900 mb-2">{card.title}</h2>
              <p className="text-sm leading-relaxed text-stone-600">{card.body}</p>
            </div>
          ))}
        </section>
      )}

      <section className="mb-20 rounded-2xl bg-forest-900 p-5 text-white sm:p-8 md:p-10">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Planning a project?</h2>
          <p className="text-forest-100 leading-relaxed mb-8">
            Tell us what is happening on the property and we will help match the right crew, scope, and next step.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/quick-quote" className="inline-flex items-center justify-center gap-2 bg-white text-forest-900 px-6 py-3 rounded-lg font-bold hover:bg-forest-50 transition-colors">
              Start a quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/services" className="inline-flex items-center justify-center gap-2 border border-forest-500 px-6 py-3 rounded-lg font-bold hover:bg-forest-800 transition-colors">
              Browse services
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
