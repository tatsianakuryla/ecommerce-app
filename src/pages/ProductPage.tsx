import {
  Container,
  Grid,
  Box,
  Heading,
  Text,
  Spinner,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useProduct } from '~/hooks/useProduct';
import { ImageSlider } from '~/components/ImageSlider/ImageSlider';
import { AddRemoveItemButton } from '~components/AddRemoveItemButton/AddRemoveItemButton';
import { getLocalizedString } from '~utils/helpers';

export const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, loading, error } = useProduct(productId);

  if (!productId) {
    return (
      <Container py={4}>
        <Heading>No product selected</Heading>
        <Text mt={4}>
          No product ID specified in URL. For example: /products/&lt;ID&gt;.
        </Text>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container py={8} textAlign='center'>
        <Spinner size='xl' />
      </Container>
    );
  }

  if (error) {
    return (
      <Container py={8}>
        <Heading>Failed to load product</Heading>
        <Text color='red.500' mt={4}>
          {error}
        </Text>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container py={4}>
        <Heading>Product not found</Heading>
        <Text mt={4}>
          Product with ID <strong>{productId}</strong> is not published or does
          not exist.
        </Text>
      </Container>
    );
  }

  const name = getLocalizedString(product.name);
  const description = getLocalizedString(product.description);
  const images = product.masterVariant.images.map((image, index) => ({
    url: image.url,
    alt: `${name} (${index + 1})`,
  }));
  const firstPrice = product.masterVariant.prices[0];
  const basePrice = firstPrice.value.centAmount / 100;
  const currency = firstPrice.value.currencyCode;
  const original = `${basePrice.toFixed(2)} ${currency}`;
  const discount = firstPrice.discounted
    ? `${(firstPrice.discounted.value.centAmount / 100).toFixed(2)} ${currency}`
    : undefined;

  return (
    <Container maxW='7xl' py={5}>
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={10}
        p={{ base: 2, md: 6 }}
        borderWidth='1px'
        borderRadius='lg'
        boxShadow='md'
      >
        <Box>
          <ImageSlider
            images={images}
            boxHeight='500px'
            boxWidth='100%'
            maxHeight='500px'
          />
        </Box>

        <VStack align='start' gap={6}>
          <Heading size='2xl'>{name}</Heading>
          <Text fontSize='lg' color='gray.600'>
            {description}
          </Text>

          <HStack gap={4}>
            {discount ? (
              <>
                <Text
                  fontSize='3xl'
                  fontWeight='semibold'
                  color='gray.500'
                  textDecoration='line-through'
                >
                  {original}
                </Text>
                <Text fontSize='3xl' fontWeight='bold' color='red.500'>
                  {discount}
                </Text>
              </>
            ) : (
              <Text fontSize='3xl' fontWeight='bold'>
                {original}
              </Text>
            )}
          </HStack>

          <HStack gap={4}>
            <AddRemoveItemButton productId={productId} />
          </HStack>
        </VStack>
      </Grid>
    </Container>
  );
};
