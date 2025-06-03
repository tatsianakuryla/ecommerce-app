import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Button,
  HStack,
  Link as ChakraLink,
  VisuallyHidden,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
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
import { CategorySidebar } from '~components/CategorySidebar/CategorySidebar.tsx';

export const CatalogPage = () => {
  const { accessToken, justRegistered, setJustRegistered } = useAuthContext();
  const { makeRequest } = useMakeRequest();
  const [productsResponse, setProductsResponse] = useState<ProductsResponse>();

  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const PRODUCTS_PER_PAGE = 20;

  useEffect(() => {
    if (!accessToken) return;

    let ignore = false;
    const startFetching = async () => {
      const offset = (page - 1) * PRODUCTS_PER_PAGE;
      const resp = await makeRequest<ProductsResponse>(
        getProducts(accessToken, PRODUCTS_PER_PAGE, offset),
        isProductsResponse,
      );
      if (!ignore && resp) {
        setProductsResponse(resp);
        setTotalProducts(resp.total);
      }
    };
    void startFetching();
    return () => {
      ignore = true;
    };
  }, [accessToken, makeRequest, page]);

  const handleCloseDialog = () => {
    setJustRegistered(false);
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <Container maxW='container.xl' py='1rem'>
      <VisuallyHidden>
        <Heading>Catalog page</Heading>
      </VisuallyHidden>

      <Box display='flex' alignItems='flex-start'>
        {accessToken && (
          <Box flex='0 0 250px' mr='1rem'>
            <CategorySidebar token={accessToken} locale={locales.UK} />
          </Box>
        )}

        <Box flex='1'>
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
                const currency =
                  product.masterVariant.prices[0].value.currencyCode;
                const locale = locales.UK;

                return (
                  <ChakraLink
                    key={product.id}
                    asChild
                    p='1rem'
                    mb='0.5rem'
                    borderWidth='1px'
                    borderRadius='md'
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Link to={`/catalog/${product.id}`}>
                      <GridItem>
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
                    </Link>
                  </ChakraLink>
                );
              })}
          </Grid>

          <HStack justify='center' gap={4} mt='1rem'>
            <Button
              onClick={() => {
                setPage((page) => Math.max(1, page - 1));
              }}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Box as='p'>
              Page {page} of {totalPages}
            </Box>
            <Button
              onClick={() => {
                setPage((page) => Math.min(totalPages, page + 1));
              }}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </HStack>
        </Box>
      </Box>

      {justRegistered && (
        <JustRegisteredDialog
          title={'Registration'}
          description={"Congrats! You've successfully registered"}
          handleCloseDialog={handleCloseDialog}
        />
      )}
    </Container>
  );
};
