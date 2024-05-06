import { db } from '../data/db';
import { CartItem, Guitar } from '../types';

export type CartActions =
  | { type: 'add-to-cart'; payload: { item: Guitar } }
  | { type: 'remove-to-cart'; payload: { id: Guitar['id'] } }
  | { type: 'increase-quantity'; payload: { id: Guitar['id'] } }
  | { type: 'decrease-quantity'; payload: { id: Guitar['id'] } }
  | { type: 'clear-cart' };

export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem('cart');
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

const MIN_ITEMS = 1;
const MAX_ITEMS = 5;

export const CartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  switch (action.type) {
    case 'add-to-cart': {
      const itemExist = state.cart.find(
        (guitar) => guitar.id === action.payload.item.id
      );

      let updateCart: CartItem[] = [];

      if (itemExist) {
        // existe en el carrito
        updateCart = state.cart.map((item) => {
          if (item.id === action.payload.item.id) {
            if (item.quantity < MAX_ITEMS) {
              return { ...item, quantity: item.quantity + 1 };
            } else {
              return item;
            }
          } else {
            return item;
          }
        });
      } else {
        // no existe en el carrito, Agregar
        const newItem: CartItem = { ...action.payload.item, quantity: 1 };
        updateCart = [...state.cart, newItem];
      }
      return { ...state, cart: updateCart };
    }

    case 'remove-to-cart': {
      const updatedCart = state.cart.filter(
        (item) => item.id !== action.payload.id
      );

      return {
        ...state,
        cart: updatedCart,
      };
    }
    case 'increase-quantity': {
      const updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      return {
        ...state,
        cart: updatedCart,
      };
    }
    case 'decrease-quantity': {
      const updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
      return {
        ...state,
        cart: updatedCart,
      };
    }
    case 'clear-cart':
      console.log(state);

      return {
        ...state,
        cart: [],
      };
    default:
      return state;
  }
};
