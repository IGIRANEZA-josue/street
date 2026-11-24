"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import ProductVisual from "./ProductVisual";
import { useCart } from "@/store/cart";

export default function QuickAddModal() {
  const { quickAddProduct: product, setQuickAdd, add } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (product) {
      setSize(product.sizes.length === 1 ? product.sizes[0] : null);
      setQty(1);
      setError("");
      setImageIndex(0);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    document.body.classList.add("is-locked");
    closeRef.current?.focus({ preventScroll: true });
    const fn = (event: KeyboardEvent) => event.key === "Escape" && setQuickAdd(null);
    window.addEventListener("keydown", fn);
    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", fn);
    };
  }, [product, setQuickAdd]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-end sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Quick add ${product.name}`}>
      <div className="animate-fade absolute inset-0 bg-black/30" onClick={() => setQuickAdd(null)} role="presentation" />
      <div className="animate-pop relative grid max-h-[92dvh] w-full max-w-3xl overflow-y-auto overscroll-contain bg-white shadow-2xl sm:max-h-[90vh] sm:grid-cols-2">
        <div className="relative h-40 w-full shrink-0 sm:h-auto sm:min-h-[520px]">
          <ProductVisual product={product} imageIndex={imageIndex} />
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${imageIndex === index ? "w-5 bg-black" : "w-1.5 bg-neutral-300 hover:bg-neutral-500"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative flex min-w-0 flex-col p-5 pb-6 sm:p-9">
          <button
            ref={closeRef}
            onClick={() => setQuickAdd(null)}
            className="absolute right-2 top-2 grid h-11 w-11 place-items-center text-neutral-800 transition hover:text-neutral-400 sm:right-4 sm:top-4"
            aria-label="Close quick add"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <p className="pr-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-800">{product.sku}</p>
          <h3 className="mt-2 pr-10 text-lg font-semibold uppercase leading-tight tracking-[0.04em] sm:text-xl">{product.name}</h3>
          <p className="mt-2 text-sm font-light leading-relaxed text-neutral-500">{product.description}</p>
          <p className="mt-4 text-sm text-neutral-900">{formatPrice(product.priceCents)}</p>

          <div className="mt-6 sm:mt-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500">
              Select size {error && <span className="text-red-700">— {error}</span>}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {product.sizes.map((itemSize) => (
                <button
                  key={itemSize}
                  onClick={() => {
                    setSize(itemSize);
                    setError("");
                  }}
                  aria-pressed={size === itemSize}
                  className={`min-h-[44px] px-2 py-3 text-[11px] font-medium uppercase tracking-[0.12em] transition ${size === itemSize ? "bg-black text-white" : "border border-neutral-200 bg-white hover:border-black"}`}
                >
                  {itemSize}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:mt-7 sm:flex-row">
            <div className="flex items-center justify-between border border-neutral-300 sm:justify-start">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-11 w-11 place-items-center transition hover:text-neutral-400" aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(9, qty + 1))} className="grid h-11 w-11 place-items-center transition hover:text-neutral-400" aria-label="Increase quantity">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => {
                if (!size) {
                  setError("required");
                  return;
                }
                add(product, size, "As shown", qty);
                setQuickAdd(null);
              }}
              className="flex min-h-[52px] flex-1 items-center justify-center gap-2 bg-black px-3 py-3.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 sm:text-[11px] sm:tracking-[0.2em]"
            >
              <ShoppingBag size={15} className="shrink-0" />
              <span className="text-center leading-tight">Add to bag — {formatPrice(product.priceCents * qty)}</span>
            </button>
          </div>

          <Link href={`/product/${product.slug}`} onClick={() => setQuickAdd(null)} className="mt-5 min-h-[44px] py-2 text-center text-[10px] uppercase tracking-[0.2em] text-neutral-500 underline underline-offset-4 transition hover:text-black">
            View product
          </Link>
          <p className="mt-5 border-t border-neutral-100 pt-4 text-[11px] font-light leading-relaxed text-neutral-500 sm:mt-7">
            Shipping and taxes calculated at checkout. All sales are final — please review size and order details carefully.
          </p>
        </div>
      </div>
    </div>
  );
}
