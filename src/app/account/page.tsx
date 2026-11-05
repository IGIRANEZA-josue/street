"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Package, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/catalog";

type Customer = { id: number; email: string; name: string };
type OrderRow = { orderNumber: string; totalCents: number; status: string; createdAt: string };

const inputClass = "w-full border border-neutral-200 bg-white px-4 py-3 text-sm font-light focus:border-black focus:outline-none placeholder:text-neutral-400";
const labelClass = "mb-1.5 block text-[9px] font-medium uppercase tracking-[0.24em] text-neutral-500";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("is90-customer");
      if (raw) setCustomer(JSON.parse(raw));
      const cached = localStorage.getItem("is90-orders-cache");
      if (cached) setOrders(JSON.parse(cached));
    } catch {}
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, ...form }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");
      setCustomer(data.customer);
      localStorage.setItem("is90-customer", JSON.stringify(data.customer));
      if (data.orders) {
        setOrders(data.orders);
        localStorage.setItem("is90-orders-cache", JSON.stringify(data.orders));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    setCustomer(null);
    setOrders([]);
    localStorage.removeItem("is90-customer");
    localStorage.removeItem("is90-orders-cache");
  };

  if (customer) {
    return (
      <div className="mx-auto max-w-4xl bg-white px-4 py-16 sm:px-6">
        <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">My Account</p>
        <h1 className="mt-4 text-4xl font-semibold uppercase leading-tight tracking-[-0.03em] sm:text-5xl">Hello, {customer.name.split(" ")[0]}</h1>
        <p className="mt-3 text-sm font-light text-neutral-500">{customer.email}</p>

        <div className="mt-10 border border-neutral-200">
          <p className="flex items-center gap-2 border-b border-neutral-100 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <Package size={15} strokeWidth={1.5} /> Order History
          </p>
          {orders.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-light leading-7 text-neutral-500">No orders under this email yet. Confirmed orders will appear here after checkout.</p>
              <Link href="/shop" className="mt-5 inline-flex items-center gap-2 bg-black px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800">
                Continue shopping <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <li key={order.orderNumber} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.06em]">{order.orderNumber}</p>
                    <p className="mt-0.5 text-xs font-light text-neutral-400">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <span className="bg-black px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-white">{order.status}</span>
                  <p className="text-sm font-medium">{formatPrice(order.totalCents)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/order-status" className="border border-black px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition hover:bg-black hover:text-white">Check order status</Link>
          <button onClick={logout} className="flex items-center gap-2 border border-neutral-300 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition hover:border-black">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md bg-white px-4 py-16 sm:py-20">
      <p className="text-center text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">INKOTANYISINCE90</p>
      <h1 className="mt-4 text-center text-4xl font-semibold uppercase leading-tight tracking-[-0.03em]">{mode === "login" ? "Sign In" : "Create Account"}</h1>
      <p className="mt-3 text-center text-sm font-light leading-7 text-neutral-500">
        {mode === "login" ? "Access your account and order history." : "Create an account to view orders linked to your email."}
      </p>

      <div className="mt-8 grid grid-cols-2 border border-black">
        {(["login", "register"] as const).map((item) => (
          <button key={item} onClick={() => { setMode(item); setError(""); }} className={`py-3.5 text-[10px] font-medium uppercase tracking-[0.2em] transition ${mode === item ? "bg-black text-white" : "hover:bg-neutral-50"}`}>
            {item === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-7 space-y-4">
        {mode === "register" && (
          <label className="block">
            <span className={labelClass}>Full Name</span>
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" className={inputClass} />
          </label>
        )}
        <label className="block">
          <span className={labelClass}>Email</span>
          <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Password</span>
          <input required type="password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Minimum 6 characters" className={inputClass} />
        </label>
        {error && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
        <button disabled={busy} className="w-full bg-black py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white transition hover:bg-neutral-800 disabled:opacity-50">
          {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
      <p className="mt-5 text-center text-xs font-light text-neutral-400">
        Read the INKOTANYISINCE90 <Link href="/privacy" className="text-neutral-600 underline underline-offset-4 hover:text-black">Privacy Policy</Link>.
      </p>
    </div>
  );
}
