import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Terms of Service | INKOTANYISINCE90", description: "Terms governing access to and use of INKOTANYISINCE90." };

export default function Page() {
  return (
    <InfoPage eyebrow="Legal" title="Terms of Service" updated="July 20, 2026">
      <section>
        <h2>Introduction</h2>
        <p>This website, located at www.inkotanyisince90.com, is operated by INKOTANYISINCE90. These Terms govern your access to and use of the website and related online services, content and features.</p>
        <p>By browsing the website or placing an order, you acknowledge that you have read, understand and agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the service.</p>
      </section>
      <section>
        <h2>Products and pricing</h2>
        <p>INKOTANYISINCE90 provides an online platform through which customers may browse and purchase INKOTANYISINCE90 branded products. Product descriptions, images and pricing are subject to change without notice. Certain products may be available in limited quantities.</p>
        <p>Prices are displayed in Rwandan francs (RWF). In the event of a pricing error, we reserve the right to cancel affected orders.</p>
      </section>
      <section>
        <h2>Order acceptance and payment</h2>
        <p>By submitting payment information, you authorize INKOTANYISINCE90 and its payment processors to charge the full amount of your order, including applicable taxes and shipping. You represent that all payment information is accurate and that you are authorized to use the payment method provided.</p>
      </section>
      <section>
        <h2>Shipping, final sale and returns</h2>
        <p>We arrange shipment to the address provided at checkout. Shipping and delivery dates are estimates only and are not guaranteed. All sales are final except where required by applicable law. We do not accept returns or exchanges for products that have been shipped, except for defective products or as otherwise required by law.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions about these Terms can be sent to <a href="mailto:contact@inkotanyisince90.com">contact@inkotanyisince90.com</a>. INKOTANYISINCE90 is based in Kigali, Rwanda.</p>
      </section>
    </InfoPage>
  );
}
