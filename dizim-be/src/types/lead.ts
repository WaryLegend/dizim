export type LeadSourceType = 'contact' | 'demo' | 'chatbot' | 'cta';

export type LeadStatus = 'new' | 'processing' | 'resolved' | 'spam';

export type LeadLevel = 'cold' | 'warm' | 'hot';

export type LeadActivityAction =
  | 'lead_created'
  | 'lead_qualified'
  | 'lead_requalified'
  | 'status_changed'
  | 'marked_spam'
  | 'notes_added'
  | 'lead_exported';

export interface CreateLeadInput {
  source_type: LeadSourceType;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiry_type?: string;
  expected_platform?: string;
  monthly_orders?: number;
  message?: string;
}

export interface UpdateLeadInput {
  full_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  inquiry_type?: string;
  expected_platform?: string;
  monthly_orders?: number;
  message?: string;
  status?: LeadStatus;
  lead_score?: number;
  lead_level?: LeadLevel;
  ai_summary?: string;
}

export interface CreateActivityInput {
  lead_id: number;
  action: LeadActivityAction;
  previous_value?: Record<string, unknown>;
  new_value?: Record<string, unknown>;
  performed_by?: string;
  metadata?: Record<string, unknown>;
}

export interface LeadExportJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  createdAt: Date;
  completedAt?: Date;
  filters?: LeadExportFilters;
}

export interface LeadExportFilters {
  source_type?: LeadSourceType;
  status?: LeadStatus;
  lead_level?: LeadLevel;
  from_date?: string;
  to_date?: string;
}

export interface QualifyLeadOutput {
  leadScore: number;
  leadLevel: LeadLevel;
  summary: string;
  recommendedAction: string;
}

export interface NewsletterSubscribeInput {
  email: string;
  source?: string;
}
