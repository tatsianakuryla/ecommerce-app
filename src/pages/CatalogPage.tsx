import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Link as ChakraLink,
  VisuallyHidden,
  Input,
  Flex,
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts } from '~/api/requests';
import { JustRegisteredDialog } from '~/components/JustRegisteredDialog/JustRegisteredDialog';
import { ProductCard } from '~/components/ProductCard/ProductCard';
import { locales, PRODUCTS_PER_PAGE } from '~/constants/constants';
import { useAuthContext } from '~/hooks/useAuthContext';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { ProductsResponse } from '~/types/types';
import { formatPrice } from '~/utils/helpers';
import { isProductsResponse } from '~/utils/typeguards';
import { CategorySidebar } from '~/components/CategorySidebar/CategorySidebar';
import { Pagination } from '~components/Pagination/Pagination';
import { useSearchParams } from 'react-router-dom';
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle.tsx';

export const CatalogPage = () => {
  const { accessToken, justRegistered, setJustRegistered } = useAuthContext();
  const { makeRequest, loading } = useMakeRequest();
  const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
  const [searchParameters, setSearchParameters] = useSearchParams();

  useEffect(() => {
    if (!searchParameters.has('page')) {
      setSearchParameters({ page: '1' }, { replace: true });
    }
  }, [searchParameters, setSearchParameters]);

  const pageParameters = Number(searchParameters.get('page'));
  const page = pageParameters >= 1 ? pageParameters : 1;

  const handlePageChange = (newPage: number) => {
    setSearchParameters({ page: String(newPage) }, { replace: true });
  };
  const [totalProducts, setTotalProducts] = useState(0);
  const [priceRange] = useState<[number, number]>([0, 1000]);

  const [sortOption, setSortOption] = useState<string>(
    'variants.scopedPrice.value.centAmount asc',
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCloseDialog = () => {
    setJustRegistered(false);
  };

  useEffect(() => {
    if (!accessToken) return;
    let ignore = false;

    const startFetching = async () => {
      const offset = (page - 1) * PRODUCTS_PER_PAGE;

      const predicates: string[] = [];

      {
        const [minPrice, maxPrice] = priceRange;
        predicates.push(
          `variants.scopedPrice.value.centAmount >= ${minPrice * 100} and variants.scopedPrice.value.centAmount <= ${maxPrice * 100}`,
        );
      }

      const sortArray = [sortOption];

      const searchText =
        searchQuery.trim().length > 0 ? searchQuery.trim() : undefined;

      const response = await makeRequest<ProductsResponse>(
        getProducts(
          accessToken,
          PRODUCTS_PER_PAGE,
          offset,
          predicates,
          sortArray,
          searchText,
          'UK',
          'EUR',
          'DE',
        ),
        isProductsResponse,
      );

      if (!ignore && response) {
        setProductsResponse(response);
        setTotalProducts(response.total);
      }
    };

    void startFetching();
    return () => {
      ignore = true;
    };
  }, [accessToken, makeRequest, page, priceRange, sortOption, searchQuery]);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <Container maxW='container.xl' py='1rem'>
      <VisuallyHidden>
        <Heading>Catalog page</Heading>
      </VisuallyHidden>

      {loading && !productsResponse ? (
        <Flex align='center' justify='center' py='20'>
          <ProgressCircleElement />
        </Flex>
      ) : (
        <Box display='flex' alignItems='flex-start'>
          {accessToken && (
            <Box flex='0 0 300px' mr='1rem'>
              <Box mb='1rem'>
                <CategorySidebar token={accessToken} locale={locales.UK} />
              </Box>
            </Box>
          )}

          <Box flex='1'>
            <HStack mb='1rem' gap={4} alignItems='center'>
              <Input
                placeholder='Search products…'
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
                width='250px'
              />
              <Select
                value={sortOption}
                onChange={(event) => {
                  setSortOption(event.target.value);
                }}
                maxW='200px'
              >
                <option value='variants.scopedPrice.value.centAmount asc'>
                  Price: Low → High
                </option>
                <option value='variants.scopedPrice.value.centAmount desc'>
                  Price: High → Low
                </option>
                <option value='name.en-GB asc'>Name: A → Z</option>
                <option value='name.en-GB desc'>Name: Z → A</option>
              </Select>
            </HStack>

            <Grid
              templateColumns='repeat(auto-fit, minmax(250px, 1fr))'
              gap='1rem'
              justifyItems='center'
            >
              {productsResponse?.results.map((product) => {
                const price = product.masterVariant.prices[0].value.centAmount;
                const discounted =
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
                      <GridItem
                        display='flex'
                        height='100%'
                        flexDirection='column'
                      >
                        <ProductCard
                          id={product.id}
                          discount={
                            discounted
                              ? formatPrice(discounted, currency, locale)
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

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </Box>
        </Box>
      )}

      {justRegistered && (
        <JustRegisteredDialog
          title='Registration'
          description="Congrats! You've successfully registered"
          handleCloseDialog={handleCloseDialog}
        />
      )}
    </Container>
  );
};
