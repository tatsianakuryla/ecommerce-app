import { useState, ReactNode, useEffect, useCallback } from 'react';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { AuthContext } from './authContext';
import {
  authenticateUser,
  createUser,
  generateAnonymousToken,
} from '~/api/requests';
import { isAuthResponse, isCustomerResponse } from '~/utils/typeguards';
import { CustomerResponse, RegistrationData } from '~types/types.ts';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { makeRequest, error, loading, clearErrors } = useMakeRequest();

  const fetchAnonymousToken = useCallback(async () => {
    try {
      const response = await makeRequest(
        generateAnonymousToken(),
        isAuthResponse,
      );
      if (response) setAccessToken(response.access_token);
    } catch (error) {
      throw new Error('anonymous token fetching failed', {
        cause: error,
      });
    }
  }, [makeRequest]);

  const logout = () => {
    setAccessToken(null);
    void fetchAnonymousToken();
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await makeRequest(
        authenticateUser(email, password),
        isAuthResponse,
      );

      if (!response?.access_token) {
        throw new Error('access_token was not received during login attempt');
      }

      setAccessToken(response.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('user login failed', { cause: error });
    }
  };

  const register = async (
    data: RegistrationData,
  ): Promise<CustomerResponse | undefined> => {
    clearErrors();
    try {
      if (!accessToken) {
        throw new Error('access_token is not provided');
      }

      const response = await makeRequest(
        createUser(data, accessToken),
        isCustomerResponse,
      );

      if (!response) {
        throw new Error('user registration failed');
      }

      await login(data.email, data.password);
      return response;
    } catch (error: unknown) {
      throw new Error('registration failed', { cause: error });
    }
  };

  useEffect(() => {
    void fetchAnonymousToken();
  }, [fetchAnonymousToken]);

  return (
    <AuthContext.Provider
      value={{
        logout,
        login,
        register,
        error,
        accessToken,
        loading,
        isAuthenticated,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
