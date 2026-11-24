"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/catalog";

/**
 * Official INKOTANYISINCE90 product photography presented plainly on white,
 * matching the restraint of the original store.
 *
 * Product photos are hotlinked from the brand's own site. If that host is not
 * reachable from the current environment the frame falls back to the product
 * code, so the grid keeps its proportions instead of showing a broken image.
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
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = src ? failedSrc === src : true;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-white"
      role="img"
      aria-label={`${product.name} — ${product.sku}`}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          onError={() => setFailedSrc(src)}
          className="product-photo object-contain p-[5%]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center px-2 text-center text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-300"
        >
          {product.sku}
        </span>
      )}
    </div>
  );
}
