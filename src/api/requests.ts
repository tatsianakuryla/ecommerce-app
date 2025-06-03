import { v4 } from 'uuid';
import { generatePermissions } from '~utils/helpers';
import {
  BASIC_AUTH_HEADER,
  USER_AUTH_URL,
  PUBLISHED_PRODUCTS_URL,
  GUEST_AUTH_TOKEN_URL,
  CUSTOMER_CREATION_URL,
  BASE_API_URL,
  PROJECT_KEY,
} from '~/constants/constants';
import {
  AddressDraft,
  CustomerDraft,
  CustomerUpdateAction,
  PermissionLevel,
  RegistrationData,
} from '~/types/types';

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
      Authorization: BASIC_AUTH_HEADER,
      'Content-Type': 'application/x-www-form-urlencoded',
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
      Authorization: BASIC_AUTH_HEADER,
    },
    body,
  });
};

export const createUser = (
  data: RegistrationData,
  accessToken: string,
): Request => {
  const addressesToSend: AddressDraft[] = [];

  addressesToSend.push({
    streetName: data.addresses[0].streetName,
    city: data.addresses[0].city,
    postalCode: data.addresses[0].postalCode,
    country: data.addresses[0].country,
  });

  if (data.addresses[1].streetName.trim() !== '') {
    addressesToSend.push({
      streetName: data.addresses[1].streetName,
      city: data.addresses[1].city,
      postalCode: data.addresses[1].postalCode,
      country: data.addresses[1].country,
    });
  }

  const customerDraft: CustomerDraft = {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    addresses: addressesToSend,
    defaultShippingAddress:
      data.defaultShippingAddress === -1 ? 0 : data.defaultShippingAddress,
    defaultBillingAddress:
      data.defaultBillingAddress === -1 ? 0 : data.defaultBillingAddress,
  };

  return new Request(CUSTOMER_CREATION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(customerDraft),
  });
};

export function fetchUserProfileRequest(token: string): Request {
  const url = `${BASE_API_URL}${PROJECT_KEY}/me`;
  return new Request(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export function updateCustomerRequest(
  id: string,
  version: number,
  actions: CustomerUpdateAction[],
  token: string,
): Request {
  return new Request(`${BASE_API_URL}${PROJECT_KEY}/customers/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ version, actions }),
  });
}

export const changePasswordRequest = (
  id: string,
  version: number,
  currentPassword: string,
  newPassword: string,
  accessToken: string,
): Request => {
  const body = JSON.stringify({
    id,
    version,
    currentPassword,
    newPassword,
  });

  return new Request(`${BASE_API_URL}${PROJECT_KEY}/customers/password`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body,
  });
};

export const getProductById = (productId: string, token: string): Request => {
  const url = `${BASE_API_URL}${PROJECT_KEY}/product-projections/${productId}?staged=false`;
  return new Request(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};
