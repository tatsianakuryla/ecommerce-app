import { CUSTOMER_ME_ENDPOINT } from '~constants/constants.ts';

export function createFetchMyProfileRequest(): Request {
  const storedToken = localStorage.getItem('accessToken');
  if (storedToken === null) {
    throw new Error('No access token in localStorage');
  }
  return new Request(CUSTOMER_ME_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  });
}
