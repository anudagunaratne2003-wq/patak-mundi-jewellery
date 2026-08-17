'use client';

import { useState } from 'react';
import { ArrowRight, Truck, ShieldCheck, Sparkles, Gem } from 'lucide-react';
import { useRouter } from '@/router/Router';
import { useStore } from '@/store/StoreContext';
import {
  CATEGORIES,
  COLLECTIONS,
  PRODUCTS,
  TESTIMONIALS,
} from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { StarRating } from '@/components/ui/Stars';

export function HomePage() {
  const { navigate } = useRouter();
  const { addToCart } = useStore();
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
        <img
          src="https://images.pexels.com/photos/32988651/pexels-photo-32988651.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxury sapphire and diamond necklace"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/70 via-charcoal-900/30 to-transparent" />
        <div className="relative z-10 flex h-full items-center">
          <div className="container-lux">
            <div className="max-w-xl animate-fade-up">
              <p className="text-sm uppercase tracking-ultra text-ivory-200/90">
                The 2026 Collection
              </p>
              <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-ivory-50 sm:text-6xl lg:text-7xl">
                Timeless Beauty,
                <br />
                <span className="italic text-champagne-300">Made to Shine.</span>
              </h1>
              <p className="mt-6 max-w-md text-base font-light leading-relaxed text-ivory-100/90">
                Handcrafted premium jewellery, designed in our atelier and finished by
                master craftsmen. Each piece is made to be treasured for generations.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  type="button"
                  onClick={() => navigate({ name: 'shop' })}
                  className="group flex items-center justify-center gap-2 bg-ivory-50 px-8 py-4 text-xs font-medium uppercase tracking-widest text-charcoal-900 transition-all hover:bg-champagne-300"
                >
                  Shop Collection
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ name: 'new-arrivals' })}
                  className="flex items-center justify-center gap-2 border border-ivory-50/50 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-all hover:border-ivory-50 hover:bg-ivory-50/10"
                >
                  Explore New Arrivals
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-charcoal-100 bg-ivory-100">
        <div className="container-lux grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {[
            { icon: Truck, title: 'Complimentary Shipping', sub: 'On orders over $150' },
            { icon: ShieldCheck, title: 'Lifetime Warranty', sub: 'On all fine jewellery' },
            { icon: Gem, title: 'Ethically Sourced', sub: 'Conflict-free stones' },
            { icon: Sparkles, title: 'Master Craftsmanship', sub: 'Hand-finished in our atelier' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon size={28} className="shrink-0 text-champagne-500" strokeWidth={1.25} />
              <div>
                <p className="text-sm font-medium text-charcoal-800">{title}</p>
                <p className="text-xs text-charcoal-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured categories */}
      <section className="container-lux py-20 lg:py-28">
        <div className="text-center">
          <p className="text-xs uppercase tracking-ultra text-champagne-600">Explore</p>
          <h2 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
            Shop by Category
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => navigate({ name: 'shop', params: { category: cat.name } })}
              className="group relative aspect-[3/4] overflow-hidden bg-ivory-200 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                <h3 className="font-serif text-xl text-ivory-50">{cat.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-ivory-200/80">
                  {cat.tagline}
                </p>
                <span className="mt-3 inline-block text-[11px] uppercase tracking-widest text-champagne-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Shop Now →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-ivory-100 py-20 lg:py-28">
        <div className="container-lux">
          <div className="flex flex-col items-center text-center">
            <p className="text-xs uppercase tracking-ultra text-champagne-600">
              Most Loved
            </p>
            <h2 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
              Best Sellers
            </h2>
            <p className="mt-4 max-w-lg text-sm font-light text-charcoal-500">
              The pieces our clients return for, again and again.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-lux py-20 lg:py-28">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-ultra text-champagne-600">Just Arrived</p>
            <h2 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
              New Arrivals
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate({ name: 'new-arrivals' })}
            className="group hidden items-center gap-2 text-xs font-medium uppercase tracking-widest text-charcoal-700 transition-colors hover:text-champagne-600 sm:flex"
          >
            View All
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* About the brand */}
      <section className="bg-charcoal-900 py-20 text-ivory-100 lg:py-28">
        <div className="container-lux grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/7167020/pexels-photo-7167020.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Artisan crafting jewellery"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute -bottom-6 -right-6 hidden bg-champagne-500 p-8 sm:block">
              <p className="font-serif text-4xl text-white">40+</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-ivory-100">
                Years of Craft
              </p>
            </div>
          </div>
          <div className="lg:pl-8">
            <p className="text-xs uppercase tracking-ultra text-champagne-400">Our Heritage</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ivory-50 lg:text-5xl">
              The Art of Fine Jewellery
            </h2>
            <p className="mt-6 text-base font-light leading-relaxed text-ivory-200/80">
              For over four decades, Lumière Jewels has been creating heirloom-quality
              pieces from our atelier. Every design begins with a sketch and ends in the
              hands of a master craftsman who devotes days — sometimes weeks — to a single
              piece.
            </p>
            <p className="mt-4 text-base font-light leading-relaxed text-ivory-200/80">
              We source only ethically mined gemstones and the finest precious metals,
              because true luxury leaves nothing to chance.
            </p>
            <button
              type="button"
              onClick={() => navigate({ name: 'about' })}
              className="group mt-8 flex items-center gap-2 border border-ivory-50/40 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-all hover:border-champagne-400 hover:bg-champagne-500 hover:text-charcoal-900"
            >
              Discover Our Story
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Promotional banner */}
      <section className="relative h-[420px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3641059/pexels-photo-3641059.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Rose gold bridal jewellery"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/55" />
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="max-w-2xl px-6">
            <Sparkles size={32} className="mx-auto text-champagne-300" />
            <h2 className="mt-5 font-serif text-3xl text-ivory-50 sm:text-4xl lg:text-5xl">
              Complimentary Shipping on Orders Over $150
            </h2>
            <p className="mt-4 text-sm font-light text-ivory-100/80">
              Every order arrives in signature packaging, ready to be gifted or treasured.
            </p>
            <button
              type="button"
              onClick={() => navigate({ name: 'shop' })}
              className="mt-8 bg-champagne-500 px-10 py-4 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-champagne-600"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Collections preview */}
      <section className="container-lux py-20 lg:py-28">
        <div className="text-center">
          <p className="text-xs uppercase tracking-ultra text-champagne-600">Curated Edits</p>
          <h2 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
            Our Collections
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => navigate({ name: 'collection', params: { collection: c.name } })}
              className="group relative aspect-[16/10] overflow-hidden bg-ivory-200 animate-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                <h3 className="font-serif text-2xl text-ivory-50">{c.name}</h3>
                <p className="mt-2 max-w-xs text-sm font-light text-ivory-100/80">
                  {c.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-champagne-300">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ivory-100 py-20 lg:py-28">
        <div className="container-lux">
          <div className="text-center">
            <p className="text-xs uppercase tracking-ultra text-champagne-600">
              Kind Words
            </p>
            <h2 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
              Loved by Our Clients
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="flex flex-col bg-white p-7 shadow-sm animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <StarRating rating={t.rating} size={16} />
                <p className="mt-4 flex-1 font-serif text-lg italic leading-relaxed text-charcoal-700">
                  "{t.text}"
                </p>
                <div className="mt-6 border-t border-charcoal-100 pt-4">
                  <p className="text-sm font-medium text-charcoal-800">{t.name}</p>
                  <p className="text-xs text-charcoal-400">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-lux py-20 lg:py-24">
        <div className="border border-charcoal-100 bg-ivory-100 px-8 py-16 text-center lg:px-16">
          <Gem size={32} className="mx-auto text-champagne-500" strokeWidth={1} />
          <h2 className="mt-5 font-serif text-3xl text-charcoal-900 sm:text-4xl">
            Be the First to Shine
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm font-light text-charcoal-500">
            Subscribe for early access to new arrivals, private events, and a complimentary
            jewellery care guide.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

function NewsletterForm() {
  const { pushToast } = useStore();
  const [email, setEmail] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim()) return;
        pushToast('Thank you for subscribing', 'success');
        setEmail('');
      }}
      className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 border border-charcoal-200 bg-white px-5 py-3.5 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-champagne-400 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-charcoal-900 px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
      >
        Subscribe
      </button>
    </form>
  );
}
