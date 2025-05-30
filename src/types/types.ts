import { permissions } from '~constants/constants';

export enum PermissionLevel {
  FULL = 'all',
  API = 'api',
  USER = 'user',
  GUEST = 'guest',
}

export type Permissions = typeof permissions;

export interface Address {
  id: string;
  streetName: string;
  postalCode: string;
  city: string;
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

export interface CustomFields {
  type: Reference;
  fields: Record<string, unknown>;
}

export interface Customer {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdBy: {
    clientId?: string;
    isPlatformClient: boolean;
    anonymousId?: string;
  };
  lastModifiedBy: {
    clientId?: string;
    isPlatformClient: boolean;
    anonymousId?: string;
  };

  customerNumber: string;
  email: string;
  password?: never;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  title?: string;
  dateOfBirth?: string;
  companyName?: string;
  vatId?: string;
  addresses: Address[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  shippingAddressIds: string[];
  billingAddressIds: string[];
  isEmailVerified: boolean;
  customerGroup?: Reference;
  customerGroupAssignments: Array<{
    customerGroup: Reference;
  }>;
  stores: Reference[];
  authenticationMode?: string;
  locale?: string;
  custom?: CustomFields;
}

export interface CustomerResponse {
  customer: Customer;
}

export interface CustomerPagedQueryResponse {
  limit: number;
  offset: number;
  count: number;
  total?: number;
  results: Customer[];
}

export interface CustomerDraft {
  email: string;
  password: string;

  firstName?: string;
  lastName?: string;
  middleName?: string;
  title?: string;
  dateOfBirth?: string;
  companyName?: string;
  vatId?: string;

  addresses?: AddressDraft[];

  defaultShippingAddress?: number;
  defaultBillingAddress?: number;

  shippingAddressIds?: number[];
  billingAddressIds?: number[];
}

export interface AddressDraft {
  id?: string;
  key?: string;
  title?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;

  streetName: string;
  additionalStreetInfo?: string;
  postalCode?: string;
  city: string;
  region?: string;
  state?: string;
  country: string;

  company?: string;
  department?: string;
  building?: string;
  apartment?: string;
  pOBox?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  fax?: string;
  externalId?: string;
}

export type CustomerUpdateAction =
  | { action: 'setFirstName'; firstName: string }
  | { action: 'setLastName'; lastName: string }
  | { action: 'setDateOfBirth'; dateOfBirth: string }
  | { action: 'changeAddress'; addressId: string; address: Address }
  | { action: 'setDefaultShippingAddress'; addressId: string }
  | { action: 'setDefaultBillingAddress'; addressId: string };
