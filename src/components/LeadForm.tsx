import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/Button";
import { content } from "../config/content";
import type { LeadFormData } from "../types";

const schema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be exactly 10 digits")
    .max(10, "Phone number must be exactly 10 digits")
    .regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
});

interface LeadFormProps {
  onSuccess: (leadId: string) => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  onSuccess,
  onError,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);

    try {
      // Get UTM parameters from localStorage
      const storedUtms = localStorage.getItem("utm_params");
      const utmParams = storedUtms ? JSON.parse(storedUtms) : {};

      // DEV MODE: Skip API call in development
      if (window.location.hostname === 'localhost') {
        console.log("DEV MODE: Form data:", data);
        console.log("DEV MODE: UTM params:", utmParams);
        const mockLeadId = "dev_" + Date.now();

        localStorage.setItem(
          "lead_data",
          JSON.stringify({
            leadId: mockLeadId,
            email: data.email,
            timestamp: new Date().toISOString(),
          })
        );

        setTimeout(() => {
          onSuccess(mockLeadId);
        }, 1000);
        return;
      }

      const response = await fetch("/api/brevo/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: "+91" + data.phone,
          utm_source: utmParams.utm_source || "",
          utm_medium: utmParams.utm_medium || "",
          utm_campaign: utmParams.utm_campaign || "",
          utm_content: utmParams.utm_content || "",
          utm_term: utmParams.utm_term || "",
        }),
      });

      // Handle empty or invalid JSON responses
      let result;
      try {
        const text = await response.text();
        result = text ? JSON.parse(text) : { success: false, error: "Empty response from server" };
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error("Server returned an invalid response. Please try again.");
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to submit form");
      }

      // Store lead data in localStorage for tracking
      localStorage.setItem(
        "lead_data",
        JSON.stringify({
          leadId: result.leadId,
          email: data.email,
          timestamp: new Date().toISOString(),
        })
      );

      // Track lead event
      if (window.fbq) {
        window.fbq("track", "Lead", {
          content_name: "VSL Webinar",
          content_category: "Lead Generation",
        });
      }

      onSuccess(result.leadId);
    } catch (error: any) {
      console.error("Form submission error:", error);
      onError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {content.modal.headline}{" "}
          <span className="text-brand-red">
            {content.modal.headlineHighlight}
          </span>{" "}
          {content.modal.headlineEnd}
        </h2>
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Name
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition ${
            errors.name
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
          }`}
          placeholder="Enter your full name"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email address
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition ${
            errors.email
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
          }`}
          placeholder="your@email.com"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p
            id="email-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
          Mobile number
        </label>
        <div className="flex gap-2">
          <div className="flex items-center px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg">
            <span className="text-gray-700 font-medium">+91</span>
          </div>
          <input
            {...register("phone")}
            id="phone"
            type="tel"
            maxLength={10}
            className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition ${
              errors.phone
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
            }`}
            placeholder="0000000000"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>
        {errors.phone && (
          <p
            id="phone-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        className="w-full"
      >
        {content.modal.cta}
      </Button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full text-gray-600 hover:text-gray-800 font-medium"
      >
        Cancel
      </button>

      {/* Consent text */}
      <div className="text-xs text-gray-500 leading-relaxed text-center">
        {content.modal.consent}
      </div>
    </form>
  );
};

// Extend Window interface for Facebook Pixel
declare global {
  interface Window {
    fbq?: (action: string, event: string, data?: any) => void;
    gtag?: (...args: any[]) => void;
  }
}
