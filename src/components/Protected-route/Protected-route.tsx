import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '~hooks/useAuth';

interface Props {
  children: ReactNode;
}

// export function RequireAuth({ children }: Props) {
//   const { isAuthenticated, checking } = useAuth()
//
//   if (checking) {
//     return (
//       <Center h="100vh">
//         <Spinner size="xl" />
//       </Center>
//     )
//   }
//
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />
//   }
//
//   return <>{children}</>
// }

export function RedirectIfAuth({ children }: Props) {
  const { isAuthenticated, checking } = useAuth();

  if (checking) {
    return (
      <Center h='100vh'>
        <Spinner size='xl' />
      </Center>
    );
  }

  if (isAuthenticated) {
    return <Navigate to='/main' replace />;
  }

  return <>{children}</>;
}
