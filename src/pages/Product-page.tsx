import { Container, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();

  return (
    <Container py='1rem'>
      <Heading>Product page</Heading>
      <Text mt='1rem'>
        Вы смотрите товар с ID = <strong>{productId}</strong>
      </Text>
      {/* Здесь нужно подгрузить товары из каталога с уникальным ID*/}
    </Container>
  );
};
