'use client';

import { useEffect, useState } from 'react';
import { User, Package, Heart, LogOut, MapPin, CreditCard } from 'lucide-react';
import { useRouter } from '@/router/Router';
import { useStore } from '@/store/StoreContext';
import { useAuth } from '@/store/AuthContext';
import { supabase } from '@/lib/supabase';

interface OrderRow {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

export function AccountPage() {
  const { navigate } = useRouter();
  const { pushToast, wishlist } = useStore();
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    supabase
      .from('orders')
      .select('id, total, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setOrdersLoading(false);
      });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result =
      mode === 'login'
        ? await signIn(form.email, form.password)
        : await signUp(form.email, form.password, form.fullName);
    setSubmitting(false);

    if (result.error) {
      pushToast(result.error, 'error');
      return;
    }
    if (mode === 'register') {
      pushToast('Account created — check your email to confirm, then sign in.', 'success');
      setMode('login');
    } else {
      pushToast('Welcome back', 'success');
    }
  };

  if (loading) {
    return <div className="container-lux py-24 text-center text-sm text-charcoal-400">Loading…</div>;
  }

  if (user) {
    return (
      <div className="container-lux py-16 animate-fade-in">
        <div className="mx-auto max-w-lg">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ivory-100">
              <User size={28} className="text-champagne-500" strokeWidth={1.25} />
            </div>
            <h1 className="mt-5 font-serif text-3xl text-charcoal-900">
              {user.user_metadata?.full_name || user.email}
            </h1>
            <p className="mt-2 text-sm text-charcoal-500">{user.email}</p>
          </div>

          <div className="mt-10 border-t border-charcoal-100 pt-8">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate({ name: 'wishlist' })}
                className="flex items-center gap-2 border border-charcoal-200 p-4 text-sm text-charcoal-700 transition-colors hover:border-champagne-400"
              >
                <Heart size={18} className="text-champagne-500" /> Wishlist ({wishlist.length})
              </button>
              <button
                onClick={() => pushToast('Saved addresses coming soon', 'info')}
                className="flex items-center gap-2 border border-charcoal-200 p-4 text-sm text-charcoal-700 transition-colors hover:border-champagne-400"
              >
                <MapPin size={18} className="text-champagne-500" /> Addresses
              </button>
              <button
                onClick={() => pushToast('Saved cards coming soon', 'info')}
                className="flex items-center gap-2 border border-charcoal-200 p-4 text-sm text-charcoal-700 transition-colors hover:border-champagne-400"
              >
                <CreditCard size={18} className="text-champagne-500" /> Payment
              </button>
              <button
                onClick={async () => {
                  await signOut();
                  pushToast('Signed out', 'info');
                }}
                className="flex items-center gap-2 border border-charcoal-200 p-4 text-sm text-charcoal-700 transition-colors hover:border-champagne-400"
              >
                <LogOut size={18} className="text-champagne-500" /> Sign Out
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-charcoal-100 pt-8">
            <h2 className="flex items-center gap-2 font-serif text-xl text-charcoal-900">
              <Package size={18} className="text-champagne-500" /> Order History
            </h2>
            {ordersLoading ? (
              <p className="mt-4 text-sm text-charcoal-400">Loading orders…</p>
            ) : orders.length === 0 ? (
              <p className="mt-4 text-sm text-charcoal-400">No orders yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between border border-charcoal-200 p-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-charcoal-800">#{o.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-charcoal-400">
                        {new Date(o.created_at).toLocaleDateString()} · {o.status}
                      </p>
                    </div>
                    <p className="text-charcoal-700">${Number(o.total).toLocaleString('en-US')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-charcoal-600">Full Name</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="mt-2 w-full border border-charcoal-200 bg-white px-4 py-3 text-sm focus:border-champagne-400 focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-charcoal-600">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full border border-charcoal-200 bg-white px-4 py-3 text-sm focus:border-champagne-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-charcoal-600">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-2 w-full border border-charcoal-200 bg-white px-4 py-3 text-sm focus:border-champagne-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-charcoal-900 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500 disabled:opacity-60"
          >
            {submitting ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
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

        <div className="mt-10 border-t border-charcoal-100 pt-8">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate({ name: 'wishlist' })}
              className="flex items-center gap-2 border border-charcoal-200 p-4 text-sm text-charcoal-700 transition-colors hover:border-champagne-400"
            >
              <Heart size={18} className="text-champagne-500" /> Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => pushToast('Sign in to view orders', 'info')}
              className="flex items-center gap-2 border border-charcoal-200 p-4 text-sm text-charcoal-700 transition-colors hover:border-champagne-400"
            >
              <Package size={18} className="text-champagne-500" /> Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
