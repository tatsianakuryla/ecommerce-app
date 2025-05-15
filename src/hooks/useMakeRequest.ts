import { useState } from 'react';

export function useMakeRequest() {
  const [loading, setLoading] = useState(false);

  const makeRequest = async (request: Request) => {
    setLoading(true);

    try {
      const response = await fetch(request);
      const json: unknown = await response.json();

      if (!response.ok) {
        throw json;
      }

      return json;
    } finally {
      setLoading(false);
    }
  };

  return { makeRequest, loading };
}
