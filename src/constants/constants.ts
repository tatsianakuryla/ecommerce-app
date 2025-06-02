// Requests related
import { ILocales } from '~types/types.ts';

export const PROJECT_KEY = 'rssecomm';
const CLIENT_ID = 'VSoSJL93ehdNSp2ILY62b3zG';
const CLIENT_SECRET = '9xPxdvPzFxRVhOAw4_U1Qkbcub8EcT1U';
export const BASIC_AUTH_HEADER =
  'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

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
export const USER_AUTH_TOKEN = `oauth/${PROJECT_KEY}/customers/token`;
export const GUEST_AUTH_TOKEN_URL = `${BASE_AUTH_URL}oauth/${PROJECT_KEY}/anonymous/token`;
export const CLIENT_AUTH_URL = `${BASE_AUTH_URL}oauth/token`;
export const USER_AUTH_URL = `${BASE_AUTH_URL}${USER_AUTH_TOKEN}`;
export const PUBLISHED_PRODUCTS_URL = `${BASE_API_URL}${PROJECT_KEY}/product-projections`;
export const CUSTOMER_CREATION_URL = `${BASE_API_URL}${PROJECT_KEY}/customers`;

// locales
export const locales: ILocales = {
  DE: 'de-DE',
  EN: 'en-US',
  UK: 'en-GB',
} as const;
