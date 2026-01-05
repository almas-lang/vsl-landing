import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { trackConversionAPI } from '../lib/track';

export const ApplyRejected: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<{
    category?: string;
    reason?: string;
  }>({});

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Get user data from localStorage
    const leadFormData = localStorage.getItem('lead_form_data');
    let email = '';
    let name = '';

    if (leadFormData) {
      try {
        const formData = JSON.parse(leadFormData);
        name = formData.name || '';
        email = formData.email || '';
        setUserName(name);
        setUserEmail(email);
      } catch (error) {
        console.error('Error parsing lead data:', error);
      }
    }

    // Get rejection reason
    let qualification = { category: '', reason: '' };
    const applyQualification = localStorage.getItem('apply_qualification');
    if (applyQualification) {
      try {
        qualification = JSON.parse(applyQualification);
        setRejectionReason({
          category: qualification.category,
          reason: qualification.reason,
        });
      } catch (error) {
        console.error('Error parsing qualification data:', error);
      }
    }

    // Track rejection event via Conversion API
    if (email) {
      trackConversionAPI('ApplicationRejected', email, undefined, {
        rejection_category: qualification.category,
        rejection_reason: qualification.reason,
      });
    }

    // Update Google Sheet to mark as apply_rejected (for sending resources)
    if (email) {
      updateSheetStatus(email, qualification.category, qualification.reason);
    }
  }, []);

  const updateSheetStatus = async (email: string, category?: string, reason?: string) => {
    try {
      await fetch('/api/sheets/append', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          data: {
            email,
            stage: 'apply_rejected',
            applyQualified: false,
            applyQualificationReason: reason || category || 'not_qualified',
          },
        }),
      });
    } catch (error) {
      console.error('Error updating sheet:', error);
    }
  };

  // Get personalized messaging based on rejection category
  const getMessage = () => {
    if (rejectionReason.category === 'both') {
      return "Based on your responses, this program may not be the right fit at this time. We recommend reconsidering when you're ready to invest and can commit to a 90-day timeline.";
    } else if (rejectionReason.category === 'investment') {
      return "Our program requires investment readiness. We recommend exploring free resources first and returning when you're ready to invest in your career growth.";
    } else if (rejectionReason.category === 'timeline') {
      return "Our program is designed for designers who can commit to a 90-day intensive process. We recommend exploring self-paced resources that better fit your timeline.";
    }
    return "Based on your responses, this program may not be the right fit at this time.";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <img
                src="/logo.png"
                alt="Xperience Wave"
                className="h-8 md:h-10 mx-auto"
              />
            </Link>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center leading-tight">
              Thank you for your interest, {userName}
            </h1>

            {/* Message */}
            <div className="mb-8">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 md:p-6 rounded-r-lg mb-6">
                <p className="text-base md:text-lg text-gray-800">
                  {getMessage()}
                </p>
              </div>

              <p className="text-base md:text-lg text-gray-700 mb-4">
                While you may not be the right fit for our intensive Pi-Design Career System at this moment,
                we still want to support your design career journey.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Resources Section */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                Free Resources to Help You Grow
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-6">
                We've curated some resources that can help you prepare for the next step in your career.
                {userEmail && <span className="font-medium"> We'll send these to {userEmail}:</span>}
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-purple mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm md:text-base text-gray-700">
                    Weekly design career tips and industry insights delivered to your inbox
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-purple mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm md:text-base text-gray-700">
                    Free guides on building your design portfolio and personal brand
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-purple mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm md:text-base text-gray-700">
                    Priority notification when we launch programs suited to your profile
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                When might this program be right for you?
              </h3>
              <div className="space-y-3">
                {rejectionReason.category === 'investment' || rejectionReason.category === 'both' ? (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm md:text-base text-gray-700">
                      When you're ready to invest ₹60-80K in your career transformation
                    </p>
                  </div>
                ) : null}
                {rejectionReason.category === 'timeline' || rejectionReason.category === 'both' ? (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm md:text-base text-gray-700">
                      When you can commit to a 90-day intensive transformation process
                    </p>
                  </div>
                ) : null}
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm md:text-base text-gray-700">
                    Feel free to reapply once your situation changes
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link
                to="/"
                className="inline-block bg-brand-purple hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm md:text-base shadow-md hover:shadow-lg"
              >
                Return to Home
              </Link>
            </div>

            {/* Signature */}
            <div className="mt-8 text-center">
              <p className="text-base md:text-lg text-gray-700 font-medium">
                — Team Xperience Wave
              </p>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Have questions?{' '}
              <a
                href="mailto:help@xperiencewave.com"
                className="text-brand-purple hover:text-purple-700 font-medium"
              >
                Contact our team
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
