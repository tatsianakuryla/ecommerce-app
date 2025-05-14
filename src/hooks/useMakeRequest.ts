import { useState } from 'react'

export function useMakeRequest() {
  const [loading, setLoading] = useState(false)

  const makeRequest = async (request: Request) => {
    setLoading(true)

    try {
      const res = await fetch(request)
      const json: unknown = await res.json()

      if (!res.ok) {
        throw json
      }

      return json
    } finally {
      setLoading(false)
    }
  }

  return { makeRequest, loading }
}
