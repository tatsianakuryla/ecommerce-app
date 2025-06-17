import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import {
  getMyActiveCart,
  createMyCart,
  updateMyCart,
  addLineItemAction,
} from '~/api/requests';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { Cart, PromoCode } from '~types/types';
import { useAuthContext } from '~hooks/useAuthContext.ts';
import { promoCodes } from '~constants/constants.ts';

export interface CartContextShape {
  cart: Cart | null;
  loading: boolean;
  addToCart: (
    productId: string,
    variantId: number,
    qty?: number,
  ) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateLineItemQuantity: (lineItemId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyDiscountCode: (code: string) => void;
  appliedCode: PromoCode | null;
}

import Toastify from 'toastify-js';

export function showError(message: string) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    style: { background: '#E53E3E', color: '#fff' },
  }).showToast();
}

export function showInfo(message: string) {
  Toastify({
    text: message,
    duration: 2500,
    close: false,
    gravity: 'top',
    position: 'right',
    style: { background: '#319795', color: '#fff' }, // teal-600
  }).showToast();
}

export const isCart = (u: unknown): u is Cart =>
  !!u && typeof u === 'object' && 'id' in u && 'version' in u;

const CartContext = createContext<CartContextShape | undefined>(undefined);

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

    // 1️⃣ создаём ref, который «переживает» перерендеры
    const cancelled = { current: false }; // <-- или useRef(false)

    // 2️⃣ IIFE вызываем через void, чтобы удовлетворить no-floating-promises
    void (async () => {
      try {
        const active = await makeRequest(getMyActiveCart(accessToken), isCart);

        // 3️⃣ если эффект ещё актуален — кладём данные в state
        if (!cancelled.current) {
          setCart(active ?? null);
        }
      } catch {
        // обработка/лог —  по желанию
        if (!cancelled.current) showError('We could not connect to the cart.');
      }
    })();

    // 4️⃣ при размонтировании/смене accessToken помечаем эффект как «отменённый»
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
