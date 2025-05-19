import { screen } from '@testing-library/react';
import { renderWithRouter } from '~/tests/helpers/renderWithRouter.tsx';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { Provider } from '~components/ui/provider.tsx';
import { AuthContext } from '~/contexts/authContext.tsx';
import { MemoryRouter } from 'react-router-dom';
import Header from '~components/Header/Header.tsx';
import { vi } from 'vitest';

describe('Routing', () => {
  it('should render main', async () => {
    renderWithRouter('/', {
      isAuthenticated: false,
      loading: false,
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: /main page/i }),
    ).toBeInTheDocument();
  });

  it('should render 404', async () => {
    renderWithRouter('/unknown', {
      isAuthenticated: false,
      loading: false,
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: /not found page/i }),
    ).toBeInTheDocument();
  });

  it('should render /about', async () => {
    renderWithRouter('/about', {
      isAuthenticated: false,
      loading: false,
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: /about page/i }),
    ).toBeInTheDocument();
  });

  it('should render /register', async () => {
    renderWithRouter('/register', {
      isAuthenticated: false,
      loading: false,
    });

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /register page/i,
        hidden: true,
      }),
    ).toBeInTheDocument();
  });

  it('should render /login', async () => {
    renderWithRouter('/login', {
      isAuthenticated: false,
      loading: false,
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: /login page/i }),
    ).toBeInTheDocument();
  });

  it('shuld render Logout link for logged-in user', async () => {
    const logoutMock = vi.fn();
    render(
      <Provider>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            loading: false,
            logout: logoutMock,
            login: vi.fn(),
            error: null,
            accessToken: '',
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Header />
          </MemoryRouter>
        </AuthContext.Provider>
      </Provider>,
    );

    const logoutLink = screen.getByRole('link', {
      name: /logout/i,
      hidden: true,
    });
    expect(logoutLink).toBeInTheDocument();

    await userEvent.click(logoutLink);
    expect(logoutMock).toHaveBeenCalled();
  });
});
