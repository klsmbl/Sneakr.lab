import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './TermsAndServices.css';

function TermsAndServices() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <h1 className="terms-services__title">Terms & Services</h1>
          <p className="terms-services__updated">Last Updated: March 2, 2026</p>
        </div>

        {/* Introduction Section */}
        <section className="terms-section">
          <h2 className="terms-section__title">1. Introduction & Acceptance of Terms</h2>
          <div className="terms-section__content">
            <p>
              Welcome to Sneakr.Lab ("we," "us," "our," or "Company"), a premium custom sneaker design and production platform. These Terms and Conditions ("Terms," "Terms of Service," or "Agreement") constitute a legally binding agreement between you ("User," "you," or "your") and Sneakr.Lab.
            </p>
            <p>
              By accessing, browsing, or using this website (www.sneakrlab.com), mobile application, or any related services (collectively, the "Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy, Cookie Policy, and all applicable laws and regulations.
            </p>
            <p>
              If you do not agree with any part of these Terms, you must immediately discontinue use of our Platform. Your continued use of the Platform following any modifications to these Terms constitutes acceptance of those changes.
            </p>
            <p>
              These Terms apply to all visitors, users, customers, and others who access or use the Platform, whether as a guest or registered user.
            </p>
          </div>
        </section>

        {/* Section 2: Eligibility & Account Registration */}
        <section className="terms-section">
          <h2 className="terms-section__title">2. Eligibility & Account Registration</h2>
          <div className="terms-section__content">
            <p>
              <strong>2.1 Age Requirement:</strong> You must be at least 18 years of age to use our Platform and purchase products. By using this Platform, you represent and warrant that you are of legal age to form a binding contract.
            </p>
            <p>
              <strong>2.2 Account Creation:</strong> To access certain features of the Platform, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p>
              <strong>2.3 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials, including your username and password. You agree to:
            </p>
            <ul className="terms-list">
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Ensure that you log out from your account at the end of each session</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Use a strong, unique password that is not used for other services</li>
            </ul>
            <p>
              <strong>2.4 Account Termination:</strong> We reserve the right to suspend or terminate your account at any time, with or without notice, for violation of these Terms or any applicable laws.
            </p>
          </div>
        </section>

        {/* Section 3: Use of Our Services */}
        <section className="terms-section">
          <h2 className="terms-section__title">3. Acceptable Use Policy</h2>
          <div className="terms-section__content">
            <p>
              You agree to use the Platform only for lawful purposes and in accordance with these Terms. You specifically agree NOT to:
            </p>
            <ul className="terms-list">
              <li>Use the Platform in any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Platform</li>
              <li>Impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
              <li>Use the Platform for fraudulent purposes or in connection with any criminal or illegal activity</li>
              <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Platform, servers, or networks</li>
              <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful</li>
              <li>Submit false, inaccurate, or misleading information when placing orders or communicating with us</li>
              <li>Use any robot, spider, or other automatic device to access the Platform for any purpose without our express written permission</li>
              <li>Collect or harvest any personally identifiable information from the Platform</li>
              <li>Use the Platform to transmit any unsolicited advertising or promotional materials</li>
              <li>Reverse engineer, decompile, or disassemble any portion of the Platform</li>
              <li>Circumvent, disable, or otherwise interfere with security-related features of the Platform</li>
            </ul>
            <p>
              Any violation of this Acceptable Use Policy may result in immediate termination of your account and legal action.
            </p>
          </div>
        </section>

        {/* Section 4: Custom Shoe Orders */}
        <section className="terms-section">
          <h2 className="terms-section__title">4. Custom Shoe Orders & Production</h2>
          <div className="terms-section__content">
            <p>
              <strong>4.1 Order Process:</strong> Custom sneaker orders are processed through our online design tool or business inquiry form. All orders are subject to acceptance and confirmation by Sneakr.Lab.
            </p>
            <p>
              <strong>4.2 Design Approval:</strong> All custom designs must be approved by our production team before manufacturing begins. We reserve the right to refuse any design that:
            </p>
            <ul className="terms-list">
              <li>Infringes on intellectual property rights of third parties</li>
              <li>Contains inappropriate, offensive, or illegal content</li>
              <li>Cannot be technically produced with our current equipment and materials</li>
              <li>Violates any applicable laws or regulations</li>
            </ul>
            <p>
              <strong>4.3 Production Timeline:</strong> Standard production time for custom sneakers is 4-8 weeks from the date of design approval and payment confirmation. Bulk orders may require extended timelines. Production times are estimates and not guarantees.
            </p>
            <p>
              <strong>4.4 Material Availability:</strong> All orders are subject to the availability of materials, fabrics, and components. If materials become unavailable, we will contact you to discuss alternatives or provide a full refund.
            </p>
            <p>
              <strong>4.5 Bulk & Corporate Orders:</strong> Orders exceeding 50 pairs or intended for commercial resale require a separate business agreement and may be subject to different terms, pricing, and production schedules. Please contact our business team for custom quotes.
            </p>
            <p>
              <strong>4.6 Modifications:</strong> Once production has begun, modifications to your order may not be possible. Any requested changes before production starts may incur additional fees and delays.
            </p>
            <p>
              <strong>4.7 Quality Standards:</strong> We maintain high quality standards for all products. Minor variations in color, texture, or finish may occur and do not constitute defects. Each custom sneaker is handcrafted and may have slight variations.
            </p>
          </div>
        </section>

        {/* Section 5: Payments & Pricing */}
        <section className="terms-section">
          <h2 className="terms-section__title">5. Payments, Pricing & Billing</h2>
          <div className="terms-section__content">
            <p>
              <strong>5.1 Pricing:</strong> All prices are listed in United States Dollars (USD) unless otherwise specified. Prices are subject to change at any time without prior notice. The price charged for a product will be the price in effect at the time the order is placed.
            </p>
            <p>
              <strong>5.2 Payment Methods:</strong> We accept the following payment methods:
            </p>
            <ul className="terms-list">
              <li>Major credit cards (Visa, Mastercard, American Express)</li>
              <li>Debit cards</li>
              <li>PayPal</li>
              <li>Wire transfer (for bulk orders over $5,000)</li>
              <li>Other payment methods as may be offered from time to time</li>
            </ul>
            <p>
              <strong>5.3 Payment Terms:</strong> For custom orders, we require:
            </p>
            <ul className="terms-list">
              <li>50% deposit upon order confirmation for orders under $1,000</li>
              <li>50% deposit and 50% before shipping for orders over $1,000</li>
              <li>Full payment upfront for orders under $200</li>
              <li>Custom payment terms may be negotiated for bulk corporate orders</li>
            </ul>
            <p>
              <strong>5.4 Taxes:</strong> Prices do not include applicable sales tax, value-added tax (VAT), goods and services tax (GST), or other taxes. You are responsible for paying all applicable taxes associated with your purchase.
            </p>
            <p>
              <strong>5.5 Currency Conversion:</strong> If you are making a payment in a currency other than USD, the final amount charged may vary due to exchange rate fluctuations and fees imposed by your financial institution.
            </p>
            <p>
              <strong>5.6 Payment Processing:</strong> Payments are processed by secure third-party payment processors. We do not store your complete credit card information on our servers.
            </p>
            <p>
              <strong>5.7 Failed Payments:</strong> If a payment fails or is declined, we will notify you and pause production until payment is successfully processed. Orders may be cancelled if payment issues are not resolved within 7 days.
            </p>
            <p>
              <strong>5.8 Promotional Codes:</strong> Promotional codes and discounts are subject to specific terms and conditions and may not be combined with other offers unless explicitly stated.
            </p>
          </div>
        </section>

        {/* Section 6: Shipping & Delivery */}
        <section className="terms-section">
          <h2 className="terms-section__title">6. Shipping & Delivery</h2>
          <div className="terms-section__content">
            <p>
              <strong>6.1 Shipping Methods:</strong> We offer various shipping options including standard, expedited, and express delivery. Shipping costs are calculated at checkout based on destination and order weight.
            </p>
            <p>
              <strong>6.2 Delivery Timeframes:</strong> Delivery times are estimates and begin from the date of shipment, not the date of order placement. International deliveries may take longer due to customs clearance.
            </p>
            <p>
              <strong>6.3 International Shipping:</strong> International orders may be subject to import duties, taxes, and customs fees imposed by the destination country. You are responsible for paying these additional charges.
            </p>
            <p>
              <strong>6.4 Risk of Loss:</strong> All items purchased from the Platform are shipped pursuant to a shipment contract. Risk of loss and title for items pass to you upon delivery to the carrier.
            </p>
            <p>
              <strong>6.5 Tracking:</strong> Once your order ships, you will receive a tracking number via email to monitor your shipment's progress.
            </p>
            <p>
              <strong>6.6 Delivery Issues:</strong> If your package is lost, stolen, or damaged during shipping, please contact us within 7 days of the expected delivery date. We will work with the carrier to resolve the issue.
            </p>
            <p>
              <strong>6.7 Address Accuracy:</strong> You are responsible for providing accurate shipping information. We are not liable for delays or non-delivery caused by incorrect addresses provided by you.
            </p>
          </div>
        </section>

        {/* Section 7: Intellectual Property */}
        <section className="terms-section">
          <h2 className="terms-section__title">7. Intellectual Property Rights</h2>
          <div className="terms-section__content">
            <p>
              <strong>7.1 Our Intellectual Property:</strong> The Platform and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, audio, design, selection, arrangement, and the "look and feel") are owned by Sneakr.Lab, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              <strong>7.2 Trademarks:</strong> The Sneakr.Lab name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Sneakr.Lab or its affiliates. You must not use such marks without our prior written permission.
            </p>
            <p>
              <strong>7.3 Your Intellectual Property:</strong> When you submit designs, logos, or other content for custom production, you represent and warrant that:
            </p>
            <ul className="terms-list">
              <li>You own or have obtained all necessary rights, licenses, and permissions to use such content</li>
              <li>Your content does not infringe upon any third party's intellectual property rights</li>
              <li>You have the authority to grant us the rights described in these Terms</li>
              <li>Your content does not violate any applicable laws or regulations</li>
            </ul>
            <p>
              <strong>7.4 License Grant:</strong> By submitting designs or content to us, you grant Sneakr.Lab a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display your content solely for the purpose of fulfilling your order and for marketing purposes (unless you opt out).
            </p>
            <p>
              <strong>7.5 Copyright Infringement:</strong> We respect the intellectual property rights of others and expect users to do the same. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please contact us with detailed information.
            </p>
            <p>
              <strong>7.6 Portfolio Use:</strong> We may showcase completed custom projects in our portfolio, website, or marketing materials unless you explicitly request confidentiality in writing at the time of order placement.
            </p>
          </div>
        </section>

        {/* Section 8: Refund & Cancellation Policy */}
        <section className="terms-section">
          <h2 className="terms-section__title">8. Refund, Return & Cancellation Policy</h2>
          <div className="terms-section__content">
            <p>
              <strong>8.1 Custom Products:</strong> Due to the personalized nature of our products, custom sneakers are generally non-refundable and non-returnable once production has commenced. All sales are final unless the product is defective or damaged upon arrival.
            </p>
            <p>
              <strong>8.2 Cancellation Before Production:</strong> You may cancel your order and receive a full refund of any payments made (minus a 5% processing fee) if cancellation occurs before production begins. Once production has started, cancellations are not accepted.
            </p>
            <p>
              <strong>8.3 Defective Products:</strong> If you receive a defective or damaged product, you must notify us within 7 days of delivery. To process a refund or replacement claim, you must provide:
            </p>
            <ul className="terms-list">
              <li>Order number and purchase confirmation</li>
              <li>Date the order was placed</li>
              <li>Date of delivery and tracking information</li>
              <li>Detailed description of the defect or damage</li>
              <li>Clear photographs showing the issue from multiple angles</li>
              <li>Original packaging and all product materials</li>
            </ul>
            <p>
              <strong>8.4 Evaluation Process:</strong> All refund requests are reviewed by our quality assurance team. Approval is at our sole discretion. If approved, you may receive:
            </p>
            <ul className="terms-list">
              <li>A full refund to your original payment method</li>
              <li>A replacement product at no additional cost</li>
              <li>Store credit for future purchases</li>
            </ul>
            <p>
              <strong>8.5 Non-Refundable Items:</strong> The following are not eligible for refund or return:
            </p>
            <ul className="terms-list">
              <li>Products that have been worn, used, or altered</li>
              <li>Products damaged due to misuse or improper care</li>
              <li>Products with minor cosmetic variations that do not affect functionality</li>
              <li>Sale or clearance items marked as final sale</li>
            </ul>
            <p>
              <strong>8.6 Refund Processing:</strong> Approved refunds will be processed within 10-14 business days. Refunds will be issued to the original payment method used for purchase.
            </p>
            <p>
              <strong>8.7 Return Shipping:</strong> If a return is approved, we will provide a prepaid return shipping label for defective products. You are responsible for return shipping costs for non-defective returns (if accepted at our discretion).
            </p>
          </div>
        </section>

        {/* Section 9: Warranties & Disclaimers */}
        <section className="terms-section">
          <h2 className="terms-section__title">9. Warranties & Disclaimers</h2>
          <div className="terms-section__content">
            <p>
              <strong>9.1 Limited Warranty:</strong> We warrant that our products will be free from defects in materials and workmanship for a period of 90 days from the date of delivery. This warranty does not cover normal wear and tear, misuse, or damage caused by accident.
            </p>
            <p>
              <strong>9.2 Disclaimer of Warranties:</strong> EXCEPT AS EXPRESSLY PROVIDED IN SECTION 9.1, THE PLATFORM AND ALL PRODUCTS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, SNEAKR.LAB DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              <strong>9.3 No Guarantee of Availability:</strong> We do not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
            <p>
              <strong>9.4 Third-Party Content:</strong> We are not responsible for the accuracy, reliability, or legality of any third-party content, links, or materials accessed through the Platform.
            </p>
            <p>
              <strong>9.5 Color Variations:</strong> We make every effort to display product colors accurately. However, we cannot guarantee that your device's display of colors accurately reflects the actual product color.
            </p>
          </div>
        </section>

        {/* Section 10: Limitation of Liability */}
        <section className="terms-section">
          <h2 className="terms-section__title">10. Limitation of Liability</h2>
          <div className="terms-section__content">
            <p>
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SNEAKR.LAB, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION:
            </p>
            <ul className="terms-list">
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data or goodwill</li>
              <li>Service interruption</li>
              <li>Computer damage or system failure</li>
              <li>Cost of substitute products or services</li>
            </ul>
            <p>
              WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              <strong>10.2 Maximum Liability:</strong> Our total liability to you for any damages arising from or related to these Terms or your use of the Platform shall not exceed the amount you paid to us in the twelve (12) months preceding the event giving rise to liability, or $500 USD, whichever is greater.
            </p>
            <p>
              <strong>10.3 Exceptions:</strong> Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitations may not apply to you.
            </p>
          </div>
        </section>

        {/* Section 11: Indemnification */}
        <section className="terms-section">
          <h2 className="terms-section__title">11. Indemnification</h2>
          <div className="terms-section__content">
            <p>
              You agree to defend, indemnify, and hold harmless Sneakr.Lab, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
            </p>
            <ul className="terms-list">
              <li>Your violation of these Terms</li>
              <li>Your use or misuse of the Platform</li>
              <li>Your breach of any representation or warranty contained in these Terms</li>
              <li>Your violation of any rights of a third party, including intellectual property rights</li>
              <li>Any content you submit that infringes upon third-party rights</li>
              <li>Any harmful or illegal activity conducted through your account</li>
            </ul>
          </div>
        </section>

        {/* Section 12: Privacy & Data Protection */}
        <section className="terms-section">
          <h2 className="terms-section__title">12. Privacy & Data Protection</h2>
          <div className="terms-section__content">
            <p>
              <strong>12.1 Privacy Policy:</strong> Your use of the Platform is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy to understand our practices regarding the collection, use, and disclosure of your personal information.
            </p>
            <p>
              <strong>12.2 Data Collection:</strong> We collect personal information you provide to us, including but not limited to:
            </p>
            <ul className="terms-list">
              <li>Name, email address, phone number, and shipping address</li>
              <li>Payment information (processed securely through third-party processors)</li>
              <li>Design preferences and customization data</li>
              <li>Communication history and customer service interactions</li>
              <li>Device and usage information, IP address, and browsing activity</li>
            </ul>
            <p>
              <strong>12.3 Data Usage:</strong> We use your personal information to process orders, provide customer support, improve our services, send marketing communications (with your consent), and comply with legal obligations.
            </p>
            <p>
              <strong>12.4 Data Security:</strong> We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p>
              <strong>12.5 Your Rights:</strong> Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or port your data. Contact us to exercise these rights.
            </p>
            <p>
              <strong>12.6 Communication Preferences:</strong> You may opt out of marketing communications at any time by clicking the "unsubscribe" link in our emails or by contacting us directly.
            </p>
          </div>
        </section>

        {/* Section 13: User Generated Content */}
        <section className="terms-section">
          <h2 className="terms-section__title">13. User Generated Content & Reviews</h2>
          <div className="terms-section__content">
            <p>
              <strong>13.1 Submission of Content:</strong> The Platform may allow you to submit reviews, comments, photos, or other content ("User Content"). By submitting User Content, you grant us a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, modify, publish, and distribute such content in any media.
            </p>
            <p>
              <strong>13.2 Content Standards:</strong> All User Content must comply with applicable laws and must not:
            </p>
            <ul className="terms-list">
              <li>Contain false, misleading, or defamatory statements</li>
              <li>Infringe upon intellectual property or privacy rights</li>
              <li>Contain obscene, offensive, or inappropriate material</li>
              <li>Promote illegal activities or violence</li>
              <li>Contain spam, advertising, or solicitations</li>
            </ul>
            <p>
              <strong>13.3 Monitoring & Removal:</strong> We reserve the right (but have no obligation) to monitor, edit, or remove any User Content that violates these Terms or is otherwise objectionable.
            </p>
            <p>
              <strong>13.4 No Endorsement:</strong> User Content does not reflect the views of Sneakr.Lab and we do not endorse or verify the accuracy of any User Content.
            </p>
          </div>
        </section>

        {/* Section 14: Third-Party Links & Services */}
        <section className="terms-section">
          <h2 className="terms-section__title">14. Third-Party Links & Services</h2>
          <div className="terms-section__content">
            <p>
              The Platform may contain links to third-party websites, applications, or services that are not owned or controlled by Sneakr.Lab. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p>
              You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of any such third-party content, goods, or services.
            </p>
            <p>
              We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
            </p>
          </div>
        </section>

        {/* Section 15: Dispute Resolution & Arbitration */}
        <section className="terms-section">
          <h2 className="terms-section__title">15. Dispute Resolution & Arbitration</h2>
          <div className="terms-section__content">
            <p>
              <strong>15.1 Informal Resolution:</strong> In the event of any dispute, claim, or controversy arising out of or relating to these Terms or your use of the Platform, the parties agree to first attempt to resolve the dispute informally by contacting us at support@sneakrlab.com.
            </p>
            <p>
              <strong>15.2 Binding Arbitration:</strong> If the dispute cannot be resolved informally within 30 days, either party may submit the dispute to binding arbitration in accordance with the rules of the American Arbitration Association (AAA).
            </p>
            <p>
              <strong>15.3 Class Action Waiver:</strong> You agree that any arbitration or proceeding shall be limited to the dispute between you and Sneakr.Lab individually. You waive any right to participate in a class action lawsuit or class-wide arbitration.
            </p>
            <p>
              <strong>15.4 Exceptions:</strong> Either party may seek injunctive or other equitable relief in court to protect intellectual property rights without first engaging in arbitration or informal dispute resolution.
            </p>
          </div>
        </section>

        {/* Section 16: Governing Law & Jurisdiction */}
        <section className="terms-section">
          <h2 className="terms-section__title">16. Governing Law & Jurisdiction</h2>
          <div className="terms-section__content">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
            </p>
            <p>
              Any dispute arising out of or relating to these Terms that is not subject to arbitration shall be brought exclusively in the federal or state courts located in Los Angeles County, California, and you consent to the personal jurisdiction of such courts.
            </p>
            <p>
              If you are accessing the Platform from outside the United States, you are responsible for compliance with local laws, and you acknowledge that your information may be transferred to and processed in the United States.
            </p>
          </div>
        </section>

        {/* Section 17: Force Majeure */}
        <section className="terms-section">
          <h2 className="terms-section__title">17. Force Majeure</h2>
          <div className="terms-section__content">
            <p>
              Sneakr.Lab shall not be liable for any failure or delay in performance under these Terms due to circumstances beyond our reasonable control, including but not limited to:
            </p>
            <ul className="terms-list">
              <li>Acts of God, natural disasters, or severe weather conditions</li>
              <li>War, terrorism, civil unrest, or government actions</li>
              <li>Labor disputes, strikes, or lockouts</li>
              <li>Pandemics, epidemics, or public health emergencies</li>
              <li>Supplier failures or material shortages</li>
              <li>Power outages, internet disruptions, or telecommunications failures</li>
              <li>Fire, flood, explosion, or other catastrophic events</li>
            </ul>
            <p>
              In the event of a force majeure situation, we will make reasonable efforts to notify affected customers and resume normal operations as soon as possible.
            </p>
          </div>
        </section>

        {/* Section 18: Termination of Access */}
        <section className="terms-section">
          <h2 className="terms-section__title">18. Termination of Access</h2>
          <div className="terms-section__content">
            <p>
              <strong>18.1 Our Right to Terminate:</strong> We reserve the right to suspend or terminate your access to the Platform at any time, with or without cause, with or without notice, effective immediately. This includes the right to terminate for:
            </p>
            <ul className="terms-list">
              <li>Violation of these Terms or any applicable laws</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abusive behavior toward our staff or other users</li>
              <li>Excessive chargebacks or payment disputes</li>
              <li>Any conduct we deem harmful to the Platform or other users</li>
            </ul>
            <p>
              <strong>18.2 Effect of Termination:</strong> Upon termination, your right to use the Platform will immediately cease. We may delete your account and all associated data. You remain liable for all obligations incurred prior to termination.
            </p>
            <p>
              <strong>18.3 Survival:</strong> Sections relating to intellectual property, disclaimers, limitations of liability, indemnification, and dispute resolution shall survive termination of these Terms.
            </p>
          </div>
        </section>

        {/* Section 19: Changes to Terms */}
        <section className="terms-section">
          <h2 className="terms-section__title">19. Modifications to These Terms</h2>
          <div className="terms-section__content">
            <p>
              We reserve the right to modify, amend, or update these Terms at any time at our sole discretion. Changes will be effective immediately upon posting to the Platform, with the "Last Updated" date revised accordingly.
            </p>
            <p>
              Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes. It is your responsibility to review these Terms periodically for updates.
            </p>
            <p>
              For material changes to these Terms, we may provide additional notice such as an email notification or a prominent notice on the Platform. However, we are not obligated to provide such notice.
            </p>
            <p>
              If you do not agree to the modified Terms, you must immediately stop using the Platform and may request account deletion.
            </p>
          </div>
        </section>

        {/* Section 20: Severability */}
        <section className="terms-section">
          <h2 className="terms-section__title">20. Severability</h2>
          <div className="terms-section__content">
            <p>
              If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if such modification is not possible, it shall be severed from these Terms.
            </p>
            <p>
              The invalidity, illegality, or unenforceability of any provision shall not affect the validity, legality, or enforceability of the remaining provisions, which shall remain in full force and effect.
            </p>
          </div>
        </section>

        {/* Section 21: Entire Agreement */}
        <section className="terms-section">
          <h2 className="terms-section__title">21. Entire Agreement</h2>
          <div className="terms-section__content">
            <p>
              These Terms, together with our Privacy Policy and any other legal notices or policies published by us on the Platform, constitute the entire agreement between you and Sneakr.Lab regarding your use of the Platform.
            </p>
            <p>
              These Terms supersede and replace any prior agreements, understandings, or arrangements between you and Sneakr.Lab, whether written or oral, regarding the subject matter herein.
            </p>
            <p>
              No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term. Our failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
            </p>
          </div>
        </section>

        {/* Section 22: Contact Information */}
        <section className="terms-section terms-section--contact">
          <h2 className="terms-section__title">22. Contact Information</h2>
          <div className="terms-section__content">
            <p>
              If you have any questions, concerns, or feedback regarding these Terms & Services, please contact us through any of the following methods:
            </p>
            <p className="terms-contact-info">
              <strong>Email:</strong> <a href="mailto:support@sneakrlab.com" className="terms-link">support@sneakrlab.com</a><br />
              <strong>Legal Inquiries:</strong> <a href="mailto:legal@sneakrlab.com" className="terms-link">legal@sneakrlab.com</a><br />
              <strong>Business Address:</strong> Angeles City, Pampanga, Philippines<br />
              <strong>Phone:</strong> +63 (917) 123-4567<br />
              <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM PST
            </p>
            <p>
              We aim to respond to all inquiries within 2-3 business days. For urgent matters, please indicate "URGENT" in your subject line.
            </p>
          </div>
        </section>


      </div>
    </div>
  );
}

export default TermsAndServices;
