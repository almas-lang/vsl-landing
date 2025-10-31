import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { trackPageView } from '../lib/track';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  useEffect(() => {
    trackPageView(`/${title.toLowerCase()}`, title);
  }, [title]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{title}</h1>
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const Privacy: React.FC = () => (
  <LegalLayout title="Privacy Policy">
    <div className="space-y-6 text-gray-700">
      <p className="text-lg">
        <strong>Effective Date:</strong> January 1, 2025
      </p>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <p>
          When you register for our webinar or book a strategy call, we collect:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Provide access to our webinar content</li>
          <li>Send you relevant updates and notifications</li>
          <li>Schedule and confirm your strategy calls</li>
          <li>Improve our services</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Storage and Security</h2>
        <p>
          Your data is stored securely using industry-standard encryption. We use Brevo (Sendinblue) 
          as our email service provider and comply with GDPR regulations.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
        <p>
          For privacy-related questions, contact us at{' '}
          <a href="mailto:help@xperiencewave.com" className="text-brand-purple underline">
            help@xperiencewave.com
          </a>
        </p>
      </section>
    </div>
  </LegalLayout>
);

export const Terms: React.FC = () => (
  <LegalLayout title="Terms of Use">
    <div className="space-y-6 text-gray-700">
      <p className="text-lg">
        <strong>Effective Date:</strong> January 1, 2025
      </p>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing our website and services, you agree to be bound by these Terms of Use. 
          If you do not agree, please do not use our services.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Services Provided</h2>
        <p>
          Xperience Wave provides career development services for UX/UI, Product, and Graphic designers 
          including webinars, strategy calls, and mentorship programs.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Obligations</h2>
        <p>You agree to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Provide accurate and complete information</li>
          <li>Maintain the confidentiality of your account</li>
          <li>Not misuse our services or content</li>
          <li>Comply with all applicable laws</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
        <p>
          All content, including webinars, materials, and resources, are the intellectual property 
          of Expwave OPC Private Limited and protected by copyright laws.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
        <p>
          While we strive to provide valuable career guidance, we do not guarantee specific outcomes 
          such as job placements or salary increases. Results may vary based on individual effort 
          and circumstances.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Contact Information</h2>
        <p>
          For questions about these terms, contact us at{' '}
          <a href="mailto:help@xperiencewave.com" className="text-brand-purple underline">
            help@xperiencewave.com
          </a>
        </p>
      </section>
    </div>
  </LegalLayout>
);

export const Refund: React.FC = () => (
  <LegalLayout title="Refund Policy">
    <div className="space-y-6 text-gray-700">
      <p className="text-lg">
        <strong>Effective Date:</strong> January 1, 2025
      </p>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Free Webinar Access</h2>
        <p>
          Our webinar is provided free of charge. As no payment is required for webinar access, 
          no refunds are applicable for this service.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Strategy Call</h2>
        <p>
          The initial strategy call is complimentary. You may cancel or reschedule your appointment 
          at any time through Calendly or by contacting us directly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Paid Programs</h2>
        <p>
          If you choose to enroll in our paid career development programs:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Refund requests must be made within 7 days of program commencement</li>
          <li>Refunds are subject to review and approval</li>
          <li>Program-specific refund terms will be provided at the time of enrollment</li>
          <li>Our "work with you until you succeed" guarantee has specific terms outlined in your enrollment agreement</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. How to Request a Refund</h2>
        <p>
          To request a refund, please contact us at{' '}
          <a href="mailto:help@xperiencewave.com" className="text-brand-purple underline">
            help@xperiencewave.com
          </a>{' '}
          with your order details and reason for the refund request.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Processing Time</h2>
        <p>
          Approved refunds will be processed within 10-14 business days and credited to the 
          original payment method.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Questions</h2>
        <p>
          For refund-related questions, call us at{' '}
          <a href="tel:08041325804" className="text-brand-purple underline">
            080 4132 5804
          </a>{' '}
          or email{' '}
          <a href="mailto:help@xperiencewave.com" className="text-brand-purple underline">
            help@xperiencewave.com
          </a>
        </p>
      </section>
    </div>
  </LegalLayout>
);