'use client';

import { Heart, ShoppingBag } from 'lucide-react';
import { useRouter } from '@/router/Router';
import { useStore } from '@/store/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/store/ProductsContext';

export function WishlistPage() {
  const { navigate } = useRouter();
  const { wishlist } = useStore();
  const { products: PRODUCTS } = useProducts();
  const products = PRODUCTS.filter((p) => wishlist.includes(p.id));

  if (products.length === 0) {
    return (
      <div className="container-lux py-24 text-center animate-fade-in">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ivory-200">
          <Heart size={32} className="text-charcoal-400" strokeWidth={1} />
        </div>
        <h1 className="mt-6 font-serif text-3xl text-charcoal-900">Your Wishlist is Empty</h1>
        <p className="mt-3 text-sm text-charcoal-500">
          Tap the heart on any piece to save it here for later.
        </p>
        <button
          type="button"
          onClick={() => navigate({ name: 'shop' })}
          className="mt-8 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
        >
          <ShoppingBag size={15} className="mr-2 inline" />
          Explore Jewellery
        </button>
      </div>
    );
  }

  return (
    <div className="container-lux py-12 animate-fade-in">
      <h1 className="font-serif text-4xl text-charcoal-900">Your Wishlist</h1>
      <p className="mt-2 text-sm text-charcoal-500">
        {products.length} saved piece{products.length === 1 ? '' : 's'}
      </p>
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
