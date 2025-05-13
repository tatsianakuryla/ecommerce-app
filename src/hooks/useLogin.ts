import { useState } from 'react'
import {
  isAuthErrorResponseBody,
  isUserAuthResponseBody,
} from '~/utils/typeguards'
import { createUserAuthRequest } from '~api/requests'
import { useMakeRequest } from './useMakeRequest'

export function useLogin() {
  const [error, setError] = useState<string | null>(null)
  const [authResponseBody, setAuthResponseBody] = useState<unknown>(null)
  const { makeRequest, loading } = useMakeRequest()

  const login = async (email: string, password: string) => {
    try {
      const responseBody = await makeRequest(
        createUserAuthRequest(email, password),
      )
      if (isUserAuthResponseBody(responseBody)) {
        setAuthResponseBody(responseBody)
        localStorage.setItem('accessToken', responseBody.access_token)
      }
    } catch (error: unknown) {
      if (isAuthErrorResponseBody(error)) {
        setError(error.message)
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Unknown error occurred')
      }
    }
  }

  return { login, loading, error, authResponseBody }
}
