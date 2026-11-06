/**
 * Text wordmark for the brand. Used instead of a logo image file so the
 * header/footer never show a broken image (the official site does not host
 * logo-original.png).
 */
export default function Wordmark({
  className = "",
  sub,
}: {
  className?: string;
  sub?: string;
}) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <span className="font-bold uppercase tracking-[0.3em] text-neutral-900">
        INKOTANYISINCE90
      </span>
      {sub ? (
        <span className="mt-1 text-[7px] font-medium uppercase tracking-[0.34em] text-neutral-400">
          {sub}
        </span>
      ) : null}
    </span>
  );
}
