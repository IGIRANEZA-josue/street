import { notFound } from "next/navigation";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/catalog";
import { getProducts } from "@/lib/server-products";
import ShopClient from "@/components/ShopClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const meta = COLLECTIONS.find((item) => item.slug === collection);
  return {
    title: collection === "all" ? "Catalogue | INKOTANYISINCE90" : `${meta?.title || "Shop"} | INKOTANYISINCE90`,
    description: meta?.description || "Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.",
  };
}

const CATEGORY_LINKS = [
  { label: "New", href: "/shop/new-arrivals" },
  { label: "Mens", href: "/shop/men" },
  { label: "Womens", href: "/shop/women" },
  { label: "Accessories", href: "/shop/accessories" },
  { label: "Catalogue", href: "/shop" },
];

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const meta = COLLECTIONS.find((item) => item.slug === collection);
  if (!meta && collection !== "all") notFound();

  const all = await getProducts();
  const items =
    collection === "all"
      ? all
      : collection === "men" || collection === "women" || collection === "accessories"
        ? all.filter((product) => product.category === collection)
        : all.filter((product) => product.collections.includes(collection));

  const title = collection === "all" ? "Catalogue" : meta?.title || "Shop";
  const description =
    collection === "all"
      ? "Every INKOTANYISINCE90 product, from IS90-001 to IS90-030."
      : meta?.description;

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-[900px] px-4 pb-10 pt-12 text-center sm:px-6 lg:pt-16">
        <nav className="text-[9px] font-light uppercase tracking-[0.24em] text-neutral-400" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <span className="text-neutral-700">{title}</span>
        </nav>

        <p className="mt-10 text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">
          {meta?.eyebrow || "INKOTANYISINCE90"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold uppercase leading-none tracking-[-0.03em] sm:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-7 text-neutral-500">{description}</p>

        <div className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {CATEGORY_LINKS.map((link) => {
            const active = link.href === `/shop/${collection}` || (collection === "all" && link.href === "/shop");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b pb-1 text-[9px] uppercase tracking-[0.22em] transition sm:text-[10px] ${
                  active
                    ? "border-black font-semibold text-black"
                    : "border-transparent font-light text-neutral-400 hover:border-neutral-300 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 pb-24 sm:px-8 lg:px-12">
        <ShopClient products={items} title={title} />
      </div>
    </div>
  );
}
