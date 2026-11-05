"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";

export type CartItem = {
  key: string;
  slug: string;
  name: string;
  sku: string;
  priceCents: number;
  size: string;
  color: string;
  garment: string;
  ink: string;
  printLines: string[];
  printStyle: string;
  image?: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  quickAddProduct: Product | null;
  setQuickAdd: (p: Product | null) => void;
  add: (p: Product, size: string, colorName: string, qty?: number) => void;
  addItem: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  lastAdded: string | null;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [quickAddProduct, setQuickAdd] = useState<Product | null>(null);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("is90-cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("is90-cart-v2", JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartCtx["addItem"] = (item, qty = 1) => {
    const key = `${item.slug}-${item.size}-${item.color}`;
    setItems((prev) => {
      const ex = prev.find((i) => i.key === key);
      if (ex) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...item, key, qty }];
    });
    setLastAdded(item.name);
    setOpen(true);
    setTimeout(() => setLastAdded(null), 2500);
  };

  const add: CartCtx["add"] = (p, size, colorName, qty = 1) => {
    const c = p.colors.find((x) => x.name === colorName) || p.colors[0];
    addItem(
      {
        slug: p.slug,
        name: p.name,
        sku: p.sku,
        priceCents: p.priceCents,
        size,
        color: colorName,
        garment: c?.garment || "#111",
        ink: c?.ink || "#fff",
        printLines: p.printLines,
        printStyle: p.printStyle,
        image: p.image,
      },
      qty
    );
  };

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((a, i) => a + i.qty, 0),
      subtotal: items.reduce((a, i) => a + i.qty * i.priceCents, 0),
      isOpen,
      setOpen,
      quickAddProduct,
      setQuickAdd,
      add,
      addItem,
      remove: (key) => setItems((p) => p.filter((i) => i.key !== key)),
      setQty: (key, qty) =>
        setItems((p) => (qty <= 0 ? p.filter((i) => i.key !== key) : p.map((i) => (i.key === key ? { ...i, qty } : i)))),
      clear: () => setItems([]),
      lastAdded,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, isOpen, quickAddProduct, lastAdded]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
