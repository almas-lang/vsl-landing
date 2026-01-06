import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { trackPageView, trackConversionAPI } from "../lib/track";

// Extend Window interface for Cal
declare global {
  interface Window {
    Cal?: any;
  }
}

export const Book: React.FC = () => {
  const navigate = useNavigate();
  const [isCalLoaded, setIsCalLoaded] = useState(false);

  useEffect(() => {
    // Track page view
    trackPageView("/book", "Book Strategy Call");

    // Get stored lead data
    const storedLeadData = localStorage.getItem("lead_data");
    const leadData = storedLeadData ? JSON.parse(storedLeadData) : null;

    // Get lead form data for pre-filling
    const leadFormData = localStorage.getItem("lead_form_data");
    const formData = leadFormData ? JSON.parse(leadFormData) : {};

    // Check if user has valid lead data
    if (!storedLeadData) {
      console.warn("No lead data found, redirecting to get started");
      navigate("/getstarted");
      return;
    }

    // Track Schedule page view (Pixel)
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: "Booking Calendar",
        content_category: "Schedule",
      });
      console.log("✅ Pixel: ViewContent (Booking Calendar) event fired");
    }

    // Track via Conversion API
    if (leadData?.email) {
      trackConversionAPI("ViewContent", leadData.email, undefined, {
        content_name: "Booking Calendar",
        content_category: "Schedule",
      });
    }

    // Load Cal.com embed script
    const loadCalEmbed = () => {
      (function (C: any, A: string, L: string) {
        let p = function (a: any, ar: any) {
          a.q.push(ar);
        };
        let d = C.document;
        C.Cal =
          C.Cal ||
          function () {
            let cal = C.Cal;
            let ar = arguments;
            if (!cal.loaded) {
              cal.ns = {};
              cal.q = cal.q || [];
              d.head.appendChild(d.createElement("script")).src = A;
              cal.loaded = true;
            }
            if (ar[0] === L) {
              const api = function () {
                p(api, arguments);
              };
              const namespace = ar[1];
              (api as any).q = (api as any).q || [];
              if (typeof namespace === "string") {
                cal.ns[namespace] = cal.ns[namespace] || api;
                p(cal.ns[namespace], ar);
                p(cal, ["initNamespace", namespace]);
              } else p(cal, ar);
              return;
            }
            p(cal, ar);
          };
      })(window, "https://app.cal.com/embed/embed.js", "init");

      window.Cal("init", "design-career-strategy-call-with-xw-team", {
        origin: "https://app.cal.com",
      });

      // Build prefill data
      const prefill: any = {};
      if (formData.name) prefill.name = formData.name;
      if (leadData?.email) prefill.email = leadData.email;
      if (formData.phone) prefill.phone = formData.phone;

      window.Cal.ns["design-career-strategy-call-with-xw-team"]("inline", {
        elementOrSelector: "#cal-embed-container",
        config: { layout: "month_view" },
        calLink: "xperience-wave/design-career-strategy-call-with-xw-team?timeFormat=12",
        prefill: prefill,
      });

      window.Cal.ns["design-career-strategy-call-with-xw-team"]("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });

      // Listen for Cal.com events
      window.Cal.ns["design-career-strategy-call-with-xw-team"]("on", {
        action: "bookingSuccessful",
        callback: (e: any) => {
          console.log("✅ Booking successful!", e);

          // Fire Schedule pixel event
          if (window.fbq) {
            window.fbq("track", "Schedule", {
              content_name: "Strategy Call Booked",
              content_category: "Appointment",
            });
            console.log("✅ Pixel: Schedule event fired");
          }

          // Fire Conversion API
          if (leadData?.email) {
            trackConversionAPI("Schedule", leadData.email, undefined, {
              content_name: "Strategy Call Booked",
              booking_data: e.detail,
            });
          }

          // Update Google Sheet stage
          updateSheetStage(leadData?.email);

          // Redirect to congratulations after a short delay
          setTimeout(() => {
            navigate("/congratulations");
          }, 1500);
        },
      });

      setIsCalLoaded(true);
    };

    loadCalEmbed();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  const updateSheetStage = async (email: string) => {
    if (!email) return;

    try {
      await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          data: {
            email,
            stage: "booked",
            bookedAt: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error("Error updating sheet:", error);
    }
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

      <main className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4">
          {/* Headline */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Pick Your Strategy Call Time
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Choose a time that works best for you. We'll discuss your career goals and create a personalized roadmap.
            </p>
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-3 md:gap-4 mt-4">
              {/* Step 1 - Completed */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm md:text-base font-medium text-green-600">Complete form</span>
              </div>

              {/* Connector */}
              <div className="w-8 md:w-12 h-0.5 bg-green-500"></div>

              {/* Step 2 - Active */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <span className="text-sm md:text-base font-medium text-gray-900">Pick time slot</span>
              </div>
            </div>
          </div>

          {/* Cal.com Embed Container */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
            <div
              id="cal-embed-container"
              style={{ width: "100%", minHeight: "700px", position: "relative" }}
            >
              {!isCalLoaded && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading calendar...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
