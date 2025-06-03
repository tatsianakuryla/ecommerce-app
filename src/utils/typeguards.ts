import {
  ProductsResponse,
  AuthResponse,
  CustomerResponse,
  Customer,
  ErrorResponse,
  Product,
  Category,
  CategoriesResponse,
} from '~types/types';

export const isAuthResponse = (data: unknown): data is AuthResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'access_token' in data &&
    'expires_in' in data &&
    'token_type' in data &&
    'scope' in data &&
    'refresh_token' in data
  );
};

export const isErrorResponse = (data: unknown): data is ErrorResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'statusCode' in data &&
    'message' in data &&
    'errors' in data &&
    Array.isArray(data.errors)
  );
};

export const isProductsResponse = (data: unknown): data is ProductsResponse => {
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
};

export const isCustomerResponse = (
  object: unknown,
): object is CustomerResponse => {
  if (
    typeof object === 'object' &&
    object !== null &&
    'customer' in object &&
    typeof object.customer === 'object' &&
    object.customer !== null
  ) {
    const c = object.customer;
    return (
      'id' in c &&
      'version' in c &&
      'versionModifiedAt' in c &&
      'lastMessageSequenceNumber' in c &&
      'createdAt' in c &&
      'lastModifiedAt' in c &&
      'lastModifiedBy' in c &&
      'lastModifiedBy' in c &&
      'lastModifiedBy' in c &&
      'lastModifiedBy' in c &&
      'createdBy' in c &&
      'createdBy' in c &&
      'createdBy' in c &&
      'createdBy' in c &&
      'email' in c &&
      'firstName' in c &&
      'lastName' in c &&
      'password' in c &&
      'addresses' in c &&
      'shippingAddressIds' in c &&
      'billingAddressIds' in c &&
      'authenticationMode' in c &&
      typeof c.id === 'string' &&
      typeof c.version === 'number' &&
      typeof c.versionModifiedAt === 'string' &&
      typeof c.lastMessageSequenceNumber === 'number' &&
      typeof c.createdAt === 'string' &&
      typeof c.lastModifiedAt === 'string' &&
      typeof c.lastModifiedBy === 'object' &&
      typeof c.createdBy === 'object' &&
      typeof c.email === 'string' &&
      typeof c.firstName === 'string' &&
      typeof c.lastName === 'string' &&
      typeof c.password === 'string' &&
      Array.isArray(c.addresses) &&
      Array.isArray(c.shippingAddressIds) &&
      Array.isArray(c.billingAddressIds) &&
      typeof c.authenticationMode === 'string'
    );
  }

  return false;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

export function isCustomer(object: unknown): object is Customer {
  if (!isRecord(object)) return false;
  if (!('id' in object) || typeof object.id !== 'string') return false;
  if (!('addresses' in object) || !Array.isArray(object.addresses))
    return false;
  return !(!('email' in object) || typeof object.email !== 'string');
}

export function isNonNullRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function hasKey<K extends string>(
  object: Record<string, unknown>,
  key: K,
): object is Record<K, unknown> & Record<string, unknown> {
  return key in object;
}

export function isProduct(object: unknown): object is Product {
  if (!isNonNullRecord(object)) return false;

  if (!hasKey(object, 'id') || typeof object.id !== 'string') return false;
  if (!hasKey(object, 'version') || typeof object.version !== 'number')
    return false;

  if (!hasKey(object, 'name') || !isNonNullRecord(object.name)) return false;
  {
    const nameObject = object.name;
    const nameKeys = Object.keys(nameObject);
    if (nameKeys.length === 0) return false;
    const firstValue = nameObject[nameKeys[0]];
    if (typeof firstValue !== 'string') return false;
  }

  if (!hasKey(object, 'description') || !isNonNullRecord(object.description))
    return false;
  {
    const descObject = object.description;
    const descKeys = Object.keys(descObject);
    if (descKeys.length === 0) return false;
    const firstValue = descObject[descKeys[0]];
    if (typeof firstValue !== 'string') return false;
  }

  if (!hasKey(object, 'masterVariant')) return false;
  const maybeMV = object.masterVariant;
  if (!isNonNullRecord(maybeMV)) return false;

  if (!hasKey(maybeMV, 'id') || typeof maybeMV.id !== 'number') return false;
  if (!hasKey(maybeMV, 'prices') || !Array.isArray(maybeMV.prices))
    return false;
  for (const price of maybeMV.prices) {
    if (!isNonNullRecord(price)) return false;
    if (!hasKey(price, 'value') || !isNonNullRecord(price.value)) return false;
    const value = price.value;
    if (!hasKey(value, 'centAmount') || typeof value.centAmount !== 'number')
      return false;
    if (
      !hasKey(value, 'currencyCode') ||
      typeof value.currencyCode !== 'string'
    )
      return false;

    if (hasKey(price, 'discounted')) {
      const discounted = price.discounted;
      if (!isNonNullRecord(discounted)) return false;
      if (!hasKey(discounted, 'value') || !isNonNullRecord(discounted.value))
        return false;
      const discountValue = discounted.value;
      if (
        !hasKey(discountValue, 'centAmount') ||
        typeof discountValue.centAmount !== 'number'
      )
        return false;
      if (
        !hasKey(discountValue, 'currencyCode') ||
        typeof discountValue.currencyCode !== 'string'
      )
        return false;
      if (
        !hasKey(discounted, 'discount') ||
        !isNonNullRecord(discounted.discount)
      )
        return false;
      const discountObject = discounted.discount;
      if (
        !hasKey(discountObject, 'typeId') ||
        typeof discountObject.typeId !== 'string'
      )
        return false;
      if (
        !hasKey(discountObject, 'id') ||
        typeof discountObject.id !== 'string'
      )
        return false;
    }
  }

  if (!hasKey(maybeMV, 'images') || !Array.isArray(maybeMV.images))
    return false;
  for (const image of maybeMV.images) {
    if (!isNonNullRecord(image)) return false;
    if (!hasKey(image, 'url') || typeof image.url !== 'string') return false;
    if (!hasKey(image, 'dimensions') || !isNonNullRecord(image.dimensions))
      return false;
    const dims = image.dimensions;
    if (!hasKey(dims, 'w') || typeof dims.w !== 'number') return false;
    if (!hasKey(dims, 'h') || typeof dims.h !== 'number') return false;
  }

  if (!hasKey(maybeMV, 'attributes') || !Array.isArray(maybeMV.attributes))
    return false;

  if (!hasKey(object, 'productType')) return false;
  if (!hasKey(object, 'categories') || !Array.isArray(object.categories))
    return false;
  if (
    !hasKey(object, 'categoryOrderHints') ||
    !isNonNullRecord(object.categoryOrderHints)
  )
    return false;
  if (!hasKey(object, 'slug') || !isNonNullRecord(object.slug)) return false;
  {
    const slugObject = object.slug;
    const slugKeys = Object.keys(slugObject);
    if (slugKeys.length === 0) return false;
    const firstValue = slugObject[slugKeys[0]];
    if (typeof firstValue !== 'string') return false;
  }

  if (!hasKey(object, 'variants') || !Array.isArray(object.variants))
    return false;
  if (
    !hasKey(object, 'searchKeywords') ||
    !isNonNullRecord(object.searchKeywords)
  )
    return false;
  if (!hasKey(object, 'attributes') || !Array.isArray(object.attributes))
    return false;
  if (
    !hasKey(object, 'hasStagedChanges') ||
    typeof object.hasStagedChanges !== 'boolean'
  )
    return false;
  if (!hasKey(object, 'published') || typeof object.published !== 'boolean')
    return false;
  if (!hasKey(object, 'key') || typeof object.key !== 'string') return false;
  if (!hasKey(object, 'taxCategory')) return false;
  if (!hasKey(object, 'createdAt') || typeof object.createdAt !== 'string')
    return false;
  return !(
    !hasKey(object, 'lastModifiedAt') ||
    typeof object.lastModifiedAt !== 'string'
  );
}

export function isCategory(value: unknown): value is Category {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('id' in value) ||
    !('name' in value) ||
    !('slug' in value)
  ) {
    return false;
  }

  const id = value.id;
  const name = value.name;
  const slug = value.slug;

  return (
    typeof id === 'string' &&
    typeof name === 'object' &&
    name !== null &&
    typeof slug === 'object' &&
    slug !== null
  );
}

export function isCategoriesResponse(
  value: unknown,
): value is CategoriesResponse {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('limit' in value) ||
    !('results' in value)
  ) {
    return false;
  }

  const limit = value.limit;
  const results = value.results;

  return (
    typeof limit === 'number' &&
    Array.isArray(results) &&
    results.every(isCategory)
  );
}
