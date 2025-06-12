import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { Action, CartContextValue, State } from '~types/types.ts';
import { isState } from '~utils/typeguards.ts';

const STORAGE_KEY = 'cart';

const initialState: State = { items: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(
        (index) => index.id === action.payload.id,
      );
      if (exists) {
        return {
          items: state.items.map((index) =>
            index.id === action.payload.id
              ? { ...index, quantity: index.quantity + action.payload.quantity }
              : index,
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((index) => index.id !== action.payload.id),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

function init(): State {
  if (typeof window === 'undefined') {
    return initialState;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === null) {
    return initialState;
  }

  try {
    const raw: unknown = JSON.parse(stored);
    if (isState(raw)) {
      return raw;
    }
    return initialState;
  } catch {
    return initialState;
  }
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const totalCount = state.items.reduce(
    (sum, index) => sum + index.quantity,
    0,
  );

  return (
    <CartContext.Provider value={{ ...state, dispatch, totalCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
