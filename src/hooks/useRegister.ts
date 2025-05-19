import { useState } from 'react';
import { useMakeRequest } from './useMakeRequest';
import {
  createUserRegistrationRequest,
  authenticateUser,
  createUser,
} from '~/api/requests';
import {
  isAuthErrorResponse,
  isAuthResponse,
  isUserProfile,
} from '~/utils/typeguards';
import type { RegistrationData, User } from '~/types/types';

export function useRegister() {
  const [error, setError] = useState<string | null>(null);
  const { makeRequest, loading } = useMakeRequest();

  const register = async (
    data: RegistrationData,
  ): Promise<User | undefined> => {
    setError(null);
    try {
      await makeRequest(createUserRegistrationRequest(data), isUserProfile);

      const loginBody = await makeRequest(
        authenticateUser(data.email, data.password),
        isAuthResponse,
      );
      if (!loginBody) throw new Error('Login failed');

      const profile = await makeRequest(
        createUser(data, loginBody.access_token),
        isUserProfile,
      );
      if (!profile) throw new Error('Profile fetch failed');

      return profile;
    } catch (err: unknown) {
      if (isAuthErrorResponse(err)) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  return { register, loading, error };
}
