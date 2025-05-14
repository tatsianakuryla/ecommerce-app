import fixture from '~fixtures/fixture.json';
import { LoginForm } from '~components/LoginForm/LoginForm';
import {
  render,
  renderHook,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useLogin } from '~/hooks/useLogin';
import { Provider } from '~/components/ui/provider';

const renderComponent = (Component: React.FC) => {
  render(
    <Provider>
      <Component />
    </Provider>,
  );
  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');

  return {
    emailInput,
    passwordInput,
  };
};

describe('Login API tests', () => {
  it('should log in with correct credentials', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.login(
        fixture.correctUsername,
        fixture.correctPassword,
      );
    });

    expect(result.current.authResponseBody).toEqual(
      fixture.mockResponses.successAuth,
    );

    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toEqual(
        fixture.mockResponses.successAuth.access_token,
      );
    });
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
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.login(username, password);
    });

    expect(result.current.error).toEqual(
      fixture.mockResponses.wrongCredentials.message,
    );
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('should not log in with empty password', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.login(fixture.correctUsername, '');
    });

    expect(result.current.error).toEqual(
      fixture.mockResponses.emptyPassword.message,
    );
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('should not log in with empty email', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.login('', fixture.correctPassword);
    });

    expect(result.current.error).toEqual(
      fixture.mockResponses.wrongCredentials.message,
    );
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});

describe('Login UI tests', () => {
  it('should not render error modal after successful login', async () => {
    const { emailInput, passwordInput } = renderComponent(LoginForm);
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, {
      target: { value: fixture.correctUsername },
    });
    fireEvent.change(passwordInput, {
      target: { value: fixture.correctPassword },
    });
    fireEvent.click(loginButton);

    expect(screen.queryByTestId('progress-bar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-alert')).not.toBeInTheDocument();
      expect(localStorage.getItem('access_token')).toEqual(
        fixture.mockResponses.successAuth.access_token,
      );
    });
  });

  it('should render error modal after unsuccessful login', async () => {
    const { emailInput, passwordInput } = renderComponent(LoginForm);
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, {
      target: { value: fixture.incorrectUsername },
    });
    fireEvent.change(passwordInput, {
      target: { value: fixture.correctPassword },
    });
    fireEvent.click(loginButton);

    expect(screen.queryByTestId('progress-bar')).toBeInTheDocument();
    expect(await screen.findByTestId('error-alert')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-alert')).toBeInTheDocument();
      expect(localStorage.getItem('access_token')).toBeNull();
    });
  });
});
