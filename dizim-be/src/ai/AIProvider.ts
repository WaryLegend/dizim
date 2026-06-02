import { QualifyLeadOutput } from '../types';

export interface AIProviderInput {
  full_name: string;
  email: string;
  company?: string;
  monthly_orders?: number;
  message?: string;
  phone?: string;
  inquiry_type?: string;
  expected_platform?: string;
}

export interface AIProvider {
  qualifyLead(input: AIProviderInput): Promise<QualifyLeadOutput>;
}
