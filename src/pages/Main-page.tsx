import { Container, Flex, Heading, VisuallyHidden } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getProducts } from '~/api/requests';
import { useAuthContext } from '~/hooks/useAuthContext';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { Product } from '~/types/types';
import { isProductsResponceBody } from '~/utils/typeguards';

export const MainPage = () => {
  const { accessToken } = useAuthContext();
  const { makeRequest } = useMakeRequest();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (accessToken == null) return;

    let ignore = false;

    const startFetching = async () => {
      try {
        const products = await makeRequest(
          getProducts(accessToken),
          isProductsResponceBody,
        );
        if (!ignore && products) {
          setProducts(products.results);
        }
      } catch (error) {
        console.error('Error while fetching products:', error);
      }
    };

    void startFetching();
    return () => {
      ignore = true;
    };
  }, [accessToken, makeRequest]);
  console.log('Products', products);

  return (
    <Container py='1rem'>
      <Flex justifyContent='center' alignItems='center'>
        <VisuallyHidden>
          <Heading>Main page</Heading>
        </VisuallyHidden>
      </Flex>
      {/*для тестов и для скрин-ридеров прошу в случае необходимости не удалять элемент, а обернуть элемент в <VisuallyHidden>*/}
    </Container>
  );
};
