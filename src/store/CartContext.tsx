import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  discountCode: string;
  discountAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_SELECTED_ITEMS' }
  | { type: 'TOGGLE_ITEM_SELECTED'; payload: number }
  | { type: 'TOGGLE_ALL_SELECTED'; payload: boolean }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'APPLY_DISCOUNT'; payload: { code: string; amount: number } };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.payload.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product.id === action.payload.product.id
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload.product, quantity: action.payload.quantity || 1, selected: false }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.product.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.product.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_CART':
      return { ...state, items: action.payload };
    case 'CLEAR_SELECTED_ITEMS':
      return { ...state, items: state.items.filter(i => !i.selected) };
    case 'TOGGLE_ITEM_SELECTED':
      return {
        ...state,
        items: state.items.map(i => i.product.id === action.payload ? { ...i, selected: !i.selected } : i)
      };
    case 'TOGGLE_ALL_SELECTED':
      return {
        ...state,
        items: state.items.map(i => ({ ...i, selected: action.payload }))
      };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'APPLY_DISCOUNT':
      return { ...state, discountCode: action.payload.code, discountAmount: action.payload.amount };
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  toggleItemSelected: (id: number) => void;
  toggleAllSelected: (selected: boolean) => void;
  clearCart: () => void;
  clearSelectedItems: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (code: string) => void;
  totalItems: number;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_CODES: Record<string, number> = {
  LUXURY10: 0.1,
  SALE20: 0.2,
  VIP30: 0.3,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, openAuth } = useAuth();

  const [state, dispatch] = useReducer(cartReducer, {
    items: user ? JSON.parse(localStorage.getItem(`cart_${user.id}`) || '[]') : [],
    isOpen: false,
    discountCode: '',
    discountAmount: 0,
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated, user?.id]);

  const selectedItems = state.items.filter(i => i.selected);
  const totalItems = state.items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
  const subtotal = selectedItems.reduce((sum: number, i: CartItem) => sum + i.product.price * i.quantity, 0);
  const total = subtotal * (1 - state.discountAmount);

  const addToCart = (product: Product, quantity = 1) => {
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    dispatch({ type: 'OPEN_CART' });
  };
  const removeFromCart = (id: number) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: number, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const clearSelectedItems = () => dispatch({ type: 'CLEAR_SELECTED_ITEMS' });
  const toggleItemSelected = (id: number) => dispatch({ type: 'TOGGLE_ITEM_SELECTED', payload: id });
  const toggleAllSelected = (selected: boolean) => dispatch({ type: 'TOGGLE_ALL_SELECTED', payload: selected });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const applyDiscount = (code: string) => {
    const discount = VALID_CODES[code.toUpperCase()];
    if (discount) {
      dispatch({ type: 'APPLY_DISCOUNT', payload: { code, amount: discount } });
    }
  };

  return (
    <CartContext.Provider value={{
      state, addToCart, removeFromCart, updateQuantity,
      toggleItemSelected, toggleAllSelected, clearCart, clearSelectedItems,
      toggleCart, openCart, closeCart, applyDiscount,
      totalItems, subtotal, total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
