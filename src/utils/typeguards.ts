import {
  ErrorResponse,
  ProductsResponse,
  AuthResponse,
  CustomerResponse,
  Customer,
} from '~types/types';

export const isAuthResponse = (
  data__________: unknown,
): data__________ is AuthResponse => {
  return (
    typeof data__________ === 'object' &&
    data__________ !== null &&
    'access_token' in data__________ &&
    'expires_in' in data__________ &&
    'token_type' in data__________ &&
    'scope' in data__________ &&
    'refresh_token' in data__________
  );
};

export const isErrorResponse = (
  data__________: unknown,
): data__________ is ErrorResponse => {
  return (
    typeof data__________ === 'object' &&
    data__________ !== null &&
    'statusCode' in data__________ &&
    'message' in data__________ &&
    'errors' in data__________ &&
    Array.isArray(data__________.errors)
  );
};

export const isProductsResponse = (
  data__________: unknown,
): data__________ is ProductsResponse => {
  if (typeof data__________ !== 'object' || data__________ === null) {
    return false;
  }

  if (
    !('results' in data__________) ||
    !Array.isArray(data__________.results) ||
    !('limit' in data__________) ||
    typeof data__________.limit !== 'number' ||
    !('offset' in data__________) ||
    typeof data__________.offset !== 'number' ||
    !('count' in data__________) ||
    typeof data__________.count !== 'number' ||
    !('total' in data__________) ||
    typeof data__________.total !== 'number'
  ) {
    return false;
  }

  return data__________.results.every((item: unknown) => {
    if (typeof item !== 'object' || item === null) {
      return false;
    }
    return (
      'id' in item &&
      'name' in item &&
      'slug' in item &&
      'masterVariant' in item &&
      typeof item.id === 'string' &&
      typeof item.name === 'object' &&
      item.name !== null &&
      typeof item.slug === 'object' &&
      item.slug !== null &&
      typeof item.masterVariant === 'object' &&
      item.masterVariant !== null &&
      Array.isArray(
        typeof item.masterVariant === 'object' && 'prices' in item.masterVariant
          ? item.masterVariant.prices
          : undefined,
      )
    );
  });
};

export const isCustomerResponse = (
  object: unknown,
): object is CustomerResponse => {
  if (
    typeof object === 'object' &&
    object !== null &&
    'customer' in object &&
    typeof object.customer === 'object' &&
    object.customer !== null
  ) {
    const c = object.customer;
    return (
      'id' in c &&
      'version' in c &&
      'versionModifiedAt' in c &&
      'lastMessageSequenceNumber' in c &&
      'createdAt' in c &&
      'lastModifiedAt' in c &&
      'lastModifiedBy' in c &&
      'lastModifiedBy' in c &&
      'lastModifiedBy' in c &&
      'lastModifiedBy' in c &&
      'createdBy' in c &&
      'createdBy' in c &&
      'createdBy' in c &&
      'createdBy' in c &&
      'email' in c &&
      'firstName' in c &&
      'lastName' in c &&
      'password' in c &&
      'addresses' in c &&
      'shippingAddressIds' in c &&
      'billingAddressIds' in c &&
      'authenticationMode' in c &&
      typeof c.id === 'string' &&
      typeof c.version === 'number' &&
      typeof c.versionModifiedAt === 'string' &&
      typeof c.lastMessageSequenceNumber === 'number' &&
      typeof c.createdAt === 'string' &&
      typeof c.lastModifiedAt === 'string' &&
      typeof c.lastModifiedBy === 'object' &&
      typeof c.createdBy === 'object' &&
      typeof c.email === 'string' &&
      typeof c.firstName === 'string' &&
      typeof c.lastName === 'string' &&
      typeof c.password === 'string' &&
      Array.isArray(c.addresses) &&
      Array.isArray(c.shippingAddressIds) &&
      Array.isArray(c.billingAddressIds) &&
      typeof c.authenticationMode === 'string'
    );
  }

  return false;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

export function isCustomer(object: unknown): object is Customer {
  if (!isRecord(object)) return false;
  if (!('id' in object) || typeof object.id !== 'string') return false;
  if (!('addresses' in object) || !Array.isArray(object.addresses))
    return false;
  if (!('email' in object) || typeof object.email !== 'string') return false;

  return true;
}
