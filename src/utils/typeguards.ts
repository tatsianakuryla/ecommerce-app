import { AuthErrorResponseBody, UserAuthResponseBody } from '~types/types';

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
