import { ILocales } from '~types/types';

export const PROJECT_KEY = 'rssecomm';
const CLIENT_ID = 'VSoSJL93ehdNSp2ILY62b3zG';
const CLIENT_SECRET = '9xPxdvPzFxRVhOAw4_U1Qkbcub8EcT1U';
export const BASIC_AUTH_HEADER =
  'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

const GUEST_PERMISSIONS = {
  VIEW_PRODUCTS: 'view_products',
  VIEW_CATEGORIES: 'view_categories',
  MANAGE_MY_ORDERS: 'manage_my_orders',
  CREATE_ANONYMOUS_TOKEN: 'create_anonymous_token',
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

export const BASE_API_URL = 'https://api.eu-central-1.aws.commercetools.com/';
export const BASE_AUTH_URL = 'https://auth.eu-central-1.aws.commercetools.com/';
export const USER_AUTH_TOKEN = `oauth/${PROJECT_KEY}/customers/token`;
export const GUEST_AUTH_TOKEN_URL = `${BASE_AUTH_URL}oauth/${PROJECT_KEY}/anonymous/token`;
export const CLIENT_AUTH_URL = `${BASE_AUTH_URL}oauth/token`;
export const USER_AUTH_URL = `${BASE_AUTH_URL}${USER_AUTH_TOKEN}`;
export const PUBLISHED_PRODUCTS_URL = `${BASE_API_URL}${PROJECT_KEY}/product-projections`;
export const CUSTOMER_CREATION_URL = `${BASE_API_URL}${PROJECT_KEY}/customers`;
export const CATEGORIES_URL = `${BASE_API_URL}${PROJECT_KEY}/categories`;

export const locales: ILocales = {
  DE: 'de-DE',
  EN: 'en-US',
  UK: 'en-GB',
} as const;

export const defaultAddressInfo = {
  id: '',
  streetName: '',
  city: '',
  postalCode: '',
  country: '',
};

export const defaultUserInfo = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  dateOfBirth: '',
};

export const defaultAddressIndex = -1;
export const PRODUCTS_PER_PAGE = 6;
export const MY_CARTS_URL = `${BASE_API_URL}${PROJECT_KEY}/me/carts`;
export const MY_ACTIVE_CART_URL = `${BASE_API_URL}${PROJECT_KEY}/me/active-cart`;
export const promoCodes = ['SAVE10', 'WELCOME5'];
export const PROMO_DISCOUNTS_RATE: Record<string, number> = {
  SAVE10: 0.1,
  WELCOME5: 0.05,
};
