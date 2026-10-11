"use client";

import Link from "next/link";
import Layout from "../src/components/Layout";
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Layout>
      <section className="mx-auto max-w-3xl rounded-2xl border border-forest-200 bg-white p-6 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-forest-700">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-wider text-forest-700">500 Error</p>
        <h1 className="mt-3 text-3xl font-serif font-bold leading-tight text-stone-950 sm:text-5xl">
          Something stalled, but your next step is still clear.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-stone-700">
          The page hit an unexpected issue. Try again, return home, or send the request directly so the work can keep moving.
        </p>
        {error.digest ? <p className="mt-3 text-xs font-semibold text-stone-500">Reference: {error.digest}</p> : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-forest-600 px-6 py-3 text-sm font-bold text-white hover:bg-forest-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/quick-quote"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-900 hover:bg-stone-50"
          >
            Start a Request
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
