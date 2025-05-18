// test-utils.tsx
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '~/router/router';
import { AuthContext } from '~/contexts/authContext';
import { Provider as ChakraProvider } from '~components/ui/provider';

interface RenderOptions {
  route?: string;
  isAuthenticated?: boolean;
  loading?: boolean;
  logout?: () => void;
  login?: () => Promise<void>;
}

export function renderWithRouter(
  initialRoute: string,
  {
    login = async () => {},
    logout = () => {},
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
          error: null,
          accessToken: '',
        }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </ChakraProvider>,
  );
}
