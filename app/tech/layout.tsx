'use client';

import { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/components/AuthProvider";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import { LogOut } from "lucide-react";

export default function TechLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute requireRole={['tech', 'foreman']}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-elite-200 border-t-elite-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-600 font-medium">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-zinc-200">
            <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/tech" className="font-bold text-lg text-slate-900 font-serif">Elite Tech</Link>
              <div className="flex items-center gap-3">
                <div className="text-xs text-zinc-600 font-medium">
                  {user ? `${user.name} (${user.role})` : "Unknown"}
                </div>
                {user && (
                  <button
                    className="flex items-center gap-1 text-xs hover:text-red-600 font-bold uppercase tracking-wider transition-colors"
                    onClick={handleLogout}
                    title="Sign out"
                  >
                    <LogOut className="w-3 h-3" />
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </header>

          <main className="max-w-xl mx-auto px-4 py-6">{children}</main>
        </div>
      )}
    </ProtectedRoute>
  );
}
