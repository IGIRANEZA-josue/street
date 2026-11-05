import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Sales Policy | INKOTANYISINCE90", description: "All sales are final. INKOTANYISINCE90 sales, cancellation and defective product policy." };

export default function Page() {
  return (
    <InfoPage eyebrow="Support" title="Sales Policy" updated="July 20, 2026">
      <section>
        <h2>All sales final</h2>
        <p><strong>All sales are final due to the low cost of goods.</strong> We do not offer returns or exchanges. Please review your order carefully before completing your purchase.</p>
      </section>
      <section>
        <h2>Kigali order cancellation</h2>
        <p>Kigali consumers have the right to cancel an order within forty-eight (48) hours of placing it, provided the order has not shipped.</p>
      </section>
      <section>
        <h2>Incorrect or defective items</h2>
        <p>If an item is incorrect or defective, email us at <a href="mailto:contact@inkotanyisince90.com">contact@inkotanyisince90.com</a> and we will take responsibility and resolve it promptly. Please include your order number and a brief description.</p>
        <p>Defective products must be reported within seven (7) days from delivery confirmation to be eligible for a replacement or refund. Misuse, improper care, alterations, or damage occurring after delivery are not considered defects.</p>
      </section>
      <section>
        <h2>After shipment</h2>
        <p>We do not accept returns or exchanges for products that have been shipped, except for defective products or as otherwise required by applicable law.</p>
      </section>
    </InfoPage>
  );
}
