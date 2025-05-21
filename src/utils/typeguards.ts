import {
  ErrorResponse,
  ProductsResponse,
  AuthResponse,
  CustomerResponse,
} from '~types/types';

export const isAuthResponse = (data: unknown): data is AuthResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'access_token' in data &&
    'expires_in' in data &&
    'token_type' in data &&
    'scope' in data &&
    'refresh_token' in data
  );
};

export const isErrorResponse = (data: unknown): data is ErrorResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'statusCode' in data &&
    'message' in data &&
    'errors' in data &&
    Array.isArray(data.errors)
  );
};

export const isProductsResponse = (data: unknown): data is ProductsResponse => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  if (
    !('results' in data) ||
    !Array.isArray(data.results) ||
    !('limit' in data) ||
    typeof data.limit !== 'number' ||
    !('offset' in data) ||
    typeof data.offset !== 'number' ||
    !('count' in data) ||
    typeof data.count !== 'number' ||
    !('total' in data) ||
    typeof data.total !== 'number'
  ) {
    return false;
  }

  return data.results.every((item: unknown) => {
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

export const isCustomerResponse = (obj: unknown): obj is CustomerResponse => {
  if (
    typeof obj === 'object' &&
    obj !== null &&
    'customer' in obj &&
    typeof obj.customer === 'object' &&
    obj.customer !== null
  ) {
    const c = obj.customer;
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
