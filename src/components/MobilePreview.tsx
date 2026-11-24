"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react";

type DeviceKind = "phone" | "tablet" | "desktop";

type Preset = {
  id: string;
  label: string;
  short: string;
  width: number;
  height: number;
  kind: DeviceKind;
};

const PRESETS: Preset[] = [
  { id: "phone-320", label: "Small phone", short: "320", width: 320, height: 568, kind: "phone" },
  { id: "phone-375", label: "iPhone SE", short: "375", width: 375, height: 667, kind: "phone" },
  { id: "phone-393", label: "iPhone 15 Pro", short: "393", width: 393, height: 852, kind: "phone" },
  { id: "phone-430", label: "iPhone 15 Pro Max", short: "430", width: 430, height: 932, kind: "phone" },
  { id: "tablet-768", label: "Tablet", short: "768", width: 768, height: 1024, kind: "tablet" },
  { id: "laptop-1024", label: "Laptop", short: "1024", width: 1024, height: 768, kind: "desktop" },
  { id: "desktop-1440", label: "Desktop", short: "1440", width: 1440, height: 900, kind: "desktop" },
];

type PageEntry = { label: string; path: string };

const PAGE_GROUPS: { label: string; pages: PageEntry[] }[] = [
  { label: "Home", pages: [{ label: "Homepage", path: "/" }] },
  {
    label: "Shop",
    pages: [
      { label: "Catalogue", path: "/shop/all" },
      { label: "New arrivals", path: "/shop/new-arrivals" },
      { label: "Mens", path: "/shop/men" },
      { label: "Womens", path: "/shop/women" },
      { label: "Accessories", path: "/shop/accessories" },
      { label: "Collections", path: "/collections" },
      { label: "Archive", path: "/archive" },
    ],
  },
  {
    label: "Product",
    pages: [
      { label: "INKOTANYI SCRIPT", path: "/product/inkotanyi-script" },
      { label: "URUGWIRO", path: "/product/urugwiro" },
      { label: "STICKER 1", path: "/product/inkotanyi-sticker-1" },
    ],
  },
  {
    label: "Brand & contact",
    pages: [
      { label: "About", path: "/story" },
      { label: "Contact", path: "/contact" },
      { label: "FAQ", path: "/faq" },
    ],
  },
  {
    label: "Account & orders",
    pages: [
      { label: "Account", path: "/account" },
      { label: "Order status", path: "/order-status" },
      { label: "Checkout", path: "/checkout" },
      { label: "Order confirmed", path: "/checkout/success" },
    ],
  },
  {
    label: "Support & legal",
    pages: [
      { label: "Shipping", path: "/shipping" },
      { label: "Sales policy", path: "/returns" },
      { label: "Size guide", path: "/size-guide" },
      { label: "Privacy", path: "/privacy" },
      { label: "Terms", path: "/terms" },
      { label: "Cookies", path: "/cookies" },
      { label: "Accessibility", path: "/accessibility" },
      { label: "404 page", path: "/preview-404" },
    ],
  },
];

const FLAT_PAGES: PageEntry[] = PAGE_GROUPS.flatMap((group) => group.pages);

type CheckResult = PageEntry & {
  ok: boolean;
  overflow: number;
  offenders: string[];
};

type Inspection = { overflow: number; offenders: string[] };

function inspectDocument(doc: Document, win: Window): Inspection {
  const viewport = win.innerWidth;
  const scrollOverflow = Math.max(0, doc.documentElement.scrollWidth - viewport);
  const offenders: string[] = [];

  if (doc.body) {
    const nodes = doc.body.querySelectorAll<HTMLElement>("*");
    for (const el of Array.from(nodes)) {
      const style = win.getComputedStyle(el);
      if (style.position === "fixed" || style.display === "none" || style.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 && rect.height <= 0) continue;
      if (rect.right > viewport + 1.5 || rect.left < -1.5) {
        const classes =
          typeof el.className === "string"
            ? el.className
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 3)
                .join(".")
            : "";
        offenders.push(`${el.tagName.toLowerCase()}${classes ? `.${classes}` : ""}`);
        if (offenders.length >= 6) break;
      }
    }
  }

  return { overflow: scrollOverflow, offenders };
}

const statusBarTime = "9:41";

