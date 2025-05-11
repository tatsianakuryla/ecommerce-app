export const BASE_API_URL = 'https://api.eu-central-1.aws.commercetools.com/'
export const BASE_AUTH_URL = 'https://auth.eu-central-1.aws.commercetools.com/'
export const CLIENT_AUTH_URL = `${BASE_AUTH_URL}oauth/token`
export const USER_AUTH_URL = `${BASE_AUTH_URL}oauth/${import.meta.env.VITE_API_CLIENT_NAME}/customers/token`
