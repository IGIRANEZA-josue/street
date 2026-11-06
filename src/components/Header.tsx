"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/store/cart";
import SearchOverlay from "./SearchOverlay";
import Wordmark from "@/components/Wordmark";

const NAV = [
  { label: "New", href: "/shop/new-arrivals", segment: "new-arrivals" },
  { label: "Mens", href: "/shop/men", segment: "men" },
  { label: "Womens", href: "/shop/women", segment: "women" },
  { label: "Accessories", href: "/shop/accessories", segment: "accessories" },
];

const SECONDARY = [
  { label: "Catalogue", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/story" },
  { label: "Contact", href: "/contact" },
  { label: "Order Status", href: "/order-status" },
  { label: "Account", href: "/account" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMobile(false), [pathname]);

  const activeSegment = pathname.startsWith("/shop/")
    ? pathname.split("/")[2]
    : pathname === "/shop"
      ? "all"
      : "";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-12">
          <div className="grid h-[76px] grid-cols-[1fr_auto_1fr] items-center sm:h-[88px]">
            <div className="flex items-center">
              <button
                className="p-2 text-neutral-900 transition hover:text-neutral-500 lg:hidden"
                onClick={() => setMobile(true)}
                aria-label="Open menu"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setSearch(true)}
                className="p-2 transition hover:text-neutral-500"
                aria-label="Search products"
              >
                <Search size={19} strokeWidth={1.5} />
              </button>
              <Link
                href="/account"
                className="hidden p-2 transition hover:text-neutral-500 sm:block"
                aria-label="Account"
              >
                <User size={19} strokeWidth={1.5} />
              </Link>
            </div>

            <Link href="/" className="flex flex-col items-center justify-center" aria-label="INKOTANYISINCE90 home">
              <Wordmark
                className="[&>span:first-child]:text-lg sm:[&>span:first-child]:text-xl"
                sub="Premium streetwear since 1990"
              />
            </Link>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setOpen(true)}
                className="relative p-2 transition hover:text-neutral-500"
                aria-label="Open shopping bag"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          <nav
            className="flex h-10 items-center justify-start gap-6 overflow-x-auto whitespace-nowrap no-scrollbar sm:justify-center sm:gap-10"
            aria-label="Primary navigation"
          >
            {NAV.map((item) => {
              const active = activeSegment === item.segment;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  data-active={active}
                  className={`link-underline py-2 text-[9px] uppercase tracking-[0.22em] transition sm:text-[10px] ${
                    active
                      ? "font-semibold text-black"
                      : "font-light text-neutral-400 hover:text-neutral-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/shop"
              className={`link-underline hidden py-2 text-[10px] uppercase tracking-[0.22em] transition md:block ${
                activeSegment === "all"
                  ? "font-semibold text-black"
                  : "font-light text-neutral-400 hover:text-neutral-800"
              }`}
            >
              Catalogue
            </Link>
            <Link
              href="/contact"
              className="link-underline hidden py-2 text-[10px] font-light uppercase tracking-[0.22em] text-neutral-400 transition hover:text-neutral-800 md:block"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {mobile && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="animate-fade absolute inset-0 bg-black/25" onClick={() => setMobile(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white text-neutral-900 shadow-xl">
            <div className="flex h-[76px] items-center justify-between px-5">
              <Link href="/" aria-label="INKOTANYISINCE90 home" onClick={() => setMobile(false)}>
                <Wordmark className="[&>span:first-child]:text-base" />
              </Link>
              <button onClick={() => setMobile(false)} aria-label="Close menu" className="p-2">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="px-5 py-3" aria-label="Mobile navigation">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block border-b border-neutral-100 py-4 text-[11px] font-medium uppercase tracking-[0.24em]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-5">
                {SECONDARY.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 transition hover:text-black"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <p className="mt-auto px-5 pb-7 text-[9px] uppercase leading-relaxed tracking-[0.2em] text-neutral-400">
              Minimalist luxury fashion from Rwanda.
              <br />
              Premium streetwear since 1990.
            </p>
          </div>
        </div>
      )}

      {search && <SearchOverlay onClose={() => setSearch(false)} />}
      <div className="h-[116px] sm:h-[128px]" />
    </>
  );
}
