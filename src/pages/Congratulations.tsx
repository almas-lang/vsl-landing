import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { trackConversionAPI, trackPageView } from "../lib/track";

export const Congratulations: React.FC = () => {
  useEffect(() => {
    // Track page view
    trackPageView("/congratulations", "Congratulations");

    // Get stored lead data
    const storedLeadData = localStorage.getItem("lead_data");
    const leadData = storedLeadData ? JSON.parse(storedLeadData) : null;

    // Fire SubmitApplication event (Pixel)
    if (window.fbq) {
      window.fbq("track", "SubmitApplication", {
        content_name: "Strategy Call Booked",
        content_category: "Appointment",
        status: "completed",
        lead_id: leadData?.leadId,
      });
      console.log("✅ Pixel: SubmitApplication event fired");
    }

    // Fire SubmitApplication event (Conversion API)
    if (leadData) {
      trackConversionAPI("SubmitApplication", leadData.email, undefined, {
        content_name: "Strategy Call Booked",
        status: "completed",
        lead_id: leadData.leadId,
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            🎉 Congratulations!
          </h1>

          {/* Message */}
          <div className="space-y-4 text-lg text-gray-600">
            <p>Your strategy call has been successfully scheduled!</p>
            <p>
              Check your email for confirmation details and a calendar invite.
            </p>
            <p className="text-brand-purple font-semibold">
              We're excited to help you transform your design career!
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-xl p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              What's Next?
            </h2>
            <ul className="text-left space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-brand-red text-xl">✓</span>
                <span>
                  You'll receive a confirmation email with all the details
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-red text-xl">✓</span>
                <span>Add the meeting to your calendar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-red text-xl">✓</span>
                <span>Prepare any questions you'd like to discuss</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-red text-xl">✓</span>
                <span>We'll see you on the call!</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-6">
            <Link
              to="/"
              className="inline-block bg-brand-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
