import { permissions } from '~constants/constants'

export enum PermissionLevel {
  FULL = 'all',
  API = 'api',
  USER = 'user',
}

export type Permissions = typeof permissions

export interface UserAuthResponseBody {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
  refresh_token: string
}

interface Error {
  code: string
  message: string
}

type ErrorsArray = Error[]

export interface AuthErrorResponseBody {
  statusCode: number
  error: string
  error_description: string
  message: string
  errors: ErrorsArray
}

export interface EmailInputProps {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error: string
  isTouched: boolean
  hasError: boolean
}

export interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error: string
  isTouched: boolean | undefined
  hasError: boolean
}
