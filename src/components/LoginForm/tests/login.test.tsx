import fixture from '~fixtures/fixture.json';
import {
  renderHook,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useAuthContext } from '~/hooks/useAuthContext';
import { Provider as ChakraProvider } from '~/components/ui/provider';
import { AuthProvider } from '~/contexts/authProvider';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithRouter } from '~/router/tests/helpers/renderWithRouter';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>
    <AuthProvider>{children}</AuthProvider>
  </ChakraProvider>
);

describe('Login API tests', () => {
  it('should log in with correct credentials', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current.login(
        fixture.correctUsername,
        fixture.correctPassword,
      );
    });

    expect(result.current.accessToken).toEqual(
      fixture.mockResponses.successAuth.access_token,
    );
    expect(result.current.isAuthenticated).toBe(true);
  });

  it.each([
    {
      desc: 'incorrect password',
      username: fixture.correctUsername,
      password: fixture.incorrectPassword,
    },
    {
      desc: 'incorrect email',
      username: fixture.incorrectUsername,
      password: fixture.correctPassword,
    },
  ])('should not log in with $desc', async ({ username, password }) => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current.login(username, password);
    });

    expect(result.current.error).toEqual(
      fixture.mockResponses.wrongCredentials.message,
    );
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should not log in with empty password', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current.login(fixture.correctUsername, '');
    });

    expect(result.current.error).toEqual(
      fixture.mockResponses.emptyPassword.message,
    );
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should not log in with empty email', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current.login('', fixture.correctPassword);
    });

    expect(result.current.error).toEqual(
      fixture.mockResponses.wrongCredentials.message,
    );
    expect(result.current.isAuthenticated).toBe(false);
  });
});

describe('Login UI tests', () => {
  it('should call login with correct credentials', async () => {
    const loginMock = vi.fn().mockResolvedValue(undefined);

    renderWithRouter('/login', { login: loginMock });

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, fixture.correctUsername);
    await userEvent.type(passwordInput, fixture.correctPassword);
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith(
        fixture.correctUsername,
        fixture.correctPassword,
      );
    });
  });

  it('should not render error modal after successful login', async () => {
    renderWithRouter('/login');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, {
      target: { value: fixture.correctUsername },
    });
    fireEvent.change(passwordInput, {
      target: { value: fixture.correctPassword },
    });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.queryByTestId('error-alert')).not.toBeInTheDocument();
    });
  });

  it('should render error modal after unsuccessful login', async () => {
    renderWithRouter('/login');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, {
      target: { value: fixture.correctUsername },
    });
    fireEvent.change(passwordInput, {
      target: { value: fixture.correctPassword },
    });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.queryByTestId('error-alert')).not.toBeInTheDocument();
    });
  });

  it('navigates to register page after clicking register link', async () => {
    renderWithRouter('/login');
    expect(
      await screen.findByRole('heading', { name: /login page/i }),
    ).toBeInTheDocument();
    const registerLink = screen.getByRole('link', {
      name: /Don`t have an account\?.*register/i,
    });
    await userEvent.click(registerLink);
    expect(
      await screen.findByRole('heading', {
        name: /register page/i,
        hidden: true,
      }),
    ).toBeInTheDocument();
  });
});

import { loginSchema } from '~/hooks/login-schema';

describe('LoginForm validation', () => {
  describe('Email validation', () => {
    it('should reject empty email', async () => {
      const result = await loginSchema.safeParseAsync({
        email: '',
        password: 'ValidPass123!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Email address must contain a domain name (e.g., example.com) and an "@" symbol separating local part and domain name',
        );
      }
    });

    it('should reject emails with leading/trailing spaces', async () => {
      const result = await loginSchema.safeParseAsync({
        email: '  test@test.com  ',
        password: 'ValidPass123!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Email must not contain leading or trailing spaces',
        );
      }
    });

    it('should reject invalid email formats', async () => {
      const result = await loginSchema.safeParseAsync({
        email: 'invalid-email',
        password: 'ValidPass123!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Email address must contain a domain name (e.g., example.com) and an "@" symbol separating local part and domain name',
        );
      }
    });

    it('should accept valid email', async () => {
      const result = await loginSchema.safeParseAsync({
        email: 'valid@test.com',
        password: 'ValidPass123!',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Password validation', () => {
    it('should reject short passwords', async () => {
      const result = await loginSchema.safeParseAsync({
        email: 'test@test.com',
        password: 'short',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must be at least 8 characters',
        );
      }
    });

    it('should reject passwords without uppercase', async () => {
      const result = await loginSchema.safeParseAsync({
        email: 'test@test.com',
        password: 'lowercase123!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Must contain at least 1 uppercase letter',
        );
      }
    });

    it('should reject passwords without special chars', async () => {
      const result = await loginSchema.safeParseAsync({
        email: 'test@test.com',
        password: 'NoSpecial123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Must contain at least 1 special character (!@#$%^&*)',
        );
      }
    });

    it('should accept valid password', async () => {
      const result = await loginSchema.safeParseAsync({
        email: 'test@test.com',
        password: 'ValidPass123!',
      });
      expect(result.success).toBe(true);
    });
  });
});
