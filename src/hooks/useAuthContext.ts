import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import { AuthContextValue } from '~types/types.ts';

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be inside AuthProvider');
  return context;
}
