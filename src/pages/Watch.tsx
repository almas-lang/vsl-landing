import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { YouTubePlayer } from "../components/YouTubePlayer";
import { Button } from "../components/ui/Button";
import { Toast } from "../components/ui/Toast";
import {
  trackVideoView,
  trackBookingClick,
  trackPageView,
  trackConversionAPI,
} from "../lib/track";
import { content } from "../config/content";

const YOUTUBE_VIDEO_ID = import.meta.env.VITE_YOUTUBE_VIDEO_ID || "GVl8_yg_HJM";
const BOOKING_URL =
  import.meta.env.VITE_BOOKING_URL ||
  "https://app.xperiencewave.com/book/design-career-strategy-call";

export const Watch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
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
    // Auto-show booking CTA when video ends
    setShowBooking(true);
    setToast({
      isVisible: true,
      message: "Ready to take the next step? Book your strategy call below!",
      type: "success",
    });
  };

  const buildBookingUrl = () => {
    const url = new URL(BOOKING_URL);
    if (leadId) url.searchParams.set("lead_id", leadId);
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    if (utmSource) url.searchParams.set("utm_source", utmSource);
    if (utmMedium) url.searchParams.set("utm_medium", utmMedium);
    if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
    return url.toString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-2 md:py-4">
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
                trackBookingClick({ lead_id: leadId });
                window.location.href = buildBookingUrl();
              }}
              variant="primary"
              size="lg"
              className="shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {content.watch.cta}
            </Button>
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
