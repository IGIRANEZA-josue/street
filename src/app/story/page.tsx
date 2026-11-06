import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/server-products";
import ProductCard from "@/components/ProductCard";
import { NewsletterForm } from "@/components/Footer";
import { officialImage } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "About | INKOTANYISINCE90",
  description: "Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.",
};

export default async function StoryPage() {
  const products = await getProducts();
  const selected = ["inkotanyi-script", "urugwiro", "inkotanyi-women", "umurage"]
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean);

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-4xl px-4 pb-14 pt-16 text-center sm:px-6">
        <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">INKOTANYISINCE90</p>
        <h1 className="mt-5 text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
          Minimalist luxury fashion from Rwanda.
        </h1>
        <p className="mt-6 text-[10px] font-light uppercase tracking-[0.3em] text-neutral-500">
          Premium streetwear since 1990
        </p>
      </section>

      <section className="mx-auto grid max-w-[1300px] gap-5 px-4 pb-20 sm:grid-cols-3 sm:px-8 lg:px-12">
        {[
          { src: officialImage("ink.front-removebg-preview.model.png"), label: "IS90-001 — INKOTANYI SCRIPT" },
          { src: officialImage("urugwiro.front-removebg-preview.model.png"), label: "IS90-005 — URUGWIRO" },
          { src: officialImage("ink.women.front-removebg-preview.model.png"), label: "IS90-003 — INKOTANYI WOMEN" },
        ].map((item) => (
          <figure key={item.label} className="text-center">
            <div className="relative aspect-square overflow-hidden bg-white">
              <Image
                src={item.src}
                alt={`${item.label} — INKOTANYISINCE90 product photography`}
                fill
                className="object-contain p-[5%] transition duration-300 hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <figcaption className="mt-3 text-[9px] font-light uppercase tracking-[0.22em] text-neutral-400">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="grid gap-10 border-y border-neutral-100 py-12 md:grid-cols-3">
          {selected.slice(0, 3).map((product) => (
            <article key={product!.slug} className="text-center md:text-left">
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-neutral-400">{product!.sku}</p>
              <h2 className="mt-3 text-base font-semibold uppercase tracking-[0.06em]">{product!.name}</h2>
              <p className="mt-3 text-sm font-light leading-7 text-neutral-500">{product!.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] font-medium uppercase tracking-[0.22em]">
          <Link href="/shop/new-arrivals" className="border-b border-black pb-1">
            Shop new
          </Link>
          <Link
            href="/shop"
            className="border-b border-neutral-300 pb-1 text-neutral-500 transition hover:border-black hover:text-black"
          >
            View catalogue
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 pb-24 sm:px-8 lg:px-12">
        <div className="mb-9 text-center">
          <p className="text-[9px] font-light uppercase tracking-[0.3em] text-neutral-400">Selected</p>
          <h2 className="mt-2 text-xl font-medium uppercase tracking-[0.08em]">Products</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          {selected.map((product) => product && <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>

      <section className="mx-auto max-w-xl px-4 pb-24 text-center sm:px-6">
        <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">Newsletter</p>
        <h2 className="mt-3 text-2xl font-medium uppercase tracking-[0.06em]">Subscribe</h2>
        <div className="mt-7 text-left">
          <NewsletterForm source="story" />
        </div>
      </section>
    </div>
  );
}
