// Vercel Serverless Function for Google Sheets Integration
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from 'googleapis';

// Environment variables needed:
// GOOGLE_SHEETS_PRIVATE_KEY - Service account private key
// GOOGLE_SHEETS_CLIENT_EMAIL - Service account email
// GOOGLE_SHEETS_SPREADSHEET_ID - The spreadsheet ID
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

interface LeadData {
  email: string;
  name?: string;
  phone?: string;
  employmentStatus?: string;
  yearsOfExperience?: string;
  monthlySalary?: string;
  qualified?: boolean;
  qualificationReason?: string;
  qualificationCategory?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  // Apply form fields
  linkedinUrl?: string;
  currentRole?: string;
  currentCompany?: string;
  targetRole?: string;
  targetSalary?: string;
  blockingIssue?: string;
  whyImportant?: string;
  investmentReadiness?: string;
  timeline?: string;
  applyQualified?: boolean;
  applyQualificationReason?: string;
  // Tracking
  hasBooked?: boolean;
  bookingDate?: string;
  stage?: string; // 'lead', 'watched', 'booked', 'applied', 'qualified', 'disqualified'
}

interface RequestBody {
  action: 'create' | 'update';
  data: LeadData;
}

// Get authenticated Google Sheets client
async function getGoogleSheetsClient() {
  if (!GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY) {
    throw new Error('Google Sheets credentials not configured');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: GOOGLE_SHEETS_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

// Find row by email
async function findRowByEmail(sheets: any, email: string): Promise<number | null> {
  const range = 'Sheet1!A:A'; // Email column

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
  });

  const values = response.data.values;

  if (!values) {
    return null;
  }

  // Find the row index (1-based) where email matches
  const rowIndex = values.findIndex((row: string[]) =>
    row[0]?.toLowerCase() === email.toLowerCase()
  );

  return rowIndex >= 0 ? rowIndex + 1 : null;
}

// Append new row
async function appendRow(sheets: any, leadData: LeadData): Promise<void> {
  const range = 'Sheet1!A:Z';

  const timestamp = new Date().toISOString();
  const row = [
    leadData.email,
    leadData.name || '',
    leadData.phone || '',
    leadData.employmentStatus || '',
    leadData.yearsOfExperience || '',
    leadData.monthlySalary || '',
    leadData.qualified ? 'yes' : 'no',
    leadData.qualificationReason || '',
    leadData.qualificationCategory || '',
    leadData.utm_source || '',
    leadData.utm_medium || '',
    leadData.utm_campaign || '',
    leadData.utm_content || '',
    leadData.utm_term || '',
    leadData.linkedinUrl || '',
    leadData.currentRole || '',
    leadData.currentCompany || '',
    leadData.targetRole || '',
    leadData.targetSalary || '',
    leadData.blockingIssue || '',
    leadData.whyImportant || '',
    leadData.investmentReadiness || '',
    leadData.timeline || '',
    leadData.applyQualified !== undefined ? (leadData.applyQualified ? 'yes' : 'no') : '',
    leadData.applyQualificationReason || '',
    leadData.hasBooked ? 'yes' : 'no',
    leadData.bookingDate || '',
    leadData.stage || 'lead',
    timestamp, // created_at
    timestamp, // updated_at
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [row]
    }
  });
}

