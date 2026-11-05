import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Size Guide | INKOTANYISINCE90", description: "INKOTANYISINCE90 product sizes." };

export default function Page() {
  return (
    <InfoPage eyebrow="Support" title="Size Guide">
      <section>
        <h2>Apparel sizes</h2>
        <p>Most INKOTANYISINCE90 apparel is available in the following sizes:</p>
        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
            <span key={size} className="border border-neutral-200 py-4 text-center text-sm font-medium text-neutral-900">{size}</span>
          ))}
        </div>
      </section>
      <section>
        <h2>Accessories</h2>
        <p>INKOTANYI STICKER 1 and INKOTANYI STICKER 2 are <strong>One Size</strong>.</p>
      </section>
      <section>
        <h2>Before you order</h2>
        <p>All sales are final, so please review the selected size carefully before completing your purchase. For product-specific sizing help, email <a href="mailto:contact@inkotanyisince90.com">contact@inkotanyisince90.com</a> with the product code, for example IS90-001.</p>
      </section>
    </InfoPage>
  );
}
