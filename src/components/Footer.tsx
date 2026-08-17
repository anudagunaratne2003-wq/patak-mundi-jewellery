'use client';

import { useState } from 'react';
import { Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';
import { useRouter, type Route } from '@/router/Router';
import { useStore } from '@/store/StoreContext';

const SHOP_LINKS: { label: string; route: Route }[] = [
  { label: 'All Jewellery', route: { name: 'shop' } },
  { label: 'New Arrivals', route: { name: 'new-arrivals' } },
  { label: 'Rings', route: { name: 'shop', params: { category: 'Rings' } } },
  { label: 'Necklaces', route: { name: 'shop', params: { category: 'Necklaces' } } },
  { label: 'Earrings', route: { name: 'shop', params: { category: 'Earrings' } } },
  { label: 'Bracelets', route: { name: 'shop', params: { category: 'Bracelets' } } },
  { label: 'Watches', route: { name: 'shop', params: { category: 'Watches' } } },
];

const SERVICE_LINKS: { label: string; route: Route }[] = [
  { label: 'Shipping & Returns', route: { name: 'contact' } },
  { label: 'Ring Size Guide', route: { name: 'contact' } },
  { label: 'Care & Maintenance', route: { name: 'contact' } },
  { label: 'Contact Us', route: { name: 'contact' } },
  { label: 'FAQ', route: { name: 'contact' } },
];

const ABOUT_LINKS: { label: string; route: Route }[] = [
  { label: 'Our Story', route: { name: 'about' } },
  { label: 'Craftsmanship', route: { name: 'about' } },
  { label: 'Collections', route: { name: 'collections' } },
  { label: 'Sustainability', route: { name: 'about' } },
  { label: 'Press', route: { name: 'about' } },
];

export function Footer() {
  const { navigate } = useRouter();
  const { pushToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    pushToast('Thank you for subscribing', 'success');
    setEmail('');
  };

  return (
    <footer className="mt-24 bg-charcoal-900 text-ivory-100">
      <div className="container-lux py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:pr-6">
            <h3 className="font-serif text-2xl tracking-widest text-ivory-50">LUMIÈRE</h3>
            <p className="mt-1 text-[11px] tracking-widest text-champagne-400">JEWELS</p>
            <p className="mt-5 text-sm font-light leading-relaxed text-ivory-200/80">
              Handcrafted premium jewellery, made to shine for a lifetime. Each piece is
              designed in our atelier and finished by master craftsmen.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#/"
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200/20 text-ivory-200 transition-all hover:border-champagne-400 hover:bg-champagne-500 hover:text-charcoal-900"
                  aria-label="Social media"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif text-lg text-champagne-300">Shop</h4>
            <ul className="mt-5 space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => navigate(link.route)}
                    className="text-sm font-light text-ivory-200/80 transition-colors hover:text-champagne-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-serif text-lg text-champagne-300">Customer Service</h4>
            <ul className="mt-5 space-y-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => navigate(link.route)}
                    className="text-sm font-light text-ivory-200/80 transition-colors hover:text-champagne-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* About + Newsletter */}
          <div>
            <h4 className="font-serif text-lg text-champagne-300">About</h4>
            <ul className="mt-5 space-y-3">
              {ABOUT_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => navigate(link.route)}
                    className="text-sm font-light text-ivory-200/80 transition-colors hover:text-champagne-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14 border-t border-ivory-200/10 pt-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h4 className="font-serif text-2xl text-ivory-50">Be the First to Shine</h4>
              <p className="mt-2 text-sm font-light text-ivory-200/70">
                Join our list for early access to new arrivals and private events.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 border border-ivory-200/20 bg-transparent px-4 py-3 text-sm text-ivory-50 placeholder:text-ivory-200/40 focus:border-champagne-400 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-champagne-500 px-6 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-champagne-600"
              >
                Subscribe <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ivory-200/10 pt-8 text-xs text-ivory-200/50 md:flex-row">
          <p>© {new Date().getFullYear()} Lumière Jewels. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <button className="transition-colors hover:text-champagne-300">Privacy Policy</button>
            <button className="transition-colors hover:text-champagne-300">Terms &amp; Conditions</button>
            <button className="transition-colors hover:text-champagne-300">Shipping &amp; Returns</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
