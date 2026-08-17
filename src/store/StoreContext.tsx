'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { PRODUCTS, type CartItem, type Product } from '@/data/products';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  toasts: Toast[];
  addToCart: (productId: string, quantity?: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  pushToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: number) => void;
}

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = 'lumiere_cart';
const WISHLIST_KEY = 'lumiere_wishlist';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function loadWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [wishlist, setWishlist] = useState<string[]>(loadWishlist);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, type: Toast['type'] = 'success') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast]
  );

  const addToCart = useCallback(
    (productId: string, quantity = 1, size?: string) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === productId && i.size === size);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { productId, quantity, size }];
      });
      const product = PRODUCTS.find((p) => p.id === productId);
      pushToast(`${product?.name ?? 'Item'} added to your bag`, 'success');
    },
    [pushToast]
  );

  const removeFromCart = useCallback((productId: string, size?: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string) => {
      if (quantity < 1) return;
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size ? { ...i, quantity } : i
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        if (prev.includes(productId)) {
          pushToast('Removed from wishlist', 'info');
          return prev.filter((id) => id !== productId);
        }
        pushToast('Saved to wishlist', 'success');
        return [...prev, productId];
      });
    },
    [pushToast]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const p = PRODUCTS.find((pr: Product) => pr.id === item.productId);
        return sum + (p ? p.price * item.quantity : 0);
      }, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      toasts,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal,
      toggleWishlist,
      isWishlisted,
      pushToast,
      dismissToast,
    }),
    [
      cart,
      wishlist,
      toasts,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal,
      toggleWishlist,
      isWishlisted,
      pushToast,
      dismissToast,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
