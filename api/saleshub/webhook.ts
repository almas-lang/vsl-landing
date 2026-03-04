// Vercel Serverless Function
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SALESHUB_WEBHOOK_URL = "https://app.xperiencewave.com/api/webhooks/lead-capture";
const SALESHUB_WEBHOOK_SECRET = process.env.SALESHUB_WEBHOOK_SECRET;

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
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  if (!SALESHUB_WEBHOOK_SECRET) {
    console.error("SALESHUB_WEBHOOK_SECRET is not configured");
    return res.status(500).json({ success: false, error: "Server configuration error" });
  }

  try {
    const response = await fetch(SALESHUB_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": SALESHUB_WEBHOOK_SECRET,
      },
      body: JSON.stringify(req.body),
    });

    const responseText = await response.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { raw: responseText };
    }

    if (!response.ok) {
      console.error("SalesHub webhook error:", data);
      return res.status(response.status).json({ success: false, error: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("SalesHub webhook error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
