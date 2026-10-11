"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AppShell, EmptyState } from "./AppShell";
import { useAuth } from "./AuthProvider";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  KeyRound,
  MessageSquare,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
const hasConvex = Boolean(convexUrl && !convexUrl.includes("placeholder"));

type Metric = {
  label: string;
  value: string;
  helper: string;
};

const fallbackMetrics: Metric[] = [
  { label: "New leads", value: "0", helper: "Connect Convex to stream live requests." },
  { label: "Open work orders", value: "0", helper: "Jobs appear here after dispatch." },
  { label: "Pending approvals", value: "0", helper: "Discounts and overrides route here." },
  { label: "Invoices due", value: "0", helper: "Payment status updates after Stripe webhooks." },
];

export function DashboardPage() {
  return (
    <AppShell
      title="Run every outdoor request from one calm command center."
      subtitle="Your team moves from scattered texts, estimates, and proof photos into a single operating rhythm: capture, prioritize, schedule, complete, and bill."
    >
      {hasConvex ? <LiveDashboard /> : <FallbackDashboard />}
    </AppShell>
  );
}

function LiveDashboard() {
  const { token } = useAuth();
  const stats = useQuery(api.stats.getDashboardStats, token ? { token } : "skip");
  const leads = useQuery(api.leads.listRecent, token ? { token, limit: 6 } : "skip") ?? [];
  const events = useQuery(api.events.listRecent, token ? { token, limit: 6 } : "skip") ?? [];
  const revenue = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(stats?.revenue ?? 0);

  const metrics: Metric[] = [
    { label: "New leads", value: String(stats?.newLeadsCount ?? 0), helper: "Requests created this month." },
    { label: "Active leads", value: String(stats?.activeLeadsCount ?? 0), helper: "Open opportunities before closeout." },
    { label: "Operations alerts", value: String(stats?.alerts?.length ?? 0), helper: "Approvals, failed messages, and compliance flags." },
    { label: "Paid revenue", value: revenue, helper: "Paid invoice value this month." },
  ];

  return (
    <div className="space-y-8">
      <MetricGrid metrics={metrics} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Newest requests" icon={Users} actionHref="/admin" actionLabel="Open CRM">
          {leads.length ? (
            <div className="divide-y divide-stone-100">
              {leads.map((lead: any) => (
                <div key={lead._id} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-extrabold text-stone-900">{lead.name || "Unassigned lead"}</h2>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-forest-700">{lead.stage ?? "lead"}</span>
                  </div>
                  <p className="mt-1 text-sm text-stone-600">{lead.message || lead.serviceSlug || "No message supplied yet."}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No leads yet" body="When a quote, booking, or contact form is submitted, it appears here instantly for triage." actionHref="/quick-quote" actionLabel="Test a Lead Form" />
          )}
        </Panel>
        <Panel title="Latest activity" icon={Activity} actionHref="/activity" actionLabel="View log">
          {events.length ? (
            <div className="space-y-3">
              {events.map((event: any) => (
                <div key={event._id} className="rounded-xl bg-stone-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-extrabold text-stone-900">{event.type}</span>
                    <span className="text-xs font-bold text-stone-500">{event.direction}</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{event.payload?.message || event.payload?.note || "Operational event recorded."}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Activity starts with the first request" body="Stage changes, notes, form submissions, and automation events will build the customer timeline." />
          )}
        </Panel>
      </div>
    </div>
  );
}

function FallbackDashboard() {
  return (
    <div className="space-y-8">
      <MetricGrid metrics={fallbackMetrics} />
      <div className="rounded-2xl border border-forest-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-forest-700">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">Convex is ready, but not connected in this environment.</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">
              Add `NEXT_PUBLIC_CONVEX_URL` and deploy the Convex backend to unlock live CRM, scheduling, invoices, activity, and admin CRUD.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <ActionCard icon={MessageSquare} title="Capture demand" body="Quote, booking, and contact forms create lead records with urgency, surface, and message context." href="/quick-quote" label="Test lead capture" />
        <ActionCard icon={CalendarDays} title="Dispatch cleanly" body="Work orders, appointments, crews, and proof requirements keep field execution visible." href="/admin" label="Open admin" />
        <ActionCard icon={CreditCard} title="Close the loop" body="Invoices, payments, and Stripe webhooks make billing status visible without manual chasing." href="/billing" label="Review billing" />
      </div>
    </div>
  );
}

export function AdminPage() {
  return (
    <AppShell
      title="Admin operations that make every request visible."
      subtitle="See the data models that matter most: leads, events, approvals, work orders, invoices, staff, fleet, inventory, and compliance."
    >
      {hasConvex ? <LiveAdmin /> : <AdminModelGrid />}
    </AppShell>
  );
}

function LiveAdmin() {
  const { token } = useAuth();
  const leads = useQuery(api.leads.listRecent, token ? { token, limit: 8 } : "skip") ?? [];
  const approvals = useQuery(api.approvals.listPending, token ? { token, limit: 8 } : "skip") ?? [];
  const workOrders = useQuery(api.workOrders.listByStatus, token ? { token, status: "open", limit: 8 } : "skip") ?? [];
  const invoices = useQuery(api.invoices.listByStatus, token ? { token, status: "open", limit: 8 } : "skip") ?? [];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ListPanel title="Leads" icon={Users} items={leads.map((lead: any) => lead.name || lead.message || "New lead")} empty="Lead forms will populate this CRM lane." />
      <ListPanel title="Approvals" icon={ShieldCheck} items={approvals.map((approval: any) => approval.reason || approval.type || "Approval request")} empty="Discounts and budget overrides appear here." />
      <ListPanel title="Work orders" icon={Wrench} items={workOrders.map((order: any) => order.title || order.serviceSlug || "Open work order")} empty="Booked jobs appear here for operations review." />
      <ListPanel title="Invoices" icon={CreditCard} items={invoices.map((invoice: any) => invoice.customerName || invoice.status || "Open invoice")} empty="Stripe-backed invoices appear here after creation." />
    </div>
  );
}

function AdminModelGrid() {
  const models = [
    { icon: Users, title: "CRM", body: "Leads, customers, stages, notes, urgency, ownership, and SLA status." },
    { icon: CalendarDays, title: "Scheduling", body: "Appointments, crews, arrival windows, route context, and job readiness." },
    { icon: Wrench, title: "Work orders", body: "Scope, proof, materials, completion notes, budget flags, and closeout controls." },
    { icon: CreditCard, title: "Billing", body: "Estimates, invoices, payment records, balances, and Stripe webhook status." },
    { icon: ShieldCheck, title: "Compliance", body: "Licenses, insurance, expiration alerts, policies, approvals, and audit history." },
    { icon: ClipboardList, title: "Resources", body: "Fleet, maintenance logs, staff, crews, inventory, and reorder visibility." },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {models.map((model) => (
        <ActionCard key={model.title} {...model} href="/docs" label="View workflow" />
      ))}
    </div>
  );
}

export function OnboardingPage() {
  return (
    <AppShell
      title="Set up the operations portal before the next busy day hits."
      subtitle="The first-run wizard keeps the team focused on the few inputs that unlock routing, response speed, proof, and billing."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          { title: "Connect the backend", body: "Add Convex URL, auth secret, Stripe, Twilio, Resend, and site URL variables.", done: true },
          { title: "Load the business rules", body: "Confirm SLA windows, approval thresholds, service areas, crews, and proof requirements.", done: false },
          { title: "Run a test request", body: "Submit a quote form, assign it, create a work order, and confirm it reaches the dashboard.", done: false },
        ].map((step) => (
          <article key={step.title} className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${step.done ? "bg-white text-forest-700" : "bg-stone-100 text-stone-600"}`}>
              {step.done ? <CheckCircle2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            </div>
            <h2 className="mt-5 text-lg font-extrabold text-stone-900">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.body}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}

export function StaticOpsPage({
  kind,
}: {
  kind: "billing" | "apiKeys" | "notifications" | "activity" | "account" | "settings";
}) {
  const copy = {
    billing: {
      icon: CreditCard,
      title: "Billing that shows what is owed, paid, and ready to collect.",
      subtitle: "Stripe-backed invoices, subscription status, balances, and payment activity live here once production billing is configured.",
      cards: [
        ["Subscription", "Manage the Elite portal plan, renewal status, and payment method."],
        ["Invoices", "See customer balances, partial payments, checkout status, and webhook confirmations."],
        ["Risk reduction", "Keep billing transparent before a job closes or a manager approves an exception."],
      ],
    },
    apiKeys: {
      icon: KeyRound,
      title: "API keys and webhooks without mystery access.",
      subtitle: "Generate scoped keys, rotate credentials, and monitor webhook delivery for integrations that need safe automation.",
      cards: [
        ["Production key", "Create a scoped key for trusted internal systems and deployment hooks."],
        ["Webhook signing", "Verify inbound events before they can modify leads, invoices, or work orders."],
        ["Rotation plan", "Track key age, owner, permissions, and last-used time."],
      ],
    },
    notifications: {
      icon: Bell,
      title: "Notifications that turn delay into action.",
      subtitle: "SLA risk, new lead, appointment, invoice, and compliance events are grouped so the next decision is obvious.",
      cards: [
        ["Lead response", "Alert the right owner before an emergency or standard SLA slips."],
        ["Field updates", "Surface appointment, proof, and closeout changes for managers."],
        ["Compliance", "Warn before license, insurance, or policy gaps become urgent."],
      ],
    },
    activity: {
      icon: Activity,
      title: "A complete activity log for every operational move.",
      subtitle: "Form submissions, stage changes, manager approvals, automations, invoices, and messages become a searchable timeline.",
      cards: [
        ["Audit trail", "See who changed what and when across customer and job records."],
        ["Automation runs", "Monitor SLA, follow-up, compliance, and approval agents."],
        ["Customer context", "Keep call, text, email, and form history attached to the work."],
      ],
    },
    account: {
      icon: UserRound,
      title: "Account controls that make team access boring in the best way.",
      subtitle: "Profile, password, preferences, role, and notification settings are organized for fast review.",
      cards: [
        ["Profile", "Update name, role, email, phone, and field-facing contact details."],
        ["Security", "Review password status, active sessions, and recovery expectations."],
        ["Preferences", "Choose which alerts reach email, SMS, or the in-app notification center."],
      ],
    },
    settings: {
      icon: Settings,
      title: "Settings that turn business rules into repeatable operations.",
      subtitle: "Configure service areas, SLA windows, lead routing, approvals, email defaults, billing behavior, and proof requirements.",
      cards: [
        ["Routing", "Map services, locations, urgency, and entity type to the right owner."],
        ["Policies", "Set discount thresholds, not-to-exceed limits, and manager approval rules."],
        ["Brand system", "Keep public copy, legal footer links, and customer communication aligned."],
      ],
    },
  }[kind];

  const Icon = copy.icon;

  return (
    <AppShell title={copy.title} subtitle={copy.subtitle}>
      <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-forest-700">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900">Production-ready surface</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">This page is responsive, indexed rules are explicit, and live actions can be enabled behind authenticated Convex mutations.</p>
            </div>
          </div>
          <Link href="/onboarding" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-forest-600 px-4 py-2 text-sm font-bold text-white hover:bg-forest-700">
            Configure
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {copy.cards.map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <h2 className="text-lg font-extrabold text-stone-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{body}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{metric.label}</p>
          <div className="mt-3 text-4xl font-black text-stone-950">{metric.value}</div>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{metric.helper}</p>
        </article>
      ))}
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  icon: LucideIcon;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-forest-700">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-extrabold text-stone-900">{title}</h2>
        </div>
        {actionHref && actionLabel ? (
          <Link href={actionHref} className="text-sm font-bold text-forest-700 hover:text-forest-800">{actionLabel}</Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function ListPanel({ title, icon: Icon, items, empty }: { title: string; icon: LucideIcon; items: string[]; empty: string }) {
  return (
    <Panel title={title} icon={Icon}>
      {items.length ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center gap-3 rounded-xl bg-stone-50 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-forest-700">
                <Plus className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-stone-700">{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title={`No ${title.toLowerCase()} yet`} body={empty} />
      )}
    </Panel>
  );
}

function ActionCard({
  icon: Icon,
  title,
  body,
  href,
  label,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  label: string;
}) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-forest-700">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-lg font-extrabold text-stone-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{body}</p>
      <Link href={href} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-bold text-white hover:bg-stone-800">
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
