import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { trackConversionAPI } from "../lib/track";
import type { ApplyFormData, QualificationResult } from "../types";

const schema = z.object({
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").min(1, "LinkedIn URL is required"),
  currentRole: z.string().min(1, "Please select your current role"),
  currentCompany: z.string().min(2, "Company name must be at least 2 characters"),
  targetRole: z.string().min(1, "Please select your target role"),
  targetSalary: z.string().min(1, "Please enter your target monthly salary"),
  blockingIssue: z.string().min(1, "Please select your biggest blocking issue"),
  whyImportant: z.string().min(10, "Please provide at least 10 characters explaining why this is important"),
  investmentReadiness: z.string().min(1, "Please select your investment readiness"),
  timeline: z.string().min(1, "Please select your timeline"),
});

const roleOptions = [
  "UX Designer",
  "UI Designer",
  "Product Designer",
  "Visual Designer",
  "Interaction Designer",
  "UX Researcher",
  "Design Lead",
  "Other"
];

const targetRoleOptions = [
  "Senior UX Designer",
  "Senior UI Designer",
  "Senior Product Designer",
  "Lead UX Designer",
  "Lead Product Designer",
  "Principal Designer",
  "Design Manager",
  "Head of Design",
  "Other"
];

const blockingIssues = [
  "Not getting interview calls despite applying",
  "Getting rejected in portfolio rounds",
  "Failing in design challenges/assignments",
  "Unable to negotiate higher salary offers",
  "Don't know how to position myself for senior roles",
  "Lack of clarity on what senior designers actually do",
];

interface ApplyFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

