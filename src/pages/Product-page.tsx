import {
  Container,
  Heading,
  Text,
  Spinner,
  Box,
  HStack,
  VStack,
  IconButton,
  Dialog,
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { getLocalizedString, useProduct } from '~/hooks/useProduct';
import { ImageSlider } from '~components/ImageSlider/ImageSlider.tsx';

export const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, loading, error } = useProduct(productId);

  if (!productId) {
    return (
      <Container py='1rem'>
        <Heading>No product selected</Heading>
        <Text mt='1rem'>
          No product ID specified in URL. For example: /products/&lt;ID&gt;.
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
        <Heading>Failed to load product</Heading>
        <Text color='red.500' mt='1rem'>
          {error}
        </Text>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container py='1rem'>
        <Heading>Product not found</Heading>
        <Text mt='1rem'>
          Product with ID <strong>{productId}</strong> is not published or does
          not exist.
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
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Box flex='1' minW='300px' cursor='pointer'>
                <ImageSlider
                  images={images.map((image, index) => ({
                    url: image.url,
                    alt: `${name} (${index + 1})`,
                  }))}
                  boxHeight='300px'
                  boxWidth='100%'
                  maxHeight='300px'
                />
              </Box>
            </Dialog.Trigger>

            <Dialog.Backdrop bg='rgba(0, 0, 0, 0.6)' />

            <Dialog.Positioner>
              <Dialog.Content
                w={{ base: '90vw', md: '80vw' }}
                h={{ base: '70vh', md: '80vh' }}
                bg='transparent'
                p={0}
                borderRadius='md'
              >
                <Dialog.CloseTrigger asChild>
                  <IconButton
                    aria-label='Close dialog'
                    position='absolute'
                    top='2'
                    right='2'
                    zIndex={2}
                    size='sm'
                    color='white'
                    bg='rgba(0, 0, 0, 0.3)'
                    _hover={{ bg: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <FiX />
                  </IconButton>
                </Dialog.CloseTrigger>

                <Dialog.Body p={0}>
                  <Box
                    position='relative'
                    w='100%'
                    h={{ base: '70vh', md: '80vh' }}
                  >
                    <ImageSlider
                      images={images.map((image, index) => ({
                        url: image.url,
                        alt: `${name} (${index + 1})`,
                      }))}
                      boxHeight='100%'
                      boxWidth='100%'
                      maxHeight='70vh'
                    />
                  </Box>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>

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
