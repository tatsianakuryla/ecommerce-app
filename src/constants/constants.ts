// Requests related
export const PROJECT_KEY = import.meta.env.VITE_API_CLIENT_NAME;
const { VITE_CLIENT_ID, VITE_CLIENT_SECRET } = import.meta.env;
export const BASIC_AUTH_HEADER =
  'Basic ' + btoa(`${VITE_CLIENT_ID}:${VITE_CLIENT_SECRET}`);

// Permissions
const GUEST_PERMISSIONS = {
  VIEW_PRODUCTS: 'view_products',
  VIEW_CATEGORIES: 'view_categories',
  MANAGE_CUSTOMERS: 'manage_customers',
  VIEW_MESSAGES: 'view_messages',
} as const;

const USER_PERMISSIONS = {
  ...GUEST_PERMISSIONS,
  MANAGE_MY_ORDERS: 'manage_my_orders',
  MANAGE_MY_PROFILE: 'manage_my_profile',
} as const;

const API_PERMISSIONS = {
  CREATE_ANONYMOUS_TOKEN: 'create_anonymous_token',
} as const;

const ALL_PERMISSIONS = {
  ...GUEST_PERMISSIONS,
  ...USER_PERMISSIONS,
  ...API_PERMISSIONS,
} as const;

export const permissions = {
  api: API_PERMISSIONS,
  user: USER_PERMISSIONS,
  guest: GUEST_PERMISSIONS,
  all: ALL_PERMISSIONS,
} as const;

// URL
export const BASE_API_URL = 'https://api.eu-central-1.aws.commercetools.com/';
export const BASE_AUTH_URL = 'https://auth.eu-central-1.aws.commercetools.com/';
export const AUTH_TOKEN = 'oauth/token';
export const USER_AUTH_TOKEN = `oauth/${PROJECT_KEY}/customers/token`;
export const GUEST_AUTH_TOKEN = `${BASE_AUTH_URL}oauth/${PROJECT_KEY}/anonymous/token`;
export const CLIENT_AUTH_URL = `${BASE_AUTH_URL}${AUTH_TOKEN}`;
export const USER_AUTH_URL = `${BASE_AUTH_URL}${USER_AUTH_TOKEN}`;
export const PUBLISHED_PRODUCTS = `${BASE_API_URL}${PROJECT_KEY}/product-projections`;
