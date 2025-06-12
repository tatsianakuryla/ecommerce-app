import { Box, Container, Grid, Spinner, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { getCategories, getProductsByCategory } from '~/api/requests';
import { isCategoriesResponse, isProductsResponse } from '~/utils/typeguards';
import { Category, Product } from '~/types/types';
import { CategorySidebar } from '~/components/CategorySidebar/CategorySidebar';
import { Breadcrumbs } from '~/components/Breadcrumbs/Breadcrumbs';
import { ProductCard } from '~/components/ProductCard/ProductCard';
import { locales } from '~/constants/constants';
import { formatPrice } from '~/utils/helpers';
import { useAuthContext } from '~/hooks/useAuthContext';

export const CategoryPage = () => {
  const { categoryId } = useParams<'categoryId'>();
  const { accessToken } = useAuthContext();
  const {
    makeRequest: makeCatRequest,
    loading: loadingCat,
    error: errorCat,
  } = useMakeRequest();
  const {
    makeRequest: makeProductionRequest,
    loading: loadingProduction,
    error: errorProduction,
  } = useMakeRequest();

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [productsInCategory, setProductsInCategory] = useState<Product[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const resp = await makeCatRequest(
          getCategories(accessToken),
          isCategoriesResponse,
        );
        if (!ignore && resp) {
          setAllCategories(resp.results);
          const found = resp.results.find((c) => c.id === categoryId);
          if (found) setCurrentCategory(found);
          else setCurrentCategory(null);
        }
      } catch {}
    };

    void fetchCategories();
    return () => {
      ignore = true;
    };
  }, [accessToken, categoryId, makeCatRequest]);

  useEffect(() => {
    if (!accessToken || !currentCategory) return;
    let ignore = false;

    const fetchProducts = async () => {
      try {
        const resp = await makeProductionRequest(
          getProductsByCategory(currentCategory.id, accessToken, locales.UK),
          isProductsResponse,
        );
        if (!ignore && resp) {
          setProductsInCategory(resp.results);
        }
      } catch {}
    };

    void fetchProducts();
    return () => {
      ignore = true;
    };
  }, [accessToken, currentCategory, makeProductionRequest]);

  if (loadingCat) {
    return (
      <Container py='2rem'>
        <Spinner size='xl' />
        <Text>Loading categories...</Text>
      </Container>
    );
  }

  if (errorCat) {
    return (
      <Container py='2rem'>
        <Text color='red.500'>Error loading categories: {errorCat}</Text>
      </Container>
    );
  }

  if (!currentCategory) {
    return (
      <Container py='2rem'>
        <Text fontSize='2xl'>Category not found</Text>
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
            <CategorySidebar token={accessToken} locale={locales.UK} />
          )}

          <Box flex='1' ml='1rem'>
            <Text fontSize='2xl' mb='1rem'>
              Products in category: {currentCategory.name[locales.UK]}
            </Text>

            {loadingProduction ? (
              <Spinner size='lg' />
            ) : errorProduction ? (
              <Text color='red.500'>
                Error loading products: {errorProduction}
              </Text>
            ) : productsInCategory.length === 0 ? (
              <Text>No products in this category yet.</Text>
            ) : (
              <Grid
                templateColumns='repeat(auto-fit, minmax(250px, 1fr))'
                gap='1rem'
                justifyItems='center'
              >
                {productsInCategory.map((product) => {
                  const price =
                    product.masterVariant.prices[0].value.centAmount;
                  const discountedPrice =
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
                      </Box>
                    </Link>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};
