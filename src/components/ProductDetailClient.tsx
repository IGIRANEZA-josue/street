"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice, type Product } from "@/lib/catalog";
import ProductVisual from "./ProductVisual";
import { useCart } from "@/store/cart";

const VIEW_LABELS = ["Front", "Back", "Front — model view", "Back — model view"];

function Accordion({ title, children, openDefault = false }: { title: string; children: React.ReactNode; openDefault?: boolean }) {
  const [open, setOpen] = useState(openDefault);
  return (
    <div className="border-b border-neutral-100">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-4 text-left text-[10px] font-medium uppercase tracking-[0.22em]" aria-expanded={open}>
        {title}
        <ChevronDown size={15} strokeWidth={1.5} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5 text-sm font-light leading-7 text-neutral-500">{children}</div>}
    </div>
  );
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const soldOut = product.stock <= 0;

  const previous = () => setImageIndex((current) => (current - 1 + product.images.length) % product.images.length);
  const next = () => setImageIndex((current) => (current + 1) % product.images.length);

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      <div>
        <div className="lg:sticky lg:top-36">
          <div className="relative mx-auto aspect-square max-w-[560px] overflow-hidden bg-white">
            <div key={imageIndex} className="animate-fade h-full">
              <ProductVisual product={product} imageIndex={imageIndex} priority />
            </div>

            {product.images.length > 1 && (
              <>
                <button onClick={previous} className="absolute left-1 top-1/2 -translate-y-1/2 p-2 text-black transition hover:text-neutral-400" aria-label="Previous image">
                  <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <button onClick={next} className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-black transition hover:text-neutral-400" aria-label="Next image">
                  <ChevronRight size={22} strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all ${imageIndex === index ? "w-5 bg-black" : "w-1.5 bg-neutral-300 hover:bg-neutral-500"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {product.images.length > 1 && (
            <>
              <div className="mx-auto mt-5 grid max-w-[560px] grid-cols-4 gap-2">
                {/* thumbnails */}
                {product.images.map((image, index) => (
                  <button key={image} onClick={() => setImageIndex(index)} className={`relative aspect-square overflow-hidden bg-white transition ${imageIndex === index ? "opacity-100" : "opacity-45 hover:opacity-80"}`} aria-label={VIEW_LABELS[index] || `View ${index + 1}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="" className="h-full w-full object-contain p-1" loading="lazy" />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-[9px] uppercase tracking-[0.22em] text-neutral-400">{VIEW_LABELS[imageIndex]}</p>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-xl lg:mx-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-800">{product.sku}</p>
        <h1 className="mt-3 text-3xl font-semibold uppercase leading-tight tracking-[-0.02em] sm:text-4xl">{product.name}</h1>
        <p className="mt-3 text-[10px] font-light uppercase tracking-[0.24em] text-neutral-400">{product.categoryLabel}</p>
        <p className="mt-6 text-base font-light leading-8 text-neutral-600">{product.description}</p>

        <div className="mt-7 flex items-baseline justify-between border-y border-neutral-100 py-5">
          <span className="text-lg font-normal">{formatPrice(product.priceCents)}</span>
          <span className="text-[9px] uppercase tracking-[0.22em] text-neutral-400">{soldOut ? "Sold out" : "In stock"}</span>
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500">
            Select size {error && <span className="text-red-700">— {error}</span>}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {product.sizes.map((itemSize) => (
              <button
                key={itemSize}
                onClick={() => {
                  setSize(itemSize);
                  setError("");
                }}
                aria-pressed={size === itemSize}
                className={`py-3 text-[11px] font-medium uppercase tracking-[0.1em] transition ${size === itemSize ? "bg-black text-white" : "border border-neutral-200 bg-white hover:border-black"}`}
              >
                {itemSize}
              </button>
            ))}
          </div>
          <Link href="/size-guide" className="mt-3 inline-block text-[10px] uppercase tracking-[0.18em] text-neutral-400 underline underline-offset-4 transition hover:text-black">
            Size guide
          </Link>
        </div>

        <div className="mt-8 flex gap-2">
          <div className="flex items-center border border-neutral-300">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3.5 py-3.5 transition hover:text-neutral-400" aria-label="Decrease quantity">
              <Minus size={14} />
            </button>
            <span className="w-9 text-center text-sm font-medium">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(9, quantity + 1))} className="px-3.5 py-3.5 transition hover:text-neutral-400" aria-label="Increase quantity">
              <Plus size={14} />
            </button>
          </div>
          <button
            disabled={soldOut}
            onClick={() => {
              if (!size) {
                setError("required");
                return;
              }
              add(product, size, "As shown", quantity);
            }}
            className="flex flex-1 items-center justify-center gap-2 bg-black py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            <ShoppingBag size={15} /> {soldOut ? "Sold out" : `Add to bag — ${formatPrice(product.priceCents * quantity)}`}
          </button>
        </div>

        <p className="mt-4 text-[11px] font-light leading-relaxed text-neutral-500">
          Shipping and taxes are calculated at checkout. All sales are final, so please review the size and product details carefully before ordering.
        </p>

        <div className="mt-9 border-t border-neutral-100">
          <Accordion title="Product details" openDefault>
            <dl className="space-y-2">
              <div className="flex justify-between gap-6"><dt>Product code</dt><dd className="text-neutral-800">{product.sku}</dd></div>
              <div className="flex justify-between gap-6"><dt>Category</dt><dd className="text-neutral-800">{product.categoryLabel}</dd></div>
              <div className="flex justify-between gap-6"><dt>Available sizes</dt><dd className="text-right text-neutral-800">{product.sizes.join(", ")}</dd></div>
              <div className="flex justify-between gap-6"><dt>Availability</dt><dd className="text-neutral-800">{soldOut ? "Sold out" : "In stock"}</dd></div>
            </dl>
          </Accordion>
          <Accordion title="Shipping">
            Orders are prepared in Kigali, Rwanda. Shipping and taxes are calculated at checkout after the delivery address is entered.
          </Accordion>
          <Accordion title="Sales policy">
            All sales are final. If an item arrives incorrect or defective, email <a href="mailto:contact@inkotanyisince90.com" className="text-black underline">contact@inkotanyisince90.com</a> with your order number and a brief description.
          </Accordion>
        </div>
      </div>
    </div>
  );
}
