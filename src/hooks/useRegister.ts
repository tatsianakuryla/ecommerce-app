import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMakeRequest } from './useMakeRequest';
import {
  createUserRegistrationRequest,
  authenticateUser,
  createFetchMyProfileRequest,
} from '~/api/requests';
import {
  isAuthErrorResponseBody,
  isUserAuthResponseBody,
  isUserProfile,
} from '~/utils/typeguards';
import type { RegistrationData, User } from '~/types/types';

export function useRegister() {
  const [error, setError] = useState<string | null>(null);
  const { makeRequest, loading } = useMakeRequest();
  const navigate = useNavigate();

  const register = async (data: RegistrationData) => {
    setError(null);
    try {
      await makeRequest(createUserRegistrationRequest(data), isUserProfile);

      const loginBody = await makeRequest(
        authenticateUser(data.email, data.password),
        isUserAuthResponseBody,
      );
      if (!loginBody) throw new Error('Login failed');

      localStorage.setItem('accessToken', loginBody.access_token);

      const profile: User | undefined = await makeRequest(
        createFetchMyProfileRequest(),
        isUserProfile,
      );
      if (!profile) throw new Error('Profile fetch failed');

      void navigate('/');
      return profile;
    } catch (err: unknown) {
      if (isAuthErrorResponseBody(err)) setError(err.message);
      else if (err instanceof Error) setError(err.message);
      else setError('Unknown error');
    }
  };

  return { register, loading, error };
}
