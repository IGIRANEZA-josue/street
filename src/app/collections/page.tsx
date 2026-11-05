import Link from "next/link";
import Image from "next/image";
import { COLLECTIONS, getCollectionProducts } from "@/lib/catalog";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Collections | INKOTANYISINCE90",
  description: "Shop INKOTANYISINCE90 by New, Mens, Womens, Accessories and Graphic Tees.",
};

export default function CollectionsPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-14 text-center sm:px-6">
        <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">INKOTANYISINCE90</p>
        <h1 className="mt-4 text-4xl font-semibold uppercase leading-tight tracking-[-0.03em] sm:text-6xl">Collections</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-7 text-neutral-500">
          Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.
        </p>
      </section>

      <div className="mx-auto grid max-w-[1300px] gap-x-5 gap-y-12 px-4 py-12 sm:grid-cols-2 sm:px-8 lg:px-12">
        {COLLECTIONS.filter((collection) => ["new-arrivals", "men", "women", "accessories"].includes(collection.slug)).map((collection, index) => (
          <Reveal key={collection.slug} delay={(index % 2) * 70}>
            <Link href={`/shop/${collection.slug}`} className="group block text-center">
              <div className="relative aspect-[16/10] overflow-hidden bg-white">
                <Image src={collection.image} alt={`${collection.title} — official INKOTANYISINCE90 product photography`} fill className="product-photo object-contain p-[5%]" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <p className="mt-4 text-[9px] font-light uppercase tracking-[0.28em] text-neutral-400">{collection.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-medium uppercase tracking-[0.05em]">{collection.title}</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm font-light leading-7 text-neutral-500">{collection.description}</p>
              <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-neutral-400">{getCollectionProducts(collection.slug).length} products</p>
              <span className="mt-4 inline-block border-b border-neutral-300 pb-1 text-[9px] uppercase tracking-[0.22em] text-neutral-500 transition group-hover:border-black group-hover:text-black">
                View products
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
