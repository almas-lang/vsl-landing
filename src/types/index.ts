export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
}

export interface BrevoContact {
  email: string;
  attributes: {
    FIRSTNAME?: string;
    PHONE?: string;
    SMS?: string;
  };
  listIds: number[];
  updateEnabled: boolean;
}

export interface BrevoResponse {
  id?: number;
  success: boolean;
  leadId?: string;
  error?: string;
}

export interface TrackingEvent {
  event: string;
  data?: Record<string, any>;
}

export interface ApplyFormData {
  linkedinUrl: string;
  currentRole: string;
  currentCompany: string;
  targetRole: string;
  targetSalary: string;
  blockingIssue: string;
  whyImportant: string;
  investmentReadiness: string;
  timeline: string;
}

export interface QualificationResult {
  qualified: boolean;
  reason?: string;
  category?: string;
}