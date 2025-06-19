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

import {
  getAnonymousId,
  getCachedToken,
  cacheToken,
  clearAnonData,
} from '~/utils/storage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem('authToken') || getCachedToken(),
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('authToken'),
  );
  const [justRegistered, setJustRegistered] = useState(false);
  const { makeRequest, error, loading, setError } = useMakeRequest();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const fetchAnonymousToken = useCallback(async () => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const anonId = getAnonymousId();
      try {
        const resp = await makeRequest(
          generateAnonymousToken(anonId),
          isAuthResponse,
        );
        if (!resp) throw new Error('empty auth response');

        cacheToken(resp.access_token, resp.expires_in);
        setAccessToken(resp.access_token);
        return;
      } catch (error_: unknown) {
        if (
          error_ instanceof Error &&
          /anonymousId\s+is\s+already\s+in\s+use/i.test(error_.message)
        ) {
          clearAnonData();
          continue;
        }
        throw error_;
      }
    }
    throw new Error('Unable to obtain anonymous token: all attempts failed');
  }, [makeRequest]);

  const logout = () => {
    clearAnonData();
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setAccessToken(null);
    setCustomer(null);

    void fetchAnonymousToken();
  };

  const login = async (email: string, password: string) => {
    const response = await makeRequest(
      authenticateUser(email, password),
      isAuthResponse,
    );
    if (!response?.access_token)
      throw new Error('access_token was not received during login attempt');

    clearAnonData();
    localStorage.setItem('authToken', response.access_token);

    setAccessToken(response.access_token);
    setRefreshToken(response.refresh_token);
    setIsAuthenticated(true);

    const me = await makeRequest(
      fetchUserProfileRequest(response.access_token),
      isCustomer,
    );
    if (me) setCustomer(me);
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
    if (!accessToken) void fetchAnonymousToken();
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
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
