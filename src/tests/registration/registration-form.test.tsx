import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '~/tests/helpers/renderWithRouter';
import { describe, it, beforeEach, expect, vi } from 'vitest';

vi.mock('~/contexts/authContext', async () => {
  const actual = await vi.importActual<typeof import('~/contexts/authContext')>(
    '~/contexts/authContext',
  );

  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

import { useAuth } from '~/contexts/authContext';
const mockedUseAuth = vi.mocked(useAuth, true);

const makeAuthValue = (overrides: Partial<ReturnType<typeof baseValue>> = {}) =>
  Object.assign(baseValue(), overrides);

function baseValue() {
  return {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    clearErrors: vi.fn(),

    loading: false,
    error: '',
    accessToken: null,
    isAuthenticated: false,
  };
}

describe('Redirection to Login page from Registration page', () => {
  it('navigates to login page after clicking login link', async () => {
    mockedUseAuth.mockReturnValue(makeAuthValue());

    renderWithRouter('/register');

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /register page/i,
        hidden: true,
      }),
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

describe('Registration Form', () => {
  const registerMock = vi.fn();

  beforeEach(() => {
    mockedUseAuth.mockReturnValue(
      makeAuthValue({
        register: registerMock,
      }),
    );
  });

  it('calls register with correct data', () => {
    renderWithRouter('/register');

    const fields = [
      { placeholder: 'First Name', value: 'John' },
      { placeholder: 'Last Name', value: 'Doe' },
      { placeholder: 'Email', value: 'john@doe.com' },
      { placeholder: 'Password', value: '123456' },
      { placeholder: 'Confirm Password', value: '123456' },
      { placeholder: 'Date of Birth', value: '1990-01-01' },
      { placeholder: 'Street', value: 'Baker St' },
      { placeholder: 'City', value: 'London' },
      { placeholder: 'Postal Code', value: 'NW1' },
      { placeholder: 'Country', value: 'UK' },
    ];

    fields.forEach(({ placeholder, value }) => {
      fireEvent.change(screen.getByPlaceholderText(placeholder), {
        target: { value },
      });
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(registerMock).toHaveBeenCalledTimes(1);
    expect(registerMock).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      password: '123456',
      dateOfBirth: '1990-01-01',
      address: {
        street: 'Baker St',
        city: 'London',
        postalCode: 'NW1',
        country: 'UK',
      },
    });
  });

  it('disables button when loading', () => {
    mockedUseAuth.mockReturnValue(
      makeAuthValue({
        loading: true,
      }),
    );

    renderWithRouter('/register');
    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
  });

  it('renders server error', () => {
    mockedUseAuth.mockReturnValue(makeAuthValue({ error: 'Email taken' }));
    renderWithRouter('/register');
    expect(screen.getByText(/email taken/i)).toBeInTheDocument();
  });
});
