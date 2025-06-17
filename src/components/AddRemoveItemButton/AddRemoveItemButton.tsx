import { HStack, Button, Text } from '@chakra-ui/react';
import { useCart } from '~/contexts/cartContext';
import { AddToCartButtonProperties } from '~types/types';
import { HiPlusSm, HiMinusSm } from 'react-icons/hi';
import { buttonStyle } from '~/styles/style.ts';

export const AddRemoveItemButton = ({
  productId,
  quantity = 1,
}: AddToCartButtonProperties) => {
  const { cart, addToCart, removeFromCart, loading } = useCart();
  const line = cart?.lineItems.find((li) => li.productId === productId);

  const stop = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  if (line) {
    return (
      <HStack gap={2} w='100%'>
        <Button
          disabled
          bg='gray.300'
          color='gray.600'
          {...buttonStyle}
          flex={1}
        >
          <Text>In Cart ({line.quantity})</Text>
          <HiPlusSm />
        </Button>
        <Button
          loading={loading}
          onClick={(event) => {
            stop(event);
            void removeFromCart(line.id);
          }}
          bg='red.500'
          color='white'
          _hover={{ bg: 'red.600' }}
          flex={1}
          {...buttonStyle}
        >
          <Text>Remove</Text>
          <HiMinusSm />
        </Button>
      </HStack>
    );
  }

  return (
    <Button
      w='100%'
      loading={loading}
      onClick={(event) => {
        stop(event);
        void addToCart(productId, 1, quantity);
      }}
      bg='teal.500'
      color='white'
      _hover={{ bg: 'teal.600' }}
      {...buttonStyle}
    >
      <Text>Add to cart</Text>
      <HiPlusSm />
    </Button>
  );
};
