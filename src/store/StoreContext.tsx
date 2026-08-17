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
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/store/AuthContext';
import { useProducts } from '@/store/ProductsContext';
import type { CartItem, Product } from '@/data/products';

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

function loadLocalCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function loadLocalWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { products } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load state: from Supabase if signed in, otherwise from localStorage.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (user) {
        const [{ data: cartRows }, { data: wishRows }] = await Promise.all([
          supabase.from('cart_items').select('*').eq('user_id', user.id),
          supabase.from('wishlists').select('product_id').eq('user_id', user.id),
        ]);
        if (!cancelled) {
          setCart(
            (cartRows ?? []).map((r) => ({
              productId: r.product_id,
              quantity: r.quantity,
              size: r.size || undefined,
            }))
          );
          setWishlist((wishRows ?? []).map((r) => r.product_id));
          setHydrated(true);
        }
      } else {
        setCart(loadLocalCart());
        setWishlist(loadLocalWishlist());
        setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Persist guest state to localStorage.
  useEffect(() => {
    if (!hydrated || user) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated, user]);

  useEffect(() => {
    if (!hydrated || user) return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated, user]);

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
        const next = existing
          ? prev.map((i) =>
              i.productId === productId && i.size === size
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          : [...prev, { productId, quantity, size }];

        if (user) {
          const newQty = existing ? existing.quantity + quantity : quantity;
          supabase
            .from('cart_items')
            .upsert({ user_id: user.id, product_id: productId, size: size ?? '', quantity: newQty })
            .then(() => {});
        }
        return next;
      });
      const product = products.find((p) => p.id === productId);
      pushToast(`${product?.name ?? 'Item'} added to your bag`, 'success');
    },
    [pushToast, products, user]
  );

  const removeFromCart = useCallback(
    (productId: string, size?: string) => {
      setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
      if (user) {
        supabase
          .from('cart_items')
          .delete()
          .match({ user_id: user.id, product_id: productId, size: size ?? '' })
          .then(() => {});
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string) => {
      if (quantity < 1) return;
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size ? { ...i, quantity } : i
        )
      );
      if (user) {
        supabase
          .from('cart_items')
          .upsert({ user_id: user.id, product_id: productId, size: size ?? '', quantity })
          .then(() => {});
      }
    },
    [user]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    if (user) {
      supabase.from('cart_items').delete().eq('user_id', user.id).then(() => {});
    }
  }, [user]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const isIn = prev.includes(productId);
        if (isIn) {
          pushToast('Removed from wishlist', 'info');
          if (user) {
            supabase
              .from('wishlists')
              .delete()
              .match({ user_id: user.id, product_id: productId })
              .then(() => {});
          }
          return prev.filter((id) => id !== productId);
        }
        pushToast('Saved to wishlist', 'success');
        if (user) {
          supabase
            .from('wishlists')
            .upsert({ user_id: user.id, product_id: productId })
            .then(() => {});
        }
        return [...prev, productId];
      });
    },
    [pushToast, user]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const p = products.find((pr: Product) => pr.id === item.productId);
        return sum + (p ? p.price * item.quantity : 0);
      }, 0),
    [cart, products]
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
