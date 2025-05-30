import fixture from '~fixtures/fixture.json';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from '~components/ui/provider.tsx';
import { AuthProvider } from '~/contexts/authProvider.tsx';
import { LoginForm } from '~components/LoginForm/LoginForm';
import { useAuthContext } from '~hooks/useAuthContext';

vi.mock('~hooks/useAuthContext');
const mockedUseAuthContext = vi.mocked(useAuthContext);

describe('LoginForm UI', () => {
  const VALID_PASSWORD = 'Abcd1234';
  let loginMock: ReturnType<typeof vi.fn>;
  let registerMock: ReturnType<typeof vi.fn>;
  let logoutMock: ReturnType<typeof vi.fn>;
  let clearErrorsMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    loginMock = vi.fn().mockResolvedValue(undefined);
    registerMock = vi.fn();
    logoutMock = vi.fn();
    clearErrorsMock = vi.fn();
    mockedUseAuthContext.mockReturnValue({
      login: loginMock,
      register: registerMock,
      logout: logoutMock,
      clearErrors: clearErrorsMock,
      accessToken: '',
      isAuthenticated: false,
      error: null,
      loading: false,
    });
  });

  function renderForm() {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <Provider>
          <AuthProvider>
            <LoginForm />
          </AuthProvider>
        </Provider>
      </MemoryRouter>,
    );
  }

  it('calls login with correct credentials', async () => {
    renderForm();
    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      fixture.correctUsername,
    );
    await userEvent.type(
      screen.getByPlaceholderText('Password'),
      VALID_PASSWORD,
    );
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(loginMock).toHaveBeenCalledWith(
      fixture.correctUsername,
      VALID_PASSWORD,
    );
  });

  it('shows client-side validation errors and does not call login', async () => {
    renderForm();
    await userEvent.clear(screen.getByPlaceholderText('Email'));
    await userEvent.type(screen.getByPlaceholderText('Email'), 'bademail');
    await userEvent.clear(screen.getByPlaceholderText('Password'));
    await userEvent.type(screen.getByPlaceholderText('Password'), '123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(
      await screen.findByText(/invalid email format\./i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password must be at least 8 characters long\./i),
    ).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('toggles password visibility', async () => {
    renderForm();
    const pwdInput = screen.getByPlaceholderText('Password');
    const showButton = screen.getByLabelText(/show password/i);
    expect(pwdInput).toHaveAttribute('type', 'password');
    await userEvent.click(showButton);
    expect(pwdInput).toHaveAttribute('type', 'text');
    const hideButton = screen.getByLabelText(/hide password/i);
    await userEvent.click(hideButton);
    expect(pwdInput).toHaveAttribute('type', 'password');
  });

  it('has a register link pointing to /register', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Provider>
          <AuthProvider>
            <Routes>
              <Route path='/login' element={<LoginForm />} />
            </Routes>
          </AuthProvider>
        </Provider>
      </MemoryRouter>,
    );
    const registerLink = screen.getByRole('link', { name: /register$/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
