"use client";

import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/store/cart";

export default function CartDrawer() {
  const { items, isOpen, setOpen, subtotal, setQty, remove, count } = useCart();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="animate-fade absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <aside className="animate-drawer absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl" aria-label="Shopping bag">
        <div className="flex h-20 items-center justify-between border-b border-neutral-100 px-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em]">Your Cart ({count})</h2>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close bag" className="p-1 transition hover:text-neutral-400">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag size={38} strokeWidth={1} className="text-neutral-300" />
              <p className="mt-5 text-sm font-medium uppercase tracking-[0.2em]">Your cart is empty</p>
              <p className="mt-2 max-w-[240px] text-sm font-light leading-relaxed text-neutral-500">Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="mt-7 bg-black px-7 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800">
                Continue shopping
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-white">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="grid h-full place-items-center px-1 text-center text-[10px] font-medium uppercase">{item.printLines[0]}</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-800">{item.sku}</p>
                        <p className="mt-1 text-xs font-normal uppercase tracking-[0.06em] text-neutral-600">{item.name}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-neutral-400">Size {item.size}</p>
                      </div>
                      <p className="text-xs font-medium">{formatPrice(item.priceCents * item.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-neutral-200">
                        <button onClick={() => setQty(item.key, item.qty - 1)} className="px-2.5 py-1.5 transition hover:text-neutral-400" aria-label="Decrease quantity">
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-medium">{item.qty}</span>
                        <button onClick={() => setQty(item.key, item.qty + 1)} className="px-2.5 py-1.5 transition hover:text-neutral-400" aria-label="Increase quantity">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => remove(item.key)} className="text-[10px] font-medium uppercase tracking-[0.14em] text-red-700 transition hover:text-red-900">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 px-6 py-5">
            <div className="flex justify-between text-sm font-semibold">
              <span className="uppercase tracking-[0.16em]">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-center text-[10px] font-light uppercase tracking-[0.14em] text-neutral-500">Shipping and taxes calculated at checkout</p>
            <Link href="/checkout" onClick={() => setOpen(false)} className="mt-5 block w-full bg-black py-4 text-center text-[11px] font-medium uppercase tracking-[0.24em] text-white transition hover:bg-neutral-800">
              Checkout
            </Link>
            <button onClick={() => setOpen(false)} className="mt-3 w-full py-1 text-center text-[10px] uppercase tracking-[0.2em] text-neutral-500 underline underline-offset-4 transition hover:text-black">
              Continue shopping
            </button>
            <p className="mt-3 text-center text-[9px] uppercase leading-relaxed tracking-[0.16em] text-neutral-400">All sales final. Please review your order carefully.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
