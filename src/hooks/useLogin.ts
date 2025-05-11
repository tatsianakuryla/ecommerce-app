import { useState } from 'react'
import { UserAuthResponseBody } from '~/types/types'
import {
  isAuthErrorResponseBody,
  isUserAuthResponseBody,
} from '~/utils/typeguards'
import { createAuthRequest } from '~api/requests'
import { useMakeRequest } from './useMakeRequest'

export function useLogin() {
  const [authResponse, setAuthResponse] = useState<UserAuthResponseBody | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)
  const { makeRequest, loading } = useMakeRequest()

  const login = async (email: string, password: string) => {
    try {
      const response = await makeRequest(createAuthRequest(email, password))

      if (!isUserAuthResponseBody(response)) {
        throw new TypeError('Invalid auth response body from server')
      }

      setAuthResponse(response)
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

  return { login, authResponse, loading, error }
}
