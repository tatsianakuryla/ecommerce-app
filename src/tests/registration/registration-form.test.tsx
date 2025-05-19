import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '~/tests/helpers/renderWithRouter';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { useRegister } from '~/hooks/useRegister';

vi.mock('~/hooks/useRegister', () => ({
  useRegister: vi.fn(),
}));

const mockedUseRegister = vi.mocked(useRegister, true);

describe('Redirection to Login page from Registration page', () => {
  it('navigates to login page after clicking login link', async () => {
    mockedUseRegister.mockReturnValue({
      register: vi.fn(),
      loading: false,
      error: null,
    });

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

describe('Registration Form', () => {
  const registerMock = vi.fn();

  beforeEach(() => {
    mockedUseRegister.mockReturnValue({
      register: registerMock,
      loading: false,
      error: null,
    });
  });

  it('calls register with correct data', () => {
    renderWithRouter('/register');

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@doe.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByPlaceholderText('Date of Birth'), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByPlaceholderText('Street'), {
      target: { value: 'Baker St' },
    });
    fireEvent.change(screen.getByPlaceholderText('City'), {
      target: { value: 'London' },
    });
    fireEvent.change(screen.getByPlaceholderText('Postal Code'), {
      target: { value: 'NW1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Country'), {
      target: { value: 'UK' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

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
    mockedUseRegister.mockReturnValue({
      register: vi.fn(),
      loading: true,
      error: null,
    });

    renderWithRouter('/register');
    expect(screen.getByRole('button', { name: /Register/i })).toBeDisabled();
  });

  it('renders server error', () => {
    mockedUseRegister.mockReturnValue({
      register: vi.fn(),
      loading: false,
      error: 'Email taken',
    });

    renderWithRouter('/register');
    expect(screen.getByText(/Email taken/i)).toBeInTheDocument();
  });
});
