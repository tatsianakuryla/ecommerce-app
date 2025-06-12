// import {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   ReactNode,
// } from 'react';
// import {
//   BASE_API_URL,
//   PROJECT_KEY,
// } from '~/constants/constants';
// import type { CartItem } from '~types/types';
// import { generateAnonymousToken } from '~api/requests.ts'
//
// interface State {
//   items: CartItem[];
//   cartId?: string;
//   version?: number;
//   anonymousId?: string;
//   accessToken?: string;
// }
//
// type Action =
//   | {
//   type: 'INITIALIZE';
//   payload: {
//     cartId: string;
//     version: number;
//     items: CartItem[];
//     anonymousId: string;
//     accessToken: string;
//   };
// }
//   | {
//   type: 'UPDATE_CART';
//   payload: {
//     cartId: string;
//     version: number;
//     items: CartItem[];
//   };
// };
//
// const initialState: State = { items: [] };
//
// function reducer(state: State, action: Action): State {
//   switch (action.type) {
//     case 'INITIALIZE':
//       return {
//         ...state,
//         cartId: action.payload.cartId,
//         version: action.payload.version,
//         items: action.payload.items,
//         anonymousId: action.payload.anonymousId,
//         accessToken: action.payload.accessToken,
//       };
//     case 'UPDATE_CART':
//       return {
//         ...state,
//         cartId: action.payload.cartId,
//         version: action.payload.version,
//         items: action.payload.items,
//       };
//     default:
//       return state;
//   }
// }
//
// interface ContextValue extends State {
//   addItem: (productId: string, quantity?: number) => Promise<void>;
//   removeItem: (productId: string) => Promise<void>;
//   totalCount: number;
// }
//
// const CartContext = createContext<ContextValue | undefined>(undefined);
//
// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//
//   // Инициализация корзины
//   useEffect(() => {
//     async function initCart() {
//       // 1) Получаем анонимный токен с anonymous_id
//       const tokenRequest = generateAnonymousToken();
//       const tokenResponse = await fetch(tokenRequest);
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//       const { access_token, anonymous_id } = await tokenResponse.json();
//
//       // 2) Пытаемся получить существующую корзину
//       const listResponse = await fetch(
//         `${BASE_API_URL}${PROJECT_KEY}/me/carts?anonymousId=${anonymous_id}`,
//         { headers: { Authorization: `Bearer ${access_token}` } }
//       );
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//       const listJson = await listResponse.json();
//
//       let cart;
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       if (listJson.results.length) {
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
//         cart = listJson.results[0];
//       } else {
//         // 3) Создаём новую корзину
//         // eslint-disable-next-line unicorn/prevent-abbreviations
//         const createRes = await fetch(
//           `${BASE_API_URL}${PROJECT_KEY}/carts`,
//           {
//             method: 'POST',
//             headers: {
//               Authorization: `Bearer ${access_token}`,
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               currency: 'EUR',
//               country: 'DE',
//               // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//               anonymousId: anonymous_id,
//             }),
//           }
//         );
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         cart = await createRes.json();
//       }
//
//       // Сохраняем в стейт
//       dispatch({
//         type: 'INITIALIZE',
//         // payload: {
//         //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
//         //   cartId: cart.id,
//         //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
//         //   version: cart.version,
//         //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
//         //   // items: cart.lineItems.map((li: never) => ({
//         //   //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
//         //   //   // id: li.sku,
//         //   //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         //   //   // quantity: li.quantity,
//         //   // })),
//         //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         //   anonymousId: anonymous_id,
//         //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         //   accessToken: access_token,
//         // },
//       });
//     }
//
//     initCart().catch(console.error);
//   }, []);
//
//   // Функция добавления товара
//   const addItem = async (productId: string, quantity = 1) => {
//     if (!state.cartId || !state.accessToken || state.version === undefined) {
//       throw new Error('Cart is not ready');
//     }
//
//     const response = await fetch(
//       `${BASE_API_URL}${PROJECT_KEY}/carts/${state.cartId}`,
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${state.accessToken}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           version: state.version,
//           actions: [
//             { action: 'addLineItem', sku: productId, quantity },
//           ],
//         }),
//       }
//     );
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const updated = await response.json();
//     dispatch({
//       type: 'UPDATE_CART',
//       payload: {
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
//         cartId: updated.id,
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
//         version: updated.version,
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
//         // items: updated.lineItems.map((li: never) => ({
//         //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         //   // id: li.sku,
//         //   // quantity: li.quantity,
//         // })),
//       },
//     });
//   };
//
//   // Функция удаления товара
//   const removeItem = async (productId: string) => {
//     if (!state.cartId || !state.accessToken || state.version === undefined) {
//       throw new Error('Cart is not ready');
//     }
//     // eslint-disable-next-line unicorn/prevent-abbreviations
//     const res = await fetch(
//       `${BASE_API_URL}${PROJECT_KEY}/carts/${state.cartId}`,
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${state.accessToken}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           version: state.version,
//           actions: [
//             { action: 'removeLineItem', lineItemId: productId },
//           ],
//         }),
//       }
//     );
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const updated = await res.json();
//     dispatch({
//       type: 'UPDATE_CART',
//       payload: {
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
//         cartId: updated.id,
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         version: updated.version,
//         items: updated.lineItems.map((li: any) => ({
//           id: li.sku,
//           quantity: li.quantity,
//         })),
//       },
//     });
//   };
//
//   const totalCount = state.items.reduce(
//     (sum, item) => sum + item.quantity,
//     0
//   );
//
//   return (
//     <CartContext.Provider
//       value={{
//         ...state,
//         addItem,
//         removeItem,
//         totalCount,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };
//
// export const useCart = (): ContextValue => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used inside CartProvider');
//   }
//   return context;
// };
