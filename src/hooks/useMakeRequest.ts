import { useCallback, useState } from 'react';
import { isErrorResponse } from '~/utils/typeguards';

export function useMakeRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(
    async <T>(
      request: Request,
      validateResponse: (body: unknown) => body is T,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(request);
        const json: unknown = await response.json();

        if (!response.ok) {
          throw json;
        }

        if (validateResponse(json)) {
          return json;
        }
      } catch (error: unknown) {
        if (isErrorResponse(error)) {
          setError(error.message);
        } else if (error instanceof Error) {
          setError('Ooops, something went wrong');
          throw error;
        } else {
          throw error;
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { makeRequest, loading, error, setError };
}
