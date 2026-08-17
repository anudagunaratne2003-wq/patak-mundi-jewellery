'use client';

import { ArrowRight, Gem, Sparkles, Hammer, Leaf } from 'lucide-react';
import { useRouter } from '@/router/Router';

export function AboutPage() {
  const { navigate } = useRouter();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/7167035/pexels-photo-7167035.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Artisans crafting jewellery"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/55" />
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="max-w-2xl px-6">
            <p className="text-xs uppercase tracking-ultra text-ivory-200/90">Our Story</p>
            <h1 className="mt-4 font-serif text-4xl text-ivory-50 sm:text-5xl lg:text-6xl">
              Crafted with Intention
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container-lux py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-ultra text-champagne-600">Est. 1984</p>
          <h2 className="mt-4 font-serif text-3xl leading-snug text-charcoal-900 lg:text-4xl">
            Four decades of devotion to the art of fine jewellery.
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-charcoal-600">
            Lumière Jewels was founded on a simple belief: that jewellery should be made to be
            treasured. From a single atelier in Paris, we have grown into a house known for
            uncompromising craftsmanship, ethically sourced materials, and designs that
            transcend the seasonal. Every piece that leaves our workshop is a quiet promise —
            to last, to matter, to shine.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-ivory-100 py-20 lg:py-28">
        <div className="container-lux">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                icon: Hammer,
                title: 'Master Craftsmanship',
                body: 'Each piece is hand-finished by artisans with decades of experience. We never rush the work — a single ring can take weeks.',
              },
              {
                icon: Gem,
                title: 'Ethically Sourced',
                body: 'Every gemstone is conflict-free and traceable to its origin. We work only with suppliers who share our standards.',
              },
              {
                icon: Leaf,
                title: 'Made to Last',
                body: 'We use only solid precious metals and offer a lifetime warranty on every piece of fine jewellery we make.',
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <Icon size={28} className="text-champagne-500" strokeWidth={1.25} />
                </div>
                <h3 className="mt-6 font-serif text-2xl text-charcoal-900">{title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm font-light leading-relaxed text-charcoal-500">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atelier */}
      <section className="container-lux py-20 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/18425415/pexels-photo-18425415.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Jeweller at work"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="lg:pl-8">
            <Sparkles size={28} className="text-champagne-500" strokeWidth={1.25} />
            <h2 className="mt-4 font-serif text-3xl text-charcoal-900 lg:text-4xl">
              Inside the Atelier
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-charcoal-600">
              Our workshop is where tradition meets precision. Sketches become wax models,
              wax models become castings, and castings are refined by hand until every curve
              feels inevitable. Stones are set under microscopes, clasps tested a hundred
              times, and surfaces polished to a mirror finish.
            </p>
            <p className="mt-4 text-base font-light leading-relaxed text-charcoal-600">
              It is slow work. We think that is the point.
            </p>
            <button
              type="button"
              onClick={() => navigate({ name: 'shop' })}
              className="group mt-8 flex items-center gap-2 border border-charcoal-300 px-8 py-4 text-xs font-medium uppercase tracking-widest text-charcoal-800 transition-all hover:border-champagne-400 hover:text-champagne-700"
            >
              Explore Our Pieces
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[380px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/12074236/pexels-photo-12074236.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Model wearing elegant jewellery"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/50" />
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="max-w-xl px-6">
            <h2 className="font-serif text-3xl text-ivory-50 sm:text-4xl">
              Begin Your Own Heirloom
            </h2>
            <button
              type="button"
              onClick={() => navigate({ name: 'shop' })}
              className="mt-7 bg-ivory-50 px-10 py-4 text-xs font-medium uppercase tracking-widest text-charcoal-900 transition-colors hover:bg-champagne-300"
            >
              Shop the Collection
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
