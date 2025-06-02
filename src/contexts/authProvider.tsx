import { useState, ReactNode, useEffect, useCallback } from 'react';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { AuthContext } from './authContext';
import {
  authenticateUser,
  changePasswordRequest,
  createUser,
  fetchUserProfileRequest,
  generateAnonymousToken,
  updateCustomerRequest,
} from '~/api/requests';
import {
  isAuthResponse,
  isCustomerResponse,
  isCustomer,
} from '~/utils/typeguards';
import {
  Customer,
  CustomerResponse,
  CustomerUpdateAction,
  RegistrationData,
} from '~types/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem('authToken'),
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('authToken'),
  );
  const [justRegistered, setJustRegistered] = useState(false);
  const { makeRequest, error, loading, setError } = useMakeRequest();
  const [customer, setCustomer] = useState<Customer | null>(null);

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
    void fetchAnonymousToken();
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    setAccessToken(null);
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
      localStorage.setItem('authToken', response.access_token);
      setIsAuthenticated(true);
      const customer = await makeRequest(
        fetchUserProfileRequest(response.access_token),
        isCustomer,
      );
      if (customer) {
        setCustomer(customer);
      }
    } catch (error) {
      throw new Error('user login failed', { cause: error });
    }
  };

  const register = async (
    data: RegistrationData,
  ): Promise<CustomerResponse | undefined> => {
    try {
      if (!accessToken) {
        throw new Error('access_token is not provided');
      }

      const response = await makeRequest(
        createUser(data, accessToken),
        isCustomerResponse,
      );
      if (!response) {
        throw new Error('empty registration response');
      }

      await login(data.email, data.password);
      setJustRegistered(true);
      return response;
    } catch (error: unknown) {
      throw new Error('registration failed', { cause: error });
    }
  };

  const updatePassword = async (
    customerId: string,
    version: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    if (!accessToken) {
      throw new Error('access_token is not provided');
    }

    const response = await makeRequest(
      changePasswordRequest(
        customerId,
        version,
        currentPassword,
        newPassword,
        accessToken,
      ),
      isCustomer,
    );

    if (!response) {
      throw new Error('Password update failed: empty response.');
    }
  };

  const updateProfile = async (
    customerId: string,
    version: number,
    actions: CustomerUpdateAction[],
  ): Promise<Customer | undefined> => {
    try {
      if (!accessToken) {
        throw new Error('access_token is not provided');
      }

      const response = await makeRequest(
        updateCustomerRequest(customerId, version, actions, accessToken),
        isCustomer,
      );
      if (!response) {
        throw new Error('Empty response from the server');
      }
      setCustomer(response);
      return response;
    } catch (error: unknown) {
      throw new Error('The profile was not updated', { cause: error });
    }
  };

  useEffect(() => {
    if (!accessToken) {
      void fetchAnonymousToken();
    }
  }, [accessToken, fetchAnonymousToken]);

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
        justRegistered,
        setJustRegistered,
        setError,
        updateProfile,
        updatePassword,
        customer,
        setCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
