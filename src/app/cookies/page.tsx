"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Choice = "all" | "necessary" | "current";

export default function CookiesPage() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("is90-cookie-choice");
      if (stored === "all" || stored === "necessary" || stored === "current") setChoice(stored);
    } catch {}
  }, []);

  const save = (value: Choice) => {
    setChoice(value);
    setSaved(true);
    try {
      localStorage.setItem("is90-cookie-choice", value);
    } catch {}
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="mx-auto max-w-3xl bg-white px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">Privacy</p>
      <h1 className="mt-4 text-4xl font-semibold uppercase leading-tight tracking-[-0.03em] sm:text-5xl">Manage Cookie Preferences</h1>

      <div className="mt-10 space-y-8 text-[15px] font-light leading-8 text-neutral-600">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900">Your Privacy Choices</h2>
          <p>In this panel you can express some preferences related to the processing of your personal information. You may review and change the expressed choices at any time by resurfacing this panel through the privacy settings link available on the website.</p>
        </section>
        <section className="border border-neutral-200 p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900">Strictly Necessary</h2>
              <p className="mt-2">Required for checkout, cart, security and core website operation.</p>
            </div>
            <span className="shrink-0 bg-black px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-white">Always on</span>
          </div>
        </section>
        <section className="border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900">Targeted Analytics</h2>
          <p className="mt-2">Helps us understand website usage and improve the shopping experience. Your current choice is <strong className="font-medium text-neutral-900">{choice ? choice : "not set"}</strong>.</p>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900">More Information</h2>
          <p>For more information about our privacy practices, please visit our <Link href="/privacy" className="text-black underline">Privacy Policy</Link>. Contact us at <a href="mailto:contact@inkotanyisince90.com" className="text-black underline">contact@inkotanyisince90.com</a>.</p>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <button onClick={() => save("all")} className="bg-black px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800">Accept All</button>
        <button onClick={() => save("necessary")} className="border border-black px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.2em] transition hover:bg-black hover:text-white">Reject All</button>
        <button onClick={() => save("current")} className="border border-neutral-300 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.2em] transition hover:border-black">Accept Current</button>
      </div>
      {saved && <p className="mt-4 text-sm text-neutral-500" role="status">Preferences saved.</p>}
    </div>
  );
}
