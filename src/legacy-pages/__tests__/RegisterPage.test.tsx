import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import RegisterPage from '../auth/RegisterPage';
import { AuthProvider } from '../../components/AuthProvider';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RegisterPage', () => {
  const mockRegister = vi.fn();
  const user = userEvent.setup();

  const renderRegisterPage = () => {
    return render(
      <HashRouter>
        <AuthProvider
          value={{
            user: null,
            isAuthenticated: false,
            login: async () => ({ success: true }),
            logout: async () => {},
            register: mockRegister,
            refreshToken: async () => {},
            loading: false,
          }}
        >
          <RegisterPage />
        </AuthProvider>
      </HashRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Form rendering', () => {
    it('renders registration form correctly', () => {
      renderRegisterPage();

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    });

    it('renders role selector', () => {
      renderRegisterPage();

      const roleSelect = screen.getByLabelText(/Role/i);
      expect(roleSelect).toBeInTheDocument();

      // Check default option
      expect(roleSelect).toHaveValue('tech');
    });

    it('renders all role options', () => {
      renderRegisterPage();

      const roleSelect = screen.getByLabelText(/Role/i) as HTMLSelectElement;

      expect(roleSelect.options).toHaveLength(4);
      expect(roleSelect.options[0].value).toBe('tech');
      expect(roleSelect.options[0].text).toBe('Technician');
      expect(roleSelect.options[1].value).toBe('foreman');
      expect(roleSelect.options[1].text).toBe('Foreman');
      expect(roleSelect.options[2].value).toBe('manager');
      expect(roleSelect.options[2].text).toBe('Manager');
      expect(roleSelect.options[3].value).toBe('admin');
      expect(roleSelect.options[3].text).toBe('Administrator');
    });

    it('renders login link', () => {
      renderRegisterPage();

      expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('renders help text', () => {
      renderRegisterPage();

      expect(
        screenByText(/By registering, you agree to comply with company policies/i)
      ).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('shows error when required fields are empty', async () => {
      renderRegisterPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
      });
    });

    it('validates password length', async () => {
      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, '12345');
      await user.type(confirmPasswordInput, '12345');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });

    it('validates password confirmation', async () => {
      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password456');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('shows password hint', () => {
      renderRegisterPage();

      expect(screen.getByText('Must be at least 6 characters')).toBeInTheDocument();
    });
  });

  describe('Form submission', () => {
    it('submits form with valid data', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Number/i);
      const phoneInput = screen.getByLabelText(/Phone Number/i);
      const roleSelect = screen.getByLabelText(/Role/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(phoneInput, '(555) 123-4567');
      await user.selectOptions(roleSelect, 'tech');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          password: 'password123',
          role: 'tech',
        });
      });
    });

    it('trims whitespace from name and email', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, '  John Doe  ');
      await user.type(emailInput, '  john@example.com  ');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
          })
        );
      });
    });

    it('handles optional phone field', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          expect.objectContaining({
            phone: undefined,
          })
        );
      });
    });

    it('shows loading state during submission', async () => {
      mockRegister.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Creating account.../i })).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('displays error message on failed registration', async () => {
      mockRegister.mockResolvedValueOnce({
        success: false,
        error: 'Email already exists',
      });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });
    });

    it('displays error message on network error', async () => {
      mockRegister.mockRejectedValueOnce(new Error('Network error'));

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
      });
    });

    it('clears error message when user types', async () => {
      mockRegister.mockResolvedValueOnce({
        success: false,
        error: 'Email already exists',
      });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });

      // Clear error by typing
      await user.clear(emailInput);
      await user.type(emailInput, 'newemail@example.com');

      await waitFor(() => {
        expect(screen.queryByText('Email already exists')).not.toBeInTheDocument();
      });
    });
  });

  describe('Successful registration', () => {
    it('shows success message on successful registration', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Registration successful! Redirecting to login...')).toBeInTheDocument();
      });
    });

    it('redirects to login page after successful registration', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Registration successful!')).toBeInTheDocument();
      });

      // Fast-forward timers
      vi.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login', {
          state: {
            message: 'Registration successful! Please sign in with your credentials.',
          },
        });
      });
    });
  });

  describe('Role selection', () => {
    it('allows role selection', async () => {
      renderRegisterPage();

      const roleSelect = screen.getByLabelText(/Role/i);

      await user.selectOptions(roleSelect, 'admin');

      expect(roleSelect).toHaveValue('admin');
    });

    it('submits selected role', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const roleSelect = screen.getByLabelText(/Role/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'Admin User');
      await user.type(emailInput, 'admin@example.com');
      await user.selectOptions(roleSelect, 'admin');
      await user.type(passwordInput, 'admin123');
      await user.type(confirmPasswordInput, 'admin123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          expect.objectContaining({
            role: 'admin',
          })
        );
      });
    });
  });

  describe('Edge cases', () => {
    it('handles whitespace in phone number', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const phoneInput = screen.getByLabelText(/Phone Number/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(phoneInput, '  (555) 123-4567  ');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          expect.objectContaining({
            phone: '(555) 123-4567',
          })
        );
      });
    });

    it('handles special characters in name', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, "John O'Brien Jr.");
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "John O'Brien Jr.",
          })
        );
      });
    });

    it('handles minimum valid password', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, '123456');
      await user.type(confirmPasswordInput, '123456');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderRegisterPage();

      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    it('marks required fields with asterisk', () => {
      renderRegisterPage();

      expect(screen.getByText(/Full Name/i).parentElement?.textContent).toContain('*');
      expect(screen.getByText(/Email Address/i).parentElement?.textContent).toContain('*');
      expect(screen.getByText(/Role/i).parentElement?.textContent).toContain('*');
      expect(screen.getByText(/Password/i).parentElement?.textContent).toContain('*');
      expect(screen.getByText(/Confirm Password/i).parentElement?.textContent).toContain('*');
    });

    it('disables inputs during loading', async () => {
      mockRegister.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));

      renderRegisterPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(nameInput).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
        expect(confirmPasswordInput).toBeDisabled();
      });
    });
  });
});
