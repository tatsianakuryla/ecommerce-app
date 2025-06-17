import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import {
  getMyActiveCart,
  createMyCart,
  updateMyCart,
  addLineItemAction,
} from '~/api/requests';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { Cart } from '~types/types';
import { useAuthContext } from '~hooks/useAuthContext.ts';

interface CartContextShape {
  cart: Cart | null;
  loading: boolean;
  addToCart: (
    productId: string,
    variantId: number,
    qty?: number,
  ) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
}

export const isCart = (u: unknown): u is Cart =>
  !!u && typeof u === 'object' && 'id' in u && 'version' in u;

const CartContext = createContext<CartContextShape | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuthContext();
  const { makeRequest } = useMakeRequest();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const ensureCart = useCallback(async (): Promise<Cart> => {
    if (!accessToken)
      throw new Error('No access token – cannot access /me endpoints');
    if (cart) return cart;

    const fetched = await makeRequest(getMyActiveCart(accessToken), isCart);
    if (fetched) {
      setCart(fetched);
      return fetched;
    }
    const draft = { currency: 'EUR', country: 'DE' };
    const created = await makeRequest(createMyCart(draft, accessToken), isCart);

    if (!created) {
      throw new Error('Cart creation failed: empty response');
    }

    setCart(created);
    return created;
  }, [cart, accessToken, makeRequest]);

  const addToCart = useCallback(
    async (productId: string, variantId: number, qty = 1) => {
      if (!accessToken)
        throw new Error('No access token – cannot add the item to cart');
      setLoading(true);
      try {
        const current = await ensureCart();
        const actions = [addLineItemAction(productId, variantId, qty)];

        const updated = await makeRequest(
          updateMyCart(current.id, current.version, actions, accessToken),
          isCart,
        );
        if (!updated) {
          throw new Error('Cart update failed: empty response');
        }
        setCart(updated);
      } finally {
        setLoading(false);
      }
    },
    [ensureCart, accessToken, makeRequest],
  );

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      if (!accessToken)
        throw new Error('No access token – cannot remove the item from cart');
      if (!cart) return;
      setLoading(true);
      try {
        const actions = [{ action: 'removeLineItem', lineItemId }];
        const updated = await makeRequest(
          updateMyCart(cart.id, cart.version, actions, accessToken),
          isCart,
        );
        if (!updated) {
          throw new Error('Cart update failed: empty response');
        }
        setCart(updated);
      } finally {
        setLoading(false);
      }
    },
    [cart, accessToken, makeRequest],
  );

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
