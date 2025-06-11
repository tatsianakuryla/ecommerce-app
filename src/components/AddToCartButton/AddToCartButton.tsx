import { Button } from '@chakra-ui/react';
import { MouseEvent } from 'react';
import { useCart } from '~/contexts/cartContext';
import { AddToCartButtonProperties } from '~types/types';
import { HiPlusSm } from 'react-icons/hi';

export const AddToCartButton = ({
  productId,
  quantity = 1,
}: AddToCartButtonProperties) => {
  const { items, dispatch } = useCart();
  const inCart = items.some((item) => item.id === productId);

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (!inCart) {
      dispatch({ type: 'ADD_ITEM', payload: { id: productId, quantity } });
    }
  };

  const addToCartButtonStyle = {
    bg: inCart ? 'gray.300' : 'teal.500',
    color: inCart ? 'gray.600' : 'white',
    _hover: inCart ? {} : { bg: 'teal.600' },
    _active: inCart ? {} : { bg: 'teal.700' },
    cursor: inCart ? 'not-allowed' : 'pointer',
    fontWeight: 'semibold',
    fontSize: 'sm',
    borderRadius: 'md',
    px: '2rem',
    py: '1rem',
    width: '100%',
  };

  return (
    <Button
      variant='ghost'
      onClick={handleClick}
      disabled={inCart}
      {...addToCartButtonStyle}
    >
      {inCart ? 'Already in cart' : 'Add to cart'}
      {!inCart ? <HiPlusSm /> : null}
    </Button>
  );
};
