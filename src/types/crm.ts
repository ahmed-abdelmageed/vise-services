
import { Tables } from "@/integrations/supabase/types";

export type VisaApplication = Tables<"visa_applications">;

export interface ApplicationStatus {
  id: string;
  application_id: string;
  status: string;
  notes?: string;
  updated_at: string;
  updated_by?: string;
}

export interface ClientDocument {
  id: string;
  client_id: string;
  document_name: string;
  document_type: string;
  storage_path: string;
  public_url?: string;
  uploaded_at: string;
  file_size?: number;
  mime_type?: string;
}

export interface ClientInvoice {
  id: string;
  invoice_number: string;
  client_id: string;
  amount: number;
  currency: string;
  status: string;
  issue_date: string;
  due_date?: string;
  payment_date?: string;
  service_description?: string;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatusType = 'Pending' | 'In Progress' | 'Document Review' | 'Interview Scheduled' | 'Approved' | 'Rejected' | 'Completed';
export type InvoiceStatusType = 'Unpaid' | 'Paid' | 'Overdue' | 'Cancelled';
export type DocumentType = 'Passport' | 'Photo' | 'ID Card' | 'Proof of Residence' | 'Financial Statement' | 'Travel Itinerary' | 'Hotel Booking' | 'Other';
