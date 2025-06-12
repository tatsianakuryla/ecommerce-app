import { Button, Card, Flex, Image, Text } from '@chakra-ui/react';
import { productCardStyles } from '~/styles/style.ts';

export const ProductCard = ({
  name,
  description,
  img,
  alt,
  price,
  discount,
}: Record<string, string>) => {
  return (
    <Card.Root {...productCardStyles}>
      <Image src={img} alt={alt} h='240px' />
      <Card.Body gap='0.2'>
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
      <Card.Footer gap='0.2'>
        <Button variant='solid'>Buy now</Button>
        <Button variant='ghost'>Add to cart</Button>
      </Card.Footer>
    </Card.Root>
  );
};