export const ApplyForm: React.FC<ApplyFormProps> = ({ onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(schema),
  });

  // Check if user qualifies for the program based on investment readiness and timeline
  const checkApplyQualification = (data: ApplyFormData): QualificationResult => {
    const cannotInvest = data.investmentReadiness === "cannot_invest";
    const longTimeline = data.timeline === "more_than_90_days";

    // Disqualify if BOTH conditions are true
    if (cannotInvest && longTimeline) {
      return {
        qualified: false,
        reason: "cannot_invest_and_long_timeline",
        category: "both"
      };
    }

    // Disqualify if cannot invest
    if (cannotInvest) {
      return {
        qualified: false,
        reason: "cannot_invest",
        category: "investment"
      };
    }

    // Disqualify if timeline too long
    if (longTimeline) {
      return {
        qualified: false,
        reason: "long_timeline",
        category: "timeline"
      };
    }

    return {
      qualified: true,
      reason: "meets_all_criteria",
      category: "qualified"
    };
  };

  const onSubmit = async (data: ApplyFormData) => {
    setIsSubmitting(true);

    try {
      // Check qualification
      const qualificationResult = checkApplyQualification(data);

      // Get stored lead data
      const storedLeadData = localStorage.getItem("lead_data");
      const leadData = storedLeadData ? JSON.parse(storedLeadData) : null;

      if (!leadData || !leadData.email) {
        throw new Error("Lead data not found. Please start from the beginning.");
      }

      // Get UTM parameters
      const storedUtms = localStorage.getItem("utm_params");
      const utmParams = storedUtms ? JSON.parse(storedUtms) : {};

      // Get lead form data for Brevo update
      const storedFormData = localStorage.getItem("lead_form_data");
      const formData = storedFormData ? JSON.parse(storedFormData) : {};

      // Update Brevo with apply-stage qualification
      try {
        await fetch("/api/brevo/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name || "",
            email: leadData.email,
            phone: formData.phone || "",
            applyQualified: qualificationResult.qualified,
            applyQualificationReason: qualificationResult.reason,
            applyQualificationCategory: qualificationResult.category,
            stage: qualificationResult.qualified ? "applied_qualified" : "applied_disqualified",
          }),
        });
        console.log("✅ Brevo: Apply qualification updated");
      } catch (brevoError) {
        console.error("Failed to update Brevo:", brevoError);
        // Don't block the flow if Brevo fails
      }

      // Submit to Google Sheets
      await fetch("/api/sheets/append", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update",
          data: {
            email: leadData.email,
            linkedinUrl: data.linkedinUrl,
            currentRole: data.currentRole,
            currentCompany: data.currentCompany,
            targetRole: data.targetRole,
            targetSalary: data.targetSalary,
            blockingIssue: data.blockingIssue,
            whyImportant: data.whyImportant,
            investmentReadiness: data.investmentReadiness,
            timeline: data.timeline,
            applyQualified: qualificationResult.qualified,
            applyQualificationReason: qualificationResult.reason,
            stage: qualificationResult.qualified ? "applied_qualified" : "applied_disqualified",
          },
        }),
      });

      // Store qualification result in localStorage
      localStorage.setItem(
        "apply_qualification",
        JSON.stringify({
          qualified: qualificationResult.qualified,
          reason: qualificationResult.reason,
          category: qualificationResult.category,
          timestamp: new Date().toISOString(),
        })
      );

      // Track application submission (Pixel)
      if (window.fbq) {
        window.fbq("track", "SubmitApplication", {
          content_name: "Application Form",
          qualified: qualificationResult.qualified,
        });
        console.log("✅ Pixel: SubmitApplication event fired");
      }

      // Track application submission (Conversion API)
      if (leadData) {
        trackConversionAPI("SubmitApplication", leadData.email, undefined, {
          content_name: "Application Form",
          qualified: qualificationResult.qualified,
          investment_readiness: data.investmentReadiness,
          timeline: data.timeline,
        });
      }

      // Route based on qualification
      if (qualificationResult.qualified) {
        // Redirect to booking page with embedded Cal.com
        navigate("/book");
      } else {
        // Navigate to apply rejected page
        navigate("/apply-rejected");
      }
    } catch (error: any) {
      console.error("Apply form submission error:", error);
      onError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 max-w-3xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          One Last Step Before You Book Your Call
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-4">
          Help us understand your goals so we can make your strategy session truly valuable
        </p>
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 md:gap-4">
          {/* Step 1 - Active */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 min-w-[32px] min-h-[32px] md:min-w-[40px] md:min-h-[40px] rounded-full bg-brand-purple text-white flex items-center justify-center text-sm md:text-base font-semibold shrink-0">
              1
            </div>
            <span className="text-sm md:text-base font-medium text-gray-900 whitespace-nowrap">Complete form</span>
          </div>

          {/* Connector */}
          <div className="w-6 md:w-12 h-0.5 bg-gray-300 shrink-0"></div>

          {/* Step 2 - Inactive */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 min-w-[32px] min-h-[32px] md:min-w-[40px] md:min-h-[40px] rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm md:text-base font-semibold shrink-0">
              2
            </div>
            <span className="text-sm md:text-base font-medium text-gray-400 whitespace-nowrap">Pick time slot</span>
          </div>
        </div>
      </div>

      {/* 1. LinkedIn URL */}
      <div>
        <label htmlFor="linkedinUrl" className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
          LinkedIn Profile URL <span className="text-red-500">*</span>
        </label>
        <input
          {...register("linkedinUrl")}
          id="linkedinUrl"
          type="url"
          className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition text-sm md:text-base ${
            errors.linkedinUrl
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
          }`}
          placeholder="https://linkedin.com/in/your-profile"
        />
        {errors.linkedinUrl && (
          <p className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.linkedinUrl.message}
          </p>
        )}
      </div>

      {/* 2. Current Role */}
      <div>
        <label htmlFor="currentRole" className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
          What is your Current Role <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            {...register("currentRole")}
            id="currentRole"
            className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition appearance-none bg-white pr-10 text-sm md:text-base ${
              errors.currentRole
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
            }`}
          >
            <option value="">Select your current role</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {errors.currentRole && (
          <p className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.currentRole.message}
          </p>
        )}
      </div>

      {/* 3. Current Company */}
      <div>
        <label htmlFor="currentCompany" className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
          What is your Current Company <span className="text-red-500">*</span>
        </label>
        <input
          {...register("currentCompany")}
          id="currentCompany"
          type="text"
          className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition text-sm md:text-base ${
            errors.currentCompany
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
          }`}
          placeholder="Company name"
        />
        {errors.currentCompany && (
          <p className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.currentCompany.message}
          </p>
        )}
      </div>

      {/* 4. Target Role */}
      <div>
        <label htmlFor="targetRole" className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
          What role are you targeting?  <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            {...register("targetRole")}
            id="targetRole"
            className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition appearance-none bg-white pr-10 text-sm md:text-base ${
              errors.targetRole
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
            }`}
          >
            <option value="">Select your target role</option>
            {targetRoleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {errors.targetRole && (
          <p className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.targetRole.message}
          </p>
        )}
      </div>

      {/* 5. Target Monthly Salary */}
      <div>
        <label htmlFor="targetSalary" className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
          What is your target monthly salary? (in ₹) <span className="text-red-500">*</span>
        </label>
        <input
          {...register("targetSalary")}
          id="targetSalary"
          type="text"
          className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition text-sm md:text-base ${
            errors.targetSalary
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
          }`}
          placeholder="e.g., 1,50,000"
        />
        {errors.targetSalary && (
          <p className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.targetSalary.message}
          </p>
        )}
      </div>

      {/* 6. Blocking Issue */}
      <div>
        <label className="block text-gray-700 font-medium mb-3 text-sm md:text-base">
          What's the #1 thing blocking you from landing a senior role right now? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {blockingIssues.map((issue) => (
            <label
              key={issue}
              className={`flex items-start p-3 md:p-4 border-2 rounded-lg cursor-pointer transition ${
                errors.blockingIssue ? "border-red-300" : "border-gray-200 hover:border-brand-purple"
              }`}
            >
              <input
                {...register("blockingIssue")}
                type="radio"
                value={issue}
                className="mt-0.5 mr-3 h-4 w-4 md:h-5 md:w-5 text-brand-purple focus:ring-brand-purple"
              />
              <span className="text-sm md:text-base text-gray-700">{issue}</span>
            </label>
          ))}
        </div>
        {errors.blockingIssue && (
          <p className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.blockingIssue.message}
          </p>
        )}
      </div>

      {/* 7. Why Important */}
      <div>
        <label htmlFor="whyImportant" className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
          Why is solving this important to you right now? <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("whyImportant")}
          id="whyImportant"
          rows={4}
          className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition text-sm md:text-base resize-none ${
            errors.whyImportant
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-brand-purple focus:ring-purple-200"
          }`}
          placeholder="Share your thoughts..."
        />
        {errors.whyImportant && (
          <p className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.whyImportant.message}
          </p>
        )}
      </div>

      {/* 8. Investment Readiness */}
      <div>
        <label className="block text-gray-700 font-medium mb-3 text-sm md:text-base">
          Our mentorship program is ₹60-80K with payment plans available. If we build a custom roadmap that gets you to your senior role, are you ready to invest in yourself? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label
            className={`flex items-start p-3 md:p-4 border-2 rounded-lg cursor-pointer transition ${
              errors.investmentReadiness ? "border-red-300" : "border-gray-200 hover:border-brand-purple"
            }`}
          >
            <input
              {...register("investmentReadiness")}
              type="radio"
              value="ready_to_invest"
              className="mt-0.5 mr-3 h-4 w-4 md:h-5 md:w-5 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-sm md:text-base text-gray-700">
              Yes, I'm ready to invest in the right program
            </span>
          </label>
          <label
            className={`flex items-start p-3 md:p-4 border-2 rounded-lg cursor-pointer transition ${
              errors.investmentReadiness ? "border-red-300" : "border-gray-200 hover:border-brand-purple"
            }`}
          >
            <input
              {...register("investmentReadiness")}
              type="radio"
              value="need_to_understand"
              className="mt-0.5 mr-3 h-4 w-4 md:h-5 md:w-5 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-sm md:text-base text-gray-700">
              I need to understand the value first
            </span>
          </label>
          <label
            className={`flex items-start p-3 md:p-4 border-2 rounded-lg cursor-pointer transition ${
              errors.investmentReadiness ? "border-red-300" : "border-gray-200 hover:border-brand-purple"
            }`}
          >
            <input
              {...register("investmentReadiness")}
              type="radio"
              value="cannot_invest"
              className="mt-0.5 mr-3 h-4 w-4 md:h-5 md:w-5 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-sm md:text-base text-gray-700">
              No, I can't invest right now
            </span>
          </label>
        </div>
        {errors.investmentReadiness && (
          <p className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.investmentReadiness.message}
          </p>
        )}
      </div>

      {/* 9. Timeline */}
      <div>
        <label className="block text-gray-700 font-medium mb-3 text-sm md:text-base">
          When do you want to start working on your career transformation? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label
            className={`flex items-start p-3 md:p-4 border-2 rounded-lg cursor-pointer transition ${
              errors.timeline ? "border-red-300" : "border-gray-200 hover:border-brand-purple"
            }`}
          >
            <input
              {...register("timeline")}
              type="radio"
              value="asap"
              className="mt-0.5 mr-3 h-4 w-4 md:h-5 md:w-5 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-sm md:text-base text-gray-700">As soon as possible</span>
          </label>
          <label
            className={`flex items-start p-3 md:p-4 border-2 rounded-lg cursor-pointer transition ${
              errors.timeline ? "border-red-300" : "border-gray-200 hover:border-brand-purple"
            }`}
          >
            <input
              {...register("timeline")}
              type="radio"
              value="30_days"
              className="mt-0.5 mr-3 h-4 w-4 md:h-5 md:w-5 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-sm md:text-base text-gray-700">Within 30 days</span>
          </label>
          <label
            className={`flex items-start p-3 md:p-4 border-2 rounded-lg cursor-pointer transition ${
              errors.timeline ? "border-red-300" : "border-gray-200 hover:border-brand-purple"
            }`}
          >
            <input
              {...register("timeline")}
              type="radio"
              value="90_days"
              className="mt-0.5 mr-3 h-4 w-4 md:h-5 md:w-5 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-sm md:text-base text-gray-700">Within 90 days</span>
          </label>
          <label
            className={`flex items-start p-3 md:p-4 border-2 rounded-lg cursor-pointer transition ${
              errors.timeline ? "border-red-300" : "border-gray-200 hover:border-brand-purple"
            }`}
          >
            <input
              {...register("timeline")}
              type="radio"
              value="more_than_90_days"
              className="mt-0.5 mr-3 h-4 w-4 md:h-5 md:w-5 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-sm md:text-base text-gray-700">More than 90 days</span>
          </label>
        </div>
        {errors.timeline && (
          <p className="mt-1.5 text-xs md:text-sm text-red-600" role="alert">
            {errors.timeline.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        className="w-full text-sm md:text-base"
      >
        {isSubmitting ? "Processing..." : "Continue to Book Your Call →"}
      </Button>

      <p className="text-center text-sm text-gray-500 mt-3">
        After submitting, you'll be able to choose your preferred time slot
      </p>
    </form>
  );
};

// Extend Window interface for Facebook Pixel
declare global {
  interface Window {
    fbq?: (action: string, event: string, data?: any) => void;
  }
}
