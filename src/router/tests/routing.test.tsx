import { screen } from '@testing-library/react';
import { renderWithRouter } from '~router/tests/helpers/renderWithRouter';
import '@testing-library/jest-dom';
import { AppRoutes } from '~router/App-routes.tsx';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { Provider } from '~components/ui/provider.tsx';
import { AuthContext } from '~/contexts/authContext';
import { MemoryRouter } from 'react-router-dom';
import Header from '~components/Header/Header.tsx';
import { vi } from 'vitest';

describe('Routing', () => {
  it('redirects / to /main', async () => {
    renderWithRouter(<AppRoutes />, {
      route: '/',
      isAuthenticated: false,
      checking: false,
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: /main page/i }),
    ).toBeInTheDocument();
  });

  it('renders 404 page for unknown route', async () => {
    renderWithRouter(<AppRoutes />, {
      route: '/unknown',
      isAuthenticated: false,
      checking: false,
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: /not found page/i }),
    ).toBeInTheDocument();
  });

  it('renders about page for "/about" route', async () => {
    renderWithRouter(<AppRoutes />, {
      route: '/about',
      isAuthenticated: false,
      checking: false,
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: /about page/i }),
    ).toBeInTheDocument();
  });

  it('renders register page for "/register" route', async () => {
    renderWithRouter(<AppRoutes />, {
      route: '/register',
      isAuthenticated: false,
      checking: false,
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: /register page/i }),
    ).toBeInTheDocument();
  });

  it('renders register page for "/login" route', async () => {
    renderWithRouter(<AppRoutes />, {
      route: '/login',
      isAuthenticated: false,
      checking: false,
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: /login page/i }),
    ).toBeInTheDocument();
  });

  it('renders Logout link for logged-in user', async () => {
    const logoutMock = vi.fn();
    render(
      <Provider>
        <AuthContext.Provider
          value={{ isAuthenticated: true, checking: false, logout: logoutMock }}
        >
          <MemoryRouter initialEntries={['/main']}>
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
