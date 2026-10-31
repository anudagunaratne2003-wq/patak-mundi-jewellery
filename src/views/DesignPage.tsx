'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sparkles, PenTool, Hammer, Gem, ChevronRight, MessageCircle } from 'lucide-react';
import { type Product } from '@/data/products';
import { useRouter } from '@/router/Router';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/store/ProductsContext';
import { openDesignChat } from '@/lib/designChat';

/** Detail view of one past commission from the portfolio. */
export function DesignPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const { products: PRODUCTS } = useProducts();
  const product = useMemo<Product | undefined>(() => PRODUCTS.find((p) => p.id === id), [id, PRODUCTS]);

  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setActiveImg(0);
  }, [id]);

  const related = useMemo(
    () =>
      product
        ? PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
        : [],
    [product, PRODUCTS]
  );

  if (!product) {
    return (
      <div className="container-lux py-32 text-center">
        <h1 className="font-serif text-3xl text-charcoal-800">Design not found</h1>
        <p className="mt-3 text-charcoal-500">This piece is no longer in our portfolio.</p>
        <button
          type="button"
          onClick={() => navigate({ name: 'portfolio' })}
          className="mt-8 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50"
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

  const handleDesignSimilar = () => {
    openDesignChat(
      `I love the "${product.name}" from your portfolio. Could we design something in a similar spirit, made for me?`
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="container-lux py-5">
        <nav className="flex items-center gap-2 text-xs text-charcoal-400">
          <button onClick={() => navigate({ name: 'portfolio' })} className="hover:text-charcoal-700">
            Portfolio
          </button>
          <ChevronRight size={13} />
          <button
            onClick={() => navigate({ name: 'portfolio', params: { category: product.category } })}
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
              <img
                key={activeImg}
                src={product.images[activeImg]}
                alt={product.name}
                className="aspect-square w-full animate-scale-in object-cover"
              />
              <span className="absolute left-4 top-4 bg-ivory-50/90 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-charcoal-800 backdrop-blur">
                One of One
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="lg:pl-6">
            <p className="text-xs uppercase tracking-ultra text-champagne-600">
              {product.collection ? `${product.collection} Collection` : 'Bespoke Commission'}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal-900">
              {product.name}
            </h1>

            <p className="mt-6 text-base font-light leading-relaxed text-charcoal-600">
              {product.description}
            </p>

            {/* Material & gemstone */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-y border-charcoal-100 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-charcoal-400">Material</p>
                <p className="mt-1 text-sm text-charcoal-800">{product.material ?? '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-charcoal-400">Gemstone</p>
                <p className="mt-1 text-sm text-charcoal-800">
                  {product.gemstone ?? 'No gemstone'}
                </p>
              </div>
            </div>

            {/* Details */}
            {product.details && product.details.length > 0 && (
            <div className="mt-6">
              <h3 className="font-serif text-lg text-charcoal-900">Design Notes</h3>
              <ul className="mt-3 space-y-2">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-charcoal-600">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-champagne-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            )}

            {/* Made-for-one notice + CTA */}
            <div className="mt-8 bg-ivory-100 p-6">
              <p className="text-sm font-light leading-relaxed text-charcoal-600">
                This piece was designed for a single client and isn't available to buy. If it speaks
                to you, our designer can create something in the same spirit — shaped around your
                story, your stones, and your size.
              </p>
              <button
                type="button"
                onClick={handleDesignSimilar}
                className="mt-5 flex w-full items-center justify-center gap-2 bg-charcoal-900 px-6 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
              >
                <MessageCircle size={16} /> Chat With the Designer
              </button>
            </div>

            {/* How a commission works */}
            <div className="mt-8 space-y-4 border-t border-charcoal-100 pt-6">
              {[
                { icon: Sparkles, title: 'Consultation', sub: 'Share your idea, references, and budget in the chat' },
                { icon: PenTool, title: 'Sketch & Refine', sub: 'We send sketches and renders until it feels right' },
                { icon: Gem, title: 'Stone Selection', sub: 'Choose from hand-picked, ethically sourced stones' },
                { icon: Hammer, title: 'Handcrafted', sub: 'Made once, by hand, in our atelier' },
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
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-3xl text-charcoal-900">More From the Portfolio</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
