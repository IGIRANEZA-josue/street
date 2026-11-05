"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/catalog";

type Stored = {
  orderNumber: string;
  email: string;
  name: string;
  totalCents: number;
  shippingCents: number;
  items: { name: string; size: string; qty: number; priceCents: number; sku: string }[];
};

function SuccessInner() {
  const params = useSearchParams();
  const orderParam = params.get("order");
  const [order, setOrder] = useState<Stored | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("is90-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <div className="mx-auto max-w-3xl bg-white px-4 py-20 text-center sm:py-24">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-black text-white">
        <CheckCircle2 size={30} strokeWidth={1.5} />
      </span>
      <p className="mt-7 text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">Order confirmed</p>
      <h1 className="mt-4 text-4xl font-semibold uppercase leading-tight tracking-[-0.03em] sm:text-5xl">Thank you</h1>
      <p className="mx-auto mt-5 max-w-md text-sm font-light leading-7 text-neutral-500">
        {order ? (
          <>Your order has been received. Order confirmation details were submitted for <strong className="font-medium text-neutral-900">{order.email}</strong>.</>
        ) : (
          "Your order has been received."
        )}
      </p>

      <div className="mx-auto mt-9 max-w-md border border-neutral-200 p-6 text-left">
        <p className="text-[9px] font-light uppercase tracking-[0.28em] text-neutral-400">Order number</p>
        <p className="mt-2 text-2xl font-semibold tracking-[0.04em]">{order?.orderNumber || orderParam || "IS90-________"}</p>

        {order && (
          <>
            <ul className="mt-6 space-y-2 border-t border-neutral-100 pt-5 text-sm font-light">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between gap-3">
                  <span>{item.name} <span className="text-neutral-400">· {item.sku} · Size {item.size} × {item.qty}</span></span>
                  <span>{formatPrice(item.priceCents * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-1 border-t border-neutral-100 pt-4 text-sm font-light">
              <p className="flex justify-between"><span className="text-neutral-500">Shipping</span><span>Calculated at confirmation</span></p>
              <p className="flex justify-between text-base font-semibold"><span className="uppercase">Total</span><span>{formatPrice(order.totalCents)}</span></p>
            </div>
          </>
        )}
        <p className="mt-5 text-xs font-light leading-6 text-neutral-500">
          Keep your order number for status checks. For an incorrect or defective item, email contact@inkotanyisince90.com with your order number and a brief description.
        </p>
      </div>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/order-status" className="bg-black px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800">
          View order status
        </Link>
        <Link href="/shop" className="border border-neutral-300 px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] transition hover:border-black">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm font-light text-neutral-400">Loading...</div>}>
      <SuccessInner />
    </Suspense>
  );
}
