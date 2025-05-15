import { useEffect, useState, ReactNode } from 'react';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { createFetchMyProfileRequest } from '~api/createFetchMyProfileRequest.ts';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const { makeRequest } = useMakeRequest();

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAuthenticated(false);
  };

  useEffect(() => {
    async function initAuth() {
      try {
        await makeRequest(createFetchMyProfileRequest());
        setAuthenticated(true);
      } catch {
        logout();
      } finally {
        setChecking(false);
      }
    }
    void initAuth();
  }, [makeRequest]);

  if (checking) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, checking, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
