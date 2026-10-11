// src/pages/auth/LoginPage.tsx
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const from = (location.state as any)?.from || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        setSuccess(true);
        // Redirect to the page they tried to visit
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-serif font-bold text-3xl text-slate-900 mb-2">
            Elite Irrigation & Landscaping
          </h1>
          <p className="text-sm text-slate-600">Operating System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-sm">
              <p className="text-sm text-emerald-800">Login successful! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-sm focus:outline-none focus:border-elite-500 transition-colors"
                placeholder="you@eliteirrigation.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-sm focus:outline-none focus:border-elite-500 transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-elite-600 border-slate-300 rounded focus:ring-elite-500"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-elite-600 hover:text-elite-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-elite-900 text-white py-3 px-4 rounded-sm font-bold uppercase tracking-wider hover:bg-elite-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-elite-600 hover:text-elite-700 font-bold"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Contact your administrator if you need access to the system.
          </p>
        </div>
      </div>
    </div>
  );
}
