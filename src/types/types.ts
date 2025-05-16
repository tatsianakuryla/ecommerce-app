import { permissions } from '~constants/constants';

export enum PermissionLevel {
  FULL = 'all',
  API = 'api',
  USER = 'user',
}

export type Permissions = typeof permissions;

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
  isAuthenticated: boolean;
  logout: () => void;
  checking: boolean;
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

export type FormProps = {
  fields: FormField[];
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
};
