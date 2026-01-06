// Vercel Serverless Function
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || "49", 10);

interface RequestBody {
  name: string;
  email: string;
  phone: string;
  // Stage 1: Lead form qualification
  employmentStatus?: string;
  yearsOfExperience?: string;
  monthlySalary?: string;
  qualified?: boolean;
  qualificationReason?: string;
  qualificationCategory?: string;
  // Stage 2: Apply form qualification
  applyQualified?: boolean;
  applyQualificationReason?: string;
  applyQualificationCategory?: string;
  // Funnel stage tracking
  stage?: string; // 'lead', 'watched', 'applied', 'booked'
  // UTM params
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  // Validate API key exists
  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not configured");
    return res.status(500).json({
      success: false,
      error: "Server configuration error",
    });
  }

  try {
    const {
      name,
      email,
      phone,
      employmentStatus,
      yearsOfExperience,
      monthlySalary,
      qualified,
      qualificationReason,
      qualificationCategory,
      applyQualified,
      applyQualificationReason,
      applyQualificationCategory,
      stage,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term
    } = req.body as RequestBody;

    // Validation
    if (!email || !name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Generate lead ID first (we'll use this for the watch link)
    const tempLeadId = email.split("@")[0] + "_" + Date.now();

    // Generate watch link - always use production domain
    const baseUrl = 'https://xperiencewave.com/vsltraining';
    const watchLink = `${baseUrl}/watch?lead_id=${tempLeadId}`;

    // Prepare attributes object with qualification data
    const attributes: Record<string, any> = {
      FIRSTNAME: name.trim(),
      SMS: phone.trim(),
      whatsapp: phone.trim(),
      WATCH_LINK: watchLink,
      UTM_SOURCE: utm_source || "",
      UTM_MEDIUM: utm_medium || "",
      UTM_CAMPAIGN: utm_campaign || "",
      UTM_CONTENT: utm_content || "",
      UTM_TERM: utm_term || "",
    };

    // Stage 1: Lead form qualification fields
    if (employmentStatus) {
      attributes.EMPLOYMENT_STATUS = employmentStatus;
    }
    if (yearsOfExperience) {
      attributes.YEARS_OF_EXPERIENCE = yearsOfExperience;
    }
    if (monthlySalary) {
      attributes.MONTHLY_SALARY = monthlySalary;
    }
    if (qualified !== undefined) {
      attributes.LEAD_QUALIFIED = qualified ? "yes" : "no";
    }
    if (qualificationReason) {
      attributes.LEAD_QUALIFICATION_REASON = qualificationReason;
    }
    if (qualificationCategory) {
      attributes.LEAD_QUALIFICATION_CATEGORY = qualificationCategory;
    }

    // Stage 2: Apply form qualification fields
    if (applyQualified !== undefined) {
      attributes.APPLY_QUALIFIED = applyQualified ? "yes" : "no";
    }
    if (applyQualificationReason) {
      attributes.APPLY_QUALIFICATION_REASON = applyQualificationReason;
    }
    if (applyQualificationCategory) {
      attributes.APPLY_QUALIFICATION_CATEGORY = applyQualificationCategory;
    }

    // Funnel stage tracking
    if (stage) {
      attributes.FUNNEL_STAGE = stage;
    }

    // Call Brevo API
    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        attributes,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    // Handle 204 No Content response (when contact is updated)
    if (brevoResponse.status === 204) {
      // Contact was updated successfully
      return res.status(200).json({
        success: true,
        leadId: tempLeadId,
        watchLink,
        message: "Contact updated successfully",
      });
    }

    // Handle empty response from Brevo
    const responseText = await brevoResponse.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("Failed to parse Brevo response:", responseText);
      console.error("Response status:", brevoResponse.status);
      throw new Error("Invalid response from Brevo API");
    }

    if (!brevoResponse.ok) {
      console.error("Brevo API Error:", data);

      // Handle duplicate contact
      if (brevoResponse.status === 400 && data.code === "duplicate_parameter") {
        return res.status(200).json({
          success: true,
          leadId: tempLeadId,
          watchLink,
          message: "Contact already exists, updated successfully",
        });
      }

      throw new Error(data.message || "Brevo API failed");
    }

    // Generate lead ID (for new contacts, prefer Brevo's ID)
    const leadId = data.id?.toString() || tempLeadId;

    // If we got a different ID from Brevo, update the watch link
    const finalWatchLink = data.id
      ? `${baseUrl}/watch?lead_id=${data.id}`
      : watchLink;

    return res.status(200).json({
      success: true,
      leadId,
      watchLink: finalWatchLink,
      message: "Contact added successfully",
    });
  } catch (error: any) {
    console.error("Subscribe error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process request",
    });
  }
}
