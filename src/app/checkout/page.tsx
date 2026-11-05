"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/store/cart";

const inputClass = "w-full border border-neutral-200 bg-white px-4 py-3 text-sm font-light focus:border-black focus:outline-none placeholder:text-neutral-400";
const labelClass = "mb-1.5 block text-[9px] font-medium uppercase tracking-[0.24em] text-neutral-500";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "Rwanda",
    street: "",
    phone: "",
    paymentPhone: "",
    offers: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (key: string, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const placeOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Valid email required";
    if (!form.firstName.trim()) nextErrors.firstName = "First name required";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name required";
    if (!form.address.trim()) nextErrors.address = "Address required";
    if (!form.city.trim()) nextErrors.city = "City required";
    if (!form.country.trim()) nextErrors.country = "Country required";
    if (!form.phone.trim()) nextErrors.phone = "Phone number required";
    if (!form.paymentPhone.trim()) nextErrors.paymentPhone = "MTN phone number required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setPlacing(true);
    setServerError("");
    try {
      const address = [form.address, form.apartment, form.street].filter(Boolean).join(", ");
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: `${form.firstName} ${form.lastName}`.trim(),
          address,
          city: form.city,
          country: form.country,
          phone: form.phone,
          notes: `MTN Mobile Money: ${form.paymentPhone}${form.offers ? " · Email offers accepted" : ""}`,
          items: items.map((item) => ({ slug: item.slug, size: item.size, color: item.color, qty: item.qty })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Order failed.");
      sessionStorage.setItem("is90-last-order", JSON.stringify({ ...data, email: form.email, name: `${form.firstName} ${form.lastName}`, items }));
      clear();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Could not place the order.");
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-3xl font-semibold uppercase tracking-[-0.02em]">Your cart is empty</p>
        <p className="mt-3 text-sm font-light text-neutral-500">Continue shopping to add INKOTANYISINCE90 products.</p>
        <Link href="/shop" className="mt-7 inline-block bg-black px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800">
          Continue shopping
        </Link>
      </div>
    );
  }

  const Field = ({ label, field, placeholder, type = "text", span = false }: { label: string; field: string; placeholder: string; type?: string; span?: boolean }) => (
    <label className={`block ${span ? "sm:col-span-2" : ""}`}>
      <span className={labelClass}>
        {label} {errors[field] && <span className="text-red-700">— {errors[field]}</span>}
      </span>
      <input
        type={type}
        value={String(form[field as keyof typeof form])}
        onChange={(event) => set(field, event.target.value)}
        placeholder={placeholder}
        className={`${inputClass} ${errors[field] ? "border-red-700" : ""}`}
      />
    </label>
  );

  return (
    <div className="mx-auto max-w-[1300px] bg-white px-4 py-12 sm:px-8 lg:px-12">
      <Link href="/shop" className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500 transition hover:text-black">
        <ArrowLeft size={14} /> Continue shopping
      </Link>
      <div className="mt-8 text-center sm:text-left">
        <h1 className="text-4xl font-semibold uppercase tracking-[-0.03em] sm:text-5xl">Checkout</h1>
        <p className="mt-3 text-sm font-light text-neutral-500">Review your order details and confirm payment securely.</p>
      </div>

      <form onSubmit={placeOrder} className="mt-11 grid gap-12 lg:grid-cols-[1fr_400px]" noValidate>
        <div>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em]">Payment Method</h2>
            <div className="mt-5 border border-black bg-neutral-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.1em]">MTN Mobile Money</p>
                  <p className="mt-1 text-sm font-light text-neutral-500">Pay securely using your MTN phone number.</p>
                </div>
                <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-black text-white"><Check size={10} /></span> Selected
                </span>
              </div>
              <label className="mt-5 block max-w-md">
                <span className={labelClass}>MTN phone number {errors.paymentPhone && <span className="text-red-700">— {errors.paymentPhone}</span>}</span>
                <input value={form.paymentPhone} onChange={(event) => set("paymentPhone", event.target.value)} placeholder="078 / 079 XXX XXXX" className={`${inputClass} ${errors.paymentPhone ? "border-red-700" : ""}`} />
              </label>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em]">Contact Information</h2>
            <div className="mt-5">
              <Field label="Email Address" field="email" type="email" placeholder="you@example.com" />
              <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm font-light text-neutral-600">
                <input type="checkbox" checked={form.offers} onChange={(event) => set("offers", event.target.checked)} className="h-4 w-4 accent-black" />
                Email me with news and offers
              </label>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em]">Shipping Address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="First Name" field="firstName" placeholder="First name" />
              <Field label="Last Name" field="lastName" placeholder="Last name" />
              <Field label="Address" field="address" placeholder="Address" span />
              <Field label="Apartment, Suite, Unit (optional)" field="apartment" placeholder="Optional" span />
              <Field label="City" field="city" placeholder="Kigali" />
              <label className="block">
                <span className={labelClass}>Country</span>
                <select value={form.country} onChange={(event) => set("country", event.target.value)} className={inputClass}>
                  {["Rwanda", "Kenya", "Uganda", "Tanzania", "DR Congo", "Burundi", "South Africa", "Nigeria", "Ghana", "United Kingdom", "France", "Belgium", "Germany", "United States", "Canada", "Other"].map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </label>
              <Field label="Street Name" field="street" placeholder="Street name" />
              <Field label="Phone Number" field="phone" type="tel" placeholder="+250 7XX XXX XXX" />
            </div>
          </section>

          <p className="mt-10 border border-neutral-200 bg-neutral-50 px-5 py-4 text-xs font-light leading-6 text-neutral-500">
            All sales are final due to the low cost of goods. Please review your order carefully before completing your purchase. If an item is incorrect or defective, contact <a className="text-black underline" href="mailto:contact@inkotanyisince90.com">contact@inkotanyisince90.com</a>.
          </p>
        </div>

        <aside className="h-fit border border-neutral-200 bg-white p-6 lg:sticky lg:top-40">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em]">Your Cart</h2>
          <ul className="mt-6 space-y-5">
            {items.map((item) => (
              <li key={item.key} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 bg-white">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                  ) : (
                    <span className="grid h-full place-items-center text-[9px] font-medium uppercase">{item.printLines[0]}</span>
                  )}
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-black text-[9px] font-semibold text-white">{item.qty}</span>
                </div>
                <div className="flex flex-1 justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em]">{item.sku}</p>
                    <p className="mt-1 text-xs font-light uppercase leading-relaxed text-neutral-600">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Size {item.size}</p>
                  </div>
                  <p className="text-xs font-medium">{formatPrice(item.priceCents * item.qty)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-7 space-y-2 border-t border-neutral-100 pt-5 text-sm font-light">
            <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span className="text-right text-xs uppercase tracking-[0.1em]">Calculated at confirmation</span></div>
            <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-semibold"><span className="uppercase">Total</span><span>{formatPrice(subtotal)}</span></div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">Plus shipping and taxes where applicable</p>
          </div>

          {serverError && <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{serverError}</p>}

          <button disabled={placing} className="mt-6 flex w-full items-center justify-center gap-2 bg-black py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white transition hover:bg-neutral-800 disabled:opacity-50">
            <Lock size={14} /> {placing ? "Confirming..." : "Continue to Payment"}
          </button>
          <p className="mt-3 text-center text-[9px] uppercase leading-relaxed tracking-[0.16em] text-neutral-400">Secure payment confirmation · All sales final</p>
        </aside>
      </form>
    </div>
  );
}
