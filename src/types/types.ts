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

export interface AuthResponse {
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

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errors: Error[];
}

export interface AuthContextValue {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegistrationData) => Promise<CustomerResponse | undefined>;
  logout: () => void;
  setJustRegistered: (v: boolean) => void;
  setError: (v: string | null) => void;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  justRegistered: boolean;
}

export interface MenuItem {
  label: string;
  to: string;
  onClick?: () => void;
}

export interface FormField {
  name: string;
  type?: string;
  options?: Array<{ label: string; value: string }>;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  error?: string;
}

export type FieldKey =
  | keyof RegistrationData
  | 'confirmPassword'
  | 'street'
  | 'city'
  | 'postalCode'
  | 'country';

export interface FormProps {
  id: string;
  fields: FormField[];
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
  nonFieldError?: string | null;
}

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

export interface ProductsResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
}

export interface CustomerResponse {
  customer: {
    id: string;
    version: number;
    versionModifiedAt: string;
    lastMessageSequenceNumber: number;
    createdAt: string;
    lastModifiedAt: string;
    lastModifiedBy: {
      clientId: string;
      isPlatformClient: boolean;
      anonymousId: string;
    };
    createdBy: {
      clientId: string;
      isPlatformClient: boolean;
      anonymousId: string;
    };
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    addresses: [];
    shippingAddressIds: string[];
    billingAddressIds: string[];
    isEmailVerified: boolean;
    customerGroupAssignments: [];
    stores: [];
    authenticationMode: string;
  };
}
