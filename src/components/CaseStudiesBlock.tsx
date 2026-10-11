/* eslint-disable @next/next/no-img-element */
// src/components/CaseStudiesBlock.tsx
export default function CaseStudiesBlock(props: {
  title: string;
  items: Array<{
    title: string;
    summary: string;
    scopeBullets: string[];
    outcomeBullets: string[];
    media: Array<{ url: string; kind: string; caption?: string }>;
    locationSlug: string;
  }>;
}) {
  if (!props.items?.length) return null;

  return (
    <section className="mt-16 border-t border-stone-200 pt-12">
      <h2 className="mb-8 break-words text-2xl font-serif font-bold leading-tight text-stone-900 sm:text-3xl">{props.title}</h2>
      <div className="space-y-8">
        {props.items.map((cs, idx) => (
          <article key={idx} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6">
               <h3 className="break-words text-lg font-bold text-stone-900 sm:text-xl">{cs.title}</h3>
               <p className="mt-2 leading-relaxed text-stone-600">{cs.summary}</p>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 sm:p-6">
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-forest-700">Project Scope</div>
                <ul className="space-y-2 text-sm text-stone-700">
                  {cs.scopeBullets.slice(0, 6).map(b => <li key={b}>{b}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 sm:p-6">
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-forest-700">Key Outcomes</div>
                <ul className="space-y-2 text-sm text-stone-700">
                  {cs.outcomeBullets.slice(0, 6).map(b => <li key={b}>{b}</li>)}
                </ul>
              </div>
            </div>

            {cs.media?.length ? (
              <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-4">
                {cs.media.slice(0, 4).map((m, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-stone-200">
                    <img src={m.url} alt={m.caption ?? m.kind} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute bottom-0 left-0 w-full bg-stone-950/75 p-2 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                       {m.caption ?? m.kind}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
