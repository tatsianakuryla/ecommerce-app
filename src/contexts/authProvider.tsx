import { useState, ReactNode, useEffect } from 'react';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { AuthContext } from './authContext';
import {
  authenticateUser,
  createUser,
  createUserRegistrationRequest,
  generateAnonymousToken,
} from '~/api/requests';
import {
  isAuthErrorResponse,
  isAuthResponse,
  isCustomerResponse,
  isUserProfile,
} from '~/utils/typeguards';
import { CustomerResponse, RegistrationData } from '~types/types.ts';

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
        return response.access_token;
      }
    } catch (error) {
      throw new Error('Error during user login:', { cause: error });
    }
  };

  const register = async (
    data: RegistrationData,
  ): Promise<CustomerResponse | undefined> => {
    clearErrors();
    try {
      await makeRequest(createUserRegistrationRequest(data), isUserProfile);

      const token = await login(data.email, data.password);

      if (!token) throw new Error('Login failed');

      const profile = await makeRequest(
        createUser(data, token),
        isCustomerResponse,
      );

      return profile;
    } catch (err: unknown) {
      if (isAuthErrorResponse(err)) {
        throw new Error(err.message);
      }
      throw new Error('Error during user registration', { cause: err });
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
