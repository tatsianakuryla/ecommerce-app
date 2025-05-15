import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import { AuthContextValue } from '~types/types.ts';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
}
