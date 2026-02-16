import { useNavigate } from 'react-router-dom';
import './TermsAndServices.css';

function TermsAndServices() {
  const navigate = useNavigate();

  return (
    <div className="terms-services">
      <div className="terms-services__container">
        {/* Back Button */}
        <button 
          className="terms-services__back"
          onClick={() => navigate('/')}
          aria-label="Go back to homepage"
        >
          ← Back to Home
        </button>

        {/* Page Title */}
        <div className="terms-services__header">
          <h1 className="terms-services__title">Terms and Services</h1>
          <p className="terms-services__updated">Last Updated: February 16, 2026</p>
        </div>

        {/* Introduction Section */}
        <section className="terms-section">
          <div className="terms-section__content">
            <p className="terms-intro">
              Welcome to Sneakr.lab. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions. These Terms and Services govern your use of our custom sneaker design platform, including all related services, features, and content we provide. Please read these terms carefully before using our services. If you do not agree with any part of these terms, you must not use our website or services.
            </p>
          </div>
        </section>

        {/* Section 1: Use of Our Services */}
        <section className="terms-section">
          <h2 className="terms-section__title">1. Use of Our Services</h2>
          <div className="terms-section__content">
            <p>
              Sneakr.lab provides a platform for users to design and order custom sneakers. You agree to use our services only for lawful purposes and in accordance with these Terms and Services.
            </p>
            <p>
              <strong>Acceptable Use:</strong> You may use our platform to create custom sneaker designs, browse our product catalog, place orders, and communicate with our support team. You agree to provide accurate information and respect the intellectual property rights of others.
            </p>
            <p>
              <strong>Prohibited Use:</strong> You may not use our services to upload, share, or distribute any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. You may not attempt to gain unauthorized access to our systems, interfere with the proper functioning of our website, or engage in any activity that could damage, disable, or impair our services.
            </p>
          </div>
        </section>

        {/* Section 2: Account Registration */}
        <section className="terms-section">
          <h2 className="terms-section__title">2. Account Registration</h2>
          <div className="terms-section__content">
            <p>
              To access certain features of our platform, you may be required to create an account. When registering, you must provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p>
              You agree to notify us immediately of any unauthorized use of your account or any other breach of security. Sneakr.lab will not be liable for any loss or damage arising from your failure to comply with these security obligations. You may not use another person's account without permission or create an account using false information.
            </p>
          </div>
        </section>

        {/* Section 3: Custom Design Responsibility */}
        <section className="terms-section">
          <h2 className="terms-section__title">3. Custom Design Responsibility</h2>
          <div className="terms-section__content">
            <p>
              As a user of our custom sneaker design platform, you are solely responsible for any designs, logos, images, text, or other content that you upload or create using our services. You represent and warrant that you own or have the necessary rights, licenses, and permissions to use and authorize us to use all content you provide.
            </p>
            <p>
              <strong>Prohibited Content:</strong> You may not upload or use any copyrighted material, trademarks, or other intellectual property without proper authorization from the rights holder. You may not submit designs containing illegal content, hate speech, violent imagery, or any material that infringes upon the rights of others.
            </p>
            <p>
              Sneakr.lab reserves the right to review, reject, or remove any custom designs that violate these terms or that we deem inappropriate at our sole discretion. You agree to indemnify and hold Sneakr.lab harmless from any claims arising from your use of unauthorized or prohibited content.
            </p>
          </div>
        </section>

        {/* Section 4: Orders and Payments */}
        <section className="terms-section">
          <h2 className="terms-section__title">4. Orders and Payments</h2>
          <div className="terms-section__content">
            <p>
              All orders placed through Sneakr.lab must be paid in full before production begins. We accept various payment methods as indicated on our checkout page. By providing payment information, you represent and warrant that you have the legal right to use the payment method provided.
            </p>
            <p>
              <strong>Pricing:</strong> All prices displayed on our website are in the currency specified and are subject to change without prior notice. We reserve the right to modify our pricing at any time. However, orders that have already been confirmed and paid will honor the price at the time of purchase.
            </p>
            <p>
              <strong>Order Confirmation:</strong> Once you place an order, you will receive an order confirmation email. This confirmation does not constitute our acceptance of your order. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraudulent activity.
            </p>
          </div>
        </section>

        {/* Section 5: Production and Delivery */}
        <section className="terms-section">
          <h2 className="terms-section__title">5. Production and Delivery</h2>
          <div className="terms-section__content">
            <p>
              Custom sneaker production typically takes 10 business days from the date of order confirmation. This timeframe includes design preparation, printing, assembly, quality control, and packaging. Estimated delivery times are provided at checkout and are based on your selected shipping method and destination.
            </p>
            <p>
              <strong>Production Process:</strong> Our innovative production process involves setting up physical shoe components to match your design specifications, printing on all parts, drying, sewing components together, forming the shoe, sealing to preserve the design, heat treatment, and final packaging.
            </p>
            <p>
              <strong>Shipping and Delays:</strong> While we strive to meet all estimated delivery dates, shipping times may be affected by factors beyond our control, including customs delays, natural disasters, carrier issues, or other unforeseen circumstances. Sneakr.lab is not responsible for delays caused by shipping carriers or customs authorities.
            </p>
          </div>
        </section>

        {/* Section 6: Refund and Returns */}
        <section className="terms-section">
          <h2 className="terms-section__title">6. Refund and Returns</h2>
          <div className="terms-section__content">
            <p>
              We want you to be completely satisfied with your custom sneakers. Our refund and return policy allows for refund requests within 7 days of delivery for qualifying issues. Items must be unused, unworn, and in their original condition with all tags and packaging intact.
            </p>
            <p>
              <strong>Refund Eligibility:</strong> Refunds may be issued for cases including wrong size received, damaged products, manufacturing defects, wrong items received, or significant shipping delays. Custom-designed shoes may have limited refund eligibility depending on the specific issue, as each pair is made to order with your unique design specifications.
            </p>
            <p>
              For complete details on our refund process, eligibility requirements, and instructions for submitting a refund request, please visit our <strong>Refund Policy</strong> page. By placing an order, you acknowledge that you have read and agree to our refund terms.
            </p>
          </div>
        </section>

        {/* Section 7: Intellectual Property */}
        <section className="terms-section">
          <h2 className="terms-section__title">7. Intellectual Property</h2>
          <div className="terms-section__content">
            <p>
              All content on the Sneakr.lab website, including but not limited to text, graphics, logos, images, design tools, software, and overall website design, is the exclusive property of Sneakr.lab and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              <strong>Platform Content:</strong> You may not copy, reproduce, distribute, modify, create derivative works from, publicly display, or otherwise use any content from our website without our express written permission. This includes our brand name, logo, design interface, and any proprietary technology we use to provide our services.
            </p>
            <p>
              <strong>User-Generated Content:</strong> By uploading designs or content to our platform, you grant Sneakr.lab a non-exclusive, worldwide, royalty-free license to use, reproduce, and display your content solely for the purpose of providing our services, including producing your custom sneakers and displaying your designs in your account.
            </p>
          </div>
        </section>

        {/* Section 8: Limitation of Liability */}
        <section className="terms-section">
          <h2 className="terms-section__title">8. Limitation of Liability</h2>
          <div className="terms-section__content">
            <p>
              To the fullest extent permitted by applicable law, Sneakr.lab and its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses, resulting from your use or inability to use our services.
            </p>
            <p>
              <strong>Service Availability:</strong> We do not guarantee that our services will be uninterrupted, secure, or error-free. We may experience technical issues, maintenance periods, or other disruptions. Sneakr.lab is not liable for any damages resulting from such interruptions or from any errors or omissions in our content.
            </p>
            <p>
              <strong>Maximum Liability:</strong> In no event shall Sneakr.lab's total liability to you for all damages, losses, and causes of action exceed the amount you paid to us for services during the six months prior to the claim. Some jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, so the above limitations may not apply to you.
            </p>
          </div>
        </section>

        {/* Section 9: Modifications to Terms */}
        <section className="terms-section">
          <h2 className="terms-section__title">9. Modifications to Terms</h2>
          <div className="terms-section__content">
            <p>
              Sneakr.lab reserves the right to modify, update, or change these Terms and Services at any time without prior notice. When we make changes, we will update the "Last Updated" date at the top of this page. It is your responsibility to review these terms periodically to stay informed of any updates.
            </p>
            <p>
              <strong>Acceptance of Changes:</strong> Your continued use of our website and services following the posting of any changes to these Terms and Services constitutes your acceptance of such changes. If you do not agree to the modified terms, you must discontinue your use of our services immediately.
            </p>
            <p>
              <strong>Notification:</strong> For significant changes to these terms, we may provide additional notice through email or a prominent announcement on our website. However, it is ultimately your responsibility to check for updates regularly.
            </p>
          </div>
        </section>

        {/* Section 10: Governing Law */}
        <section className="terms-section">
          <h2 className="terms-section__title">10. Governing Law</h2>
          <div className="terms-section__content">
            <p>
              These Terms and Services shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions. Our business operations are based in Angeles City, Philippines, and these terms are subject to Philippine law.
            </p>
            <p>
              <strong>Dispute Resolution:</strong> Any disputes arising out of or relating to these Terms and Services or your use of our services shall be resolved through binding arbitration in accordance with Philippine law, or in the courts of the Philippines if arbitration is not applicable. You agree to submit to the personal jurisdiction of the courts located in the Philippines.
            </p>
            <p>
              <strong>International Users:</strong> If you access our services from outside the Philippines, you are responsible for compliance with local laws in your jurisdiction. By using our services, you consent to the transfer of your information to the Philippines and agree that Philippine law governs these terms.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="terms-section terms-section--contact">
          <h2 className="terms-section__title">Questions or Concerns?</h2>
          <div className="terms-section__content">
            <p>
              If you have any questions, concerns, or require clarification regarding these Terms and Services, please do not hesitate to contact us. We are committed to ensuring that you understand your rights and obligations when using our platform.
            </p>
            <p className="terms-contact-info">
              <strong>Email:</strong> <a href="mailto:support@sneakrlab.com" className="terms-link">support@sneakrlab.com</a><br />
              <strong>Business Address:</strong> Angeles City, Philippines<br />
              <strong>Phone:</strong> +1 (857) 380-2244
            </p>
            <p>
              Thank you for choosing Sneakr.lab. We look forward to helping you create custom sneakers that represent your unique style and creativity.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TermsAndServices;
