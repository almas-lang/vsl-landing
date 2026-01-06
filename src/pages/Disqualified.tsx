import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { content as siteContent } from '../config/content';

export const Disqualified: React.FC = () => {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Get user name from localStorage
    const leadData = localStorage.getItem('lead_data');
    if (leadData) {
      try {
        // Try to get name from lead form submission
        const leadFormData = localStorage.getItem('lead_form_data');
        if (leadFormData) {
          const formData = JSON.parse(leadFormData);
          setUserName(formData.name || '');
        }
      } catch (error) {
        console.error('Error parsing lead data:', error);
      }
    }
  }, []);

  // Determine personalized messaging based on disqualification reason
  const getPersonalizedContent = (): {
    title: string;
    targetAudience: string[];
    notMeetMessage: string;
    helpMessage: string;
    cta: {
      description: string;
      link: string;
      buttonText: string;
    };
  } => {
    return {
      title: "Thanks for your interest, but this program isn't the right fit for you right now.",
      targetAudience: [
        'Currently employed UX/UI/Product designers with 2+ years of experience'
      ],
      notMeetMessage: "Based on your responses, you don't meet these criteria yet.",
      helpMessage: "But we want to help you get there.",
      cta: {
        description: "Download our free \"Designers Current Capability Assessment\"",
        link: siteContent.disqualified.designerCapabilityAssessmentUrl,
        buttonText: "Download Free Assessment"
      }
    };
  };

  const content = getPersonalizedContent();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
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

          {/* Main Content Card - Dark Theme with Brand Colors */}
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-10">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center leading-tight">
              {content.title}
            </h1>

            {/* Personalized Greeting */}
            <div className="mb-8 text-left">
              <p className="text-lg md:text-xl text-gray-200 mb-6">
                Hi {userName ? <span className="font-semibold text-brand-purple">{userName}</span> : 'there'},
              </p>

              <p className="text-base md:text-lg text-gray-300 mb-4">
                Our <span className="font-semibold text-white">Pi-Design Career System</span> is specifically designed for:
              </p>

              <ul className="space-y-2 mb-6 ml-4">
                {content.targetAudience.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-base md:text-lg text-gray-300">
                    <svg className="w-6 h-6 text-brand-purple mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-base md:text-lg text-gray-200 mb-2 font-semibold">
                {content.notMeetMessage}
              </p>

              <p className="text-base md:text-lg font-semibold text-brand-purple">
                {content.helpMessage}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-8"></div>

            {/* CTA Section */}
            <div className="bg-brand-purple/10 rounded-xl p-6 md:p-8 mb-8 border border-brand-purple/30">
              <p className="text-base md:text-lg text-gray-200 mb-6">
                {content.cta.description}
              </p>
              <a
                href={content.cta.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-red hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm md:text-base shadow-lg"
              >
                {content.cta.buttonText}
              </a>
            </div>

            {/* Additional Resources */}
            <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                What happens next?
              </h3>
              <p className="text-base md:text-lg text-gray-300 mb-4">
                We'll also send you free resources via email to help you build toward senior roles.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-purple mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm md:text-base text-gray-300">
                    Free career growth resources tailored to your current stage
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-purple mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm md:text-base text-gray-300">
                    Priority notification when we launch programs suited to your profile
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-purple mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm md:text-base text-gray-300">
                    Weekly design career tips and industry insights
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8">
              <Link
                to="/"
                className="inline-block bg-brand-red hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm md:text-base shadow-lg"
              >
                Return to Home
              </Link>
            </div>

            {/* Signature */}
            <div className="mt-8 text-center">
              <p className="text-base md:text-lg text-gray-300 font-medium">
                — Team Xperience Wave
              </p>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Have questions?{' '}
              <a
                href="mailto:team@xperiencewave.com"
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
