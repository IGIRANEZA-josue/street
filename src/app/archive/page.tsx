import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/server-products";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Archive | INKOTANYISINCE90",
  description: "INKOTANYISINCE90 products including SINCE 90, URUGWIRO, LEGACY and UMURAGE.",
};

export default async function ArchivePage() {
  const products = await getProducts();
  const archive = products.filter((product) => product.collections.includes("archive"));
  const urugwiro = products.find((product) => product.slug === "urugwiro");

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-16 text-center sm:px-6">
        <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">INKOTANYISINCE90</p>
        <h1 className="mt-4 text-4xl font-semibold uppercase leading-tight tracking-[-0.03em] sm:text-6xl">Archive</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-7 text-neutral-500">
          SINCE 90, URUGWIRO, BSL, INK LEGACY, LEGACY, SAVE, URW and UMURAGE.
        </p>
      </section>

      {urugwiro && (
        <section className="mx-auto grid max-w-[1200px] items-center gap-8 px-4 pb-20 sm:px-8 lg:grid-cols-2 lg:px-12">
          <Reveal>
            <Link href={`/product/${urugwiro.slug}`} className="group relative block aspect-square overflow-hidden bg-white">
              <Image src={urugwiro.images[2] || urugwiro.image} alt="URUGWIRO — official product photography" fill className="product-photo object-contain p-[4%]" sizes="(max-width: 1024px) 100vw, 50vw" />
            </Link>
          </Reveal>
          <Reveal delay={90}>
            <div className="mx-auto max-w-md text-center lg:text-left">
              <p className="text-[9px] font-light uppercase tracking-[0.3em] text-neutral-400">{urugwiro.sku}</p>
              <h2 className="mt-4 text-4xl font-semibold uppercase leading-none tracking-[-0.03em] sm:text-5xl">{urugwiro.name}</h2>
              <p className="mt-5 text-base font-light leading-8 text-neutral-500">{urugwiro.description}</p>
              <Link href={`/product/${urugwiro.slug}`} className="mt-7 inline-block border-b border-black pb-1 text-[10px] font-medium uppercase tracking-[0.22em]">View product</Link>
            </div>
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-[1500px] px-4 pb-24 sm:px-8 lg:px-12">
        <Reveal>
          <div className="mb-9 flex items-end justify-between border-t border-neutral-100 pt-10">
            <div>
              <p className="text-[9px] font-light uppercase tracking-[0.3em] text-neutral-400">Selection</p>
              <h2 className="mt-2 text-xl font-medium uppercase tracking-[0.08em]">Products</h2>
            </div>
            <Link href="/shop/archive" className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 underline underline-offset-4 transition hover:text-black">View selection</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          {archive.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
