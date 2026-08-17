'use client';

import { useState } from 'react';
import { User, Package, Heart, LogOut, MapPin, CreditCard } from 'lucide-react';
import { useRouter } from '@/router/Router';
import { useStore } from '@/store/StoreContext';

export function AccountPage() {
  const { navigate } = useRouter();
  const { pushToast, wishlist } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="container-lux py-16 animate-fade-in">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ivory-100">
            <User size={28} className="text-champagne-500" strokeWidth={1.25} />
          </div>
          <h1 className="mt-5 font-serif text-3xl text-charcoal-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-sm text-charcoal-500">
            {mode === 'login'
              ? 'Sign in to access your orders and wishlist.'
              : 'Join Lumière for a personalised experience.'}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            pushToast('This is a demo account portal', 'info');
          }}
          className="mt-8 space-y-4"
        >
          {mode === 'register' && (
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-charcoal-600">Full Name</label>
              <input className="mt-2 w-full border border-charcoal-200 bg-white px-4 py-3 text-sm focus:border-champagne-400 focus:outline-none" />
            </div>
          )}
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-charcoal-600">Email</label>
            <input type="email" className="mt-2 w-full border border-charcoal-200 bg-white px-4 py-3 text-sm focus:border-champagne-400 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-charcoal-600">Password</label>
            <input type="password" className="mt-2 w-full border border-charcoal-200 bg-white px-4 py-3 text-sm focus:border-champagne-400 focus:outline-none" />
          </div>
          <button
            type="submit"
            className="w-full bg-charcoal-900 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-charcoal-500">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-champagne-600 transition-colors hover:text-champagne-700"
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-10 border-t border-charcoal-100 pt-8">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate({ name: 'wishlist' })}
              className="flex items-center gap-2 border border-charcoal-200 p-4 text-sm text-charcoal-700 transition-colors hover:border-champagne-400"
            >
              <Heart size={18} className="text-champagne-500" /> Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => pushToast('No orders yet', 'info')}
              className="flex items-center gap-2 border border-charcoal-200 p-4 text-sm text-charcoal-700 transition-colors hover:border-champagne-400"
            >
              <Package size={18} className="text-champagne-500" /> Orders
            </button>
            <button
              onClick={() => pushToast('No saved addresses', 'info')}
              className="flex items-center gap-2 border border-charcoal-200 p-4 text-sm text-charcoal-700 transition-colors hover:border-champagne-400"
            >
              <MapPin size={18} className="text-champagne-500" /> Addresses
            </button>
            <button
              onClick={() => pushToast('No saved cards', 'info')}
              className="flex items-center gap-2 border border-charcoal-200 p-4 text-sm text-charcoal-700 transition-colors hover:border-champagne-400"
            >
              <CreditCard size={18} className="text-champagne-500" /> Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
