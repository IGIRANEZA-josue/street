"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MapPin } from "lucide-react";

const inputClass = "w-full border border-neutral-200 bg-white px-4 py-3 text-sm font-light focus:border-black focus:outline-none placeholder:text-neutral-400";
const labelClass = "mb-1.5 block text-[9px] font-medium uppercase tracking-[0.24em] text-neutral-500";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "Order Issues", message: "" });
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("busy");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setState("done");
      setMessage(data.message);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Failed to send.");
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] bg-white px-4 py-16 sm:px-8 lg:px-12">
      <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">INKOTANYISINCE90</p>
      <h1 className="mt-4 text-4xl font-semibold uppercase leading-tight tracking-[-0.03em] sm:text-6xl">Contact</h1>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="border border-neutral-200 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em]">All Sales Final</p>
          <p className="mt-4 text-sm font-light leading-7 text-neutral-500">
            All sales are final due to the low cost of goods. We do not offer returns or exchanges. Please review your order carefully before completing your purchase.
          </p>
        </section>
        <section className="border border-neutral-200 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em]">Order Issues</p>
          <p className="mt-4 text-sm font-light leading-7 text-neutral-500">
            If an item is incorrect or defective, email us at <a href="mailto:contact@inkotanyisince90.com" className="text-black underline underline-offset-4">contact@inkotanyisince90.com</a> and we will take responsibility and resolve it promptly.
          </p>
          <p className="mt-3 text-sm font-light leading-7 text-neutral-500">Please include your order number and a brief description.</p>
        </section>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="border border-neutral-100 p-6">
            <Mail size={20} strokeWidth={1.5} />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]">Email</p>
            <a href="mailto:contact@inkotanyisince90.com" className="mt-2 block text-sm font-light text-neutral-500 underline-offset-4 hover:underline">contact@inkotanyisince90.com</a>
          </div>
          <div className="border border-neutral-100 p-6">
            <MapPin size={20} strokeWidth={1.5} />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]">Address</p>
            <p className="mt-2 text-sm font-light leading-7 text-neutral-500">INKOTANYISINCE90<br />Kigali, Rwanda</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          {state === "done" ? (
            <div className="grid h-full min-h-[420px] place-items-center border border-neutral-200 p-10 text-center">
              <div>
                <CheckCircle2 size={40} strokeWidth={1.25} className="mx-auto" />
                <p className="mt-5 text-xl font-medium uppercase tracking-[0.08em]">Message sent</p>
                <p className="mt-2 text-sm font-light text-neutral-500">{message}</p>
                <button onClick={() => { setState("idle"); setForm({ name: "", email: "", subject: "Order Issues", message: "" }); }} className="mt-7 border border-black px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition hover:bg-black hover:text-white">
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4 border border-neutral-200 p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Name</span>
                  <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Email</span>
                  <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" className={inputClass} />
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Subject</span>
                <select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className={inputClass}>
                  {["Order Issues", "Product Question", "Sizing", "Incorrect or Defective Item", "General"].map((subject) => <option key={subject}>{subject}</option>)}
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Message</span>
                <textarea required rows={7} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Include your order number and a brief description." className={inputClass} />
              </label>
              {state === "error" && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{message}</p>}
              <button disabled={state === "busy"} className="w-full bg-black py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white transition hover:bg-neutral-800 disabled:opacity-50">
                {state === "busy" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
