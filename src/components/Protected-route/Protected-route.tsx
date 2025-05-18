import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '~/hooks/useAuthContext';
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle.tsx';

export function RedirectIfAuth() {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <ProgressCircleElement />;
  }

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}
