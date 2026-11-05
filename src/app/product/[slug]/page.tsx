import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getProducts } from "@/lib/server-products";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found | INKOTANYISINCE90" };
  return {
    title: `${product.name} ${product.sku} | INKOTANYISINCE90`,
    description: `${product.description} Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((item) => item.slug !== slug && item.category === product.category)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[1500px] bg-white px-4 py-10 sm:px-8 lg:px-12">
      <nav className="mb-10 text-[9px] font-light uppercase tracking-[0.24em] text-neutral-400" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-black">Home</Link>
        <span className="mx-2 text-neutral-300">/</span>
        <Link href="/shop" className="transition hover:text-black">Catalogue</Link>
        <span className="mx-2 text-neutral-300">/</span>
        <Link href={`/shop/${product.category}`} className="transition hover:text-black">{product.categoryLabel}</Link>
        <span className="mx-2 text-neutral-300">/</span>
        <span className="text-neutral-700">{product.sku}</span>
      </nav>

      <ProductDetailClient product={product} />

      <section className="mt-24 border-t border-neutral-100 pt-12">
        <Reveal>
          <div className="mb-9 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-light uppercase tracking-[0.3em] text-neutral-400">More</p>
              <h2 className="mt-2 text-xl font-medium uppercase tracking-[0.08em]">You may also like</h2>
            </div>
            <Link href={`/shop/${product.category}`} className="hidden text-[10px] uppercase tracking-[0.2em] text-neutral-500 underline underline-offset-4 transition hover:text-black sm:block">
              View {product.categoryLabel}
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
