import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from '~components/ui/provider'; // ← your Chakra+theme wrapper
import { AuthContext } from '~/contexts/authContext'; // make sure this matches your file

interface RenderOptions {
  route?: string;
  isAuthenticated?: boolean;
  checking?: boolean;
}

export function renderWithRouter(
  ui: ReactNode,
  {
    route = '/',
    isAuthenticated = false,
    checking = false,
  }: RenderOptions = {},
) {
  return render(
    <Provider>
      {' '}
      {/* ← now wrap your UI */}
      <AuthContext.Provider
        value={{ isAuthenticated, checking, logout: () => {} }}
      >
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AuthContext.Provider>
    </Provider>,
  );
}
