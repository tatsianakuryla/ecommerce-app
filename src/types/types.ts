import { permissions } from '~constants/constants';

export enum PermissionLevel {
  FULL = 'all',
  API = 'api',
  USER = 'user',
  GUEST = 'guest',
}

export type Permissions = typeof permissions;

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: Address;
}

export interface User extends RegistrationData {
  id: string;
  isActive: boolean;
  permissionLevel: PermissionLevel;
  scopes: Permissions[PermissionLevel];
}

export interface UserAuthResponseBody {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

interface Error {
  code: string;
  message: string;
}

type ErrorsArray = Error[];

export interface AuthErrorResponseBody {
  statusCode: number;
  error: string;
  error_description: string;
  message: string;
  errors: ErrorsArray;
}

export interface AuthContextValue {
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  error: string | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface MenuItem {
  label: string;
  to: string;
  onClick?: () => void;
}

export type FormField = {
  name: string;
  type?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  error?: string;
};

export type FieldKey =
  | keyof RegistrationData
  | 'confirmPassword'
  | 'street'
  | 'city'
  | 'postalCode'
  | 'country';

export type FormProps = {
  fields: FormField[];
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
};

export interface LocalizedString {
  [locale: string]: string;
}

export interface Reference {
  typeId: string;
  id: string;
}

export interface Price {
  id: string;
  value: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  key: string;
  country: string;
  channel?: Reference;
}

export interface Image {
  url: string;
  dimensions: {
    w: number;
    h: number;
  };
}

export interface Attribute {
  name: string;
  value: LocalizedString | string;
}

export interface AvailabilityChannel {
  isOnStock: boolean;
  availableQuantity: number;
  version: number;
  id: string;
}

export interface Availability {
  isOnStock: boolean;
  availableQuantity: number;
  version: number;
  id: string;
  channels: {
    [channelId: string]: AvailabilityChannel;
  };
}

export interface MasterVariant {
  id: number;
  sku: string;
  key: string;
  prices: Price[];
  images: Image[];
  attributes: Attribute[];
  assets: unknown[];
  availability: Availability;
}

export interface Product {
  id: string;
  version: number;
  productType: Reference;
  name: LocalizedString;
  description: LocalizedString;
  categories: Reference[];
  categoryOrderHints: Record<string, string>;
  slug: LocalizedString;
  masterVariant: MasterVariant;
  variants: unknown[];
  searchKeywords: Record<string, unknown>;
  attributes: Attribute[];
  hasStagedChanges: boolean;
  published: boolean;
  key: string;
  taxCategory: Reference;
  createdAt: string;
  lastModifiedAt: string;
}

export interface ProductsResponseBody {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
}
