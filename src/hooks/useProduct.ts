import { useRef, useState, useEffect, useContext } from 'react';
import { AuthContext } from '~/contexts/authContext.tsx';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { getProductById } from '~/api/requests';
import { Locale, LocalizedString, Product } from '~types/types';
import { isProduct } from '~/utils/typeguards';

interface UseProductResult {
  data: Product | null;
  loading: boolean;
  error: string | null;
}

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

const DEFAULT_LOCALE: Locale = 'en-US';

export function getLocalizedString(localized: LocalizedString): string {
  if (localized[DEFAULT_LOCALE]) {
    return localized[DEFAULT_LOCALE];
  }

  const locales: Locale[] = ['en-US', 'de-DE', 'en-GB'];
  const firstKey = locales.find((key) => localized[key]) || locales[0];
  return localized[firstKey] || '';
}
