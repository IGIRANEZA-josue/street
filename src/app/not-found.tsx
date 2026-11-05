import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl bg-white px-4 py-28 text-center">
      <p className="text-7xl font-light tracking-[-0.05em] sm:text-8xl">404</p>
      <h1 className="mt-5 text-2xl font-medium uppercase tracking-[0.06em]">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-sm font-light leading-7 text-neutral-500">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="mt-8 inline-block bg-black px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800">
        Back to Home
      </Link>
    </div>
  );
}
