"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import Wordmark from "@/components/Wordmark";

export function NewsletterForm({ source = "footer" }: { dark?: boolean; source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Subscription failed.");
      setState("done");
      setMessage(data.message || "Thank you for subscribing.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  if (state === "done") {
    return (
      <div className="flex items-center gap-3 border border-neutral-200 bg-neutral-50 px-5 py-4" role="status">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-white">
          <Check size={15} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em]">Subscribed</p>
          <p className="mt-0.5 text-xs font-light text-neutral-500">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className={`flex border ${state === "error" ? "border-red-700" : "border-neutral-900"}`}>
        <label className="sr-only" htmlFor={`newsletter-${source}`}>
          Email address
        </label>
        <input
          id={`newsletter-${source}`}
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setState("idle");
          }}
          placeholder="Email address"
          className="min-w-0 w-full bg-white px-4 py-3.5 text-base font-light normal-case tracking-normal placeholder:text-neutral-400 focus:outline-none sm:text-sm"
        />
        <button
          disabled={state === "loading"}
          className="min-h-[48px] shrink-0 bg-black px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-neutral-800 disabled:opacity-50 sm:px-5 sm:tracking-[0.18em]"
        >
          {state === "loading" ? "Submitting..." : "Subscribe"}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-xs text-red-700" role="alert">
          {message}
        </p>
      )}
      <p className="mt-3 text-[10px] font-light uppercase leading-relaxed tracking-[0.11em] text-neutral-500">
        <strong className="font-semibold text-neutral-700">I consent to receive INKOTANYISINCE90 email marketing.</strong>{" "}
        Consent is not required for purchase. Read our{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>{" "}
        to learn about your rights and our use of your personal information.
      </p>
    </form>
  );
}

const columns = [
  {
    title: "Shop",
    links: [
      ["New", "/shop/new-arrivals"],
      ["Mens", "/shop/men"],
      ["Womens", "/shop/women"],
      ["Accessories", "/shop/accessories"],
      ["Catalogue", "/shop"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Contact", "/contact"],
      ["Order Status", "/order-status"],
      ["Shipping", "/shipping"],
      ["Sales Policy", "/returns"],
      ["Size Guide", "/size-guide"],
      ["FAQ", "/faq"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/privacy"],
      ["Terms of Service", "/terms"],
      ["Accessibility", "/accessibility"],
      ["Cookies", "/cookies"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white text-neutral-900">
      <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <Link href="/" className="inline-flex flex-col items-start" aria-label="INKOTANYISINCE90 home">
              <Wordmark className="[&>span:first-child]:text-[clamp(15px,4.4vw,20px)]" />
            </Link>

            <p className="mt-5 max-w-sm text-sm font-light leading-7 text-neutral-500">
              Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.
            </p>

            <p className="mt-5 text-sm font-light leading-7 text-neutral-500">
              INKOTANYISINCE90
              <br />
              Kigali, Rwanda
              <br />
              <a
                href="mailto:contact@inkotanyisince90.com"
                className="underline underline-offset-4 transition hover:text-black"
              >
                contact@inkotanyisince90.com
              </a>
            </p>

            <div className="mt-8 max-w-sm">
              <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.28em] text-neutral-400">Subscribe</p>
              <NewsletterForm source="footer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-7 lg:gap-x-4">
            {columns.map((column) => (
              <nav key={column.title} className="min-w-0" aria-label={column.title}>
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-400">{column.title}</p>
                <ul className="mt-4 space-y-1 sm:mt-5 sm:space-y-3">
                  {column.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="inline-block py-1.5 text-sm font-light text-neutral-500 transition hover:text-black hover:underline hover:underline-offset-4"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="min-w-0">
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-400">Payment</p>
              <p className="mt-4 text-sm font-light leading-7 text-neutral-500 sm:mt-5">
                MTN Mobile Money
                <br />
                RWF
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-neutral-100 pt-6 text-[9px] uppercase tracking-[0.22em] text-neutral-400 sm:mt-16 sm:flex-row">
          <p>© {new Date().getFullYear()} INKOTANYISINCE90</p>
          <p>Kigali, Rwanda</p>
        </div>
      </div>
    </footer>
  );
}
