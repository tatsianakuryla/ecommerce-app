import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import { AuthContextValue } from '~types/types.ts';

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
