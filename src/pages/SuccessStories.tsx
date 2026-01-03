import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const SuccessStories: React.FC = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center text-brand-purple hover:text-purple-700 font-semibold mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4">
            Success Stories
          </h1>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            See how designers like you landed senior roles with 2X salary in 90 days
          </p>

          {/* WhatsApp Chat Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 justify-items-center">
            {/* Akash */}
            <div className="w-full max-w-sm">
              <img
                src="/testimonials/akash.png"
                alt="Akash testimonial"
                className="w-full h-auto"
                style={{ aspectRatio: '9/16', objectFit: 'contain' }}
              />
            </div>

            {/* Maitreyee */}
            <div className="w-full max-w-sm">
              <img
                src="/testimonials/maitreyee.png"
                alt="Maitreyee testimonial"
                className="w-full h-auto"
                style={{ aspectRatio: '9/16', objectFit: 'contain' }}
              />
            </div>

            {/* Pavi - Video */}
            <div className="w-full max-w-sm">
              <video
                src="/testimonials/pavi.MP4"
                controls
                className="w-full h-auto"
                style={{ aspectRatio: '9/16', objectFit: 'contain' }}
                playsInline
              />
            </div>

            {/* Kritika 2 */}
            <div className="w-full max-w-sm">
              <img
                src="/testimonials/kritika2.png"
                alt="Kritika testimonial"
                className="w-full h-auto"
                style={{ aspectRatio: '9/16', objectFit: 'contain' }}
              />
            </div>

            {/* Abhishek */}
            <div className="w-full max-w-sm">
              <img
                src="/testimonials/abhishek.png"
                alt="Abhishek testimonial"
                className="w-full h-auto"
                style={{ aspectRatio: '9/16', objectFit: 'contain' }}
              />
            </div>

            {/* Ashley - Video */}
            <div className="w-full max-w-sm">
              <video
                src="/testimonials/Ashley.mp4"
                controls
                className="w-full h-auto"
                style={{ aspectRatio: '9/16', objectFit: 'contain' }}
                playsInline
              />
            </div>

          </div>

          {/* LinkedIn Style Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Sheetal */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64 bg-gray-100">
                <img
                  src="/testimonials/sheetal.png"
                  alt="Sheetal Pimparwar LinkedIn profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Sheetal Pimparwar</h3>
                <p className="text-gray-700 text-lg mb-1">Design lead at CX100</p>
                <p className="text-brand-red font-semibold text-base">in 2 months</p>
              </div>
            </div>

            {/* Kritika */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64 bg-gray-100">
                <img
                  src="/testimonials/kritika.png"
                  alt="Kritika Singh LinkedIn profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Kritika Singh</h3>
                <p className="text-gray-700 text-lg mb-1">Lead UX Designer at Synduct, Germany</p>
                <p className="text-brand-red font-semibold text-base">in 3 months</p>
              </div>
            </div>

            {/* Jerin */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64 bg-gray-100">
                <img
                  src="/testimonials/jerin.png"
                  alt="Jerin John LinkedIn profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Jerin John</h3>
                <p className="text-gray-700 text-lg mb-1">Sr. Product Designer at CGI</p>
                <p className="text-brand-red font-semibold text-base">in 1.5 months</p>
              </div>
            </div>

            {/* Shreekanth */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64 bg-gray-100">
                <img
                  src="/testimonials/shreekanth.png"
                  alt="Shreekanth LinkedIn profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Shreekanth</h3>
                <p className="text-gray-700 text-lg mb-1">Sr. UX Designer at Wipro</p>
                <p className="text-brand-red font-semibold text-base">in 5 weeks</p>
              </div>
            </div>

            {/* Maulin */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64 bg-gray-100">
                <img
                  src="/testimonials/maulin.png"
                  alt="Maulin Rajput LinkedIn profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Maulin Rajput</h3>
                <p className="text-gray-700 text-lg mb-1">Sr.UX Designer at Augmented.Ai</p>
                <p className="text-brand-red font-semibold text-base">in 90 days</p>
              </div>
            </div>

            {/* Jonah */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64 bg-gray-100">
                <img
                  src="/testimonials/jonah.png"
                  alt="Jonah Immanuel LinkedIn profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Jonah Immanuel</h3>
                <p className="text-gray-700 text-lg mb-1">Sr. Lead Designer at Infosys</p>
                <p className="text-brand-red font-semibold text-base">in 2 months</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
