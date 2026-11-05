"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Search, ArrowRight } from "lucide-react";
import { PRODUCTS, formatPrice } from "@/lib/catalog";
import ProductVisual from "./ProductVisual";

const SUGGESTIONS = ["INKOTANYI SCRIPT", "URUGWIRO", "UMURAGE", "SINCE 90", "IAM", "STICKER"];

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const fn = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const results = query.trim()
    ? PRODUCTS.filter((p) => `${p.name} ${p.sku} ${p.categoryLabel} ${p.description}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-white text-neutral-900">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-6 sm:pt-10">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-400">Search INKOTANYISINCE90</span>
          <button onClick={onClose} className="p-2 transition hover:text-neutral-400" aria-label="Close search">
            <X size={26} strokeWidth={1.25} />
          </button>
        </div>

        <div className="mt-10 flex items-center gap-4 border-b border-neutral-300 pb-4 focus-within:border-black">
          <Search size={26} strokeWidth={1.25} className="shrink-0 text-neutral-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or IS90 codes"
            className="w-full bg-transparent text-2xl font-light uppercase tracking-[0.04em] placeholder:text-neutral-300 focus:outline-none sm:text-4xl"
          />
        </div>

        {!query && (
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[9px] uppercase tracking-[0.24em] text-neutral-400">Suggested</span>
            {SUGGESTIONS.map((term) => (
              <button key={term} onClick={() => setQuery(term)} className="border border-neutral-200 px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] transition hover:border-black">
                {term}
              </button>
            ))}
          </div>
        )}

        <p className="mt-12 text-[9px] uppercase tracking-[0.28em] text-neutral-400" role="status">
          {query ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”` : "Featured products"}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4">
          {results.map((product) => (
            <Link key={product.slug} href={`/product/${product.slug}`} onClick={onClose} className="group text-center">
              <div className="aspect-square bg-white">
                <ProductVisual product={product} />
              </div>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-800">{product.sku}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-neutral-500 group-hover:text-black">{product.name}</p>
              <p className="mt-1 text-[11px]">{formatPrice(product.priceCents)}</p>
            </Link>
          ))}
        </div>

        {query && results.length === 0 && (
          <div className="mt-10 border border-neutral-200 px-6 py-10 text-center">
            <p className="text-lg font-light uppercase tracking-[0.08em]">No products found for “{query}”</p>
            <p className="mt-2 text-sm font-light text-neutral-500">Try a product name or code, for example IS90-001.</p>
          </div>
        )}

        <Link href="/shop" onClick={onClose} className="mt-12 inline-flex items-center gap-2 bg-black px-6 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800">
          View catalogue <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
