import React from 'react';
import Link from 'next/link';
import Layout from '../../src/components/Layout';
import PageHero from '../../src/components/PageHero';
import { ArrowRight, Camera, CheckCircle2, Clock, MapPin, ShieldCheck, Users, Wrench } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Our Charlotte Irrigation & Landscaping Team',
  description: 'Learn about our Harrisburg, NC based team. Over 20 years of experience providing professional irrigation, drainage, and landscaping services to the Charlotte metro area.',
  alternates: { canonical: 'https://eliteirrigation.com/about' },
};

export default function AboutPage() {
  return (
    <Layout>
      <PageHero 
        title="About Elite" 
        subtitle="A Harrisburg-based outdoor services team built around responsive scheduling, documented work, and clear communication for Charlotte-area properties." 
        chips={["Est. 2004", "Licensed & Insured", "Family Owned"]}
      />

      <section className="mb-16 grid gap-10 lg:grid-cols-3 lg:items-start">
        <div className="min-w-0 lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Our Story</span>
          <h2 className="mt-3 text-3xl font-serif font-bold leading-tight text-stone-900">Outdoor work should feel organized from the first call.</h2>
          <div className="mt-6 space-y-4 text-stone-700 leading-relaxed">
            <p>
              Elite Irrigation & Landscaping started with a single truck and a simple promise: show up when we say we will, and do the job right.
            </p>
            <p>
              Over the last 20 years, we've grown into a full-service exterior systems provider, but our core values haven't changed. We know that homeowners in North Carolina appreciate straightforward communication and craftsmanship that lasts.
            </p>
            <p>
              Whether it's a complex drainage correction or a simple sprinkler repair, we treat every property like it's our own. No shortcuts, no hidden fees, just honest work.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/quick-quote" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-forest-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-forest-700">
              Start a Quick Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/projects" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-6 py-3 text-sm font-bold text-stone-700 transition-colors hover:bg-stone-50">
              See Project Proof
            </Link>
          </div>
        </div>
        <aside className="rounded-2xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
           <h3 className="font-bold text-lg text-stone-900 mb-6">Why Choose Us?</h3>
           <ul className="space-y-5">
             {[
               { icon: ShieldCheck, title: 'Licensed & Insured', body: 'Professional coverage and NC irrigation licensing for protected property work.' },
               { icon: Camera, title: 'Photo-Documented', body: 'Before, during, and after notes help remove guesswork from each job.' },
               { icon: Wrench, title: 'Proper Tools', body: 'The right equipment keeps visits cleaner, faster, and easier to verify.' },
               { icon: Clock, title: 'Reliable Scheduling', body: 'Clear arrival windows, direct communication, and prompt follow-up.' },
             ].map((item) => (
               <li key={item.title} className="flex items-start gap-3">
                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-forest-700 shadow-sm">
                   <item.icon className="h-5 w-5" />
                 </div>
                 <div className="min-w-0">
                   <div className="font-bold text-stone-900">{item.title}</div>
                   <div className="text-sm leading-relaxed text-stone-600">{item.body}</div>
                 </div>
               </li>
             ))}
           </ul>
           <div className="mt-8 rounded-xl border border-forest-200 bg-white p-4">
             <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
               <MapPin className="h-4 w-4 text-forest-600" />
               Harrisburg HQ
             </div>
             <p className="mt-2 text-sm leading-relaxed text-stone-600">Serving Harrisburg, Concord, Charlotte, Lake Norman, Matthews, and surrounding communities.</p>
           </div>
        </aside>
      </section>

      <section className="mb-16 border-y border-stone-200 py-12">
        <div className="mb-8 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">How We Work</span>
          <h2 className="mt-3 text-3xl font-serif font-bold leading-tight text-stone-900">A simple process that keeps outdoor projects moving.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Triage the need', body: 'We identify urgency, service type, location, and whether photos can clarify the issue.' },
            { title: 'Scope the fix', body: 'You get a clear recommendation, estimate path, and schedule expectation before work begins.' },
            { title: 'Document the result', body: 'Crews close the loop with photos, notes, testing, and a clean handoff.' },
          ].map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-stone-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-sm font-black text-white">{index + 1}</div>
              <h3 className="mt-6 text-lg font-extrabold text-stone-900">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Team Structure</span>
          <h2 className="mt-3 text-3xl font-serif font-bold text-stone-900">The roles behind a smooth visit.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
           {[
             { role: "Owner-led Operations", bio: "Sets standards for communication, scope clarity, and job quality." },
             { role: "Field Specialists", bio: "Irrigation, drainage, hardscape, lighting, and maintenance crews with the tools for the work." },
             { role: "Customer Coordination", bio: "Keeps estimate requests, routes, scheduling, and follow-up organized." }
           ].map((member) => (
             <div key={member.role} className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-forest-700">
                 <Users className="h-8 w-8" />
               </div>
               <div className="font-bold text-stone-900">{member.role}</div>
               <p className="mt-2 text-sm leading-relaxed text-stone-500">{member.bio}</p>
             </div>
           ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-stone-600">
          <CheckCircle2 className="h-4 w-4 text-forest-600" />
          Licensed, insured, and built for repeatable service quality.
        </div>
      </section>
    </Layout>
  );
}
