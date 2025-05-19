import {
  AuthErrorResponseBody,
  ProductsResponseBody,
  User,
  UserAuthResponseBody,
} from '~types/types';

export function isUserAuthResponseBody(
  data: unknown,
): data is UserAuthResponseBody {
  return (
    typeof data === 'object' &&
    data !== null &&
    'access_token' in data &&
    'expires_in' in data &&
    'token_type' in data &&
    'scope' in data &&
    'refresh_token' in data
  );
}

export function isAuthErrorResponseBody(
  data: unknown,
): data is AuthErrorResponseBody {
  return (
    typeof data === 'object' &&
    data !== null &&
    'statusCode' in data &&
    'error' in data &&
    'error_description' in data &&
    'message' in data &&
    'errors' in data &&
    Array.isArray(data.errors)
  );
}

export function isProductsResponseBody(
  data: unknown,
): data is ProductsResponseBody {
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
}

export function isUserProfile(body: unknown): body is User {
  return (
    typeof body === 'object' &&
    body !== null &&
    'id' in body &&
    'email' in body &&
    'firstName' in body &&
    'lastName' in body &&
    'isActive' in body &&
    'permissionLevel' in body &&
    'scopes' in body
  );
}
