import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '~hooks/useAuthContext.ts';

export function RequireAuth() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
}
