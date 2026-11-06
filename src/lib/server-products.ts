import { db } from "@/db";
import { products as productsTable } from "@/db/schema";
import { PRODUCTS, type Product } from "./catalog";

let synced = false;

/** Keeps the DB catalogue in sync with the real INKOTANYISINCE90 catalogue. */
async function syncCatalog() {
  if (synced) return;
  const rows = await db.select({ slug: productsTable.slug }).from(productsTable);
  const dbSlugs = new Set(rows.map((r) => r.slug));
  const mismatch = rows.length !== PRODUCTS.length || PRODUCTS.some((p) => !dbSlugs.has(p.slug));
  if (mismatch) {
    await db.delete(productsTable);
    await db.insert(productsTable).values(
      PRODUCTS.map((p) => ({
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents ?? null,
        category: p.category,
        gender: p.gender,
        collections: p.collections,
        colors: p.colors,
        sizes: p.sizes,
        badge: p.badge ?? null,
        image: p.image,
        printStyle: p.printStyle,
        printLines: p.printLines,
        stock: p.stock,
        featured: !!p.featured,
      }))
    );
  }
  synced = true;
}

export async function getProducts(): Promise<Product[]> {
  try {
    await syncCatalog();
    const rows = await db.select().from(productsTable);
    if (rows.length === 0) return PRODUCTS;
    const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));
    return rows.map((r) => {
      const base = bySlug.get(r.slug);
      return {
        ...(base as Product),
        slug: r.slug,
        sku: r.sku,
        name: r.name,
        tagline: r.tagline,
        description: r.description,
        priceCents: r.priceCents,
        compareAtCents: r.compareAtCents ?? undefined,
        category: r.category as Product["category"],
        gender: r.gender as Product["gender"],
        collections: (r.collections as string[]) ?? [],
        colors: (r.colors as Product["colors"]) ?? [],
        sizes: (r.sizes as string[]) ?? [],
        badge: r.badge ?? undefined,
        // Imagery is hotlinked from the official site; ignore stale local paths in the DB.
        image: r.image?.startsWith("/images/") ? base?.image || r.image : r.image || base?.image || "",
        images:
          (r.images as string[])?.length && !(r.images as string[])[0]?.startsWith("/images/")
            ? (r.images as string[])
            : base?.images?.length
              ? base.images
              : (r.images as string[]) ?? [],
        printStyle: r.printStyle as Product["printStyle"],
        printLines: (r.printLines as string[]) ?? [],
        stock: r.stock,
        featured: r.featured,
      };
    });
  } catch {
    return PRODUCTS;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  // Supports both the redesigned slug URLs and the original /product/{id} URLs.
  return all.find((p) => p.slug === slug || p.id === slug);
}
