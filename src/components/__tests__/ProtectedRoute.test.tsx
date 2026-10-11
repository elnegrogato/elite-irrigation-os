import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider } from '../AuthProvider';

// Mock Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to, replace }: { to: string; replace: boolean }) => (
      <div data-testid="navigate" data-to={to} data-replace={String(replace)}>
        Navigate to {to}
      </div>
    ),
  };
});

describe('ProtectedRoute', () => {
  const mockChildren = <div>Protected Content</div>;

  const renderWithAuth = (
    isAuthenticated: boolean,
    user: any = null,
    loading: boolean = false,
    requireRole?: string[]
  ) => {
    return render(
      <HashRouter>
        <AuthProvider
          value={{
            user,
            isAuthenticated,
            login: async () => ({ success: true }),
            logout: async () => {},
            register: async () => ({ success: true }),
            refreshToken: async () => {},
            loading,
          }}
        >
          <ProtectedRoute requireRole={requireRole}>{mockChildren}</ProtectedRoute>
        </AuthProvider>
      </HashRouter>
    );
  };

  describe('Authentication checks', () => {
    it('redirects to login when not authenticated', () => {
      renderWithAuth(false, null, false);

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toBeInTheDocument();
      expect(navigate).toHaveAttribute('data-to', '/login');
    });

    it('renders children when authenticated', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
      };

      renderWithAuth(true, mockUser, false);

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('shows loading state when loading', () => {
      renderWithAuth(false, null, true);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Role-based access control', () => {
    it('allows access when user has required role', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
      };

      renderWithAuth(true, mockUser, false, ['admin', 'manager']);

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('denies access when user lacks required role', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'tech',
      };

      renderWithAuth(true, mockUser, false, ['admin', 'manager']);

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('allows manager access to manager routes', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'manager',
      };

      renderWithAuth(true, mockUser, false, ['admin', 'manager']);

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('denies tech access to admin routes', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'tech',
      };

      renderWithAuth(true, mockUser, false, ['admin']);

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('denies foreman access to admin-only routes', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'foreman',
      };

      renderWithAuth(true, mockUser, false, ['admin']);

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('allows foreman access to foreman-inclusive routes', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'foreman',
      };

      renderWithAuth(true, mockUser, false, ['admin', 'manager', 'foreman']);

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('Access denied UI', () => {
    it('displays access denied message', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'tech',
      };

      renderWithAuth(true, mockUser, false, ['admin']);

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(
        screenByText("You don't have permission to access this page.")
      ).toBeInTheDocument();
    });

    it('displays go back button', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'tech',
      };

      renderWithAuth(true, mockUser, false, ['admin']);

      const goBackButton = screen.getByRole('button');
      expect(goBackButton).toBeInTheDocument();
      expect(goBackButton).toHaveTextContent('Go Back');
    });
  });

  describe('No role requirements', () => {
    it('allows access for any authenticated user when no roles required', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'tech',
      };

      renderWithAuth(true, mockUser, false);

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('allows admin access when no roles required', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test Admin',
        email: 'admin@example.com',
        role: 'admin',
      };

      renderWithAuth(true, mockUser, false);

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('shows loading spinner while checking auth', () => {
      renderWithAuth(false, null, true);

      const loadingContainer = screen.getByText('Loading...').parentElement;
      expect(loadingContainer).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
    });

    it('does not show content while loading', () => {
      renderWithAuth(true, { role: 'admin' }, true);

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles user object without role', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        // role is missing
      };

      renderWithAuth(true, mockUser, false, ['admin']);

      // Should deny access since role is undefined
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('handles empty role requirements array', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'tech',
      };

      renderWithAuth(true, mockUser, false, []);

      // Empty array should not restrict access
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('handles user with null role', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: null as any,
      };

      renderWithAuth(true, mockUser, false, ['admin']);

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  describe('Multiple role requirements', () => {
    it('allows access when user has one of multiple required roles', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test Manager',
        email: 'manager@example.com',
        role: 'manager',
      };

      renderWithAuth(true, mockUser, false, ['admin', 'manager', 'foreman']);

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('denies access when user has none of the required roles', () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test Tech',
        email: 'tech@example.com',
        role: 'tech',
      };

      renderWithAuth(true, mockUser, false, ['admin', 'manager', 'foreman']);

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });
});
