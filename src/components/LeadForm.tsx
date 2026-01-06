import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/Button";
import { content } from "../config/content";
import type { LeadFormData, QualificationResult } from "../types";

const schema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be exactly 10 digits")
    .max(10, "Phone number must be exactly 10 digits")
    .regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
  employmentStatus: z.string().min(1, "Please select your employment status"),
  yearsOfExperience: z.string().min(1, "Please select your years of experience"),
  monthlySalary: z.string().optional(),
});

interface LeadFormProps {
  onSuccess: (leadId: string, qualificationResult: QualificationResult) => void;
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
    watch,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(schema),
  });

  // Watch select field values to update text color
  const employmentStatusValue = watch("employmentStatus");
  const yearsOfExperienceValue = watch("yearsOfExperience");
  const monthlySalaryValue = watch("monthlySalary");

  // Check if user qualifies based on employment and experience (salary hidden for now)
  const checkQualification = (data: LeadFormData): QualificationResult => {
    const isEmployed = data.employmentStatus === "yes";
    const hasExperience = data.yearsOfExperience === "2_to_5" || data.yearsOfExperience === "5_plus";

    // Qualified if: employed + 2+ years experience
    if (isEmployed && hasExperience) {
      return {
        qualified: true,
        reason: "meets_all_criteria",
        category: "qualified"
      };
    }

    // Determine disqualification reason
    if (!isEmployed) {
      return {
        qualified: false,
        reason: "not_employed",
        category: "employment"
      };
    }

    if (!hasExperience) {
      return {
        qualified: false,
        reason: "insufficient_experience",
        category: "experience"
      };
    }

    return {
      qualified: false,
      reason: "general_disqualification",
      category: "general"
    };
  };

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);

    try {
      // Check qualification
      const qualificationResult = checkQualification(data);
      // Get UTM parameters from localStorage
      const storedUtms = localStorage.getItem("utm_params");
      const utmParams = storedUtms ? JSON.parse(storedUtms) : {};

      // DEV MODE: Set to true to skip API calls, false to test with real APIs
      const SKIP_API_IN_DEV = false;

      if (SKIP_API_IN_DEV && window.location.hostname === 'localhost') {
        console.log("DEV MODE: Form data:", data);
        console.log("DEV MODE: Qualification result:", qualificationResult);
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

        // Save form data for Cal.com pre-fill
        localStorage.setItem(
          "lead_form_data",
          JSON.stringify({
            name: data.name,
            phone: "+91" + data.phone,
          })
        );

        setTimeout(() => {
          onSuccess(mockLeadId, qualificationResult);
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
          employmentStatus: data.employmentStatus,
          yearsOfExperience: data.yearsOfExperience,
          monthlySalary: data.monthlySalary || "",
          qualified: qualificationResult.qualified,
          qualificationReason: qualificationResult.reason,
          qualificationCategory: qualificationResult.category,
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

      // Save form data for Cal.com pre-fill
      localStorage.setItem(
        "lead_form_data",
        JSON.stringify({
          name: data.name,
          phone: "+91" + data.phone,
        })
      );

      // Save to Google Sheets
      try {
        await fetch("/api/sheets/append", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "create",
            data: {
              email: data.email,
              name: data.name,
              phone: "+91" + data.phone,
              employmentStatus: data.employmentStatus,
              yearsOfExperience: data.yearsOfExperience,
              monthlySalary: data.monthlySalary,
              qualified: qualificationResult.qualified,
              qualificationReason: qualificationResult.reason,
              qualificationCategory: qualificationResult.category,
              utm_source: utmParams.utm_source || "",
              utm_medium: utmParams.utm_medium || "",
              utm_campaign: utmParams.utm_campaign || "",
              utm_content: utmParams.utm_content || "",
              utm_term: utmParams.utm_term || "",
              stage: "lead"
            }
          })
        });
        console.log("✅ Lead data saved to Google Sheets");
      } catch (sheetsError) {
        console.error("Failed to save to Google Sheets:", sheetsError);
        // Don't fail the form submission if Sheets fails
      }

      // Note: Lead pixel event is fired on Watch page (with new_lead=true param)
      // to avoid duplicate events

      onSuccess(result.leadId, qualificationResult);
    } catch (error: any) {
      console.error("Form submission error:", error);
      onError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-sm">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm md:text-base text-gray-700 font-medium mb-2">
          Name
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          className={`w-full px-3 py-2.5 md:px-4 md:py-3 text-base rounded-lg border-2 focus:outline-none focus:ring-2 transition ${
            errors.name
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
          }`}
          placeholder="Enter your full name"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm md:text-base text-gray-700 font-medium mb-2">
          Email address
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          className={`w-full px-3 py-2.5 md:px-4 md:py-3 text-base rounded-lg border-2 focus:outline-none focus:ring-2 transition ${
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
            className="mt-1.5 text-xs md:text-sm text-red-600"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm md:text-base text-gray-700 font-medium mb-2">
          Mobile number
        </label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 py-2.5 md:px-4 md:py-3 bg-gray-100 border-2 border-gray-200 rounded-lg">
            <span className="text-sm md:text-base text-gray-700 font-medium">+91</span>
          </div>
          <input
            {...register("phone")}
            id="phone"
            type="tel"
            maxLength={10}
            className={`flex-1 px-3 py-2.5 md:px-4 md:py-3 text-base rounded-lg border-2 focus:outline-none focus:ring-2 transition ${
              errors.phone
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
            }`}
            placeholder="0000000000"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                e.preventDefault();
              }
            }}
          />
        </div>
        {errors.phone && (
          <p
            id="phone-error"
            className="mt-1.5 text-xs md:text-sm text-red-600"
            role="alert"
          >
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Employment Status */}
      <div>
        <label htmlFor="employmentStatus" className="block text-sm md:text-base text-gray-700 font-medium mb-2">
          {content.qualifying.employmentStatus.label}
        </label>
        <div className="relative">
          <select
            {...register("employmentStatus")}
            id="employmentStatus"
            className={`w-full px-3 py-2.5 md:px-4 md:py-3 text-base rounded-lg border-2 focus:outline-none focus:ring-2 transition appearance-none bg-white pr-10 ${
              errors.employmentStatus
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
            }`}
            style={{ color: employmentStatusValue ? '#111827' : '#9CA3AF' }}
            aria-invalid={errors.employmentStatus ? "true" : "false"}
            aria-describedby={errors.employmentStatus ? "employment-error" : undefined}
          >
            <option value="" className="text-gray-400">Select an option</option>
            {content.qualifying.employmentStatus.options.map((option) => (
              <option key={option.value} value={option.value} className="text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {errors.employmentStatus && (
          <p id="employment-error" className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.employmentStatus.message}
          </p>
        )}
      </div>

      {/* Years of Experience */}
      <div>
        <label htmlFor="yearsOfExperience" className="block text-sm md:text-base text-gray-700 font-medium mb-2">
          {content.qualifying.yearsOfExperience.label}
        </label>
        <div className="relative">
          <select
            {...register("yearsOfExperience")}
            id="yearsOfExperience"
            className={`w-full px-3 py-2.5 md:px-4 md:py-3 text-base rounded-lg border-2 focus:outline-none focus:ring-2 transition appearance-none bg-white pr-10 ${
              errors.yearsOfExperience
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
            }`}
            style={{ color: yearsOfExperienceValue ? '#111827' : '#9CA3AF' }}
            aria-invalid={errors.yearsOfExperience ? "true" : "false"}
            aria-describedby={errors.yearsOfExperience ? "experience-error" : undefined}
          >
            <option value="" className="text-gray-400">Select an option</option>
            {content.qualifying.yearsOfExperience.options.map((option) => (
              <option key={option.value} value={option.value} className="text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {errors.yearsOfExperience && (
          <p id="experience-error" className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.yearsOfExperience.message}
          </p>
        )}
      </div>

      {/* Monthly Salary - Hidden for now */}
      {/* <div>
        <label htmlFor="monthlySalary" className="block text-sm md:text-base text-gray-700 font-medium mb-2">
          {content.qualifying.monthlySalary.label}
        </label>
        <div className="relative">
          <select
            {...register("monthlySalary")}
            id="monthlySalary"
            className={`w-full px-3 py-2.5 md:px-4 md:py-3 text-base rounded-lg border-2 focus:outline-none focus:ring-2 transition appearance-none bg-white pr-10 ${
              errors.monthlySalary
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
            }`}
            style={{ color: monthlySalaryValue ? '#111827' : '#9CA3AF' }}
            aria-invalid={errors.monthlySalary ? "true" : "false"}
            aria-describedby={errors.monthlySalary ? "salary-error" : undefined}
          >
            <option value="" className="text-gray-400">Select an option</option>
            {content.qualifying.monthlySalary.options.map((option) => (
              <option key={option.value} value={option.value} className="text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {errors.monthlySalary && (
          <p id="salary-error" className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.monthlySalary.message}
          </p>
        )}
      </div> */}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        className="w-full text-base md:text-lg"
      >
        {content.modal.cta}
      </Button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full text-sm md:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors py-2"
      >
        Cancel
      </button>

      {/* Important disclaimer */}
      <div className="text-[11px] sm:text-xs text-gray-600 leading-relaxed text-center pt-3 border-t border-gray-200">
        <p className="font-medium mb-2">
          <span className="font-semibold">Important:</span> This training is for UX/UI/Product designers earning 6+ LPA with 2+ years experience. If you're a student, unemployed, or looking for job placement services – this won't be relevant for you.
        </p>
      </div>

      {/* Consent text */}
      <div className="text-[10px] sm:text-xs text-gray-500 leading-relaxed text-center">
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
