import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { useAuth } from './AuthContext';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  discountCode: string;
  discountAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number; size?: string; variant?: ProductVariant } }
  | { type: 'REMOVE_ITEM'; payload: { id: number; size?: string; variantId?: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; size?: string; variantId?: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_SELECTED_ITEMS' }
  | { type: 'TOGGLE_ITEM_SELECTED'; payload: { id: number; size?: string; variantId?: number } }
  | { type: 'TOGGLE_ALL_SELECTED'; payload: boolean }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'APPLY_DISCOUNT'; payload: { code: string; amount: number } }
  | { type: 'CLEAR_DISCOUNT' };

const areSameCartItem = (item: CartItem, id: number, variantId?: number, size?: string) =>
  item.product.id === id &&
  ((variantId !== undefined && variantId !== null)
    ? (item.variant?.id ?? item.variantId ?? -1) === variantId
    : (item.size ?? '') === (size ?? ''));

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(i => areSameCartItem(i, action.payload.product.id, action.payload.variant?.id, action.payload.size));
      const priceAtPurchase = action.payload.variant?.price ?? action.payload.product.price;
      if (existingIndex >= 0) {
        const updatedItem = {
          ...state.items[existingIndex],
          quantity: state.items[existingIndex].quantity + (action.payload.quantity || 1),
        };
        return {
          ...state,
          items: [
            updatedItem,
            ...state.items.filter((_, index) => index !== existingIndex),
          ],
        };
      }
      return {
        ...state,
        items: [
          {
            product: action.payload.product,
            quantity: action.payload.quantity || 1,
            size: action.payload.size,
            variant: action.payload.variant,
            variantId: action.payload.variant?.id,
            priceAtPurchase,
            selected: false,
          },
          ...state.items,
        ],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => !areSameCartItem(i, action.payload.id, action.payload.variantId, action.payload.size)),
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => !areSameCartItem(i, action.payload.id, action.payload.variantId, action.payload.size)),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
          areSameCartItem(i, action.payload.id, action.payload.variantId, action.payload.size)
            ? { ...i, quantity: action.payload.quantity }
            : i
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
        items: state.items.map(i =>
          areSameCartItem(i, action.payload.id, action.payload.variantId, action.payload.size)
            ? { ...i, selected: !i.selected }
            : i
        ),
      };
    case 'TOGGLE_ALL_SELECTED':
      return {
        ...state,
        items: state.items.map(i => ({ ...i, selected: action.payload })),
      };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'APPLY_DISCOUNT':
      return { ...state, discountCode: action.payload.code, discountAmount: action.payload.amount };
    case 'CLEAR_DISCOUNT':
      return { ...state, discountCode: '', discountAmount: 0 };
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity?: number, size?: string, variant?: ProductVariant) => void;
  removeFromCart: (id: number, size?: string, variantId?: number) => void;
  updateQuantity: (id: number, quantity: number, size?: string, variantId?: number) => void;
  toggleItemSelected: (id: number, size?: string, variantId?: number) => void;
  toggleAllSelected: (selected: boolean) => void;
  clearCart: () => void;
  clearSelectedItems: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (code: string) => void;
  clearDiscount: () => void;
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

  const selectedItems = state.items.filter((i: CartItem) => i.selected);
  const totalItems = state.items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
  const subtotal = selectedItems.reduce((sum: number, i: CartItem) => {
    const itemPrice = i.priceAtPurchase ?? i.variant?.price ?? i.product.price;
    return sum + itemPrice * i.quantity;
  }, 0);
  const total = subtotal * (1 - state.discountAmount);

  const addToCart = (product: Product, quantity = 1, size?: string, variant?: Product['variants'] extends Array<infer U> ? U : never) => {
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, size, variant } });
    dispatch({ type: 'OPEN_CART' });
  };
  const removeFromCart = (id: number, size?: string, variantId?: number) => dispatch({ type: 'REMOVE_ITEM', payload: { id, size, variantId } });
  const updateQuantity = (id: number, quantity: number, size?: string, variantId?: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, variantId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const clearSelectedItems = () => dispatch({ type: 'CLEAR_SELECTED_ITEMS' });
  const toggleItemSelected = (id: number, size?: string, variantId?: number) => dispatch({ type: 'TOGGLE_ITEM_SELECTED', payload: { id, size, variantId } });
  const toggleAllSelected = (selected: boolean) => dispatch({ type: 'TOGGLE_ALL_SELECTED', payload: selected });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const clearDiscount = () => dispatch({ type: 'CLEAR_DISCOUNT' });
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
      toggleCart, openCart, closeCart, applyDiscount, clearDiscount,
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
