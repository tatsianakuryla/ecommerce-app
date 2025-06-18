import { Card, chakra, Flex, Text } from '@chakra-ui/react';
import { ProductCardProperties } from '~types/types';
import { productCardStyles, productCardTextStyle } from '~/styles/style';
import { AddRemoveItemButton } from '~components/AddRemoveItemButton/AddRemoveItemButton';

const ChakraImage = chakra('img');

export const ProductCard = ({
  img,
  alt,
  name,
  description,
  price,
  discount,
  id,
}: ProductCardProperties) => {
  const thumbUrl = `${img}?width=300&height=300&format=webp`;

  return (
    <Card.Root {...productCardStyles}>
      <ChakraImage
        src={thumbUrl}
        alt={alt}
        height='240px'
        width='100%'
        objectFit='contain'
      />

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
        <AddRemoveItemButton productId={id} />
      </Card.Footer>
    </Card.Root>
  );
};
