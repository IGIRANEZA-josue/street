"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (product) {
      setSize(product.sizes.length === 1 ? product.sizes[0] : null);
      setQty(1);
      setError("");
      setImageIndex(0);
    }
  }, [product]);

  useEffect(() => {
    const fn = (event: KeyboardEvent) => event.key === "Escape" && setQuickAdd(null);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [setQuickAdd]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-end sm:place-items-center sm:p-6">
      <div className="animate-fade absolute inset-0 bg-black/30" onClick={() => setQuickAdd(null)} />
      <div className="animate-pop relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-white shadow-2xl sm:grid-cols-2" role="dialog" aria-modal="true" aria-label={`Quick add ${product.name}`}>
        <div className="relative aspect-square sm:aspect-auto sm:min-h-[520px]">
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

        <div className="relative flex flex-col p-6 sm:p-9">
          <button onClick={() => setQuickAdd(null)} className="absolute right-4 top-4 p-2 text-neutral-800 transition hover:text-neutral-400" aria-label="Close quick add">
            <X size={20} strokeWidth={1.5} />
          </button>

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-800">{product.sku}</p>
          <h3 className="mt-2 pr-8 text-xl font-semibold uppercase leading-tight tracking-[0.04em]">{product.name}</h3>
          <p className="mt-2 text-sm font-light leading-relaxed text-neutral-500">{product.description}</p>
          <p className="mt-4 text-sm text-neutral-900">{formatPrice(product.priceCents)}</p>


          <div className="mt-8">
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
                  className={`py-3 text-[11px] font-medium uppercase tracking-[0.12em] transition ${size === itemSize ? "bg-black text-white" : "border border-neutral-200 bg-white hover:border-black"}`}
                >
                  {itemSize}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 flex gap-2">
            <div className="flex items-center border border-neutral-300">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3 transition hover:text-neutral-400" aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(9, qty + 1))} className="px-3 py-3 transition hover:text-neutral-400" aria-label="Increase quantity">
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
              className="flex flex-1 items-center justify-center gap-2 bg-black py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
            >
              <ShoppingBag size={15} /> Add to bag — {formatPrice(product.priceCents * qty)}
            </button>
          </div>

          <Link href={`/product/${product.slug}`} onClick={() => setQuickAdd(null)} className="mt-5 text-center text-[10px] uppercase tracking-[0.2em] text-neutral-500 underline underline-offset-4 transition hover:text-black">
            View product
          </Link>
          <p className="mt-7 border-t border-neutral-100 pt-4 text-[11px] font-light leading-relaxed text-neutral-500">
            Shipping and taxes calculated at checkout. All sales are final — please review size and order details carefully.
          </p>
        </div>
      </div>
    </div>
  );
}
