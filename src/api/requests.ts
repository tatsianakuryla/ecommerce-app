import { v4 } from 'uuid';
import { generatePermissions } from '~utils/helpers';
import {
  BASIC_AUTH_HEADER,
  USER_AUTH_URL,
  PUBLISHED_PRODUCTS,
  GUEST_AUTH_TOKEN,
  BASE_API_URL,
  PROJECT_KEY,
} from '~/constants/constants';
import { PermissionLevel, RegistrationData } from '~/types/types';

const userPermissions = generatePermissions(PermissionLevel.USER);
const guestPermissions = generatePermissions();

export const authenticateUser = (
  username: string,
  password: string,
): Request => {
  const body = new URLSearchParams({
    grant_type: 'password',
    username,
    password,
    scope: userPermissions,
  });

  return new Request(USER_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: BASIC_AUTH_HEADER,
    },
    body,
  });
};

export const getProducts = (token: string): Request => {
  return new Request(PUBLISHED_PRODUCTS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const generateAnonymousToken = (): Request => {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: guestPermissions,
    anonymous_id: v4(),
  });

  return new Request(GUEST_AUTH_TOKEN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: BASIC_AUTH_HEADER,
    },
    body,
  });
};

export function createUserRegistrationRequest(data: RegistrationData): Request {
  return new Request(`${BASE_API_URL}/${PROJECT_KEY}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function createFetchMyProfileRequest(): Request {
  const token = localStorage.getItem('accessToken');

  if (token == null || token === '') {
    return new Request(`${BASE_API_URL}/${PROJECT_KEY}/customers/me`);
  }

  return new Request(`${BASE_API_URL}/${PROJECT_KEY}/customers/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
