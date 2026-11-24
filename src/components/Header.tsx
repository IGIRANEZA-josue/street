"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close the menu as soon as the route changes (link tap, back button, etc.)
  // without an extra effect pass.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMobile(false);
  }

  // While the mobile menu is open: lock page scroll, close on Escape and move
  // focus into the panel. Focus returns to the hamburger when it closes.
  useEffect(() => {
    if (!mobile) return;
    const trigger = menuButtonRef.current;
    document.body.classList.add("is-locked");
    closeButtonRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobile(false);
    };
    // The hamburger only exists below 768px; close the panel if the window
    // grows past that point so the page is never left scroll-locked.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = (event: MediaQueryListEvent) => {
      if (event.matches) setMobile(false);
    };

    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);

    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      trigger?.focus({ preventScroll: true });
    };
  }, [mobile]);

  const activeSegment = pathname.startsWith("/shop/")
    ? pathname.split("/")[2]
    : pathname === "/shop"
      ? "all"
      : "";

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-12">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center sm:h-[76px] lg:h-[88px]">
            <div className="flex min-w-0 items-center">
              <button
                ref={menuButtonRef}
                className="-ml-2 grid h-10 w-10 place-items-center text-neutral-900 transition hover:text-neutral-500 sm:-ml-2.5 sm:h-11 sm:w-11 md:hidden"
                onClick={() => setMobile(true)}
                aria-label="Open menu"
                aria-expanded={mobile}
                aria-controls="mobile-navigation"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setSearch(true)}
                className="grid h-10 w-10 place-items-center transition hover:text-neutral-500 sm:h-11 sm:w-11"
                aria-label="Search products"
              >
                <Search size={19} strokeWidth={1.5} />
              </button>
              <Link
                href="/account"
                className="hidden h-11 w-11 place-items-center transition hover:text-neutral-500 sm:grid"
                aria-label="Account"
              >
                <User size={19} strokeWidth={1.5} />
              </Link>
            </div>

            <Link
              href="/"
              className="flex min-w-0 flex-col items-center justify-center"
              aria-label="INKOTANYISINCE90 home"
            >
              <Wordmark
                className="[&>span:first-child]:whitespace-nowrap [&>span:first-child]:text-[clamp(9px,3vw,13px)] [&>span:first-child]:tracking-[0.12em] sm:[&>span:first-child]:text-xl sm:[&>span:first-child]:tracking-[0.3em] [&>span:last-child]:hidden sm:[&>span:last-child]:block"
                sub="Premium streetwear since 1990"
              />
            </Link>

            <div className="flex min-w-0 items-center justify-end">
              <button
                onClick={() => setOpen(true)}
                className="relative grid h-10 w-10 place-items-center transition hover:text-neutral-500 sm:h-11 sm:w-11"
                aria-label="Open shopping bag"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {count > 0 && (
                  <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-black px-1 text-[9px] font-semibold text-white sm:right-0.5 sm:top-0.5">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop navigation — on phones it is replaced by the hamburger menu. */}
          <nav
            className="hidden h-10 items-center justify-center gap-7 whitespace-nowrap md:flex lg:gap-10"
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
                  className={`link-underline py-2 text-[10px] uppercase tracking-[0.22em] transition ${
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
              aria-current={activeSegment === "all" ? "page" : undefined}
              className={`link-underline py-2 text-[10px] uppercase tracking-[0.22em] transition ${
                activeSegment === "all"
                  ? "font-semibold text-black"
                  : "font-light text-neutral-400 hover:text-neutral-800"
              }`}
            >
              Catalogue
            </Link>
            <Link
              href="/contact"
              className="link-underline py-2 text-[10px] font-light uppercase tracking-[0.22em] text-neutral-400 transition hover:text-neutral-800"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {mobile && (
        <div
          className="fixed inset-0 z-[70] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          id="mobile-navigation"
        >
          <div
            className="animate-fade absolute inset-0 bg-black/30"
            onClick={() => setMobile(false)}
            role="presentation"
          />
          <div className="animate-drawer absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto overscroll-contain bg-white pt-[env(safe-area-inset-top)] text-neutral-900 shadow-xl safe-b">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-100 px-4 sm:h-[76px] sm:px-5">
              <Link href="/" aria-label="INKOTANYISINCE90 home" onClick={() => setMobile(false)}>
                <Wordmark className="[&>span:first-child]:text-sm" />
              </Link>
              <button
                ref={closeButtonRef}
                onClick={() => setMobile(false)}
                aria-label="Close menu"
                className="-mr-2 grid h-11 w-11 place-items-center transition hover:text-neutral-500"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="px-4 py-2 sm:px-5" aria-label="Mobile navigation">
              {NAV.map((item) => {
                const active = activeSegment === item.segment;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobile(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[52px] items-center justify-between border-b border-neutral-100 text-[13px] uppercase tracking-[0.18em] transition ${
                      active ? "font-semibold text-black" : "font-medium text-neutral-800 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4">
                {SECONDARY.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobile(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="flex min-h-[44px] items-center py-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500 transition hover:text-black"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <p className="mt-auto px-4 pb-6 pt-8 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-neutral-400 sm:px-5">
              Minimalist luxury fashion from Rwanda.
              <br />
              Premium streetwear since 1990.
            </p>
          </div>
        </div>
      )}

      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </>
  );
}
