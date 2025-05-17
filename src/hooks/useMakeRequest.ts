import { useCallback, useState } from 'react';
import { isAuthErrorResponseBody } from '~/utils/typeguards';

export function useMakeRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(
    async <T>(
      request: Request,
      validateResponseBody: (body: unknown) => body is T,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(request);
        const json: unknown = await response.json();

        if (!response.ok) {
          throw json;
        }

        if (!validateResponseBody(json)) {
          throw new TypeError('Invalid response body');
        }

        return json;
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else if (isAuthErrorResponseBody(error)) {
          setError(error.message);
        } else if (error instanceof TypeError) {
          setError(error.message);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { makeRequest, loading, error };
}
