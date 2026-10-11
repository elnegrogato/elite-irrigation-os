import Link from "next/link";
import Layout from "./Layout";
import PageHero from "./PageHero";
import { ConversionPanel } from "./MarketingSections";

type LegalSection = {
  title: string;
  body: string;
};

export default function LegalPage({
  eyebrow,
  title,
  subtitle,
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: LegalSection[];
}) {
  return (
    <Layout>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} chips={["Plain language", "Customer clarity", "Updated May 14, 2026"]} />
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <article className="space-y-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
              <h2 className="text-xl font-serif font-bold text-stone-900">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">{section.body}</p>
            </section>
          ))}
        </article>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900">Legal links</h2>
            <nav className="mt-4 grid gap-2 text-sm font-semibold">
              <Link href="/terms" className="rounded-lg px-3 py-2 text-stone-700 hover:bg-white hover:text-forest-700">Terms of Service</Link>
              <Link href="/privacy" className="rounded-lg px-3 py-2 text-stone-700 hover:bg-white hover:text-forest-700">Privacy Policy</Link>
              <Link href="/cookies" className="rounded-lg px-3 py-2 text-stone-700 hover:bg-white hover:text-forest-700">Cookie Policy</Link>
              <Link href="/contact" className="rounded-lg px-3 py-2 text-stone-700 hover:bg-white hover:text-forest-700">Contact</Link>
            </nav>
          </div>
        </aside>
      </div>
      <ConversionPanel
        title="Need help before approving outdoor work?"
        body="Send the question and we will route it to the right person. Clear scope, clear communication, and no mystery handoffs."
        href="/contact"
        label="Contact Elite"
      />
    </Layout>
  );
}
