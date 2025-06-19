import { createContext } from 'react';
import { CartContextShape } from '~types/types';

export const CartContext = createContext<CartContextShape | undefined>(
  undefined,
);
