'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { PRODUCTS, type Product } from '@/data/products';

interface ProductsState {
  products: Product[];
  loading: boolean;
}

// The portfolio is curated by hand in src/data/products.ts — that file is the
// single source of truth for the pieces shown on the site.
const ProductsContext = createContext<ProductsState>({
  products: PRODUCTS,
  loading: false,
});

export function ProductsProvider({ children }: { children: ReactNode }) {
  return (
    <ProductsContext.Provider value={{ products: PRODUCTS, loading: false }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
