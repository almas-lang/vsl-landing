import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { YouTubePlayer } from "../components/YouTubePlayer";
import { Button } from "../components/ui/Button";
import { Toast } from "../components/ui/Toast";
import {
  trackVideoView,
  trackPageView,
  trackConversionAPI,
} from "../lib/track";
import { content } from "../config/content";

const YOUTUBE_VIDEO_ID = import.meta.env.VITE_YOUTUBE_VIDEO_ID || "GVl8_yg_HJM";

export const Watch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  const leadId = searchParams.get("lead_id");

  useEffect(() => {
    // Track page view
    trackPageView("/watch", "Watch Webinar");

    // Get stored lead data for Conversion API
    const storedLeadData = localStorage.getItem("lead_data");
    const leadData = storedLeadData ? JSON.parse(storedLeadData) : null;

    // Check if this is a new lead
    const isNewLead = searchParams.get("new_lead");

    if (isNewLead === "true") {
      // Fire Lead event (Pixel)
      if (window.fbq) {
        window.fbq("track", "Lead", {
          content_name: "VSL Webinar Registration",
          content_category: "Lead Generation",
          lead_id: leadId,
          value: 0,
          currency: "USD",
        });
        console.log("✅ Pixel: Lead event fired");
      }

      // Fire Lead event (Conversion API)
      if (leadData) {
        trackConversionAPI("Lead", leadData.email, undefined, {
          content_name: "VSL Webinar Registration",
          lead_id: leadId,
        });
      }
    }

    // Fire ViewContent event (Pixel)
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: "Design Career Webinar",
        content_category: "Video",
        content_type: "video",
        content_ids: [YOUTUBE_VIDEO_ID],
        lead_id: leadId,
      });
      console.log("✅ Pixel: ViewContent event fired");
    }

    // Fire ViewContent event (Conversion API)
    if (leadData) {
      trackConversionAPI("ViewContent", leadData.email, undefined, {
        content_name: "Design Career Webinar",
        content_ids: [YOUTUBE_VIDEO_ID],
      });
    }

    // Check if user has valid lead data
    if (!storedLeadData && !leadId) {
      setToast({
        isVisible: true,
        message: "Please register first to access the training.",
        type: "info",
      });

      setTimeout(() => navigate("/"), 2000);
    }
  }, [leadId, navigate, searchParams, YOUTUBE_VIDEO_ID]);

  const handleVideoPlay = () => {
    if (!hasTrackedView) {
      trackVideoView(YOUTUBE_VIDEO_ID, {
        lead_id: leadId,
        utm_source: searchParams.get("utm_source"),
        utm_medium: searchParams.get("utm_medium"),
      });
      setHasTrackedView(true);
    }
  };

  const handleVideoEnd = () => {
    // Show message when video ends
    setToast({
      isVisible: true,
      message: "Ready to take the next step? Click the button below to apply!",
      type: "success",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Badge */}

          {/* Video Section */}
          <div className="mb-8">
            <YouTubePlayer
              videoId={YOUTUBE_VIDEO_ID}
              onPlay={handleVideoPlay}
              onEnd={handleVideoEnd}
            />
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Button
              onClick={() => {
                // Get stored lead data for Conversion API
                const storedLeadData = localStorage.getItem("lead_data");
                const leadData = storedLeadData ? JSON.parse(storedLeadData) : null;

                // Track the click (Pixel)
                if (window.fbq) {
                  window.fbq("track", "InitiateCheckout", {
                    content_name: "Application Form CTA",
                    content_category: "Apply",
                    lead_id: leadId,
                  });
                  console.log("✅ Pixel: InitiateCheckout event fired (Watch CTA)");
                }

                // Track the click (Conversion API)
                if (leadData) {
                  trackConversionAPI("InitiateCheckout", leadData.email, undefined, {
                    content_name: "Application Form CTA",
                    lead_id: leadId,
                  });
                }

                // Navigate to Apply page with lead_id
                navigate(`/apply${leadId ? `?lead_id=${leadId}` : ""}`);
              }}
              variant="primary"
              size="lg"
              className="shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {content.watch.cta}
            </Button>
          </div>

          {/* Inline Calendly (optional - shows after video or on demand) */}
          {/* {showCalendly && (
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Schedule Your Strategy Call
              </h3>
              <CalendlyWidget
                url={CALENDLY_URL}
                mode="inline"
                onScheduled={handleCalendlyScheduled}
              />
            </div>
          )} */}
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
