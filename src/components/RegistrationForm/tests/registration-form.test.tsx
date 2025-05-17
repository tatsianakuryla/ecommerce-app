import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '~/router/tests/helpers/renderWithRouter';

describe('Redirection to Login page from Registration page', () => {
  it('navigates to login page after clicking login link', async () => {
    renderWithRouter('/register');
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
