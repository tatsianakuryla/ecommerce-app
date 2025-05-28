import { Button, Card, Flex, Image, Text } from '@chakra-ui/react';

export const ProductCard = ({
  name,
  description,
  img,
  alt,
  price,
  discount,
}: Record<string, string>) => {
  return (
    <Card.Root maxW='sm' overflow='hidden' height='100%'>
      <Image src={img} alt={alt} h='320px' />
      <Card.Body gap='2'>
        <Card.Title>{name}</Card.Title>
        <Card.Description lineClamp={2}>{description}</Card.Description>
        {discount ? (
          <Flex gap='3'>
            <Text
              textStyle='2xl'
              fontWeight='medium'
              letterSpacing='tight'
              mt='2'
              textDecor='line-through'
            >
              {price}
            </Text>
            <Text
              textStyle='2xl'
              fontWeight='medium'
              letterSpacing='tight'
              mt='2'
              color='red.500'
            >
              {discount}
            </Text>
          </Flex>
        ) : (
          <Text
            textStyle='2xl'
            fontWeight='medium'
            letterSpacing='tight'
            mt='2'
          >
            {price}
          </Text>
        )}
      </Card.Body>
      <Card.Footer gap='2'>
        <Button variant='solid'>Buy now</Button>
        <Button variant='ghost'>Add to cart</Button>
      </Card.Footer>
    </Card.Root>
  );
};
