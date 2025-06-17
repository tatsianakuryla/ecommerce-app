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
import { useEffect, useState, ChangeEvent } from 'react';
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
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle';

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

    const fetchCategories = async () => {
      try {
        const response = await makeCatRequest(
          getCategories(accessToken),
          isCategoriesResponse,
        );
        if (response) {
          setAllCategories(response.results);
          setCurrentCategory(
            response.results.find((category) => category.id === categoryId) ||
              null,
          );
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    void fetchCategories();
  }, [accessToken, categoryId, makeCatRequest]);

  const {
    makeRequest: makeProductionRequest,
    loading: loadingProduction,
    error: errorProduction,
  } = useMakeRequest();

  useEffect(() => {
    if (!accessToken || !currentCategory) return;
    let shouldIgnore = false;

    const fetchProducts = async () => {
      try {
        const offset = (page - 1) * PRODUCTS_PER_PAGE;
        const predicates = [`categories.id:"${currentCategory.id}"`];
        const searchText = searchQuery.trim() || undefined;
        const sortArray = [sortOption];

        const response = await makeProductionRequest<ProductsResponse>(
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
        if (!shouldIgnore && response) {
          setProductsResponse(response);
          setTotalProducts(response.total);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    void fetchProducts();
    return () => {
      shouldIgnore = true;
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

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

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
    <Container maxW='container.xl' py='1rem' px={{ base: 4, md: 0 }}>
      <VStack align='stretch' gap={4}>
        <Breadcrumbs
          currentCategory={currentCategory}
          allCategories={allCategories}
          locale={locales.UK}
        />

        <Box
          display='flex'
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems='flex-start'
        >
          {accessToken && (
            <Box
              flex='0 0 300px'
              width={{ base: '100%', md: 'auto' }}
              mr={{ base: 0, md: '1rem' }}
              mb={{ base: 4, md: 0 }}
            >
              <CategorySidebar token={accessToken} locale={locales.UK} />
            </Box>
          )}

          <Box flex='1' ml={{ base: 0, md: '1rem' }} width='100%'>
            <HStack
              mb='1rem'
              gap={4}
              flexDirection={{ base: 'column', sm: 'row' }}
              alignItems={{ base: 'stretch', sm: 'center' }}
            >
              <Input
                placeholder='Search products…'
                value={searchQuery}
                onChange={handleSearchChange}
                width={{ base: '100%', sm: '250px' }}
              />
              <Select
                value={sortOption}
                onChange={handleSortChange}
                maxW={{ base: '100%', sm: '200px' }}
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
            ) : !productsResponse?.results.length ? (
              <Text>No products in this category.</Text>
            ) : (
              <>
                <Grid
                  templateColumns={{
                    base: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(auto-fit, minmax(250px, 1fr))',
                  }}
                  gap='1rem'
                  justifyItems={{ base: 'center', sm: 'stretch' }}
                >
                  {productsResponse.results.map((product) => {
                    const price =
                      product.masterVariant.prices[0].value.centAmount;
                    const discountedPrice =
                      product.masterVariant.prices[0].discounted?.value
                        .centAmount;
                    const currency =
                      product.masterVariant.prices[0].value.currencyCode;
                    const locale = locales.UK;
                    const description = product.description[locale] || '';
                    const imageUrl = product.masterVariant.images[0]?.url || '';

                    return (
                      <Link to={`/catalog/${product.id}`} key={product.id}>
                        <Box
                          p={{ base: '0.75rem', md: '1rem' }}
                          mb={{ base: '0.25rem', md: '0.5rem' }}
                          borderWidth='1px'
                          borderRadius='md'
                          _hover={{ bg: 'gray.50' }}
                        >
                          <ProductCard
                            id={product.id}
                            discount={
                              discountedPrice
                                ? formatPrice(discountedPrice, currency, locale)
                                : undefined
                            }
                            name={product.name[locale]}
                            description={description}
                            img={imageUrl}
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
