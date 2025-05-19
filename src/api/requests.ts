import { v4 } from 'uuid';
import { generatePermissions } from '~utils/helpers';
import {
  BASIC_AUTH_HEADER,
  USER_AUTH_URL,
  PUBLISHED_PRODUCTS_URL,
  GUEST_AUTH_TOKEN_URL,
  CUSTOMER_CREATION_URL,
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
  return new Request(PUBLISHED_PRODUCTS_URL, {
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

  return new Request(GUEST_AUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: BASIC_AUTH_HEADER,
    },
    body,
  });
};

export function createUserRegistrationRequest(data: RegistrationData): Request {
  return new Request(CUSTOMER_CREATION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export const createUser = (
  data: RegistrationData,
  accessToken: string,
): Request => {
  const body = JSON.stringify(data);

  return new Request(CUSTOMER_CREATION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });
};
