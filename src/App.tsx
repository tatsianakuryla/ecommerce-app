import { router } from '~/router/router';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/authProvider';
import { CartProvider } from '~/contexts/cartContext';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}
