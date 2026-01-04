import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { LeadForm } from "../components/LeadForm";
import { Toast } from "../components/ui/Toast";
import { trackPageView, trackConversionAPI } from "../lib/track";
import type { QualificationResult } from "../types";

export const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  useEffect(() => {
    // Track page view for /getstarted (Pixel)
    trackPageView("/getstarted", "Get Started");

    // Track InitiateCheckout event (user is starting the registration process)
    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        content_name: "VSL Webinar Registration Form",
        content_category: "Lead Generation",
      });
      console.log("✅ Pixel: InitiateCheckout event fired");
    }

    // Track PageView via Conversion API
    const storedLeadData = localStorage.getItem("lead_data");
    const leadData = storedLeadData ? JSON.parse(storedLeadData) : null;
    if (leadData) {
      trackConversionAPI("PageView", leadData.email, undefined, {
        content_name: "Get Started Page",
      });
    }

    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ isVisible: true, message, type });
  };

  const handleLeadSuccess = (leadId: string, qualificationResult: QualificationResult) => {
    if (qualificationResult.qualified) {
      showToast("Registration successful! Redirecting to training...", "success");

      setTimeout(() => {
        // Qualified: go to watch page
        navigate(`/watch?lead_id=${leadId}&utm_source=landing&utm_medium=form&new_lead=true`);
      }, 1500);
    } else {
      showToast("Thank you for your interest!", "info");

      setTimeout(() => {
        // Disqualified: go to disqualified page
        navigate("/disqualified");
      }, 1500);
    }
  };

  const handleLeadError = (message: string) => {
    showToast(message, "error");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1 flex items-center justify-center px-4 py-6 md:py-8 lg:py-12">
        <div className="w-full max-w-5xl">
          {/* Headline Section */}
          <div className="text-center mb-6 md:mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 lg:mb-8 px-2">
              Watch The Free Training That Shows You Exactly How This Works
            </h1>

            {/* Bullet Points */}
            <div className="space-y-2 md:space-y-3 lg:space-y-4 text-left max-w-4xl mx-auto px-2">
              <div className="flex items-start gap-2 md:gap-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-700 mt-0.5 md:mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="3" />
                </svg>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
                  Why skilled designers stay stuck (and what senior designers do differently)
                </p>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-700 mt-0.5 md:mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="3" />
                </svg>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
                  The Pi-Design Career System framework that gets results in 90 days
                </p>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-700 mt-0.5 md:mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="3" />
                </svg>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
                  How to position yourself for ₹18-28 LPA roles without leading teams first
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto">
            <LeadForm
              onSuccess={handleLeadSuccess}
              onError={handleLeadError}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};
