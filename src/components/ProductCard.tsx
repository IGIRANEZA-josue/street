"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { formatPrice, type Product } from "@/lib/catalog";
import ProductVisual from "./ProductVisual";
import { useCart } from "@/store/cart";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { setQuickAdd, add } = useCart();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;
  const singleSize = product.sizes.length === 1;
  const hoverIndex = product.images.length > 2 ? 2 : product.images.length > 1 ? 1 : 0;

  const quickAction = () => {
    if (soldOut) return;
    if (singleSize) {
      add(product, product.sizes[0], "As shown");
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1400);
    } else {
      setQuickAdd(product);
    }
  };

  return (
    <article
      className="group relative flex flex-col bg-white text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-white"
        aria-label={`View ${product.name}, ${product.sku}`}
      >
        <div className={`absolute inset-0 transition-opacity duration-200 ${hovered ? "opacity-0" : "opacity-100"}`}>
          <ProductVisual product={product} imageIndex={0} priority={priority} />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <ProductVisual product={product} imageIndex={hoverIndex} />
        </div>

        {product.isNew && (
          <span className="absolute left-2 top-2 z-10 text-[8px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            New
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-x-0 top-3 z-10 text-[9px] font-medium uppercase tracking-[0.24em] text-neutral-500">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-col items-center px-1 pt-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-800 sm:text-[10px]">
          {product.sku}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-1 line-clamp-1 max-w-full text-[10px] font-normal uppercase tracking-[0.07em] text-neutral-500 transition hover:text-black sm:text-[11px]"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-[10px] font-normal tracking-[0.03em] text-neutral-900 sm:text-[11px]">
          {formatPrice(product.priceCents)}
        </p>

        <button
          onClick={quickAction}
          disabled={soldOut}
          aria-label={singleSize ? `Add ${product.name} to bag` : `Select size for ${product.name}`}
          className="mt-1.5 flex h-8 w-8 items-center justify-center rounded-full text-black transition hover:bg-neutral-100 hover:text-neutral-600 disabled:cursor-not-allowed disabled:text-neutral-300"
        >
          {added ? <Check size={16} strokeWidth={1.5} /> : <Plus size={19} strokeWidth={1.25} />}
        </button>
      </div>
    </article>
  );
}
