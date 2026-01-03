import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { ApplyForm } from "../components/ApplyForm";
import { trackPageView, trackConversionAPI } from "../lib/track";

export const Apply: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const leadId = searchParams.get("lead_id");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track page view for /apply (Pixel)
    trackPageView("/apply", "Apply - Application Form");

    // Track InitiateCheckout event (user is starting application)
    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        content_name: "Application Form",
        content_category: "Apply",
        lead_id: leadId,
      });
      console.log("✅ Pixel: InitiateCheckout event fired (Application)");
    }

    // Track PageView via Conversion API
    const storedLeadData = localStorage.getItem("lead_data");
    const leadData = storedLeadData ? JSON.parse(storedLeadData) : null;
    if (leadData) {
      trackConversionAPI("PageView", leadData.email, undefined, {
        content_name: "Apply Page",
        lead_id: leadId,
      });
    }

    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Check if user has valid lead data in localStorage
    // If they have lead data stored, they can access the page
    // Only redirect if there's no stored data AND no lead_id in URL
    if (!storedLeadData && !leadId) {
      console.warn("No lead data found, redirecting to get started");
      setTimeout(() => navigate("/getstarted"), 2000);
    }
  }, [leadId, navigate]);

  const handleSuccess = () => {
    console.log("✅ Application submitted successfully!");
    // Navigation is handled in ApplyForm based on qualification
  };

  const handleError = (message: string) => {
    setError(message);
    // Scroll to top to show error
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <img
            src="/logo.png"
            alt="Xperience Wave"
            className="h-8 md:h-10"
          />
        </div>
      </header>

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Error Message */}
          {error && (
            <div className="max-w-3xl mx-auto mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-red-800 mb-1">
                    Application Not Approved
                  </h3>
                  <p className="text-xs md:text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <ApplyForm onSuccess={handleSuccess} onError={handleError} />
        </div>
      </main>

      <Footer />
    </div>
  );
};
