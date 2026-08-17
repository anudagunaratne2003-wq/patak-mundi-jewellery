'use client';

import { useRouter as useNextRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'shop'; params?: { collection?: string; category?: string } }
  | { name: 'collections' }
  | { name: 'collection'; params: { collection: string } }
  | { name: 'new-arrivals' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'product'; params: { id: string } }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'wishlist' }
  | { name: 'account' };

export function useRouter() {
  const router = useNextRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (route: Route) => {
      switch (route.name) {
        case 'home':
          router.push('/');
          break;
        case 'shop':
          if (route.params?.category) {
            router.push(`/shop?category=${encodeURIComponent(route.params.category)}`);
          } else if (route.params?.collection) {
            router.push(`/shop?collection=${encodeURIComponent(route.params.collection)}`);
          } else {
            router.push('/shop');
          }
          break;
        case 'collections':
          router.push('/collections');
          break;
        case 'collection':
          router.push(`/collections/${encodeURIComponent(route.params.collection)}`);
          break;
        case 'new-arrivals':
          router.push('/new-arrivals');
          break;
        case 'about':
          router.push('/about');
          break;
        case 'contact':
          router.push('/contact');
          break;
        case 'product':
          router.push(`/product/${encodeURIComponent(route.params.id)}`);
          break;
        case 'cart':
          router.push('/cart');
          break;
        case 'checkout':
          router.push('/checkout');
          break;
        case 'wishlist':
          router.push('/wishlist');
          break;
        case 'account':
          router.push('/account');
          break;
      }
    },
    [router]
  );

  return { route: { name: 'home', pathname, searchParams }, navigate, pathname, searchParams };
}
