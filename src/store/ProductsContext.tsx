'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { PRODUCTS as STATIC_PRODUCTS, type Product } from '@/data/products';

interface ProductsState {
  products: Product[];
  loading: boolean;
}

const ProductsContext = createContext<ProductsState>({
  products: STATIC_PRODUCTS,
  loading: true,
});

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    images: row.images ?? [],
    material: row.material,
    gemstone: row.gemstone,
    collection: row.collection,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    inStock: row.in_stock,
    sizes: row.sizes ?? undefined,
    description: row.description ?? '',
    details: row.details ?? [],
  };
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (!cancelled) {
        if (!error && data && data.length > 0) {
          setProducts(data.map(rowToProduct));
        }
        // on error or empty table, keep the static fallback already in state
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
