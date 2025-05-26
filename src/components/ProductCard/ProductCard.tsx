import { Button, Card, Image, Text } from '@chakra-ui/react';

export const ProductCard = ({
  name,
  description,
  img,
  alt,
  price,
}: Record<string, string>) => {
  return (
    <Card.Root maxW='sm' overflow='hidden'>
      <Image src={img} alt={alt} h='320px' />
      <Card.Body gap='2'>
        <Card.Title>{name}</Card.Title>
        <Card.Description lineClamp={2}>{description}</Card.Description>
        <Text textStyle='2xl' fontWeight='medium' letterSpacing='tight' mt='2'>
          {price}
        </Text>
      </Card.Body>
      <Card.Footer gap='2'>
        <Button variant='solid'>Buy now</Button>
        <Button variant='ghost'>Add to cart</Button>
      </Card.Footer>
    </Card.Root>
  );
};
