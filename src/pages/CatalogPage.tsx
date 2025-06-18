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
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle';
import PromoBanner from '~components/PromoBanner/PromoBanner';

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
    <Container maxW='container.xl' py='1rem' px={{ base: '10px', md: '1rem' }}>
      <VisuallyHidden>
        <Heading>Catalog page</Heading>
      </VisuallyHidden>

      {loading && !productsResponse ? (
        <Flex align='center' justify='center' py='20'>
          <ProgressCircleElement />
        </Flex>
      ) : (
        <Box
          display='flex'
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems='flex-start'
          gap={{ base: 4, md: 0 }}
        >
          {accessToken && (
            <Box
              flex={{ base: '0 0 230px', md: '0 0 300px' }}
              mr={{ base: 0, md: '1rem' }}
              width={{ base: '100%', md: 'auto' }}
            >
              <Box mb='1rem'>
                <CategorySidebar token={accessToken} locale={locales.UK} />
              </Box>
            </Box>
          )}

          <Box flex='1' width='100%'>
            <PromoBanner />
            <HStack
              mb='1rem'
              gap={4}
              flexDirection={{ base: 'column', lg: 'row' }}
              alignItems={{ base: 'stretch', sm: 'center' }}
            >
              <Input
                placeholder='Search products…'
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
                width={{ base: '100%', md: '250px' }}
              />
              <Select
                value={sortOption}
                onChange={(event) => {
                  setSortOption(event.target.value);
                }}
                width={{ base: '100%', md: '200px' }}
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
              templateColumns={{
                base: 'repeat(200px, 1fr)',
                sm: 'repeat(300px, 1fr)',
                md: 'repeat(auto-fill,300px)',
              }}
              gap={{ base: 3, md: 6 }}
              justifyContent='center'
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
                    p={{ base: '0.5rem', md: '1rem' }}
                    mb={{ base: '0.25rem', md: '0.5rem' }}
                    borderWidth='1px'
                    borderRadius='md'
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Link to={`/catalog/${product.id}`}>
                      <GridItem
                        display='flex'
                        height='100%'
                        flexDirection='column'
                        w='100%'
                        maxW='100%'
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
