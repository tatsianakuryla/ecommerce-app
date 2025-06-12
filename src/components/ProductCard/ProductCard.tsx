import { Card, Flex, Image, Text } from '@chakra-ui/react';
import { productCardStyles, productCardTextStyle } from '~/styles/style';
import { AddToCartButton } from '~components/AddToCartButton/AddToCartButton';
import { ProductCardProperties } from '~types/types';

export const ProductCard = ({
  id,
  name,
  description,
  img,
  alt,
  price,
  discount,
}: ProductCardProperties) => {
  return (
    <Card.Root {...productCardStyles}>
      <Image src={img} alt={alt} h='240px' objectFit='contain' />
      <Card.Body flexGrow='1' gap='0.2'>
        <Card.Title flexGrow='1'>{name}</Card.Title>
        <Card.Description lineClamp={2}>{description}</Card.Description>
        {discount ? (
          <Flex gap='3'>
            <Text {...productCardTextStyle} textDecor='line-through'>
              {price}
            </Text>
            <Text {...productCardTextStyle} color='red.500'>
              {discount}
            </Text>
          </Flex>
        ) : (
          <Text {...productCardTextStyle} mt='2'>
            {price}
          </Text>
        )}
      </Card.Body>
      <Card.Footer gap='0.2' mt='auto'>
        <AddToCartButton productId={id} />
      </Card.Footer>
    </Card.Root>
  );
};
