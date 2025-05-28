import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '~/hooks/useAuthContext';

export function RedirectIfAuth() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}
