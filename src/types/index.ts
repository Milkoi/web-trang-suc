// Product types
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'necklace' | 'ring' | 'bracelet' | 'anklet' | 'earring';
  material: 'gold' | 'silver' | 'platinum' | 'diamond';
  images: string[];
  description: string;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  rating: number;
  reviews: number;
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  selected?: boolean;
}

export interface Cart {
  items: CartItem[];
  discountCode?: string;
  discountAmount?: number;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'google';
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Order / Checkout types
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  postalCode: string;
  phone?: string;
}

export interface PaymentInfo {
  method: 'credit-card' | 'paypal' | 'klarna';
  cardNumber?: string;
  cardName?: string;
  expiry?: string;
  cvv?: string;
}

export interface CheckoutForm {
  email: string;
  newsletterOptin: boolean;
  shipping: ShippingAddress;
  shippingMethod: 'free' | 'standard' | 'express';
  payment: PaymentInfo;
}

// Filter types
export interface ProductFilters {
  categories: string[];
  materials: string[];
  priceRange: [number, number];
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';
