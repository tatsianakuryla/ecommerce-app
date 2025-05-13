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
