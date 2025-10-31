// Analytics tracking abstraction layer

interface TrackingData {
  [key: string]: any;
}

/**
 * Track Facebook Pixel events
 */
export const trackFacebookPixel = (event: string, data?: TrackingData) => {
  if (typeof window !== "undefined" && window.fbq) {
    try {
      window.fbq("track", event, data);
    } catch (error) {
      console.warn("Facebook Pixel tracking failed:", error);
    }
  }
};

/**
 * Track Google Analytics 4 events
 */
export const trackGA4 = (eventName: string, parameters?: TrackingData) => {
  if (typeof window !== "undefined" && window.gtag) {
    try {
      window.gtag("event", eventName, parameters);
    } catch (error) {
      console.warn("GA4 tracking failed:", error);
    }
  }
};

/**
 * Track page view
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  // Facebook Pixel
  trackFacebookPixel("PageView");

  // Google Analytics 4
  trackGA4("page_view", {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
};

/**
 * Track lead submission
 */
export const trackLead = (data?: TrackingData) => {
  trackFacebookPixel("Lead", {
    content_name: "VSL Webinar",
    content_category: "Lead Generation",
    ...data,
  });

  trackGA4("generate_lead", {
    method: "lead_form",
    ...data,
  });
};

/**
 * Track video view
 */
export const trackVideoView = (videoId: string, data?: TrackingData) => {
  trackFacebookPixel("ViewContent", {
    content_type: "video",
    content_ids: [videoId],
    ...data,
  });

  trackGA4("video_start", {
    video_id: videoId,
    ...data,
  });
};

/**
 * Track Calendly booking
 */
export const trackCalendlyBooking = (data?: TrackingData) => {
  trackFacebookPixel("Schedule", {
    content_name: "Strategy Call",
    ...data,
  });

  trackGA4("schedule_appointment", {
    appointment_type: "strategy_call",
    ...data,
  });
};

/**
 * Track button clicks
 */
export const trackClick = (buttonName: string, data?: TrackingData) => {
  trackGA4("click", {
    button_name: buttonName,
    ...data,
  });
};

// Export all as named exports
export default {
  trackPageView,
  trackLead,
  trackVideoView,
  trackCalendlyBooking,
  trackClick,
  trackFacebookPixel,
  trackGA4,
};

// Extend Window interface for tracking
declare global {
  interface Window {
    fbq?: (action: string, event: string, data?: any) => void;
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Send event to Conversion API (server-side)
 */
export const trackConversionAPI = async (
  eventName: string,
  email?: string,
  phone?: string,
  customData?: any
) => {
  try {
    // Get Facebook browser cookies (_fbp and _fbc)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return undefined;
    };

    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");

    // Send to server
    const response = await fetch("/api/facebook/conversion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: eventName,
        email,
        phone,
        fbp,
        fbc,
        event_source_url: window.location.href,
        custom_data: customData,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Conversion API: ${eventName} sent successfully`);
    } else {
      console.warn(`⚠️ Conversion API: ${eventName} failed`, result.error);
    }
  } catch (error) {
    console.warn("Conversion API failed:", error);
  }
};
