import { HStack, Button, Text } from '@chakra-ui/react';
import { AddToCartButtonProperties } from '~types/types';
import { HiPlusSm, HiMinusSm } from 'react-icons/hi';
import {
  addButtonStyle,
  addRemoveButtonStyle,
  removeButtonStyle,
} from '~/styles/style';
import { useCart } from '~hooks/useCart';

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
        <Button disabled {...addRemoveButtonStyle}>
          <Text>In Cart ({line.quantity})</Text>
          <HiPlusSm />
        </Button>
        <Button
          loading={loading}
          onClick={(event) => {
            stop(event);
            void removeFromCart(line.id);
          }}
          {...addRemoveButtonStyle}
          {...removeButtonStyle}
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
      {...addRemoveButtonStyle}
      {...addButtonStyle}
    >
      <Text>Add to cart</Text>
      <HiPlusSm />
    </Button>
  );
};
