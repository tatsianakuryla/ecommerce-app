import { useRef, useState, useEffect, useContext } from 'react';
import { AuthContext } from '~/contexts/authContext';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { getProductById } from '~/api/requests';
import { Product, UseProductResult } from '~types/types';
import { isProduct } from '~/utils/typeguards';

export function useProduct(productId: string | undefined): UseProductResult {
  const auth = useContext(AuthContext);
  const token = auth?.accessToken || null;

  const {
    makeRequest,
    loading: requestLoading,
    error: requestError,
  } = useMakeRequest();

  const [data, setData] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loading = requestLoading;

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    if (!productId || !token) {
      return;
    }

    setError(null);
    setData(null);

    void (async () => {
      try {
        const response = await makeRequest(
          getProductById(productId, token),
          isProduct,
        );
        if (isMounted.current) {
          setData(response ?? null);
        }
      } catch (error_: unknown) {
        if (isMounted.current) {
          setError(error_ instanceof Error ? error_.message : String(error_));
        }
      }
    })();

    return () => {
      isMounted.current = false;
    };
  }, [productId, token, makeRequest]);

  useEffect(() => {
    if (requestError) {
      setError(requestError);
    }
  }, [requestError]);

  return { data, loading, error };
}
