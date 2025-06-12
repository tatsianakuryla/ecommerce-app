import {
  Box,
  Container,
  Grid,
  Text,
  VStack,
  Input,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { getCategories, getProducts } from '~/api/requests';
import { isCategoriesResponse, isProductsResponse } from '~/utils/typeguards';
import { ProductsResponse, Category } from '~/types/types';
import { CategorySidebar } from '~/components/CategorySidebar/CategorySidebar';
import { Breadcrumbs } from '~/components/Breadcrumbs/Breadcrumbs';
import { ProductCard } from '~/components/ProductCard/ProductCard';
import { locales, PRODUCTS_PER_PAGE } from '~/constants/constants';
import { formatPrice } from '~/utils/helpers';
import { useAuthContext } from '~/hooks/useAuthContext';
import { Pagination } from '~components/Pagination/Pagination';
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle.tsx';

export const CategoryPage = () => {
  const { categoryId } = useParams<'categoryId'>();
  const { accessToken } = useAuthContext();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [searchParameters, setSearchParameters] = useSearchParams();
  const pageParameter = Number(searchParameters.get('page')) || 1;
  const page = pageParameter >= 1 ? pageParameter : 1;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name.en-GB asc');
  const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    if (!searchParameters.has('page')) {
      setSearchParameters({ page: '1' }, { replace: true });
    }
  }, [searchParameters, setSearchParameters]);

  const {
    makeRequest: makeCatRequest,
    loading: loadingCat,
    error: errorCat,
  } = useMakeRequest();
  useEffect(() => {
    if (!accessToken) return;
    void (async () => {
      try {
        const resp = await makeCatRequest(
          getCategories(accessToken),
          isCategoriesResponse,
        );
        if (resp) {
          setAllCategories(resp.results);
          setCurrentCategory(
            resp.results.find((c) => c.id === categoryId) || null,
          );
        }
      } catch {}
    })();
  }, [accessToken, categoryId, makeCatRequest]);

  const {
    makeRequest: makeProductionRequest,
    loading: loadingProduction,
    error: errorProduction,
  } = useMakeRequest();
  useEffect(() => {
    if (!accessToken || !currentCategory) return;
    let ignore = false;

    const fetch = async () => {
      const offset = (page - 1) * PRODUCTS_PER_PAGE;
      const predicates = [`categories.id:"${currentCategory.id}"`];
      const searchText = searchQuery.trim() || undefined;
      const sortArray = [sortOption];

      const resp = await makeProductionRequest<ProductsResponse>(
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
      if (!ignore && resp) {
        setProductsResponse(resp);
        setTotalProducts(resp.total);
      }
    };

    void fetch();
    return () => {
      ignore = true;
    };
  }, [
    accessToken,
    currentCategory,
    page,
    searchQuery,
    sortOption,
    makeProductionRequest,
  ]);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  if (loadingCat) {
    return (
      <Container py='2rem'>
        <Flex align='center' justify='center' py='10'>
          <ProgressCircleElement />
        </Flex>
        <Text>Loading categories...</Text>
      </Container>
    );
  }
  if (errorCat || !currentCategory) {
    return (
      <Container py='2rem'>
        <Text color='red.500'>Category not found or failed to load.</Text>
      </Container>
    );
  }

  return (
    <Container maxW='container.xl' py='1rem'>
      <VStack align='stretch' gap={4}>
        <Breadcrumbs
          currentCategory={currentCategory}
          allCategories={allCategories}
          locale={locales.UK}
        />

        <Box display='flex' alignItems='flex-start'>
          {accessToken && (
            <Box flex='0 0 300px' mr='1rem'>
              <CategorySidebar token={accessToken} locale={locales.UK} />
            </Box>
          )}

          <Box flex='1' ml='1rem'>
            <HStack mb='1rem' gap={4}>
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

            {loadingProduction && !productsResponse ? (
              <Flex align='center' justify='center' py='20'>
                <ProgressCircleElement />
              </Flex>
            ) : errorProduction ? (
              <Text color='red.500'>
                Error loading products: {errorProduction}
              </Text>
            ) : !productsResponse || productsResponse.results.length === 0 ? (
              <Text>No products in this category.</Text>
            ) : (
              <>
                <Grid
                  templateColumns='repeat(auto-fit, minmax(250px, 1fr))'
                  gap='1rem'
                  justifyItems='center'
                >
                  {productsResponse.results.map((product) => {
                    const price =
                      product.masterVariant.prices[0].value.centAmount;
                    const discounted =
                      product.masterVariant.prices[0].discounted?.value
                        .centAmount;
                    const currency =
                      product.masterVariant.prices[0].value.currencyCode;
                    const locale = locales.UK;

                    return (
                      <Link to={`/catalog/${product.id}`} key={product.id}>
                        <Box
                          p='1rem'
                          mb='0.5rem'
                          borderWidth='1px'
                          borderRadius='md'
                          _hover={{ bg: 'gray.50' }}
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
                        </Box>
                      </Link>
                    );
                  })}
                </Grid>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onChange={(newPage) => {
                    setSearchParameters(
                      { page: String(newPage) },
                      { replace: true },
                    );
                  }}
                />
              </>
            )}
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};
