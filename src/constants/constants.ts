// Requests related
const { VITE_CLIENT_ID, VITE_CLIENT_SECRET } = import.meta.env;
export const BASIC_AUTH_HEADER =
  'Basic ' + btoa(`${VITE_CLIENT_ID}:${VITE_CLIENT_SECRET}`);

// Permissions
const USER_PERMISSIONS = {
  VIEW_PUBLISHED_PRODUCTS: 'view_published_products',
  MANAGE_MY_ORDERS: 'manage_my_orders',
  MANAGE_MY_PROFILE: 'manage_my_profile',
  VIEW_CATEGORIES: 'view_categories',
} as const;

const API_PERMISSIONS = {
  CREATE_ANONYMOUS_TOKEN: 'create_anonymous_token',
} as const;

const ALL_PERMISSIONS = {
  ...USER_PERMISSIONS,
  ...API_PERMISSIONS,
} as const;

export const permissions = {
  api: API_PERMISSIONS,
  user: USER_PERMISSIONS,
  all: ALL_PERMISSIONS,
} as const;

// URL
export const BASE_API_URL = 'https://api.eu-central-1.aws.commercetools.com/';
export const BASE_AUTH_URL = 'https://auth.eu-central-1.aws.commercetools.com/';
export const AUTH_TOKEN = 'oauth/token';
export const USER_AUTH_TOKEN = `oauth/${import.meta.env.VITE_API_CLIENT_NAME}/customers/token`;
export const CLIENT_AUTH_URL = `${BASE_AUTH_URL}${AUTH_TOKEN}`;
export const USER_AUTH_URL = `${BASE_AUTH_URL}${USER_AUTH_TOKEN}`;

export const PROJECT_KEY = import.meta.env.VITE_API_CLIENT_NAME;
export const CUSTOMER_ME_ENDPOINT = `${BASE_API_URL}/${PROJECT_KEY}/customers/me`;
