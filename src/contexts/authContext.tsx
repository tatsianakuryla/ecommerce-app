import { createContext } from 'react';
import { AuthContextValue } from '~types/types';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
