import { createContext, useContext } from 'react';
import { CartContextShape } from '~types/types';

export const CartContext = createContext<CartContextShape | undefined>(
  undefined,
);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
