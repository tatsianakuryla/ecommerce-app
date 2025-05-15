import { router } from '~/router/router';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/authProvider';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />;
    </AuthProvider>
  );
}
