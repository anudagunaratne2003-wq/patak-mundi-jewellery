'use client';

import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useRouter } from '@/router/Router';
import { useStore } from '@/store/StoreContext';
import { useProducts } from '@/store/ProductsContext';

export function CartPage() {
  const { navigate } = useRouter();
  const { cart, removeFromCart, updateQuantity, cartSubtotal } = useStore();
  const { products: PRODUCTS } = useProducts();

  const items = cart
    .map((item) => ({
      ...item,
      product: PRODUCTS.find((p) => p.id === item.productId),
    }))
    .filter((i) => i.product);

  const shipping = cartSubtotal >= 150 || cartSubtotal === 0 ? 0 : 25;
  const total = cartSubtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-lux py-24 text-center animate-fade-in">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ivory-200">
          <ShoppingBag size={32} className="text-charcoal-400" strokeWidth={1} />
        </div>
        <h1 className="mt-6 font-serif text-3xl text-charcoal-900">Your Bag is Empty</h1>
        <p className="mt-3 text-sm text-charcoal-500">
          Discover our collection and find something to treasure.
        </p>
        <button
          type="button"
          onClick={() => navigate({ name: 'shop' })}
          className="mt-8 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container-lux py-12 animate-fade-in">
      <h1 className="font-serif text-4xl text-charcoal-900">Shopping Bag</h1>
      <p className="mt-2 text-sm text-charcoal-500">
        {items.length} item{items.length === 1 ? '' : 's'} in your bag
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-charcoal-100 border-y border-charcoal-100">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-4 py-6">
                <button
                  type="button"
                  onClick={() => navigate({ name: 'product', params: { id: item.productId } })}
                  className="shrink-0"
                >
                  <img
                    src={item.product!.images[0]}
                    alt={item.product!.name}
                    className="h-28 w-24 object-cover"
                  />
                </button>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-champagne-600">
                        {item.product!.category}
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate({ name: 'product', params: { id: item.productId } })}
                        className="mt-1 text-left font-serif text-lg text-charcoal-800 hover:text-champagne-700"
                      >
                        {item.product!.name}
                      </button>
                      {item.size && (
                        <p className="mt-1 text-xs text-charcoal-400">Size: {item.size}</p>
                      )}
                      <p className="mt-1 text-xs text-charcoal-400">
                        {item.product!.material}
                      </p>
                    </div>
                    <p className="font-serif text-lg text-charcoal-800">
                      ${(item.product!.price * item.quantity).toLocaleString('en-US')}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border border-charcoal-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                        className="flex h-8 w-8 items-center justify-center text-charcoal-600 hover:bg-ivory-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                        className="flex h-8 w-8 items-center justify-center text-charcoal-600 hover:bg-ivory-100"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="flex items-center gap-1.5 text-xs text-charcoal-400 transition-colors hover:text-red-600"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate({ name: 'shop' })}
            className="mt-6 text-sm text-charcoal-600 transition-colors hover:text-champagne-600"
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-ivory-100 p-7">
            <h2 className="font-serif text-2xl text-charcoal-900">Order Summary</h2>

            {shipping === 0 ? (
              <div className="mt-4 flex items-center gap-2 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                <Truck size={16} />
                You qualify for complimentary shipping!
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 bg-champagne-50 px-4 py-3 text-xs text-champagne-700">
                <Truck size={16} />
                Add ${(150 - cartSubtotal).toLocaleString('en-US')} more for free shipping
              </div>
            )}

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span className="text-charcoal-900">${cartSubtotal.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Shipping</span>
                <span className="text-charcoal-900">
                  {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Estimated Tax</span>
                <span className="text-charcoal-400">Calculated at checkout</span>
              </div>
            </div>

            <div className="mt-5 flex justify-between border-t border-charcoal-200 pt-5">
              <span className="font-serif text-lg text-charcoal-900">Total</span>
              <span className="font-serif text-xl text-charcoal-900">
                ${total.toLocaleString('en-US')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate({ name: 'checkout' })}
              className="group mt-6 flex w-full items-center justify-center gap-2 bg-charcoal-900 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
            >
              Proceed to Checkout
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <p className="mt-4 text-center text-[11px] text-charcoal-400">
              Secure checkout — your payment information is encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
