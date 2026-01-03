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