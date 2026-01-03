# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for your Xperience Wave landing page to automatically collect and track lead data.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Your Google Spreadsheet created and ready

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top and select "New Project"
3. Enter a project name (e.g., "Xperience Wave Leads")
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your Google Cloud Console, make sure your new project is selected
2. Go to "APIs & Services" > "Library"
3. Search for "Google Sheets API"
4. Click on it and press "Enable"

## Step 3: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - **Name**: Xperience Wave Sheets Integration
   - **Description**: Service account for managing lead data in Google Sheets
4. Click "Create and Continue"
5. Skip the optional steps (roles and users) by clicking "Done"

## Step 4: Generate Service Account Key

1. On the Credentials page, find your newly created service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Choose "JSON" format
6. Click "Create"
7. A JSON file will be downloaded to your computer - **KEEP THIS SECURE!**

## Step 5: Set Up Your Google Sheet

1. Create a new Google Sheet or open an existing one
2. Name it something like "Xperience Wave Leads"
3. In the first sheet (Sheet1), add the following headers in Row 1:

```
A: Email
B: Name
C: Phone
D: Employment Status
E: Years of Experience
F: Monthly Salary
G: Qualified
H: Qualification Reason
I: Qualification Category
J: UTM Source
K: UTM Medium
L: UTM Campaign
M: UTM Content
N: UTM Term
O: LinkedIn URL
P: Current Role
Q: Current Company
R: Target Role
S: Target Salary
T: Blocking Issue
U: Why Important
V: Investment Readiness
W: Timeline
X: Apply Qualified
Y: Apply Qualification Reason
Z: Has Booked
AA: Booking Date
AB: Stage
AC: Created At
AD: Updated At
```

4. Copy the **Spreadsheet ID** from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part

5. **Share the sheet with the service account**:
   - Click the "Share" button
   - Paste the service account email (from the JSON file: `client_email`)
   - Give it "Editor" access
   - Click "Send"

## Step 6: Configure Environment Variables

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following environment variables:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Your spreadsheet ID | From Step 5 |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Service account email | From JSON file: `client_email` |
| `GOOGLE_SHEETS_PRIVATE_KEY` | Service account private key | From JSON file: `private_key` (keep the \n characters) |

**Important for GOOGLE_SHEETS_PRIVATE_KEY**:
- Copy the entire `private_key` value from your JSON file
- It should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`
- Keep the `\n` characters as they are (don't replace them with actual line breaks)

### For Local Development:

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following:

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email_here
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

**Note**: Make sure `.env.local` is in your `.gitignore` file!

## Step 7: Test the Integration

### Local Testing:

1. Start your development server:
```bash
npm run dev
```

2. Fill out the lead form on your local site
3. Check your Google Sheet to see if the data appears

### Production Testing:

1. Deploy your changes to Vercel
2. Test the live form
3. Verify data appears in your Google Sheet

## Troubleshooting

### "Google Sheets is not configured" Error

**Solution**: Make sure all three environment variables are set correctly in Vercel.

### "Failed to get access token" Error

**Solution**:
- Check that the `GOOGLE_SHEETS_PRIVATE_KEY` is copied correctly with `\n` characters
- Verify the `GOOGLE_SHEETS_CLIENT_EMAIL` matches the service account email

### "Permission denied" Error

**Solution**:
- Make sure you shared the spreadsheet with the service account email
- Give the service account "Editor" permissions

### Data Not Appearing in Sheet

**Solution**:
1. Check the browser console for errors
2. Verify the `GOOGLE_SHEETS_SPREADSHEET_ID` is correct
3. Ensure Sheet1 exists in your spreadsheet
4. Check that column headers match the expected format

## Security Best Practices

1. **Never commit** your JSON key file to git
2. **Never commit** your `.env.local` file to git
3. Add `.env.local` and `*.json` (service account keys) to `.gitignore`
4. Rotate your service account keys periodically
5. Only give the service account access to the specific spreadsheet it needs

## Column Reference

The data is stored in the following order:

| Column | Field Name | Type | Source |
|--------|------------|------|--------|
| A | Email | String | Lead Form |
| B | Name | String | Lead Form |
| C | Phone | String | Lead Form |
| D | Employment Status | String | Lead Form |
| E | Years of Experience | String | Lead Form |
| F | Monthly Salary | String | Lead Form (Optional) |
| G | Qualified | yes/no | Auto-calculated |
| H | Qualification Reason | String | Auto-calculated |
| I | Qualification Category | String | Auto-calculated |
| J-N | UTM Parameters | String | URL tracking |
| O | LinkedIn URL | String | Apply Form |
| P | Current Role | String | Apply Form |
| Q | Current Company | String | Apply Form |
| R | Target Role | String | Apply Form |
| S | Target Salary | String | Apply Form |
| T | Blocking Issue | String | Apply Form |
| U | Why Important | String | Apply Form |
| V | Investment Readiness | String | Apply Form |
| W | Timeline | String | Apply Form |
| X | Apply Qualified | yes/no | Auto-calculated |
| Y | Apply Qualification Reason | String | Auto-calculated |
| Z | Has Booked | yes/no | Tracking |
| AA | Booking Date | Date | Tracking |
| AB | Stage | String | Tracking |
| AC | Created At | Timestamp | Auto-generated |
| AD | Updated At | Timestamp | Auto-generated |

## Support

If you encounter any issues, check:
1. Google Cloud Console logs
2. Vercel function logs
3. Browser console errors

For additional help, refer to:
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
