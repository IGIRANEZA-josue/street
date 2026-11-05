import type { ReactNode } from "react";

export default function InfoPage({ eyebrow, title, updated, children }: { eyebrow: string; title: ReactNode; updated?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl bg-white px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-[9px] font-light uppercase tracking-[0.32em] text-neutral-400">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-semibold uppercase leading-tight tracking-[-0.03em] sm:text-5xl">{title}</h1>
      {updated && <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400">Last updated: {updated}</p>}
      <div className="mt-10 space-y-9 text-[15px] font-light leading-8 text-neutral-600 [&_a]:text-black [&_a]:underline [&_h2]:mb-3 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-[0.18em] [&_h2]:text-neutral-900 [&_strong]:font-medium [&_strong]:text-neutral-900">
        {children}
      </div>
    </div>
  );
}
