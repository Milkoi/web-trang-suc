import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  discountCode: string;
  discountAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number; size?: string; variant?: ProductVariant } }
  | { type: 'REMOVE_ITEM'; payload: { id?: number; productId: number; size?: string; variantId?: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id?: number; productId: number; size?: string; variantId?: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_SELECTED_ITEMS' }
  | { type: 'TOGGLE_ITEM_SELECTED'; payload: { id: number; productId: number; size?: string; variantId?: number } }
  | { type: 'TOGGLE_ALL_SELECTED'; payload: boolean }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'APPLY_DISCOUNT'; payload: { code: string; amount: number } }
  | { type: 'CLEAR_DISCOUNT' };

const areSameCartItem = (item: CartItem, selector: { id?: number; productId: number; variantId?: number; size?: string }) => {
  if (selector.id && item.id === selector.id) return true;

  return item.product.id === selector.productId &&
    ((selector.variantId !== undefined && selector.variantId !== null)
      ? (item.variant?.id ?? item.variantId ?? -1) === selector.variantId
      : (item.size ?? '') === (selector.size ?? ''));
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(i => areSameCartItem(i, { productId: action.payload.product.id, variantId: action.payload.variant?.id, size: action.payload.size }));
      const priceAtPurchase = action.payload.variant?.price ?? action.payload.product.price;
      if (existingIndex >= 0) {
        const item = state.items[existingIndex];
        const maxStock = item.variant ? (item.variant.stockQuantity ?? 0) : (item.product.stockQuantity ?? 0);
        const requestedQty = action.payload.quantity || 1;
        const newQuantity = Math.min(item.quantity + requestedQty, maxStock);

        const updatedItem = {
          ...item,
          quantity: newQuantity,
        };
        return {
          ...state,
          items: [
            updatedItem,
            ...state.items.filter((_, index) => index !== existingIndex),
          ],
        };
      }
      const maxStock = action.payload.variant ? (action.payload.variant.stockQuantity ?? 0) : (action.payload.product.stockQuantity ?? 0);
      const initialQty = Math.min(action.payload.quantity || 1, maxStock);

      return {
        ...state,
        items: [
          {
            id: -1, // Temporary ID for optimistic local only items
            product: action.payload.product,
            quantity: initialQty,
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
        items: state.items.filter(i => !areSameCartItem(i, { id: action.payload.id, productId: action.payload.productId, variantId: action.payload.variantId, size: action.payload.size })),
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => !areSameCartItem(i, { id: action.payload.id, productId: action.payload.productId, variantId: action.payload.variantId, size: action.payload.size })),
        };
      }
      return {
        ...state,
        items: state.items.map(i => {
          if (areSameCartItem(i, { id: action.payload.id, productId: action.payload.productId, variantId: action.payload.variantId, size: action.payload.size })) {
            const maxStock = i.variant ? (i.variant.stockQuantity ?? 0) : (i.product.stockQuantity ?? 0);
            return { ...i, quantity: Math.min(action.payload.quantity, maxStock) };
          }
          return i;
        }),
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
          areSameCartItem(i, { id: action.payload.id, productId: action.payload.productId, variantId: action.payload.variantId, size: action.payload.size })
            ? { ...i, selected: !i.selected }
            : i
        ),
      };

    case 'TOGGLE_ALL_SELECTED':
      return {
        ...state,
        items: state.items.map(i => {
          const maxStock = i.variant ? (i.variant.stockQuantity ?? 0) : (i.product.stockQuantity ?? 0);
          // Chỉ cho phép chọn nếu còn hàng
          const canSelect = maxStock > 0;
          return { ...i, selected: canSelect ? action.payload : false };
        }),
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
  removeFromCart: (id: number, size?: string, variantId?: number, cartItemId?: number) => void;
  updateQuantity: (id: number, quantity: number, size?: string, variantId?: number, cartItemId?: number) => void;
  toggleItemSelected: (id: number, size?: string, variantId?: number, cartItemId?: number) => void;
  toggleAllSelected: (selected: boolean) => void;
  clearCart: () => void;
  clearSelectedItems: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (code: string, amount: number) => void;
  clearDiscount: () => void;
  refreshCart: () => void;
  totalItems: number;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, openAuth } = useAuth();

  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    discountCode: '',
    discountAmount: 0,
  });

  // Fetch from server when logged in
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await api.get('/carts');
          dispatch({ type: 'SET_CART', payload: response.data });
        } catch (error) {
          console.error('Failed to fetch cart', error);
          dispatch({ type: 'CLEAR_CART' });
        }
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
    };
    fetchCart();
  }, [isAuthenticated, user?.id]);

  const selectedItems = state.items.filter((i: CartItem) => i.selected);
  const totalItems = state.items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
  const subtotal = selectedItems.reduce((sum: number, i: CartItem) => {
    const itemPrice = i.priceAtPurchase ?? i.variant?.price ?? i.product.price;
    return sum + itemPrice * i.quantity;
  }, 0);
  const total = Math.max(0, subtotal - state.discountAmount);

  // Sync wrappers
  const addToCart = async (product: Product, quantity = 1, size?: string, variant?: ProductVariant) => {
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }

    // Optimistic UI updates
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, size, variant } });
    
    // Open cart after a small delay to ensure state is updated
    setTimeout(() => {
      dispatch({ type: 'OPEN_CART' });
    }, 100);

    // Server Call
    try {
      await api.post('/carts/items', {
        productId: product.id,
        variantId: variant?.id,
        quantity: quantity,
        size: size,
      });
    } catch (err) {
      console.error('API failed to add to cart', err);
      // Fallback: sync from server again
      try {
        const serverState = await api.get('/carts');
        dispatch({ type: 'SET_CART', payload: serverState.data });
      } catch (syncErr) {
        console.error('Failed to sync cart from server', syncErr);
      }
    }
  };

  const removeFromCart = async (id: number, size?: string, variantId?: number, cartItemId?: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: cartItemId, productId: id, size, variantId } });
    if (isAuthenticated) {
      try {
        await api.delete('/carts/items', {
          data: { cartItemId, productId: id, variantId, size }
        });
      } catch (err) {
        console.error('Failed API remove', err);
      }
    }
  };

  const updateQuantity = async (id: number, quantity: number, size?: string, variantId?: number, cartItemId?: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: cartItemId, productId: id, size, variantId, quantity } });
    if (isAuthenticated) {
      try {
        await api.put('/carts/items', {
          productId: id,
          variantId,
          size,
          quantity
        });
      } catch (err) {
        console.error('Failed API update quant', err);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    if (isAuthenticated) {
      try {
        await api.delete('/carts');
      } catch (err) { }
    }
  };

  const clearSelectedItems = () => dispatch({ type: 'CLEAR_SELECTED_ITEMS' });
  const toggleItemSelected = (id: number, size?: string, variantId?: number, cartItemId?: number) =>
    dispatch({ type: 'TOGGLE_ITEM_SELECTED', payload: { id: cartItemId!, productId: id, size, variantId } });
  const toggleAllSelected = (selected: boolean) => dispatch({ type: 'TOGGLE_ALL_SELECTED', payload: selected });

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const clearDiscount = () => dispatch({ type: 'CLEAR_DISCOUNT' });
  const applyDiscount = (code: string, amount: number) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: { code, amount } });
  };

  const refreshCart = async () => {
    if (isAuthenticated && user) {
      try {
        const response = await api.get('/carts');
        dispatch({ type: 'SET_CART', payload: response.data });
      } catch (error) {
        console.error('Failed to refresh cart', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{
      state, addToCart, removeFromCart, updateQuantity,
      toggleItemSelected, toggleAllSelected, clearCart, clearSelectedItems,
      toggleCart, openCart, closeCart, applyDiscount, clearDiscount, refreshCart,
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
