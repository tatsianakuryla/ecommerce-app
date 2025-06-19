import { useState, ReactNode, useCallback, useEffect } from 'react';
import {
  getMyActiveCart,
  createMyCart,
  updateMyCart,
  addLineItemAction,
} from '~/api/requests';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { Cart, PromoCode } from '~types/types';
import { useAuthContext } from '~hooks/useAuthContext';
import { promoCodes } from '~constants/constants';
import { isCart } from '~utils/typeguards';
import { showError, showInfo } from '~utils/helpers';
import { CartContext } from '~/contexts/cartContext';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuthContext();
  const { makeRequest } = useMakeRequest();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [appliedCode, setAppliedCode] = useState<PromoCode | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setCart(null);
      return;
    }

    const cancelled = { current: false };

    void (async () => {
      try {
        const active = await makeRequest(getMyActiveCart(accessToken), isCart);

        if (!cancelled.current) {
          setCart(active ?? null);
        }
      } catch {
        if (!cancelled.current) showError('We could not connect to the cart.');
      }
    })();

    return () => {
      cancelled.current = true;
    };
  }, [accessToken, makeRequest]);

  const changeQty = (lineItemId: string, quantity: number) => ({
    action: 'changeLineItemQuantity',
    lineItemId,
    quantity,
  });

  const updateLineItemQuantity = useCallback(
    async (lineItemId: string, qty: number) => {
      if (!cart || !accessToken) return;
      setLoading(true);
      try {
        const actions = [changeQty(lineItemId, qty)];
        const updated = await makeRequest(
          updateMyCart(cart.id, cart.version, actions, accessToken),
          isCart,
        );
        if (updated) setCart(updated);
      } finally {
        setLoading(false);
      }
    },
    [cart, accessToken, makeRequest],
  );

  const applyDiscountCode = useCallback(
    (code: string) => {
      if (!promoCodes.includes(code)) {
        showError('Invalid promo code');
        return;
      }

      if (appliedCode === code) return;

      setAppliedCode(code);
      showInfo(`Promo code ${code} applied! 🎉`);
    },
    [appliedCode],
  );

  const clearCart = useCallback(async () => {
    if (!cart || !accessToken) return;
    setLoading(true);
    try {
      const actions = cart.lineItems.map((li) => ({
        action: 'removeLineItem',
        lineItemId: li.id,
      }));
      const updated = await makeRequest(
        updateMyCart(cart.id, cart.version, actions, accessToken),
        isCart,
      );
      if (updated) setCart(updated);
    } finally {
      setLoading(false);
    }
  }, [cart, accessToken, makeRequest]);

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
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateLineItemQuantity,
        clearCart,
        applyDiscountCode,
        appliedCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
