import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Privacy Policy | INKOTANYISINCE90", description: "How INKOTANYISINCE90 collects, uses, stores and protects personal information." };

export default function Page() {
  return (
    <InfoPage eyebrow="Legal" title="Privacy Policy" updated="July 20, 2026">
      <section>
        <h2>Introduction</h2>
        <p>At INKOTANYISINCE90, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect the information you provide when you visit our website, place an order, or communicate with us.</p>
        <p>Our goal is to provide a secure and trustworthy shopping experience. By using our website or purchasing our products, you agree to the practices described in this Privacy Policy.</p>
      </section>
      <section>
        <h2>Information we collect</h2>
        <p>When you place an order or contact us, we may collect your full name, email address, phone number, shipping address, billing address, order information, payment confirmation details and messages you send to us.</p>
        <p>When you visit the website, we may automatically collect your IP address, browser type, device type, operating system, pages visited, time spent on the website and website usage information.</p>
      </section>
      <section>
        <h2>How we use your information</h2>
        <p>We use information to process and confirm orders, arrange delivery, send shipping updates, respond to customer inquiries, provide support, improve our website and services, prevent fraud and unauthorized activity, maintain security, and comply with legal obligations.</p>
        <p>We only collect information that is necessary to provide our services efficiently.</p>
      </section>
      <section>
        <h2>Cookies and third parties</h2>
        <p>Our website may use cookies and trusted third-party services to help operate the online store, process payments, deliver orders, understand website performance and improve the shopping experience. See our <a href="/cookies">Cookies</a> page for preference controls.</p>
      </section>
      <section>
        <h2>Your rights and contact</h2>
        <p>To ask about access, correction or deletion of your personal information, contact <a href="mailto:contact@inkotanyisince90.com">contact@inkotanyisince90.com</a>.</p>
      </section>
    </InfoPage>
  );
}
