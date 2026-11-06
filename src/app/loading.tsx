import Wordmark from "@/components/Wordmark";

/** Full-screen branded loading screen shown during route transitions. */
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
      role="status"
      aria-label="Loading INKOTANYISINCE90"
    >
      <div className="animate-pulse">
        <Wordmark className="[&>span:first-child]:text-2xl sm:[&>span:first-child]:text-3xl" />
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-[0.34em] text-neutral-400">
        Premium streetwear since 1990
      </p>
      <div
        className="mt-10 h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-black"
        aria-hidden="true"
      />
    </div>
  );
}
