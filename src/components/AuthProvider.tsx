// src/components/AuthProvider.tsx
import React, { createContext, useCallback, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "manager" | "foreman" | "tech";
  status: string;
  createdAt: number;
};

type Session = {
  id: string;
  expiresAt: number;
  lastActiveAt: number;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  refreshToken: () => Promise<void>;
};

type RegisterData = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "elite_auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const convex = useConvex();

  // Get authenticated user data
  const authData = useQuery(
    api.auth.getAuthenticatedUser,
    token ? { token } : "skip"
  );

  const loginMutation = useMutation(api.auth.login);
  const logoutMutation = useMutation(api.auth.logout);
  const registerMutation = useMutation(api.auth.register);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      if (token) {
        await logoutMutation({ token });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [logoutMutation, token]);

  // Auto-refresh session every 15 minutes
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        // Check if session is still valid
        const result = await convex.query(api.auth.getAuthenticatedUser, { token });
        if (!result) {
          // Session expired, clear token
          handleLogout();
        }
      } catch (error) {
        console.error("Session refresh error:", error);
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [token, convex, handleLogout]);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation({ email, password });

      if (result.success) {
        setToken(result.token);
        localStorage.setItem(TOKEN_KEY, result.token);
        return { success: true };
      }

      return { success: false, error: "Login failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "Invalid credentials" };
    }
  };

  const logout = async () => {
    await handleLogout();
  };

  const register = async (data: RegisterData) => {
    try {
      const result = await registerMutation(data);

      if (result.success) {
        return { success: true };
      }

      return { success: false, error: "Registration failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "Registration failed" };
    }
  };

  const refreshToken = async () => {
    // Token refresh logic - for now, just validate existing token
    if (token) {
      const result = await convex.query(api.auth.getAuthenticatedUser, { token });
      if (!result) {
        handleLogout();
      }
    }
  };

  const value: AuthContextType = {
    user: authData?.user ?? null,
    session: authData?.session ?? null,
    token,
    loading: loading || Boolean(token && authData === undefined),
    login,
    logout,
    register,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
