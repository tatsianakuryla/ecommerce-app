import { useState, ReactNode, useEffect } from 'react';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { AuthContext } from './authContext';
import { authenticateUser, generateAnonymousToken } from '~/api/requests';
import { isUserAuthResponseBody } from '~/utils/typeguards';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { makeRequest, error, loading } = useMakeRequest();

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const responseBody = await makeRequest(
        authenticateUser(email, password),
        isUserAuthResponseBody,
      );
      if (responseBody) {
        setAccessToken(responseBody.access_token);
        setIsAuthenticated(true);
      }
    } catch {
      throw new Error('Failed to login');
    }
  };

  useEffect(() => {
    async function fetchAnonymousToken() {
      try {
        const responseBody = await makeRequest(
          generateAnonymousToken(),
          isUserAuthResponseBody,
        );
        if (responseBody) setAccessToken(responseBody.access_token);
      } catch {
        throw new Error('Failed to fetch anonymous token');
      }
    }

    void fetchAnonymousToken();
  }, [makeRequest]);

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ logout, login, error, accessToken, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}