// Update existing row
async function updateRow(sheets: any, rowIndex: number, leadData: LeadData): Promise<void> {
  // First, get the existing row data
  const getRange = `Sheet1!A${rowIndex}:Z${rowIndex}`;

  const getResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: getRange,
  });

  const existingRow = getResponse.data.values?.[0] || [];

  // Merge new data with existing data (only update provided fields)
  const updatedRow = [
    leadData.email || existingRow[0],
    leadData.name !== undefined ? leadData.name : existingRow[1],
    leadData.phone !== undefined ? leadData.phone : existingRow[2],
    leadData.employmentStatus !== undefined ? leadData.employmentStatus : existingRow[3],
    leadData.yearsOfExperience !== undefined ? leadData.yearsOfExperience : existingRow[4],
    leadData.monthlySalary !== undefined ? leadData.monthlySalary : existingRow[5],
    leadData.qualified !== undefined ? (leadData.qualified ? 'yes' : 'no') : existingRow[6],
    leadData.qualificationReason !== undefined ? leadData.qualificationReason : existingRow[7],
    leadData.qualificationCategory !== undefined ? leadData.qualificationCategory : existingRow[8],
    leadData.utm_source !== undefined ? leadData.utm_source : existingRow[9],
    leadData.utm_medium !== undefined ? leadData.utm_medium : existingRow[10],
    leadData.utm_campaign !== undefined ? leadData.utm_campaign : existingRow[11],
    leadData.utm_content !== undefined ? leadData.utm_content : existingRow[12],
    leadData.utm_term !== undefined ? leadData.utm_term : existingRow[13],
    leadData.linkedinUrl !== undefined ? leadData.linkedinUrl : existingRow[14],
    leadData.currentRole !== undefined ? leadData.currentRole : existingRow[15],
    leadData.currentCompany !== undefined ? leadData.currentCompany : existingRow[16],
    leadData.targetRole !== undefined ? leadData.targetRole : existingRow[17],
    leadData.targetSalary !== undefined ? leadData.targetSalary : existingRow[18],
    leadData.blockingIssue !== undefined ? leadData.blockingIssue : existingRow[19],
    leadData.whyImportant !== undefined ? leadData.whyImportant : existingRow[20],
    leadData.investmentReadiness !== undefined ? leadData.investmentReadiness : existingRow[21],
    leadData.timeline !== undefined ? leadData.timeline : existingRow[22],
    leadData.applyQualified !== undefined ? (leadData.applyQualified ? 'yes' : 'no') : existingRow[23],
    leadData.applyQualificationReason !== undefined ? leadData.applyQualificationReason : existingRow[24],
    leadData.hasBooked !== undefined ? (leadData.hasBooked ? 'yes' : 'no') : existingRow[25],
    leadData.bookingDate !== undefined ? leadData.bookingDate : existingRow[26],
    leadData.stage !== undefined ? leadData.stage : existingRow[27],
    existingRow[28] || new Date().toISOString(), // created_at (keep original)
    new Date().toISOString(), // updated_at (always update)
  ];

  const updateRange = `Sheet1!A${rowIndex}:Z${rowIndex}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: updateRange,
    valueInputOption: 'RAW',
    requestBody: {
      values: [updatedRow]
    }
  });
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
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  if (!SPREADSHEET_ID || !GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY) {
    console.error("Google Sheets is not configured");
    return res.status(500).json({
      success: false,
      error: "Server configuration error",
    });
  }

  try {
    const { action, data } = req.body as RequestBody;

    if (!data.email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const sheets = await getGoogleSheetsClient();

    if (action === 'create') {
      const existingRow = await findRowByEmail(sheets, data.email);

      if (existingRow) {
        // Update existing row instead
        await updateRow(sheets, existingRow, data);
        return res.status(200).json({
          success: true,
          message: "Lead updated successfully",
          action: "updated"
        });
      } else {
        // Create new row
        await appendRow(sheets, data);
        return res.status(200).json({
          success: true,
          message: "Lead created successfully",
          action: "created"
        });
      }
    } else if (action === 'update') {
      // Find and update row
      const existingRow = await findRowByEmail(sheets, data.email);

      if (existingRow) {
        await updateRow(sheets, existingRow, data);
        return res.status(200).json({
          success: true,
          message: "Lead updated successfully",
          action: "updated"
        });
      } else {
        return res.status(404).json({
          success: false,
          error: "Lead not found"
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid action. Must be 'create' or 'update'"
      });
    }
  } catch (error: any) {
    console.error("Google Sheets error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process request",
    });
  }
}
