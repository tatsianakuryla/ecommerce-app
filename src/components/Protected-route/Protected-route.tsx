import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '~hooks/useAuth';
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle.tsx';

interface Props {
  children: ReactNode;
}

export function RedirectIfAuth({ children }: Props) {
  const { isAuthenticated, checking } = useAuth();

  if (checking) {
    return <ProgressCircleElement />;
  }

  if (isAuthenticated) {
    return <Navigate to='/main' replace />;
  }

  return <>{children}</>;
}
