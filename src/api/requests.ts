import { v4 } from 'uuid';
import { generatePermissions } from '~utils/helpers';
import {
  BASIC_AUTH_HEADER,
  USER_AUTH_URL,
  PUBLISHED_PRODUCTS_URL,
  GUEST_AUTH_TOKEN_URL,
  CUSTOMER_CREATION_URL,
  BASE_API_URL,
  PROJECT_KEY,
  CATEGORIES_URL,
  locales,
  MY_CARTS_URL,
  MY_ACTIVE_CART_URL,
} from '~/constants/constants';
import {
  AddressDraft,
  CustomerDraft,
  CustomerUpdateAction,
  ILocales,
  MyCartDraft,
  PermissionLevel,
  RegistrationData,
} from '~/types/types';

const userPermissions = generatePermissions(PermissionLevel.USER);
const guestPermissions = generatePermissions();

export const authenticateUser = (
  username: string,
  password: string,
): Request => {
  const body = new URLSearchParams({
    grant_type: 'password',
    username,
    password,
    scope: userPermissions,
  });

  return new Request(USER_AUTH_URL, {
    method: 'POST',
    headers: {
      Authorization: BASIC_AUTH_HEADER,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
};

export const generateAnonymousToken = (): Request => {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: guestPermissions,
    anonymous_id: v4(),
  });

  return new Request(GUEST_AUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: BASIC_AUTH_HEADER,
    },
    body,
  });
};

export const createUser = (
  data: RegistrationData,
  accessToken: string,
): Request => {
  const addressesToSend: AddressDraft[] = [];

  addressesToSend.push({
    streetName: data.addresses[0].streetName,
    city: data.addresses[0].city,
    postalCode: data.addresses[0].postalCode,
    country: data.addresses[0].country,
  });

  if (data.addresses[1].streetName.trim() !== '') {
    addressesToSend.push({
      streetName: data.addresses[1].streetName,
      city: data.addresses[1].city,
      postalCode: data.addresses[1].postalCode,
      country: data.addresses[1].country,
    });
  }

  const customerDraft: CustomerDraft = {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    addresses: addressesToSend,
    defaultShippingAddress:
      data.defaultShippingAddress === -1 ? 0 : data.defaultShippingAddress,
    defaultBillingAddress:
      data.defaultBillingAddress === -1 ? 0 : data.defaultBillingAddress,
  };

  return new Request(CUSTOMER_CREATION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(customerDraft),
  });
};

export function fetchUserProfileRequest(token: string): Request {
  const url = `${BASE_API_URL}${PROJECT_KEY}/me`;
  return new Request(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export function updateCustomerRequest(
  id: string,
  version: number,
  actions: CustomerUpdateAction[],
  token: string,
): Request {
  return new Request(`${BASE_API_URL}${PROJECT_KEY}/customers/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ version, actions }),
  });
}

export const changePasswordRequest = (
  id: string,
  version: number,
  currentPassword: string,
  newPassword: string,
  accessToken: string,
): Request => {
  const body = JSON.stringify({
    id,
    version,
    currentPassword,
    newPassword,
  });

  return new Request(`${BASE_API_URL}${PROJECT_KEY}/customers/password`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body,
  });
};

export const getProductById = (productId: string, token: string): Request => {
  const url = `${BASE_API_URL}${PROJECT_KEY}/product-projections/${productId}?staged=false`;
  return new Request(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const getCategories = (token: string): Request => {
  const url = `${CATEGORIES_URL}?limit=500`;
  return new Request(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const getProductsByCategory = (
  categoryId: string,
  token: string,
  locale: ILocales[keyof ILocales] = locales.UK,
): Request => {
  const encodedFilter = encodeURIComponent(`categories.id:"${categoryId}"`);
  const url = `${BASE_API_URL}${PROJECT_KEY}/product-projections/search?filter=${encodedFilter}&limit=100&localeProjection=${locale}`;
  return new Request(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const getProducts = (
  token: string,
  limit = 20,
  offset = 0,
  predicates?: string[],
  sort?: string[],
  search?: string,
  localeKey: keyof ILocales = 'UK',
  currency?: string,
  country?: string,
): Request => {
  const url = new URL(`${PUBLISHED_PRODUCTS_URL}/search`);

  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  if (predicates && predicates.length > 0) {
    predicates.forEach((p) => {
      if (p.includes('text.') || p.includes('categories.id:')) {
        url.searchParams.append('filter.query', p);
      } else {
        const m = p.match(/>=\s*(\d+).*<=\s*(\d+)/);
        if (m) {
          const [, min, max] = m;
          url.searchParams.append(
            'filter',
            `variants.scopedPrice.value.centAmount:range(${min} to ${max})`,
          );
        }
      }
    });
  }
  if (sort && sort.length > 0) {
    sort.forEach((s) => {
      url.searchParams.append('sort', s);
    });
  }

  if (search && search.trim().length > 0) {
    const realLocale = locales[localeKey];
    url.searchParams.set(`text.${realLocale}`, search.trim());
  }

  if (currency) {
    url.searchParams.set('priceCurrency', currency);
  }
  if (country) {
    url.searchParams.set('priceCountry', country);
  }

  url.searchParams.set('staged', 'false');

  return new Request(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const getFilterValues = (
  token: string,
  attributeName: string,
): Request => {
  const url = new URL(`${PUBLISHED_PRODUCTS_URL}/search`);

  url.searchParams.set('facet', `variants.attributes.${attributeName}`);
  url.searchParams.set('limit', '0');
  url.searchParams.set('staged', 'false');

  return new Request(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const getMyActiveCart = (token: string): Request =>
  new Request(MY_ACTIVE_CART_URL, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const createMyCart = (draft: MyCartDraft, token: string): Request =>
  new Request(MY_CARTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(draft),
  });

export const updateMyCart = (
  cartId: string,
  version: number,
  actions: unknown[],
  token: string,
): Request =>
  new Request(`${MY_CARTS_URL}/${cartId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ version, actions }),
  });

export const addLineItemAction = (
  productId: string,
  variantId: number,
  quantity = 1,
) => ({
  action: 'addLineItem',
  productId,
  variantId,
  quantity,
});
