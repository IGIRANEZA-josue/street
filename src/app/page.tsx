import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/server-products";
import { COLLECTIONS, formatPrice, type Product } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import ProductVisual from "@/components/ProductVisual";
import { NewsletterForm } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  const bySlug = (slug: string) => products.find((product) => product.slug === slug);
  const pick = (slugs: string[]): Product[] =>
    slugs.flatMap((slug) => {
      const product = bySlug(slug);
      return product ? [product] : [];
    });

  const openingProducts = pick(["inkotanyi-script", "urugwiro", "inkotanyi-women"]);
  const latestProducts = products.slice(0, 18);
  const categoryPanels = COLLECTIONS.filter((collection) =>
    ["men", "women", "accessories"].includes(collection.slug),
  );
  const urugwiro = bySlug("urugwiro");

  const countFor = (slug: string) =>
    products.filter((product) => product.category === slug).length;

  return (
    <div className="bg-white text-neutral-900">
      {/* Opening: the brand line and three real products, nothing else competing */}
      <section className="mx-auto max-w-[1500px] px-4 pb-16 pt-12 sm:px-8 lg:px-12 lg:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[9px] font-light uppercase tracking-[0.34em] text-neutral-400 sm:text-[10px]">
            INKOTANYISINCE90
          </p>
          <h1 className="mt-5 text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-neutral-950">
            Minimalist luxury fashion from Rwanda.
          </h1>
          <p className="mt-5 text-[10px] font-light uppercase tracking-[0.3em] text-neutral-500 sm:text-xs">
            Premium streetwear since 1990
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-3 items-start gap-3 sm:gap-6">
          {openingProducts.map((product) => (
            <Link key={product.slug} href={`/product/${product.slug}`} className="group block text-center">
              <div className="relative aspect-square overflow-hidden bg-white">
                <ProductVisual
                  product={product}
                  imageIndex={product.images.length > 2 ? 2 : 0}
                  priority={product.slug === "inkotanyi-script"}
                  sizes="(max-width: 768px) 33vw, 300px"
                />
              </div>
              <p className="mt-3 text-[8px] font-semibold uppercase tracking-[0.2em] text-neutral-800 sm:text-[10px]">
                {product.sku}
              </p>
              <p className="mt-1 hidden text-[10px] font-light uppercase tracking-[0.08em] text-neutral-400 sm:block">
                {product.name}
              </p>
              <p className="mt-1 text-[10px] font-light text-neutral-700 sm:text-[11px]">
                {formatPrice(product.priceCents)}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[10px] font-medium uppercase tracking-[0.24em]">
          <Link
            href="/shop/new-arrivals"
            className="group inline-flex items-center gap-2 border-b border-black pb-1 transition hover:text-neutral-500"
          >
            Shop new
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/shop"
            className="border-b border-neutral-300 pb-1 text-neutral-500 transition hover:border-black hover:text-black"
          >
            View catalogue
          </Link>
        </div>
      </section>

      {/* The product grid is the homepage, as it is on the original store */}
      <section className="mx-auto max-w-[1800px] px-4 pb-20 sm:px-8 lg:px-12" aria-label="Latest products">
        <div className="mb-8 flex items-end justify-between border-t border-neutral-100 pt-8">
          <div>
            <p className="text-[9px] font-light uppercase tracking-[0.3em] text-neutral-400">New</p>
            <h2 className="mt-2 text-xl font-medium uppercase tracking-[0.08em]">Latest products</h2>
          </div>
          <Link
            href="/shop/new-arrivals"
            className="text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-500 underline underline-offset-4 transition hover:text-black sm:text-[10px]"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {latestProducts.map((product, index) => (
            <ProductCard key={product.slug} product={product} priority={index < 6} />
          ))}
        </div>
      </section>

      {/* Categories in the original store's own words */}
      <section className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-8 lg:px-12" aria-label="Shop by category">
        <div className="mb-10 text-center">
          <p className="text-[9px] font-light uppercase tracking-[0.3em] text-neutral-400">Shop</p>
          <h2 className="mt-2 text-xl font-medium uppercase tracking-[0.08em]">Mens / Womens / Accessories</h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
          {categoryPanels.map((collection) => (
            <Link key={collection.slug} href={`/shop/${collection.slug}`} className="group block text-center">
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src={collection.image}
                  alt={`${collection.title} — INKOTANYISINCE90 product photography`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-[5%] transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em]">{collection.title}</p>
              <p className="mx-auto mt-2 max-w-xs text-xs font-light leading-5 text-neutral-400">
                {collection.description}
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                {countFor(collection.slug)} products
              </p>
              <span className="mt-3 inline-block border-b border-neutral-300 pb-1 text-[9px] uppercase tracking-[0.2em] text-neutral-500 transition group-hover:border-black group-hover:text-black">
                View products
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* One product, shown properly */}
      {urugwiro && (
        <section className="border-y border-neutral-100">
          <div className="mx-auto grid max-w-[1300px] items-center gap-10 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:px-12">
            <Link href={`/product/${urugwiro.slug}`} className="group relative block aspect-square overflow-hidden bg-white">
              <ProductVisual product={urugwiro} imageIndex={0} sizes="(max-width: 1024px) 92vw, 620px" />
            </Link>
            <div className="mx-auto max-w-md text-center lg:text-left">
              <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">{urugwiro.sku}</p>
              <h2 className="mt-4 text-4xl font-semibold uppercase leading-none tracking-[-0.03em] sm:text-5xl">
                {urugwiro.name}
              </h2>
              <p className="mt-6 text-base font-light leading-8 text-neutral-500">{urugwiro.description}</p>
              <p className="mt-6 text-sm">{formatPrice(urugwiro.priceCents)}</p>
              <Link
                href={`/product/${urugwiro.slug}`}
                className="mt-8 inline-flex items-center gap-2 bg-black px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
              >
                View product <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Plain store information, taken from the actual store policies */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 lg:px-12" aria-label="Store information">
        <div className="grid gap-10 text-center md:grid-cols-3">
          <div className="px-2 md:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em]">Kigali, Rwanda</p>
            <p className="mx-auto mt-4 max-w-xs text-sm font-light leading-7 text-neutral-500">
              INKOTANYISINCE90, Kigali, Rwanda. Questions: contact@inkotanyisince90.com.
            </p>
          </div>
          <div className="px-2 md:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em]">MTN Mobile Money</p>
            <p className="mx-auto mt-4 max-w-xs text-sm font-light leading-7 text-neutral-500">
              Pay securely using your MTN phone number. Prices are shown in Rwandan francs (RWF).
            </p>
          </div>
          <div className="px-2 md:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em]">All Sales Final</p>
            <p className="mx-auto mt-4 max-w-xs text-sm font-light leading-7 text-neutral-500">
              All sales are final due to the low cost of goods. We do not offer returns or exchanges.
            </p>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="mx-auto max-w-xl px-4 pb-24 text-center sm:px-6">
        <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">Newsletter</p>
        <h2 className="mt-3 text-2xl font-medium uppercase tracking-[0.06em]">Subscribe</h2>
        <p className="mx-auto mt-4 max-w-md text-sm font-light leading-7 text-neutral-500">
          Receive INKOTANYISINCE90 product updates and email marketing.
        </p>
        <div className="mt-7 text-left">
          <NewsletterForm source="homepage" />
        </div>
      </section>
    </div>
  );
}
