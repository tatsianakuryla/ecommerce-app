import { locales, promoCodes } from '~constants/constants';

export enum PermissionLevel {
  USER = 'user',
  GUEST = 'guest',
}

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
  addresses: Address[];
  defaultShippingAddress?: -1 | 0;
  defaultBillingAddress?: -1 | 1;
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
  updateProfile: (
    customerId: string,
    version: number,
    actions: CustomerUpdateAction[],
  ) => Promise<Customer | undefined>;
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
  updatePassword: (
    customerId: string,
    version: number,
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  refreshToken: string | null;
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
  | 'billingStreet'
  | 'billingCity'
  | 'billingPostalCode'
  | 'billingCountry'
  | 'shippingStreet'
  | 'shippingCity'
  | 'shippingPostalCode'
  | 'shippingCountry';

export interface FormProperties {
  id: string;
  fields: FormField[];
  onSubmit: (event: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
  nonFieldError?: string | null;
  children?: React.ReactNode;
}

export interface Reference {
  typeId: string;
  id: string;
}

export interface ILocales {
  DE: 'de-DE';
  EN: 'en-US';
  UK: 'en-GB';
}

type LocaleKey = keyof typeof locales;
export type Locale = ILocales[keyof ILocales];
export type LocalizedString = Record<Locale, string>;

export interface Price {
  id: string;
  value: {
    type: 'centPrecision';
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  key: string;
  country: LocaleKey;
  channel?: Reference;
  discounted?: {
    value: Price['value'];
    discount: {
      typeId: 'product-discount';
      id: string;
    };
  };
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
  value: Locale;
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
  productType: unknown;
  name: LocalizedString;
  description: LocalizedString;
  categories: unknown[];
  categoryOrderHints: Record<string, string>;
  slug: LocalizedString;
  masterVariant: MasterVariant;
  variants: unknown[];
  searchKeywords: Record<string, unknown>;
  attributes: unknown[];
  hasStagedChanges: boolean;
  published: boolean;
  key: string;
  taxCategory: unknown;
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
  | { action: 'changeEmail'; email: string }
  | { action: 'changeAddress'; addressId: string; address: AddressDraft }
  | { action: 'addAddress'; address: AddressDraft }
  | { action: 'removeAddress'; addressId: string }
  | { action: 'setDefaultShippingAddress'; addressId: string }
  | { action: 'setDefaultBillingAddress'; addressId: string };

type AddressType = 'shipping' | 'billing';

export interface AddressFormProperties {
  addressType: AddressType;
  data: Address;
  setData: (address: Address) => void;
  fieldError: Partial<Record<FieldKey, string>>;
  setFieldError: React.Dispatch<
    React.SetStateAction<Partial<Record<FieldKey, string>>>
  >;
  handleDefaultShippingAddress?: () => void;
  handleDefaultBillingAddress?: () => void;
}

export interface AddressError {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PersonalInfoProperties {
  isEditing: boolean;
  editData: {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  errors: {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  profileData: {
    email: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  };
  onEmailChange: (newValue: string) => void;
  onFirstNameChange: (newValue: string) => void;
  onLastNameChange: (newValue: string) => void;
  onDateOfBirthChange: (newValue: string) => void;
  onToggleEdit: () => void;
  onSave: () => void;
  hasErrors: boolean;
}

export interface AddressesProperties {
  addresses: Address[];
  addressEdits: Address[];
  addressErrors: AddressError[];
  defaultShipIndex?: number;
  defaultBillIndex?: number;
  isEditing: boolean;
  onAddressFieldChange: (
    index: number,
    field: keyof AddressError,
    value: string,
  ) => void;
  onSetDefaultShip: (index: number) => void;
  onSetDefaultBill: (index: number) => void;
  onDeleteAddress: (indexToDelete: number) => void;
}

export interface Category {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  name: LocalizedString;
  slug: LocalizedString;
  ancestors: Array<{
    typeId: 'category';
    id: string;
  }>;
  parent?: {
    typeId: 'category';
    id: string;
  };
  orderHint?: string;
}

export interface CategoriesResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Category[];
}

export type State = { items: CartItem[] };

export type CartItem = {
  id: string;
  quantity: number;
};

export interface AddToCartButtonProperties {
  productId: string;
  quantity?: number;
}

export interface ProductCardProperties {
  id: string;
  name: string;
  description: string;
  img: string;
  alt: string;
  price: string;
  discount?: string;
}

export interface PaginationProperties {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export interface AddToCartButtonProperties {
  productId: string;
  quantity?: number;
}

export interface ProductCardProperties {
  id: string;
  name: string;
  description: string;
  img: string;
  alt: string;
  price: string;
  discount?: string;
}

export interface PaginationProperties {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export interface LineItem {
  id: string;
  productId: string;
  variantId: number;
  name: LocalizedString;
  quantity: number;
  price: Price;
  totalPrice: Price['value'];
  variant?: {
    images?: Image[];
  };
}

export interface Cart {
  id: string;
  version: number;
  customerId?: string;
  anonymousId?: string;
  currency: string;
  country?: string;
  lineItems: LineItem[];
  totalPrice: Price['value'];
}

export interface MyCartDraft {
  currency: string;
  country?: string;
}

export interface CartUpdateAction {
  [key: string]: unknown;
  action: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  isActive: boolean;
}

export interface DiscountCodeResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: DiscountCode[];
}

export type PromoCode = (typeof promoCodes)[number];

export interface TeamMember {
  img: string;
  name: string;
  role: string;
  desc: string;
  bio: string;
  github: string;
}

interface CategoryNode extends Category {
  children: CategoryNode[];
}

export interface Properties {
  node: CategoryNode;
  locale: ILocales[keyof ILocales];
}

export interface ImageSliderProperties {
  images: Array<{ url: string; alt?: string }>;
  boxHeight?: string | number;
  boxWidth?: string | number;
  maxHeight?: string | number;
}

export interface ChangePasswordDialogProperties {
  isOpen: boolean;
  onClose: () => void;
}

export interface UseProductResult {
  data: Product | null;
  loading: boolean;
  error: string | null;
}

export interface CartContextShape {
  cart: Cart | null;
  loading: boolean;
  addToCart: (
    productId: string,
    variantId: number,
    qty?: number,
  ) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateLineItemQuantity: (lineItemId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyDiscountCode: (code: string) => void;
  appliedCode: PromoCode | null;
}

export interface NavItemProperties {
  label: string;
  to: string;
  onClick?: () => void;
}
