import { createContext } from 'react';
import { AuthContextValue } from '~types/types.ts';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
