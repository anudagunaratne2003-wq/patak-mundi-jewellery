'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { PRODUCTS, type Product } from '@/data/products';
import { useRouter } from '@/router/Router';
import { useStore } from '@/store/StoreContext';
import { Price, StarRating, WishlistButton } from '@/components/ui/Stars';
import { ProductCard } from '@/components/ProductCard';

export function ProductPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const { addToCart, pushToast } = useStore();
  const product = useMemo<Product | undefined>(() => PRODUCTS.find((p) => p.id === id), [id]);

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    setSize(undefined);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [id]);

  const related = useMemo(
    () =>
      product
        ? PRODUCTS.filter(
            (p) => p.id !== product.id && p.category === product.category
          ).slice(0, 4)
        : [],
    [product]
  );

  if (!product) {
    return (
      <div className="container-lux py-32 text-center">
        <h1 className="font-serif text-3xl text-charcoal-800">Piece not found</h1>
        <p className="mt-3 text-charcoal-500">The item you are looking for is no longer available.</p>
        <button
          type="button"
          onClick={() => navigate({ name: 'shop' })}
          className="mt-8 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const hasSizes = (product.sizes?.length ?? 0) > 0;

  const handleAddToCart = () => {
    if (hasSizes && !size) {
      pushToast('Please select a size', 'error');
      return;
    }
    addToCart(product.id, qty, size);
  };

  const handleBuyNow = () => {
    if (hasSizes && !size) {
      pushToast('Please select a size', 'error');
      return;
    }
    addToCart(product.id, qty, size);
    navigate({ name: 'checkout' });
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="container-lux py-5">
        <nav className="flex items-center gap-2 text-xs text-charcoal-400">
          <button onClick={() => navigate({ name: 'home' })} className="hover:text-charcoal-700">
            Home
          </button>
          <ChevronRight size={13} />
          <button
            onClick={() => navigate({ name: 'shop', params: { category: product.category } })}
            className="hover:text-charcoal-700"
          >
            {product.category}
          </button>
          <ChevronRight size={13} />
          <span className="text-charcoal-700">{product.name}</span>
        </nav>
      </div>

      <div className="container-lux pb-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            <div className="flex gap-3 sm:flex-col">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-20 shrink-0 overflow-hidden border-2 transition-colors ${
                    activeImg === i ? 'border-champagne-500' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative flex-1 overflow-hidden bg-ivory-200">
              {loading ? (
                <div className="aspect-square w-full shimmer-bg animate-pulse" />
              ) : (
                <img
                  key={activeImg}
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="aspect-square w-full animate-scale-in object-cover"
                />
              )}
              {product.isNew && (
                <span className="absolute left-4 top-4 bg-charcoal-900 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-ivory-50">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:pl-6">
            <p className="text-xs uppercase tracking-ultra text-champagne-600">
              {product.collection}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal-900">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <StarRating rating={product.rating} size={16} showValue reviewCount={product.reviewCount} />
            </div>
            <div className="mt-5">
              <Price value={product.price} oldPrice={product.oldPrice} className="text-2xl" />
            </div>

            <p className="mt-6 text-base font-light leading-relaxed text-charcoal-600">
              {product.description}
            </p>

            {/* Material & gemstone */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-y border-charcoal-100 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-charcoal-400">Material</p>
                <p className="mt-1 text-sm text-charcoal-800">{product.material}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-charcoal-400">Gemstone</p>
                <p className="mt-1 text-sm text-charcoal-800">
                  {product.gemstone === 'None' ? 'No gemstone' : product.gemstone}
                </p>
              </div>
            </div>

            {/* Sizes */}
            {hasSizes && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-widest text-charcoal-800">
                    {product.category === 'Watches' ? 'Case Size' : 'Size'}
                  </p>
                  <button className="text-xs text-champagne-600 hover:text-champagne-700">
                    Size Guide
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes!.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`min-w-12 border px-4 py-2.5 text-sm transition-colors ${
                        size === s
                          ? 'border-charcoal-900 bg-charcoal-900 text-ivory-50'
                          : 'border-charcoal-200 text-charcoal-700 hover:border-charcoal-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-widest text-charcoal-800">
                Quantity
              </p>
              <div className="mt-3 flex items-center border border-charcoal-200">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-charcoal-600 transition-colors hover:bg-ivory-100"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm font-medium text-charcoal-800">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-charcoal-600 transition-colors hover:bg-ivory-100"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="group flex flex-1 items-center justify-center gap-2 bg-charcoal-900 px-6 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-charcoal-800"
              >
                <ShoppingBag size={16} /> Add to Bag
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex flex-1 items-center justify-center gap-2 bg-champagne-500 px-6 py-4 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-champagne-600"
              >
                <Zap size={16} /> Buy Now
              </button>
              <div className="flex items-center justify-center sm:justify-start">
                <WishlistButton
                  productId={product.id}
                  className="h-14 w-14 border border-charcoal-200 hover:border-champagne-400"
                />
              </div>
            </div>

            {/* Stock */}
            <p className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {product.inStock ? 'In stock — ready to ship' : 'Made to order — 2-3 weeks'}
            </p>

            {/* Shipping info */}
            <div className="mt-8 space-y-4 border-t border-charcoal-100 pt-6">
              {[
                { icon: Truck, title: 'Complimentary Shipping', sub: 'Insured, tracked delivery worldwide' },
                { icon: RotateCcw, title: '30-Day Returns', sub: 'Return unworn pieces in original packaging' },
                { icon: ShieldCheck, title: 'Lifetime Warranty', sub: 'Against manufacturing defects' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon size={20} className="mt-0.5 shrink-0 text-champagne-500" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-medium text-charcoal-800">{title}</p>
                    <p className="text-xs text-charcoal-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="mt-8 border-t border-charcoal-100 pt-6">
              <h3 className="font-serif text-lg text-charcoal-900">The Details</h3>
              <ul className="mt-3 space-y-2">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-charcoal-600">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-champagne-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* You may also like */}
        <div className="mt-24">
          <h2 className="font-serif text-3xl text-charcoal-900">You May Also Like</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
