import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { TestimonialGrid } from "../components/TestimonialGrid";
import { CTA } from "../components/CTA";
import { Modal } from "../components/ui/Modal";
import { Toast } from "../components/ui/Toast";
import { LeadForm } from "../components/LeadForm";
import { useModal } from "../hooks/useModal";
import { content } from "../config/content";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modal = useModal();
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  // Capture UTM parameters when user lands on the page
  useEffect(() => {
    // Get Meta's actual tracking parameters (hsa_*)
    const metaCampaign = searchParams.get("hsa_cam") || "";
    const metaAdSet = searchParams.get("hsa_grp") || "";
    const metaAd = searchParams.get("hsa_ad") || "";

    const utmParams = {
      utm_source: searchParams.get("utm_source") || "",
      utm_medium: searchParams.get("utm_medium") || "",
      // Use Meta's actual IDs if custom UTM params aren't set
      utm_campaign: searchParams.get("utm_campaign") || metaCampaign,
      utm_content: searchParams.get("utm_content") || metaAd,
      utm_term: searchParams.get("utm_term") || metaAdSet,
    };

    // Only store if at least one UTM parameter exists
    if (Object.values(utmParams).some((value) => value !== "")) {
      localStorage.setItem("utm_params", JSON.stringify(utmParams));
      console.log("UTM parameters captured:", utmParams);
    }
  }, [searchParams]);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ isVisible: true, message, type });
  };

  const handleLeadSuccess = (leadId: string) => {
  showToast('Registration successful! Redirecting to training...', 'success');

  setTimeout(() => {
    // Add flag to indicate this is a new lead
    navigate(`/watch?lead_id=${leadId}&utm_source=landing&utm_medium=form&new_lead=true`);
  }, 1500);
};

  const handleLeadError = (message: string) => {
    showToast(message, "error");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Rating Section - Right below header */}
      <div className="py-4 md:py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-6 h-6 md:w-7 md:h-7 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-2xl md:text-3xl font-bold text-gray-900">
              {content.hero.rating.score}
            </span>
            <span className="text-gray-600 text-sm md:text-base">
              Out of {content.hero.rating.count.toLocaleString()} ratings
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-0 md:py-0 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-8">
              {/* Qualifier */}
              <p className="text-[15px] lg:text-2xl text-gray-700 font-bold">
                {content.hero.qualifier}
              </p>

              {/* Main Headline */}
              <h1 className="text-[25px]/[1.3] md:text-4xl lg:text-[48px]/[1.1] font-bold text-gray-900 ">
                {content.hero.headline}
              </h1>

              {/* Subheadline */}
              <div className="text-sm md:text-xl text-brand-purple px-4 md:px-12">
                <p className="font-semibold md:font-semibold leading-snug md:leading-snug">
                  {content.hero.subheadline1}
                </p>
              </div>

              {/* CTA Button */}
              <CTA onClick={modal.open} text={content.hero.cta} />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialGrid />

        {/* Final CTA */}
      </main>

      <Footer />

      {/* Lead Capture Modal */}
      <Modal isOpen={modal.isOpen} onClose={modal.close} size="md">
        <LeadForm
          onSuccess={handleLeadSuccess}
          onError={handleLeadError}
          onCancel={modal.close}
        />
      </Modal>

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
