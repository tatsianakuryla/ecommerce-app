import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '~router/router.tsx';
import { AuthContext } from '~/contexts/authContext.tsx';
import { Provider as ChakraProvider } from '~components/ui/provider.tsx';
import { CustomerResponse, RegistrationData } from '~types/types.ts';

interface RenderOptions {
  route?: string;
  isAuthenticated?: boolean;
  loading?: boolean;
  logout?: () => void;
  login?: () => Promise<void>;
  register?: (data: RegistrationData) => Promise<CustomerResponse | undefined>;
  clearErrors?: () => void;
}

export function renderWithRouter(
  initialRoute: string,
  {
    login = async () => {},
    logout = () => {},
    register = Promise<void>,
    clearErrors = () => {},
    isAuthenticated = false,
    loading = false,
  }: RenderOptions = {},
) {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
  });

  return render(
    <ChakraProvider>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          loading,
          logout,
          login,
          register,
          clearErrors,
          error: null,
          accessToken: '',
        }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </ChakraProvider>,
  );
}
