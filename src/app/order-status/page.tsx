"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/catalog";

const inputClass = "w-full border border-neutral-200 bg-white px-4 py-3 text-sm font-light focus:border-black focus:outline-none placeholder:text-neutral-400";
const labelClass = "mb-1.5 block text-[9px] font-medium uppercase tracking-[0.24em] text-neutral-500";

type StatusOrder = {
  orderNumber: string;
  status: string;
  createdAt: string;
  totalCents: number;
  items: { name: string; sku: string; size: string; qty: number; priceCents: number }[];
};

export default function OrderStatusPage() {
  const [form, setForm] = useState({ email: "", orderNumber: "", address: "" });
  const [order, setOrder] = useState<StatusOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const response = await fetch("/api/order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Order not found.");
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not check this order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl bg-white px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-center text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">INKOTANYISINCE90</p>
      <h1 className="mt-4 text-center text-4xl font-semibold uppercase leading-tight tracking-[-0.03em] sm:text-5xl">View Order Status</h1>
      <p className="mx-auto mt-5 max-w-md text-center text-sm font-light leading-7 text-neutral-500">
        Enter the email address, order number, and shipping address from your order.
      </p>

      <form onSubmit={submit} className="mt-10 space-y-4">
        <label className="block">
          <span className={labelClass}>Email Address</span>
          <input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Order Number</span>
          <input required value={form.orderNumber} onChange={(event) => setForm({ ...form, orderNumber: event.target.value })} placeholder="IS90-00000000" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Shipping Address</span>
          <input required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Address used at checkout" className={inputClass} />
        </label>
        {error && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
        <button disabled={loading} className="w-full bg-black py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white transition hover:bg-neutral-800 disabled:opacity-50">
          {loading ? "Checking..." : "View Order"}
        </button>
      </form>

      {order && (
        <section className="mt-8 border border-neutral-200 p-6" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.24em] text-neutral-400">Order</p>
              <p className="mt-1 text-xl font-semibold tracking-[0.04em]">{order.orderNumber}</p>
              <p className="mt-1 text-xs font-light text-neutral-500">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <span className="bg-black px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white">{order.status}</span>
          </div>
          <ul className="mt-6 space-y-2 border-t border-neutral-100 pt-5 text-sm font-light">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between gap-4">
                <span>{item.name} <span className="text-neutral-400">· {item.sku} · Size {item.size} × {item.qty}</span></span>
                <span>{formatPrice(item.priceCents * item.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex justify-between border-t border-neutral-100 pt-4 text-sm font-semibold"><span className="uppercase">Total</span><span>{formatPrice(order.totalCents)}</span></p>
        </section>
      )}

      <Link href="/" className="mt-10 block text-center text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500 underline underline-offset-4 transition hover:text-black">
        Go back to INKOTANYISINCE90
      </Link>
    </div>
  );
}
