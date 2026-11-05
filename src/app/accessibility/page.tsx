import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Accessibility | INKOTANYISINCE90", description: "INKOTANYISINCE90 accessibility commitment and support." };

export default function Page() {
  return (
    <InfoPage eyebrow="Support" title="Accessibility">
      <section>
        <p>At INKOTANYISINCE90, we are committed to making our website accessible to everyone, including people with disabilities. We continuously work to improve the usability of our website so that all visitors can browse, shop, and access our content with ease.</p>
      </section>
      <section>
        <h2>Disclaimer</h2>
        <p>We are always improving the accessibility of our website. While we strive to provide an inclusive experience for all users, some areas of the site may still require improvement. We appreciate your patience as we continue to enhance accessibility.</p>
      </section>
      <section>
        <h2>Support and contact</h2>
        <p>If you experience any difficulty using our website or need assistance, please contact us. Our team will do its best to provide the support you need.</p>
        <p>Email: <a href="mailto:contact@inkotanyisince90.com">contact@inkotanyisince90.com</a><br />Address: INKOTANYISINCE90, Kigali, Rwanda</p>
        <p>Thank you for helping us create a more accessible experience for everyone.</p>
      </section>
    </InfoPage>
  );
}
