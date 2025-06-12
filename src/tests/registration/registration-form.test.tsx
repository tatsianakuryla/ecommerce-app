// // src/tests/registration/registration-form.test.tsx
// import { screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { renderWithRouter } from '~/tests/helpers/renderWithRouter';
// import { describe, it, beforeEach, expect, vi } from 'vitest';
//
// vi.mock('~/contexts/authContext', async () => {
//   const actual = await vi.importActual<typeof import('~/contexts/authContext')>(
//     '~/contexts/authContext',
//   );
//   return {
//     ...actual,
//     useAuth: vi.fn(),
//   };
// });
// import { useAuth } from '~/contexts/authContext';
// const mockedUseAuth = vi.mocked(useAuth, true);
//
// function baseValue() {
//   return {
//     login: vi.fn(),
//     register: vi.fn(),
//     logout: vi.fn(),
//     clearErrors: vi.fn(),
//     loading: false,
//     error: '',
//     accessToken: null,
//     isAuthenticated: false,
//   };
// }
// const makeAuthValue = (overrides: Partial<ReturnType<typeof baseValue>> = {}) =>
//   Object.assign(baseValue(), overrides);
//
// describe('Redirection to Login page from Registration page', () => {
//   it('navigates to login page after clicking login link', async () => {
//     mockedUseAuth.mockReturnValue(makeAuthValue());
//     renderWithRouter('/register');
//
//     expect(
//       await screen.findByRole('heading', {
//         level: 2,
//         name: /register page/i,
//         hidden: true,
//       }),
//     ).toBeInTheDocument();
//
//     await userEvent.click(
//       screen.getByRole('link', { name: /already have an account\?.*login/i }),
//     );
//
//     expect(
//       await screen.findByRole('heading', { name: /login page/i }),
//     ).toBeInTheDocument();
//   });
// });
//
// describe('Registration Form', () => {
//   let registerMock: ReturnType<typeof vi.fn>;
//
//   beforeEach(() => {
//     registerMock = vi.fn();
//     mockedUseAuth.mockReturnValue(
//       makeAuthValue({
//         register: registerMock,
//       }),
//     );
//   });
//
//   it('disables button when loading', () => {
//     mockedUseAuth.mockReturnValue(makeAuthValue({ loading: true }));
//     renderWithRouter('/register');
//     expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
//   });
//
//   it('renders server error', () => {
//     mockedUseAuth.mockReturnValue(makeAuthValue({ error: 'Email taken' }));
//     renderWithRouter('/register');
//     expect(screen.getByText(/email taken/i)).toBeInTheDocument();
//   });
// });
