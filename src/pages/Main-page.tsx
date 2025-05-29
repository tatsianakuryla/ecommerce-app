import {
  Container,
  Grid,
  GridItem,
  Heading,
  VisuallyHidden,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getProducts } from '~/api/requests';
import { JustRegisteredDialog } from '~/components/JustRegisteredDialog/JustRegisteredDialog';
import { ProductCard } from '~/components/ProductCard/ProductCard';
import { locales } from '~/constants/constants';
import { useAuthContext } from '~/hooks/useAuthContext';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { ProductsResponse } from '~/types/types';
import { formatPrice } from '~/utils/helpers';
import { isProductsResponse } from '~/utils/typeguards';

export const MainPage = () => {
  const { accessToken, justRegistered, setJustRegistered } = useAuthContext();
  const { makeRequest } = useMakeRequest();
  const [productsResponse, setProductsResponse] = useState<ProductsResponse>();

  useEffect(() => {
    if (accessToken == null) return;

    let ignore = false;

    const startFetching = async () => {
      const productsResponse = await makeRequest<ProductsResponse>(
        getProducts(accessToken),
        isProductsResponse,
      );

      if (!ignore && productsResponse) {
        setProductsResponse(productsResponse);
      }
    };

    void startFetching();

    return () => {
      ignore = true;
    };
  }, [accessToken, makeRequest]);

  const handleCloseDialog = () => {
    setJustRegistered(false);
  };

  return (
    <Container py='1rem'>
      <VisuallyHidden>
        <Heading>Main page</Heading>
      </VisuallyHidden>
      <Grid
        templateColumns='repeat(auto-fit, minmax(250px, 1fr))'
        gap='1rem'
        justifyItems='center'
      >
        {productsResponse &&
          productsResponse.results.map((product) => {
            const price = product.masterVariant.prices[0].value.centAmount;
            const discountedPrice =
              product.masterVariant.prices[0].discounted?.value.centAmount;
            const currency = product.masterVariant.prices[0].value.currencyCode;
            const locale = locales.UK;

            return (
              <GridItem key={product.id}>
                <ProductCard
                  discount={
                    discountedPrice
                      ? formatPrice(discountedPrice, currency, locale)
                      : ''
                  }
                  name={product.name[locale]}
                  description={product.description[locale]}
                  img={product.masterVariant.images[0].url}
                  alt={product.name[locale]}
                  price={formatPrice(price, currency, locale)}
                />
              </GridItem>
            );
          })}
        {justRegistered && (
          <JustRegisteredDialog
            title={'Registration'}
            description={"Congrats! You've successfully registered!"}
            handleCloseDialog={handleCloseDialog}
          />
        )}
      </Grid>
    </Container>
  );
};