export default function MobilePreview() {
  const [presetId, setPresetId] = useState("phone-393");
  const [path, setPath] = useState("/");
  // Where the preview is showing right now. The visitor can navigate inside the
  // frame, so this follows the real location without remounting the iframe.
  const [shownPath, setShownPath] = useState("/");
  const [nonce, setNonce] = useState(0);
  const [scaleMode, setScaleMode] = useState<"fit" | "actual">("fit");
  const [fit, setFit] = useState(0.6);

  const [results, setResults] = useState<CheckResult[]>([]);
  const [running, setRunning] = useState(false);
  const [currentCheck, setCurrentCheck] = useState<Inspection | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");

  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const preset = useMemo(() => PRESETS.find((item) => item.id === presetId) || PRESETS[2], [presetId]);
  const shownPage = FLAT_PAGES.find((page) => page.path === shownPath);
  const pageIndex = Math.max(0, FLAT_PAGES.findIndex((page) => page.path === shownPath));
  const currentPage = shownPage || { label: shownPath, path: shownPath };
  const scale = scaleMode === "fit" ? fit : 1;

  const bezel = preset.kind === "phone" ? 12 : 10;
  const frameWidth = preset.width + bezel * 2;
  const frameHeight = preset.height + bezel * 2;
  const statusBarHeight = preset.kind === "phone" ? 44 : 0;
  const screenHeight = preset.height - statusBarHeight;

  // Clicking a link inside the frame changes the location without firing a new
  // load event, so keep the toolbar in step with what the preview is showing.
  useEffect(() => {
    const id = window.setInterval(() => {
      try {
        const next = frameRef.current?.contentWindow?.location.pathname;
        if (next) setShownPath(next);
      } catch {
        /* the frame is between documents */
      }
    }, 900);
    return () => window.clearInterval(id);
  }, [preset.id, path, nonce]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const availableWidth = el.clientWidth - 40;
      const availableHeight = el.clientHeight - 40;
      setFit(Math.max(0.15, Math.min(1, availableWidth / frameWidth, availableHeight / frameHeight)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [frameWidth, frameHeight]);

  const selectPage = useCallback((next: string) => {
    setPath(next);
    setShownPath(next);
    setCurrentCheck(null);
    setCheckError("");
  }, []);

  const selectPreset = useCallback((next: string) => {
    setPresetId(next);
    setCurrentCheck(null);
    setCheckError("");
    setResults([]);
  }, []);

  const go = useCallback(
    (nextIndex: number) => {
      const next = FLAT_PAGES[(nextIndex + FLAT_PAGES.length) % FLAT_PAGES.length];
      selectPage(next.path);
    },
    [selectPage],
  );

  const checkCurrent = () => {
    setChecking(true);
    setCheckError("");
    try {
      const frame = frameRef.current;
      if (!frame?.contentWindow || !frame.contentDocument) throw new Error("Preview not ready yet.");
      setCurrentCheck(inspectDocument(frame.contentDocument, frame.contentWindow));
    } catch {
      setCheckError("The preview has to finish loading before it can be inspected.");
    } finally {
      setChecking(false);
    }
  };

  const runAll = async () => {
    setRunning(true);
    setResults([]);
    setCheckError("");

    const hidden = document.createElement("iframe");
    hidden.setAttribute("title", "Responsive check");
    hidden.style.cssText = `position:fixed;left:-10000px;top:0;width:${preset.width}px;height:${preset.height}px;border:0;opacity:0;pointer-events:none;`;
    document.body.appendChild(hidden);

    try {
      for (const page of FLAT_PAGES) {
        await new Promise<void>((resolve) => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(safety);
            resolve();
          };
          const safety = window.setTimeout(finish, 15000);
          hidden.onload = () => window.setTimeout(finish, 450);
          hidden.src = page.path;
        });

        let inspection: Inspection = { overflow: 0, offenders: [] };
        try {
          if (hidden.contentWindow && hidden.contentDocument) {
            inspection = inspectDocument(hidden.contentDocument, hidden.contentWindow);
          }
        } catch {
          inspection = { overflow: -1, offenders: ["cross-origin frame"] };
        }

        setResults((prev) => [
          ...prev,
          {
            ...page,
            ok: inspection.overflow === 0 && inspection.offenders.length === 0,
            overflow: inspection.overflow,
            offenders: inspection.offenders,
          },
        ]);
      }
    } finally {
      hidden.remove();
      setRunning(false);
    }
  };

  const openInTab = () => {
    window.open(path, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-[1700px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-neutral-400">Responsive review</p>
            <h1 className="mt-2 text-2xl font-semibold uppercase tracking-[-0.01em] sm:text-3xl">Mobile preview</h1>
            <p className="mt-2 max-w-2xl text-sm font-light leading-6 text-neutral-500">
              The live site running inside a phone-sized viewport. Pick a screen, open any page, and use it as a real
              visitor would — the hamburger menu, filters, bag and checkout all work here.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={runAll}
              disabled={running}
              className="inline-flex min-h-[44px] items-center gap-2 bg-black px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {running ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              {running ? `Checking ${results.length}/${FLAT_PAGES.length}` : "Check all pages"}
            </button>
            <button
              onClick={() => {
                setNonce((value) => value + 1);
                setCurrentCheck(null);
                setCheckError("");
                setResults([]);
              }}
              className="inline-flex min-h-[44px] items-center gap-2 border border-neutral-300 bg-white px-4 text-[10px] font-medium uppercase tracking-[0.18em] transition hover:border-black"
            >
              <RefreshCw size={14} /> Reload
            </button>
            <button
              onClick={openInTab}
              className="inline-flex min-h-[44px] items-center gap-2 border border-neutral-300 bg-white px-4 text-[10px] font-medium uppercase tracking-[0.18em] transition hover:border-black"
            >
              <ExternalLink size={14} /> Open page
            </button>
          </div>
        </div>

        {/* Device presets */}
        <div className="mt-7 flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          <span className="shrink-0 text-[9px] font-medium uppercase tracking-[0.24em] text-neutral-400">Screen</span>
          <div className="flex shrink-0 gap-2">
            {PRESETS.map((item) => {
              const Icon = item.kind === "phone" ? Smartphone : item.kind === "tablet" ? Tablet : Monitor;
              const active = item.id === preset.id;
              return (
                <button
                  key={item.id}
                  onClick={() => selectPreset(item.id)}
                  aria-pressed={active}
                  title={`${item.label} — ${item.width} × ${item.height}`}
                  className={`flex min-h-[42px] items-center gap-2 border px-3 text-[10px] font-medium uppercase tracking-[0.12em] transition ${
                    active ? "border-black bg-black text-white" : "border-neutral-300 bg-white hover:border-neutral-500"
                  }`}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  <span>{item.short}px</span>
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex shrink-0 gap-2">
            {(["fit", "actual"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setScaleMode(mode)}
                aria-pressed={scaleMode === mode}
                className={`min-h-[42px] border px-3 text-[10px] font-medium uppercase tracking-[0.12em] transition ${
                  scaleMode === mode ? "border-black bg-black text-white" : "border-neutral-300 bg-white hover:border-neutral-500"
                }`}
              >
                {mode === "fit" ? "Fit" : "100%"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[248px_1fr] xl:grid-cols-[268px_1fr]">
          {/* Page rail */}
          <aside className="hidden min-w-0 lg:block">
            <div className="sticky top-[calc(var(--header-h)+1.5rem)] max-h-[calc(100dvh-var(--header-h)-3rem)] overflow-y-auto overscroll-contain border border-neutral-200 bg-white p-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-neutral-400">Pages</p>
              <div className="mt-3 space-y-5">
                {PAGE_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">{group.label}</p>
                    <ul className="mt-2 space-y-0.5">
                      {group.pages.map((page) => {
                        const active = page.path === path;
                        return (
                          <li key={page.path}>
                            <button
                              onClick={() => selectPage(page.path)}
                              aria-current={active ? "true" : undefined}
                              className={`flex w-full items-center justify-between gap-2 px-2 py-2 text-left text-[12px] transition ${
                                active ? "bg-black font-medium text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                              }`}
                            >
                              <span className="truncate">{page.label}</span>
                              <span className={`shrink-0 text-[9px] ${active ? "text-neutral-400" : "text-neutral-300"}`}>
                                {page.path}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Stage */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 border border-b-0 border-neutral-200 bg-white p-2.5 sm:p-3">
              <button
                onClick={() => go(pageIndex - 1)}
                aria-label="Previous page"
                className="grid h-10 w-10 shrink-0 place-items-center border border-neutral-200 transition hover:border-black"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => go(pageIndex + 1)}
                aria-label="Next page"
                className="grid h-10 w-10 shrink-0 place-items-center border border-neutral-200 transition hover:border-black"
              >
                <ChevronRight size={16} />
              </button>
              <label className="min-w-0 flex-1">
                <span className="sr-only">Preview page</span>
                <select
                  value={shownPage ? shownPath : ""}
                  onChange={(event) => event.target.value && selectPage(event.target.value)}
                  className="min-h-[42px] w-full min-w-0 border border-neutral-200 bg-white px-3 text-base uppercase tracking-[0.06em] focus:border-black focus:outline-none sm:text-[11px] sm:tracking-[0.1em]"
                >
                  {!shownPage && <option value="">{shownPath}</option>}
                  {PAGE_GROUPS.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.pages.map((page) => (
                        <option key={page.path} value={page.path}>
                          {page.label} — {page.path}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              <span className="hidden shrink-0 px-2 text-[9px] uppercase tracking-[0.18em] text-neutral-400 sm:inline">
                {preset.width} × {preset.height}
              </span>
            </div>

            <div
              ref={stageRef}
              className="relative flex h-[62vh] min-h-[440px] items-center justify-center overflow-auto border border-neutral-200 bg-[radial-gradient(circle_at_50%_0%,#ffffff_0%,#f4f4f1_55%,#e9e9e4_100%)] p-5 sm:h-[68vh] sm:min-h-[520px] lg:h-[calc(100dvh-var(--header-h)-19rem)]"
            >
              <div
                className="relative shrink-0"
                style={{ width: frameWidth * scale, height: frameHeight * scale }}
              >
                <div
                  style={{
                    width: frameWidth,
                    height: frameHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                  className={
                    preset.kind === "phone"
                      ? "rounded-[3rem] bg-neutral-900 p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] ring-1 ring-black/20"
                      : "rounded-[1.35rem] bg-neutral-900 p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] ring-1 ring-black/20"
                  }
                >
                  <div
                    className={
                      preset.kind === "phone"
                        ? "relative overflow-hidden rounded-[2.3rem] bg-white"
                        : "relative overflow-hidden rounded-[0.7rem] bg-white"
                    }
                    style={{ width: preset.width, height: preset.height }}
                  >
                    {preset.kind === "phone" && (
                      <>
                        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between bg-white px-6">
                          <span className="text-[10px] font-semibold tracking-[0.02em] text-black">{statusBarTime}</span>
                          <div className="flex items-center gap-1">
                            <span className="flex items-end gap-[2px]" aria-hidden="true">
                              {[5, 8, 11, 14].map((height) => (
                                <span key={height} className="w-[3px] rounded-sm bg-black" style={{ height }} />
                              ))}
                            </span>
                            <svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true">
                              <path d="M7.5 9.6 5.9 8a2.3 2.3 0 0 1 3.2 0L7.5 9.6Z" fill="#111" />
                              <path d="M4.4 6.5a4.9 4.9 0 0 1 6.2 0" stroke="#111" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                              <path d="M2.4 4.3a8 8 0 0 1 10.2 0" stroke="#111" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                            </svg>
                            <span className="ml-0.5 flex h-[10px] w-[20px] items-center rounded-[3px] border border-black/70 p-[1.5px]">
                              <span className="h-full w-[75%] rounded-[1px] bg-black" />
                            </span>
                          </div>
                        </div>
                        <div className="pointer-events-none absolute left-1/2 top-[7px] z-30 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-neutral-900" />
                      </>
                    )}

                    <iframe
                      key={`${preset.id}-${path}-${nonce}`}
                      ref={frameRef}
                      title={`${currentPage.label} on a ${preset.width}px wide screen`}
                      src={path}
                      onLoad={(event) => {
                        try {
                          const next = event.currentTarget.contentWindow?.location.pathname;
                          if (next) setShownPath(next);
                        } catch {
                          /* cross-origin guard */
                        }
                      }}
                      style={{
                        display: "block",
                        width: preset.width,
                        height: screenHeight,
                        marginTop: statusBarHeight,
                        border: 0,
                        background: "#ffffff",
                      }}
                    />

                    {preset.kind === "phone" && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-5 items-center justify-center">
                        <span className="h-[4px] w-[110px] rounded-full bg-black/25" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Current page + check */}
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3 border border-neutral-200 bg-white p-3.5 sm:p-4">
              <div className="min-w-0">
                <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-400">Now showing</p>
                <p className="mt-1 truncate text-sm font-medium">
                  {currentPage.label} <span className="font-light text-neutral-400">· {shownPath}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={checkCurrent}
                  disabled={checking}
                  className="inline-flex min-h-[40px] items-center gap-2 border border-neutral-300 px-3 text-[10px] font-medium uppercase tracking-[0.14em] transition hover:border-black"
                >
                  Check this page
                </button>
                <Link
                  href={shownPath}
                  target="_blank"
                  className="inline-flex min-h-[40px] items-center gap-2 border border-neutral-300 px-3 text-[10px] font-medium uppercase tracking-[0.14em] transition hover:border-black"
                >
                  Full page <ExternalLink size={12} />
                </Link>
              </div>

              {checkError && <p className="w-full text-xs text-red-700">{checkError}</p>}

              {currentCheck && (
                <div className="w-full border-t border-neutral-100 pt-3" role="status">
                  {currentCheck.overflow === 0 && currentCheck.offenders.length === 0 ? (
                    <p className="flex items-center gap-2 text-xs text-emerald-700">
                      <CheckCircle2 size={14} /> No horizontal overflow at {preset.width}px.
                    </p>
                  ) : (
                    <div className="text-xs text-amber-800">
                      <p className="flex items-center gap-2 font-medium">
                        <AlertTriangle size={14} /> {currentCheck.overflow > 0 ? `${currentCheck.overflow}px of sideways overflow` : "Elements extend past the edge"}
                      </p>
                      {currentCheck.offenders.length > 0 && (
                        <p className="mt-1 break-words font-mono text-[10px] leading-5 text-neutral-500">
                          {currentCheck.offenders.join(" · ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* All-page report */}
            {(results.length > 0 || running) && (
              <div className="mt-4 border border-neutral-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 px-4 py-3">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em]">
                    Responsive check at {preset.width}px
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {results.length}/{FLAT_PAGES.length} pages
                    {!running && results.length === FLAT_PAGES.length
                      ? ` · ${results.filter((item) => item.ok).length} pass`
                      : ""}
                  </p>
                </div>
                <div className="h-1 w-full bg-neutral-100">
                  <div
                    className="h-1 bg-black transition-all"
                    style={{ width: `${(results.length / FLAT_PAGES.length) * 100}%` }}
                  />
                </div>
                <ul className="max-h-[320px] divide-y divide-neutral-100 overflow-y-auto overscroll-contain">
                  {results.map((result) => (
                    <li key={result.path} className="flex flex-wrap items-start justify-between gap-2 px-4 py-2.5 text-xs">
                      <span className="flex min-w-0 items-center gap-2">
                        {result.ok ? (
                          <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                        ) : (
                          <AlertTriangle size={14} className="shrink-0 text-amber-600" />
                        )}
                        <button onClick={() => selectPage(result.path)} className="truncate text-left hover:underline">
                          {result.label}
                        </button>
                        <span className="hidden shrink-0 text-[10px] text-neutral-400 sm:inline">{result.path}</span>
                      </span>
                      {result.ok ? (
                        <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-emerald-700">Pass</span>
                      ) : (
                        <span className="min-w-0 text-right text-[10px] text-amber-700">
                          {result.overflow > 0 ? `+${result.overflow}px` : "review"}{" "}
                          {result.offenders.length > 0 && (
                            <span className="block w-full max-w-[190px] truncate font-mono text-[9px] text-neutral-400 sm:max-w-[280px]">
                              {result.offenders[0]}
                            </span>
                          )}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-4 text-[11px] font-light leading-5 text-neutral-400">
              Tip: the preview is the real site inside a {preset.width}px-wide frame, so the menu, product pages,
              filters, bag and forms behave exactly as they would on a device. Switch screens to compare phone, tablet
              and desktop layouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
