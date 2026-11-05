"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { formatPrice, type Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "name" | "code";

const CATEGORY_OPTIONS = [
  { value: "men", label: "Mens" },
  { value: "women", label: "Womens" },
  { value: "accessories", label: "Accessories" },
];

export default function ShopClient({ products, title }: { products: Product[]; title: string }) {
  const [sort, setSort] = useState<Sort>("featured");
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(23000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allSizes = useMemo(() => Array.from(new Set(products.flatMap((product) => product.sizes))), [products]);

  const toggle = (list: string[], value: string, set: (next: string[]) => void) =>
    set(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

  const filtered = useMemo(() => {
    const out = products.filter((product) => {
      if (categories.length && !categories.includes(product.category)) return false;
      if (sizes.length && !sizes.some((size) => product.sizes.includes(size))) return false;
      if (product.priceCents / 100 > maxPrice) return false;
      if (inStockOnly && product.stock <= 0) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        return [...out].sort((a, b) => a.priceCents - b.priceCents);
      case "price-desc":
        return [...out].sort((a, b) => b.priceCents - a.priceCents);
      case "name":
        return [...out].sort((a, b) => a.name.localeCompare(b.name));
      case "code":
        return [...out].sort((a, b) => a.sku.localeCompare(b.sku));
      default:
        return [...out].sort((a, b) => Number(b.featured || false) - Number(a.featured || false) || a.sku.localeCompare(b.sku));
    }
  }, [products, categories, sizes, maxPrice, inStockOnly, sort]);

  const activeCount = categories.length + sizes.length + (inStockOnly ? 1 : 0) + (maxPrice < 23000 ? 1 : 0);
  const clear = () => {
    setCategories([]);
    setSizes([]);
    setMaxPrice(23000);
    setInStockOnly(false);
  };

  const filterBody = (
    <div className="space-y-8">
      <div>
        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-neutral-400">Category</p>
        <div className="mt-4 space-y-2.5">
          {CATEGORY_OPTIONS.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-2.5 text-sm font-light transition hover:text-black">
              <span className={`grid h-4 w-4 place-items-center border ${categories.includes(option.value) ? "border-black bg-black text-white" : "border-neutral-300 bg-white"}`}>
                {categories.includes(option.value) && <Check size={11} />}
              </span>
              <input type="checkbox" className="sr-only" checked={categories.includes(option.value)} onChange={() => toggle(categories, option.value, setCategories)} />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-neutral-400">Size</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {allSizes.map((size) => (
            <button key={size} onClick={() => toggle(sizes, size, setSizes)} className={`min-w-10 px-2 py-2 text-[10px] font-medium uppercase ${sizes.includes(size) ? "bg-black text-white" : "border border-neutral-200 hover:border-black"}`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-neutral-400">
          Max price — <span className="text-black">{formatPrice(maxPrice * 100)}</span>
        </p>
        <input type="range" min={3000} max={23000} step={1000} value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="mt-4 w-full accent-black" aria-label="Maximum price" />
        <div className="flex justify-between text-[9px] uppercase tracking-[0.14em] text-neutral-400">
          <span>RWF 3,000</span>
          <span>RWF 23,000</span>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm font-light">
        <span className={`grid h-4 w-4 place-items-center border ${inStockOnly ? "border-black bg-black text-white" : "border-neutral-300 bg-white"}`}>
          {inStockOnly && <Check size={11} />}
        </span>
        <input type="checkbox" className="sr-only" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
        In stock only
      </label>

      {activeCount > 0 && (
        <button onClick={clear} className="w-full border border-black py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition hover:bg-black hover:text-white">
          Clear all ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[210px_1fr] lg:gap-12">
      <aside className="sticky top-40 hidden self-start lg:block">{filterBody}</aside>

      <div>
        <div className="mb-8 flex items-center justify-between gap-3 border-y border-neutral-100 py-3">
          <p className="text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500" role="status">
            {filtered.length} product{filtered.length === 1 ? "" : "s"} — {title}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 border border-neutral-300 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] lg:hidden">
              <SlidersHorizontal size={13} /> Filters {activeCount > 0 && <span className="grid h-4 w-4 place-items-center rounded-full bg-black text-[9px] text-white">{activeCount}</span>}
            </button>
            <label className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em]">
              <span className="hidden sm:inline">Sort</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="border border-neutral-200 bg-white px-3 py-2.5 text-[10px] uppercase tracking-[0.1em] focus:border-black focus:outline-none" aria-label="Sort products">
                <option value="featured">Featured</option>
                <option value="code">Code</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-neutral-200 px-6 py-20 text-center">
            <p className="text-xl font-light uppercase tracking-[0.08em]">No products match these filters</p>
            <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-7 text-neutral-500">Remove a size or category, or view the complete catalogue.</p>
            <button onClick={clear} className="mt-7 bg-black px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="animate-fade absolute inset-0 bg-black/30" onClick={() => setFiltersOpen(false)} />
          <div className="animate-drawer absolute inset-y-0 right-0 w-[88%] max-w-sm overflow-y-auto bg-white p-6">
            <div className="mb-7 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.22em]">Filters</p>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            {filterBody}
            <button onClick={() => setFiltersOpen(false)} className="mt-9 w-full bg-black py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white">
              Show {filtered.length} products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
