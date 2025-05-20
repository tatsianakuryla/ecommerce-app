import fixture from '~fixtures/fixture.json';
import {
  renderHook,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { Provider as ChakraProvider } from '~components/ui/provider.tsx';
import { AuthProvider } from '~/contexts/authProvider.tsx';
import { useAuthContext } from '~hooks/useAuthContext.ts';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { renderWithRouter } from '~/tests/helpers/renderWithRouter.tsx';

const makeRequestMock = vi.fn();

vi.mock('~/hooks/useMakeRequest', () => ({
  useMakeRequest: () => ({
    makeRequest: makeRequestMock,
    loading: false,
    error: null,
    clearErrors: vi.fn(),
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>
    <AuthProvider>{children}</AuthProvider>
  </ChakraProvider>
);

describe('Login API login', () => {
  beforeEach(() => {
    makeRequestMock.mockReset();
  });

  it('should log in with correct credentials', async () => {
    makeRequestMock

      .mockResolvedValueOnce({ access_token: 'anon' })
      .mockResolvedValueOnce({
        access_token: fixture.mockResponses.successAuth.access_token,
      });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(() =>
      result.current.login(fixture.correctUsername, fixture.correctPassword),
    );

    expect(result.current.accessToken).toBe(
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
    makeRequestMock
      .mockResolvedValueOnce({ access_token: 'anon' })
      .mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await expect(
      act(() => result.current.login(username, password)),
    ).rejects.toThrow('Error during user login');

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should not log in with empty password', async () => {
    makeRequestMock
      .mockResolvedValueOnce({ access_token: 'anon' })
      .mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await expect(
      act(() => result.current.login(fixture.correctUsername, '')),
    ).rejects.toThrow('Error during user login');

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should not log in with empty email', async () => {
    makeRequestMock
      .mockResolvedValueOnce({ access_token: 'anon' })
      .mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await expect(
      act(() => result.current.login('', fixture.correctPassword)),
    ).rejects.toThrow('Error during user login');

    expect(result.current.isAuthenticated).toBe(false);
  });
});

describe('Login UI login', () => {
  beforeEach(() => {
    makeRequestMock.mockReset().mockResolvedValue({ access_token: 'anon' });
  });

  it('should call login with correct credentials', async () => {
    const loginMock = vi.fn().mockResolvedValue('fake-token');

    renderWithRouter('/login', { login: loginMock });

    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      fixture.correctUsername,
    );
    await userEvent.type(
      screen.getByPlaceholderText('Password'),
      fixture.correctPassword,
    );
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith(
        fixture.correctUsername,
        fixture.correctPassword,
      );
    });
  });

  it('should not render error modal after successful login', async () => {
    renderWithRouter('/login');

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: fixture.correctUsername },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: fixture.correctPassword },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.queryByTestId('error-alert')).not.toBeInTheDocument();
    });
  });

  it('should render error modal after unsuccessful login', async () => {
    makeRequestMock
      .mockReset()
      .mockResolvedValueOnce({ access_token: 'anon' })
      .mockResolvedValueOnce({});

    renderWithRouter('/login');

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: fixture.correctUsername },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: fixture.incorrectPassword },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByTestId('error-alert-error')).toBeInTheDocument();
    });
  });

  it('navigates to register page after clicking register link', async () => {
    renderWithRouter('/login');

    expect(
      await screen.findByRole('heading', { name: /login page/i }),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('link', {
        name: /Don`t have an account\?.*register/i,
      }),
    );
    expect(
      await screen.findByRole('heading', {
        name: /register page/i,
        hidden: true,
      }),
    ).toBeInTheDocument();
  });
});
