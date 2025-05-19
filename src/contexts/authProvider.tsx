import { useState, ReactNode, useEffect } from 'react';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { AuthContext } from './authContext';
import {
  authenticateUser,
  createUser,
  generateAnonymousToken,
} from '~/api/requests';
import { isAuthResponse, isCustomerResponse } from '~/utils/typeguards';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { makeRequest, error, loading, clearErrors } = useMakeRequest();

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await makeRequest(
        authenticateUser(email, password),
        isAuthResponse,
      );

      if (response && !response.access_token) {
        throw new Error('access_token was not received during login attempt');
      }

      if (response) {
        setAccessToken(response.access_token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      throw new Error('Error during user login:', { cause: error });
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    try {
      if (!accessToken) {
        throw new Error('access_token is not provided');
      }

      const response = await makeRequest(
        createUser(email, password, firstName, lastName, accessToken),
        isCustomerResponse,
      );

      if (response) {
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      throw new Error('Error during registration:', {
        cause: error,
      });
    }
  };

  useEffect(() => {
    async function fetchAnonymousToken() {
      try {
        const response = await makeRequest(
          generateAnonymousToken(),
          isAuthResponse,
        );
        if (response) setAccessToken(response.access_token);
      } catch (error) {
        throw new Error('Error during fetching anonymous token:', {
          cause: error,
        });
      }
    }

    void fetchAnonymousToken();
  }, [makeRequest]);

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
