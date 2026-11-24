"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/store/cart";

export default function CartDrawer() {
  const { items, isOpen, setOpen, subtotal, setQty, remove, count } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  // The drawer is full-screen on phones, so lock the page behind it and let
  // Escape close it — same behaviour as the mobile menu.
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("is-locked");
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div className="animate-fade absolute inset-0 bg-black/30" onClick={() => setOpen(false)} role="presentation" />
      <aside className="animate-drawer absolute inset-y-0 right-0 flex w-full flex-col bg-white pt-[env(safe-area-inset-top)] shadow-2xl sm:max-w-md">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-100 px-4 sm:h-20 sm:px-6">
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] sm:text-sm sm:tracking-[0.22em]">
              Your Cart ({count})
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={() => setOpen(false)}
            aria-label="Close bag"
            className="-mr-1 grid h-11 w-11 place-items-center transition hover:text-neutral-400"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <ShoppingBag size={38} strokeWidth={1} className="text-neutral-300" />
              <p className="mt-5 text-sm font-medium uppercase tracking-[0.2em]">Your cart is empty</p>
              <p className="mt-2 max-w-[240px] text-sm font-light leading-relaxed text-neutral-500">Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="mt-7 inline-flex min-h-[48px] items-center bg-black px-7 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800">
                Continue shopping
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 py-5 sm:gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-white">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="grid h-full place-items-center px-1 text-center text-[10px] font-medium uppercase">{item.printLines[0]}</span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-800">{item.sku}</p>
                        <p className="mt-1 text-xs font-normal uppercase tracking-[0.06em] text-neutral-600">{item.name}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-neutral-400">Size {item.size}</p>
                      </div>
                      <p className="shrink-0 text-xs font-medium">{formatPrice(item.priceCents * item.qty)}</p>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                      <div className="flex items-center border border-neutral-200">
                        <button onClick={() => setQty(item.key, item.qty - 1)} className="grid h-11 w-11 place-items-center transition hover:text-neutral-400" aria-label="Decrease quantity">
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-xs font-medium">{item.qty}</span>
                        <button onClick={() => setQty(item.key, item.qty + 1)} className="grid h-11 w-11 place-items-center transition hover:text-neutral-400" aria-label="Increase quantity">
                          <Plus size={13} />
                        </button>
                      </div>
                      <button onClick={() => remove(item.key)} className="min-h-[40px] px-1 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-red-700 transition hover:text-red-900">
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
          <div className="shrink-0 border-t border-neutral-200 px-4 py-4 sm:px-6 sm:py-5 safe-b">
            <div className="flex justify-between text-sm font-semibold">
              <span className="uppercase tracking-[0.16em]">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-center text-[10px] font-light uppercase tracking-[0.14em] text-neutral-500">Shipping and taxes calculated at checkout</p>
            <Link href="/checkout" onClick={() => setOpen(false)} className="mt-4 flex min-h-[52px] w-full items-center justify-center bg-black text-center text-[11px] font-medium uppercase tracking-[0.24em] text-white transition hover:bg-neutral-800">
              Checkout
            </Link>
            <button onClick={() => setOpen(false)} className="mt-2 min-h-[44px] w-full text-center text-[10px] uppercase tracking-[0.2em] text-neutral-500 underline underline-offset-4 transition hover:text-black">
              Continue shopping
            </button>
            <p className="mt-1 text-center text-[9px] uppercase leading-relaxed tracking-[0.16em] text-neutral-400">All sales final. Please review your order carefully.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
