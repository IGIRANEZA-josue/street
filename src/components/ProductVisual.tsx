"use client";

import Image from "next/image";
import type { Product } from "@/lib/catalog";

/**
 * Official INKOTANYISINCE90 product photography presented plainly on white,
 * matching the restraint of the original store.
 */
export default function ProductVisual({
  product,
  imageIndex = 0,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: {
  product: Pick<Product, "name" | "sku" | "image" | "images">;
  imageIndex?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const src = product.images?.[imageIndex] || product.image;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-white"
      role="img"
      aria-label={`${product.name} — ${product.sku}`}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className="product-photo object-contain p-[5%]"
        />
      ) : null}
    </div>
  );
}
