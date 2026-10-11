import { ChevronDown } from "lucide-react";

export default function FAQBlock(props: { faq: Array<{ q: string; a: string }> }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-extrabold text-stone-900 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {props.faq.map((f, idx) => (
          <details key={idx} className="group rounded-lg border border-stone-200 bg-white p-5 open:shadow-md transition-all">
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-stone-900 text-sm">
              {f.q}
              <span className="transition group-open:rotate-180">
                <ChevronDown className="w-4 h-4 text-forest-600" />
              </span>
            </summary>
            <p className="mt-3 text-stone-600 text-sm leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
