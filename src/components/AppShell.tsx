import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bell,
  CreditCard,
  Home,
  KeyRound,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin", label: "Admin", icon: Home },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/account", label: "Account", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireRole={["admin", "manager", "foreman"]}>
      <Layout>
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="grid gap-2 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-1">
              {navItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>
          </aside>
          <main className="min-w-0">
            <div className="mb-8 rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-forest-700">Elite Portal</p>
              <h1 className="mt-3 text-3xl font-serif font-bold leading-tight text-stone-950 sm:text-4xl">{title}</h1>
              <p className="mt-3 max-w-3xl text-stone-600">{subtitle}</p>
            </div>
            {children}
          </main>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <Link
      href={href}
      className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-stone-700 transition-colors hover:bg-forest-50 hover:text-forest-700"
    >
      <Icon className="h-4 w-4 text-forest-600" />
      {label}
    </Link>
  );
}

export function EmptyState({ title, body, actionHref, actionLabel }: { title: string; body: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
      <h2 className="text-lg font-extrabold text-stone-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-stone-600">{body}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-forest-600 px-5 py-2 text-sm font-bold text-white hover:bg-forest-700">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
