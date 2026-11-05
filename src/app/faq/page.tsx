"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "What is INKOTANYISINCE90?", a: "Minimalist luxury fashion from Rwanda. Premium streetwear since 1990." },
  { q: "Where is INKOTANYISINCE90 based?", a: "INKOTANYISINCE90 is based in Kigali, Rwanda." },
  { q: "What do the product codes mean?", a: "Each product has an IS90 code. For example, INKOTANYI SCRIPT is IS90-001, URUGWIRO is IS90-005 and INKOTANYI STICKER 1 is IS90-022. The code is shown on every product and in your order confirmation." },
  { q: "What sizes are available?", a: "Most apparel is available in S, M, L, XL, 2XL and 3XL. Stickers are One Size. The exact sizes are shown on each product page." },
  { q: "How do I pay?", a: "Checkout uses MTN Mobile Money. Pay securely using your MTN phone number." },
  { q: "How is shipping calculated?", a: "Shipping and taxes are calculated at checkout. Shipping and delivery dates are estimates only and are not guaranteed." },
  { q: "Can I return or exchange a product?", a: "All sales are final due to the low cost of goods. We do not offer returns or exchanges. Kigali consumers may cancel within forty-eight (48) hours of placing an order, provided it has not shipped." },
  { q: "What if my item is incorrect or defective?", a: "Email contact@inkotanyisince90.com with your order number and a brief description. Defective products must be reported within seven (7) days from delivery confirmation." },
  { q: "How can I check my order?", a: "Use the Order Status page with the email address, order number and shipping address from your order." },
];

export default function FaqPage() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl bg-white px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">Support</p>
      <h1 className="mt-4 text-4xl font-semibold uppercase leading-tight tracking-[-0.03em] sm:text-5xl">FAQ</h1>
      <div className="mt-10 border-t border-neutral-100">
        {FAQS.map((item, index) => (
          <div key={item.q} className="border-b border-neutral-100">
            <button onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 py-5 text-left" aria-expanded={open === index}>
              <span className="text-sm font-medium uppercase tracking-[0.08em] sm:text-base">{item.q}</span>
              <ChevronDown size={18} strokeWidth={1.5} className={`shrink-0 transition-transform ${open === index ? "rotate-180" : "text-neutral-400"}`} />
            </button>
            {open === index && <p className="pb-6 text-sm font-light leading-7 text-neutral-500">{item.a}</p>}
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm font-light text-neutral-500">
        Still need help? <Link href="/contact" className="font-normal text-black underline underline-offset-4">Contact INKOTANYISINCE90</Link> or email <a href="mailto:contact@inkotanyisince90.com" className="text-black underline underline-offset-4">contact@inkotanyisince90.com</a>.
      </p>
    </div>
  );
}
