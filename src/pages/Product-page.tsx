import {
  Container,
  Heading,
  Text,
  Spinner,
  Box,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { getLocalizedString, useProduct } from '~/hooks/useProduct';
import { ImageSlider } from '~components/ImageSlider/ImageSlider.tsx';

export const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, loading, error } = useProduct(productId);

  if (!productId) {
    return (
      <Container py='1rem'>
        <Heading>Товар не выбран</Heading>
        <Text mt='1rem'>
          В URL не указан ID товара. Например, /products/&lt;ID&gt;.
        </Text>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container py='1rem' textAlign='center'>
        <Spinner size='xl' />
      </Container>
    );
  }

  if (error) {
    return (
      <Container py='1rem'>
        <Heading>Ошибка при загрузке товара</Heading>
        <Text color='red.500' mt='1rem'>
          {error}
        </Text>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container py='1rem'>
        <Heading>Товар не найден</Heading>
        <Text mt='1rem'>
          Товар с ID <strong>{productId}</strong> не опубликован или не
          существует.
        </Text>
      </Container>
    );
  }

  const name = getLocalizedString(product.name);
  const description = getLocalizedString(product.description);
  const images = product.masterVariant.images;

  const firstPrice = product.masterVariant.prices[0];
  const originalAmount = firstPrice.value.centAmount / 100;
  const currency = firstPrice.value.currencyCode;
  let saleAmount: number | null = null;
  if (firstPrice.discounted) {
    saleAmount = firstPrice.discounted.value.centAmount / 100;
  }

  return (
    <Container maxW='container.lg' py='2rem'>
      <VStack align='start' gap='1.5rem'>
        <Heading size='xl'>{name}</Heading>

        <HStack align='start' gap='2rem' w='100%' flexWrap='wrap'>
          <Box flex='1' minW='300px'>
            <ImageSlider
              images={images.map((image, index) => ({
                url: image.url,
                alt: `${name} (${index + 1})`,
              }))}
              boxHeight='400px'
              boxWidth='100%'
            />
          </Box>

          <Box flex='1' minW='300px'>
            <Text fontSize='lg' mb='1rem'>
              {description}
            </Text>

            <Box my='2rem'>
              {saleAmount !== null ? (
                <HStack gap='1rem'>
                  <Text
                    fontSize='2xl'
                    fontWeight='semibold'
                    color='gray.500'
                    textDecoration='line-through'
                  >
                    {originalAmount.toFixed(2)} {currency}
                  </Text>
                  <Text fontSize='2xl' fontWeight='bold' color='red.500'>
                    {saleAmount.toFixed(2)} {currency}
                  </Text>
                </HStack>
              ) : (
                <Text fontSize='2xl' fontWeight='bold'>
                  {originalAmount.toFixed(2)} {currency}
                </Text>
              )}
            </Box>
          </Box>
        </HStack>
      </VStack>
    </Container>
  );
};
