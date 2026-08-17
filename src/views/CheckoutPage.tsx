'use client';

import { useState } from 'react';
import { Lock, CreditCard, Truck, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useRouter } from '@/router/Router';
import { useStore } from '@/store/StoreContext';

type DeliveryOption = 'standard' | 'express' | 'overnight';

const DELIVERY: { id: DeliveryOption; label: string; sub: string; price: number }[] = [
  { id: 'standard', label: 'Standard', sub: '5-7 business days', price: 0 },
  { id: 'express', label: 'Express', sub: '2-3 business days', price: 35 },
  { id: 'overnight', label: 'Overnight', sub: 'Next business day', price: 75 },
];

export function CheckoutPage() {
  const { navigate } = useRouter();
  const { cart, cartSubtotal, clearCart, pushToast } = useStore();
  const [delivery, setDelivery] = useState<DeliveryOption>('standard');
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const items = cart
    .map((item) => ({
      ...item,
      product: PRODUCTS.find((p) => p.id === item.productId),
    }))
    .filter((i) => i.product);

  const deliveryPrice = DELIVERY.find((d) => d.id === delivery)?.price ?? 0;
  const tax = Math.round(cartSubtotal * 0.08);
  const total = cartSubtotal + deliveryPrice + tax;

  if (items.length === 0 && !placed) {
    return (
      <div className="container-lux py-24 text-center animate-fade-in">
        <h1 className="font-serif text-3xl text-charcoal-900">Your Bag is Empty</h1>
        <p className="mt-3 text-sm text-charcoal-500">
          Add something to your bag before checking out.
        </p>
        <button
          type="button"
          onClick={() => navigate({ name: 'shop' })}
          className="mt-8 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50"
        >
          Shop Now
        </button>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="container-lux py-24 text-center animate-fade-in">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={40} className="text-emerald-600" strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 font-serif text-4xl text-charcoal-900">Order Confirmed</h1>
        <p className="mt-3 max-w-md mx-auto text-sm text-charcoal-500">
          Thank you for your purchase. A confirmation email is on its way to{' '}
          <span className="text-charcoal-800">{form.email || 'your inbox'}</span>. Your order
          number is <span className="font-medium text-charcoal-800">#LJ-{Date.now().toString().slice(-6)}</span>.
        </p>
        <button
          type="button"
          onClick={() => navigate({ name: 'home' })}
          className="mt-8 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setPlaced(true);
    pushToast('Order placed successfully', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass =
    'w-full border border-charcoal-200 bg-white px-4 py-3 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-champagne-400 focus:outline-none';
  const labelClass = 'text-xs font-medium uppercase tracking-widest text-charcoal-600';

  return (
    <div className="container-lux py-12 animate-fade-in">
      <h1 className="font-serif text-4xl text-charcoal-900">Checkout</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-charcoal-500">
        <Lock size={14} className="text-emerald-600" /> Secure checkout — 256-bit encryption
      </p>

      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left: forms */}
        <div className="space-y-10 lg:col-span-2">
          {/* Contact */}
          <section>
            <h2 className="flex items-center gap-3 font-serif text-xl text-charcoal-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-900 text-xs text-ivory-50">1</span>
              Contact Information
            </h2>
            <div className="mt-5">
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@example.com"
                className={`mt-2 ${inputClass}`}
              />
            </div>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="flex items-center gap-3 font-serif text-xl text-charcoal-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-900 text-xs text-ivory-50">2</span>
              Shipping Address
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={`mt-2 ${inputClass}`} />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={`mt-2 ${inputClass}`} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Street Address</label>
                <input required value={form.address} onChange={(e) => set('address', e.target.value)} className={`mt-2 ${inputClass}`} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input required value={form.city} onChange={(e) => set('city', e.target.value)} className={`mt-2 ${inputClass}`} />
              </div>
              <div>
                <label className={labelClass}>Postal Code</label>
                <input required value={form.zip} onChange={(e) => set('zip', e.target.value)} className={`mt-2 ${inputClass}`} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Country</label>
                <select value={form.country} onChange={(e) => set('country', e.target.value)} className={`mt-2 ${inputClass}`}>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>France</option>
                  <option>Germany</option>
                  <option>Italy</option>
                  <option>Japan</option>
                  <option>Australia</option>
                  <option>Canada</option>
                </select>
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="flex items-center gap-3 font-serif text-xl text-charcoal-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-900 text-xs text-ivory-50">3</span>
              Delivery Options
            </h2>
            <div className="mt-5 space-y-3">
              {DELIVERY.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDelivery(d.id)}
                  className={`flex w-full items-center gap-4 border p-4 text-left transition-colors ${
                    delivery === d.id
                      ? 'border-champagne-500 bg-champagne-50/50'
                      : 'border-charcoal-200 hover:border-charcoal-400'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      delivery === d.id ? 'border-champagne-500' : 'border-charcoal-300'
                    }`}
                  >
                    {delivery === d.id && <span className="h-2.5 w-2.5 rounded-full bg-champagne-500" />}
                  </span>
                  <Truck size={20} className="text-charcoal-500" strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal-800">{d.label}</p>
                    <p className="text-xs text-charcoal-400">{d.sub}</p>
                  </div>
                  <span className="text-sm text-charcoal-700">
                    {d.price === 0 ? 'Free' : `$${d.price}`}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="flex items-center gap-3 font-serif text-xl text-charcoal-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-900 text-xs text-ivory-50">4</span>
              Payment Method
            </h2>
            <div className="mt-5 flex items-center gap-2 border border-charcoal-200 bg-ivory-100 p-3 text-xs text-charcoal-500">
              <CreditCard size={16} className="text-champagne-500" />
              This is a demo checkout — no real payment will be processed.
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Name on Card</label>
                <input required value={form.cardName} onChange={(e) => set('cardName', e.target.value)} className={`mt-2 ${inputClass}`} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Card Number</label>
                <input required value={form.cardNumber} onChange={(e) => set('cardNumber', e.target.value)} placeholder="0000 0000 0000 0000" className={`mt-2 ${inputClass}`} />
              </div>
              <div>
                <label className={labelClass}>Expiry Date</label>
                <input required value={form.expiry} onChange={(e) => set('expiry', e.target.value)} placeholder="MM/YY" className={`mt-2 ${inputClass}`} />
              </div>
              <div>
                <label className={labelClass}>CVC</label>
                <input required value={form.cvc} onChange={(e) => set('cvc', e.target.value)} placeholder="123" className={`mt-2 ${inputClass}`} />
              </div>
            </div>
          </section>
        </div>

        {/* Right: order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-ivory-100 p-7">
            <h2 className="font-serif text-2xl text-charcoal-900">Order Summary</h2>

            <div className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                  <div className="relative shrink-0">
                    <img src={item.product!.images[0]} alt={item.product!.name} className="h-16 w-14 object-cover" />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal-900 text-[10px] text-ivory-50">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-sm text-charcoal-800">{item.product!.name}</p>
                    {item.size && <p className="text-xs text-charcoal-400">Size: {item.size}</p>}
                  </div>
                  <p className="text-sm text-charcoal-700">
                    ${(item.product!.price * item.quantity).toLocaleString('en-US')}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-charcoal-200 pt-5 text-sm">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span>${cartSubtotal.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Delivery</span>
                <span>{deliveryPrice === 0 ? 'Free' : `$${deliveryPrice}`}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Estimated Tax</span>
                <span>${tax.toLocaleString('en-US')}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t border-charcoal-200 pt-4">
              <span className="font-serif text-lg text-charcoal-900">Total</span>
              <span className="font-serif text-xl text-charcoal-900">
                ${total.toLocaleString('en-US')}
              </span>
            </div>

            <button
              type="submit"
              className="group mt-6 flex w-full items-center justify-center gap-2 bg-charcoal-900 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
            >
              <Lock size={14} /> Place Order
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-charcoal-400">
              <ShieldCheck size={14} className="text-emerald-600" />
              SSL Encrypted · PCI Compliant
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
