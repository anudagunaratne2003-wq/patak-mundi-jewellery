'use client';

import { useRouter as useNextRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'portfolio'; params?: { collection?: string; category?: string } }
  | { name: 'collections' }
  | { name: 'collection'; params: { collection: string } }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'design'; params: { id: string } };

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
        case 'portfolio':
          if (route.params?.category) {
            router.push(`/portfolio?category=${encodeURIComponent(route.params.category)}`);
          } else if (route.params?.collection) {
            router.push(`/portfolio?collection=${encodeURIComponent(route.params.collection)}`);
          } else {
            router.push('/portfolio');
          }
          break;
        case 'collections':
          router.push('/collections');
          break;
        case 'collection':
          router.push(`/collections/${encodeURIComponent(route.params.collection)}`);
          break;
        case 'about':
          router.push('/about');
          break;
        case 'contact':
          router.push('/contact');
          break;
        case 'design':
          router.push(`/portfolio/${encodeURIComponent(route.params.id)}`);
          break;
      }
    },
    [router]
  );

  return { route: { name: 'home', pathname, searchParams }, navigate, pathname, searchParams };
}
