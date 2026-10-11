import Link from "next/link";
import { Phone, MessageSquare, CheckCircle2 } from "lucide-react";

export default function AeoBlock(props: {
  question: string;
  shortAnswer: string;
  commonCauses?: string[];
  whenToCall?: string;
  whatToDoNext?: string;
  relatedQuestions?: string[];
  showSchema?: boolean;
}) {
  const schema = props.showSchema !== false ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: {
      "@type": "Question",
      name: props.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: props.shortAnswer,
      },
    },
  } : null;

  return (
    <div className="mb-6 rounded-2xl border border-forest-200 bg-white p-5 sm:p-6">
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-600">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold uppercase tracking-wider text-forest-700">
            Quick Answer
          </h3>
          <p className="mt-1 break-words text-lg font-semibold leading-snug text-stone-900">
            {props.question}
          </p>
        </div>
      </div>

      <p className="mb-4 leading-relaxed text-stone-700 sm:ml-11">
        {props.shortAnswer}
      </p>

      {props.commonCauses && props.commonCauses.length > 0 && (
        <div className="mb-4 sm:ml-11">
          <h4 className="font-bold text-stone-900 text-sm mb-2">Common Causes</h4>
          <ul className="space-y-1.5">
            {props.commonCauses.map((cause) => (
              <li key={cause} className="flex items-start gap-2 text-sm text-stone-600">
                <span className="text-forest-500 mt-1">•</span>
                {cause}
              </li>
            ))}
          </ul>
        </div>
      )}

      {props.whenToCall && (
        <div className="mb-4 rounded-lg border border-stone-200 bg-white p-4 sm:ml-11">
          <h4 className="font-bold text-stone-900 text-sm mb-1">When to Call Elite</h4>
          <p className="text-sm text-stone-600">{props.whenToCall}</p>
        </div>
      )}

      {props.whatToDoNext && (
        <div className="mb-4 sm:ml-11">
          <h4 className="font-bold text-stone-900 text-sm mb-2">What to Do Next</h4>
          <p className="text-sm text-stone-600 mb-3">{props.whatToDoNext}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <a
              href="tel:+17048864240"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-forest-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-forest-700"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Now
            </a>
            <a
              href="sms:+17048864240"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-forest-600 bg-white px-4 py-2 text-sm font-bold text-forest-700 transition-colors hover:bg-forest-50"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Text Us Photos
            </a>
            <Link
              href="/quick-quote"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-forest-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-forest-700"
            >
              Free Estimate
            </Link>
          </div>
        </div>
      )}

      {props.relatedQuestions && props.relatedQuestions.length > 0 && (
        <div className="border-t border-forest-200 pt-4 sm:ml-11">
          <h4 className="font-bold text-stone-900 text-sm mb-2">Related Questions</h4>
          <ul className="space-y-1">
            {props.relatedQuestions.map((q) => (
              <li key={q} className="text-sm text-forest-600 hover:text-forest-700 cursor-pointer">
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
