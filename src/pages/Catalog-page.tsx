import { Container, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link, Link as RouterLink } from 'react-router-dom';

//для теста роутинга
interface TestProduct {
  id: string;
  name: string;
  price: string;
}

const TEST_PRODUCTS: TestProduct[] = [
  { id: '1', name: 'Тестовый товар', price: '999 EUR' },
  { id: '2', name: 'Тестовый товар 2', price: '999 EUR' },
];

export const CatalogPage = () => {
  return (
    <Container py='1rem'>
      <Heading mb='1rem'>Catalog page</Heading>
      {TEST_PRODUCTS.map((product) => (
        <ChakraLink
          key={product.id}
          as={RouterLink}
          p='1rem'
          mb='0.5rem'
          borderWidth='1px'
          borderRadius='md'
          _hover={{ bg: 'gray.50' }}
        >
          <Link to={`/catalog/${product.id}`}>
            <Text fontWeight='semibold'>{product.name}</Text>
            <Text>{product.price}</Text>
          </Link>
        </ChakraLink>
      ))}
    </Container>
  );
};
