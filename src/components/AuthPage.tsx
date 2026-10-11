"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "convex/react";
import { ShieldCheck } from "lucide-react";
import { api } from "../../convex/_generated/api";

type AuthPageProps = {
  mode: "login" | "signup" | "forgot";
};

export default function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const login = useMutation(api.auth.login);
  const register = useMutation(api.auth.register);
  const requestPasswordReset = useMutation(api.auth.requestPasswordReset);
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const hasConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL && !process.env.NEXT_PUBLIC_CONVEX_URL.includes("placeholder"));
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!hasConvex) {
      setStatus("error");
      setMessage("Convex is not configured in this environment. Set NEXT_PUBLIC_CONVEX_URL to enable authentication.");
      return;
    }

    try {
      if (isForgot) {
        const result = await requestPasswordReset({ email: form.email });
        setStatus("success");
        setMessage(result?.message ?? "If an account exists, recovery instructions will be sent.");
        return;
      }

      if (isSignup) {
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
          role: "manager",
        });
        setStatus("success");
        setMessage("Account created. Sign in to launch the dashboard.");
        router.push("/login");
        return;
      }

      const result = await login({
        email: form.email,
        password: form.password,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      });

      if (result?.token) {
        localStorage.setItem("elite_session_token", result.token);
        localStorage.setItem("elite_session_expires_at", String(result.expiresAt));
        localStorage.setItem("elite_user", JSON.stringify(result.user));
      }

      setStatus("success");
      setMessage("Signed in. Launching the dashboard.");
      router.push("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Authentication failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
        <section>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest-700">
            <ShieldCheck className="h-5 w-5" />
            Elite Irrigation & Landscaping Portal
          </Link>
          <h1 className="mt-8 text-4xl font-serif font-bold leading-tight text-stone-950 sm:text-5xl">
            {isForgot ? "Recover access and get back to the work." : isSignup ? "Turn property requests into organized jobs." : "Launch your operations dashboard."}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            {isForgot
              ? "Reset your password securely. If your account exists, the system will guide you through the next verified step."
              : "Use one place to see leads, approvals, work orders, invoices, support requests, and field activity without hunting through messages."}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Secure sessions", "Role-based access", "Audit-ready activity"].map((item) => (
              <div key={item} className="rounded-xl border border-stone-200 bg-white p-4 text-sm font-bold text-stone-700">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xl sm:p-8">
          <h2 className="text-2xl font-extrabold text-stone-900">
            {isForgot ? "Reset password" : isSignup ? "Create account" : "Sign in"}
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            {isForgot ? "Enter your email to begin account recovery." : "Production auth is backed by Convex sessions and rate limiting."}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {isSignup && (
              <>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Name</span>
                  <input required className="mt-2 w-full rounded-xl border border-stone-200 p-4 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-100" type="text" autoComplete="name" value={form.name} onChange={update("name")} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Phone</span>
                  <input className="mt-2 w-full rounded-xl border border-stone-200 p-4 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-100" type="tel" autoComplete="tel" value={form.phone} onChange={update("phone")} />
                </label>
              </>
            )}
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Email</span>
              <input required className="mt-2 w-full rounded-xl border border-stone-200 p-4 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-100" type="email" autoComplete="email" value={form.email} onChange={update("email")} />
            </label>
            {!isForgot && (
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Password</span>
                <input required minLength={8} className="mt-2 w-full rounded-xl border border-stone-200 p-4 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-100" type="password" autoComplete={isSignup ? "new-password" : "current-password"} value={form.password} onChange={update("password")} />
              </label>
            )}
            {message ? (
              <div className={`rounded-xl p-4 text-sm font-semibold ${status === "error" ? "bg-white text-forest-700" : "bg-white text-forest-700"}`}>
                {message}
              </div>
            ) : null}
            <button disabled={status === "loading"} type="submit" className="min-h-12 w-full rounded-xl bg-forest-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-forest-700 disabled:opacity-60">
              {status === "loading" ? "Working..." : isForgot ? "Send Recovery Instructions" : isSignup ? "Create Secure Account" : "Launch My Dashboard"}
            </button>
          </form>
          <div className="mt-6 flex flex-col gap-2 text-sm text-stone-600 sm:flex-row sm:justify-between">
            {!isSignup && !isForgot && <Link href="/signup" className="font-bold text-forest-700">Create account</Link>}
            {!isForgot && <Link href="/forgot-password" className="font-bold text-forest-700">Forgot password?</Link>}
            {(isSignup || isForgot) && <Link href="/login" className="font-bold text-forest-700">Back to login</Link>}
          </div>
        </section>
      </div>
    </main>
  );
}
