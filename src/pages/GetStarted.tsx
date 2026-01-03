import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { LeadForm } from "../components/LeadForm";
import { Toast } from "../components/ui/Toast";
import { trackPageView, trackConversionAPI } from "../lib/track";

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

  const handleLeadSuccess = (leadId: string) => {
    showToast("Registration successful! Redirecting to training...", "success");

    setTimeout(() => {
      // Add flag to indicate this is a new lead
      navigate(`/watch?lead_id=${leadId}&utm_source=landing&utm_medium=form&new_lead=true`);
    }, 1500);
  };

  const handleLeadError = (message: string) => {
    showToast(message, "error");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1 flex items-center justify-center px-4 py-6 md:py-12">
        <div className="w-full max-w-md md:max-w-lg">
          <LeadForm
            onSuccess={handleLeadSuccess}
            onError={handleLeadError}
            onCancel={handleCancel}
          />
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
