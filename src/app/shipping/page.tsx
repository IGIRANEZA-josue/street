import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Shipping | INKOTANYISINCE90", description: "Shipping information for INKOTANYISINCE90 orders." };

export default function Page() {
  return (
    <InfoPage eyebrow="Support" title="Shipping" updated="July 20, 2026">
      <section>
        <h2>Delivery address</h2>
        <p>We arrange shipment of products to the address provided at checkout. Please review the address carefully before completing your purchase.</p>
      </section>
      <section>
        <h2>Shipping and taxes</h2>
        <p>Shipping and taxes are calculated at checkout. Shipping and delivery dates are estimates only and are not guaranteed.</p>
      </section>
      <section>
        <h2>Delays, loss and damage</h2>
        <p>INKOTANYISINCE90 is not responsible for delays caused by shipping carriers. If products are lost or damaged in transit before delivery, contact us and we will work with you to resolve the issue, which may include replacement or refund at our discretion.</p>
      </section>
      <section>
        <h2>Order help</h2>
        <p>For an order issue, email <a href="mailto:contact@inkotanyisince90.com">contact@inkotanyisince90.com</a> with your order number and a brief description.</p>
      </section>
    </InfoPage>
  );
}
