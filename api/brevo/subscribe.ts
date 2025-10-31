// Vercel Serverless Function
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BREVO_API_KEY =
  "BREVO_API_KEY_REMOVED-Nkx6lVnRrd4bpaSl";
const BREVO_LIST_ID = 49;

interface RequestBody {
  name: string;
  email: string;
  phone: string;
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

  try {
    const { name, email, phone } = req.body as RequestBody;

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
        attributes: {
          FIRSTNAME: name.trim(),
          SMS: phone.trim(),
          whatsapp: phone.trim(), // Add this line
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    const data = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error("Brevo API Error:", data);

      // Handle duplicate contact
      if (brevoResponse.status === 400 && data.code === "duplicate_parameter") {
        return res.status(200).json({
          success: true,
          leadId: email.split("@")[0] + Date.now(),
          message: "Contact already exists, updated successfully",
        });
      }

      throw new Error(data.message || "Brevo API failed");
    }

    // Generate lead ID
    const leadId = data.id?.toString() || email.split("@")[0] + Date.now();

    return res.status(200).json({
      success: true,
      leadId,
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
