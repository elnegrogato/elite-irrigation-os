import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from '../components/auth/AuthProvider';

// Custom render function with router
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: {
    initialEntries?: string[];
  };
}

export function renderWithRouter(
  ui: ReactElement,
  { routerProps, ...renderOptions }: CustomRenderOptions = {}
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <HashRouter initialEntries={routerProps?.initialEntries}>
      {children}
    </HashRouter>
  );

  return {
    ...render(ui, { wrapper, ...renderOptions }),
  };
}

// Custom render function with auth provider
interface AuthRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authProps?: {
    user?: any;
    isAuthenticated?: boolean;
  };
}

export function renderWithAuth(
  ui: ReactElement,
  { authProps, ...renderOptions }: AuthRenderOptions = {}
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider
      value={{
        user: authProps?.user || null,
        isAuthenticated: authProps?.isAuthenticated ?? false,
        login: async () => {},
        logout: async () => {},
        loading: false,
      }}
    >
      {children}
    </AuthProvider>
  );

  return {
    ...render(ui, { wrapper, ...renderOptions }),
  };
}

// Custom render function with both router and auth
interface FullRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: {
    initialEntries?: string[];
  };
  authProps?: {
    user?: any;
    isAuthenticated?: boolean;
  };
}

export function renderWithProviders(
  ui: ReactElement,
  { routerProps, authProps, ...renderOptions }: FullRenderOptions = {}
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <HashRouter initialEntries={routerProps?.initialEntries}>
      <AuthProvider
        value={{
          user: authProps?.user || null,
          isAuthenticated: authProps?.isAuthenticated ?? false,
          login: async () => {},
          logout: async () => {},
          loading: false,
        }}
      >
        {children}
      </AuthProvider>
    </HashRouter>
  );

  return {
    ...render(ui, { wrapper, ...renderOptions }),
  };
}

// Mock Convex query
export function mockConvexQuery<T>(data: T) {
  return vi.fn().mockResolvedValue(data);
}

// Mock Convex mutation
export function mockConvexMutation<T>(data: T) {
  return vi.fn().mockResolvedValue(data);
}

// Wait for loading to finish
export async function waitForLoadingToFinish() {
  // This is a placeholder for any loading state management
  // You can expand this based on your app's loading patterns
  await new Promise((resolve) => setTimeout(resolve, 0));
}

// Helper to create mock user
export function createMockUser(overrides = {}) {
  return {
    _id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
    orgId: 'test-org-id',
    ...overrides,
  };
}
