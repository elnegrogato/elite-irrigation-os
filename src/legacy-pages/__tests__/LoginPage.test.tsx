import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import LoginPage from '../auth/LoginPage';
import { AuthProvider } from '../../components/AuthProvider';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { from: '/admin' } }),
  };
});

describe('LoginPage', () => {
  const mockLogin = vi.fn();
  const user = userEvent.setup();

  const renderLoginPage = () => {
    return render(
      <HashRouter>
        <AuthProvider
          value={{
            user: null,
            isAuthenticated: false,
            login: mockLogin,
            logout: async () => {},
            register: async () => ({ success: true }),
            refreshToken: async () => {},
            loading: false,
          }}
        >
          <LoginPage />
        </AuthProvider>
      </HashRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form rendering', () => {
    it('renders login form correctly', () => {
      renderLoginPage();

      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('renders logo and brand text', () => {
      renderLoginPage();

      expect(screen.getByText('Elite Irrigation & Landscaping')).toBeInTheDocument();
      expect(screen.getByText('Operating System')).toBeInTheDocument();
    });

    it('renders remember me checkbox', () => {
      renderLoginPage();

      expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
    });

    it('renders forgot password link', () => {
      renderLoginPage();

      expect(screen.getByText(/Forgot password?/i)).toBeInTheDocument();
    });

    it('renders register link', () => {
      renderLoginPage();

      expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('renders help text', () => {
      renderLoginPage();

      expect(
        screenByText(/Contact your administrator if you need access to the system/i)
      ).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('shows error when fields are empty', async () => {
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      // HTML5 validation should prevent form submission
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);

      expect(emailInput).toBeInvalid();
      expect(passwordInput).toBeInvalid();
    });

    it('accepts valid email format', async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('accepts valid password', async () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Form submission', () => {
    it('submits form with valid credentials', async () => {
      mockLogin.mockResolvedValueOnce({ success: true, token: 'test-token' });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('shows loading state during submission', async () => {
      mockLogin.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Button should show loading state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Signing in.../i })).toBeInTheDocument();
      });
    });

    it('disables form during loading', async () => {
      mockLogin.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
      });
    });
  });

  describe('Error handling', () => {
    it('displays error message on failed login', async () => {
      mockLogin.mockResolvedValueOnce({
        success: false,
        error: 'Invalid email or password',
      });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });

    it('displays error message on network error', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Network error'));

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
      });
    });

    it('clears error message when user types', async () => {
      mockLogin.mockResolvedValueOnce({
        success: false,
        error: 'Invalid email or password',
      });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });

      // Clear error by typing
      await user.clear(emailInput);
      await user.type(emailInput, 'newemail@example.com');

      await waitFor(() => {
        expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
      });
    });
  });

  describe('Successful login', () => {
    it('shows success message on successful login', async () => {
      mockLogin.mockResolvedValueOnce({ success: true, token: 'test-token' });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Login successful! Redirecting...')).toBeInTheDocument();
      });
    });

    it('redirects to previous page after successful login', async () => {
      mockLogin.mockResolvedValueOnce({ success: true, token: 'test-token' });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
      }, { timeout: 1000 });
    });
  });

  describe('Remember me functionality', () => {
    it('toggles remember me checkbox', async () => {
      renderLoginPage();

      const checkbox = screen.getByLabelText(/Remember me/i);
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Edge cases', () => {
    it('handles whitespace in email', async () => {
      mockLogin.mockResolvedValueOnce({ success: true, token: 'test-token' });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, '  test@example.com  ');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        // Email should be trimmed
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('handles special characters in password', async () => {
      mockLogin.mockResolvedValueOnce({ success: true, token: 'test-token' });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'P@ssw0rd!123#');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'P@ssw0rd!123#');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderLoginPage();

      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('has proper button text', () => {
      renderLoginPage();

      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('disables inputs during loading', async () => {
      mockLogin.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));

      renderLoginPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toHaveAttribute('disabled');
        expect(passwordInput).toHaveAttribute('disabled');
      });
    });
  });
});
