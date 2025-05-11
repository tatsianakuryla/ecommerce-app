import { useState } from 'react'
import {
  isAuthErrorResponseBody,
  isUserAuthResponseBody,
} from '~/utils/typeguards'
import { createAuthRequest } from '~api/requests'
import { useMakeRequest } from './useMakeRequest'

export function useLogin() {
  const [error, setError] = useState<string | null>(null)
  const { makeRequest, loading } = useMakeRequest()

  const login = async (email: string, password: string) => {
    try {
      const response = await makeRequest(createAuthRequest(email, password))

      if (!isUserAuthResponseBody(response)) {
        throw new TypeError('Invalid auth response body from server')
      }

      localStorage.setItem('access_token', response.access_token)
    } catch (error: unknown) {
      if (isAuthErrorResponseBody(error)) {
        setError(error.error_description)
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Unknown error occurred')
      }
    }
  }

  return { login, loading, error }
}
