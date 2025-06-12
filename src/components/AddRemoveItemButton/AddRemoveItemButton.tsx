import { HStack, Button, Text } from '@chakra-ui/react';
import { MouseEvent } from 'react';
import { useCart } from '~/contexts/cartContext';
import { AddToCartButtonProperties } from '~types/types';
import { HiPlusSm, HiMinusSm } from 'react-icons/hi';

export const AddRemoveItemButton = ({
  productId,
  quantity = 1,
}: AddToCartButtonProperties) => {
  const { items, dispatch } = useCart();
  const inCart = items.some((item) => item.id === productId);

  const handleAdd = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (!inCart) {
      dispatch({ type: 'ADD_ITEM', payload: { id: productId, quantity } });
    }
  };

  const handleRemove = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch({ type: 'REMOVE_ITEM', payload: { id: productId } });
  };

  const buttonStyles = {
    fontWeight: 'semibold' as const,
    fontSize: 'sm' as const,
    borderRadius: 'md' as const,
    px: 4,
    py: 3,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  };

  if (inCart) {
    return (
      <HStack gap={2} width='100%'>
        <Button
          disabled
          bg='gray.300'
          color='gray.600'
          cursor='not-allowed'
          {...buttonStyles}
          flex={1}
        >
          <Text>In Cart</Text>
          <HiPlusSm />
        </Button>

        <Button
          onClick={handleRemove}
          bg='red.500'
          color='white'
          _hover={{ bg: 'red.600' }}
          _active={{ bg: 'red.700' }}
          {...buttonStyles}
          flex={1}
        >
          <Text>Remove</Text>
          <HiMinusSm />
        </Button>
      </HStack>
    );
  }

  return (
    <Button
      onClick={handleAdd}
      bg='teal.500'
      color='white'
      _hover={{ bg: 'teal.600' }}
      _active={{ bg: 'teal.700' }}
      cursor='pointer'
      {...buttonStyles}
      width='100%'
    >
      <Text>Add to cart</Text>
      <HiPlusSm />
    </Button>
  );
};
