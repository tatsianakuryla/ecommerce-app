import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '~router/App-routes';
import { Provider } from '~components/ui/provider';
import { AuthProvider } from '~/contexts/authProvider.tsx';

describe('Redirection to Login page from Registration page', () => {
  it('navigates to login page after clicking login link', async () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Provider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Provider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole('heading', { name: /register page/i }),
    ).toBeInTheDocument();
    const loginLink = screen.getByRole('link', {
      name: /already have an account\?.*login/i,
    });
    await userEvent.click(loginLink);
    expect(
      await screen.findByRole('heading', { name: /login page/i }),
    ).toBeInTheDocument();
  });
});
