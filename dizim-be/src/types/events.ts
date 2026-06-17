export type EventType =
  | 'lead:created'
  | 'lead:qualified'
  | 'lead:requalified'
  | 'lead:hot'
  | 'lead:status_changed'
  | 'newsletter:subscribed';

export interface LeadCreatedEvent {
  leadId: number;
  sourceType: string;
  email: string;
  fullName: string;
  phone?: string;
  company?: string;
  inquiryType?: string;
  message?: string;
  createdAt: string;
}

export interface LeadQualifiedEvent {
  leadId: number;
  leadScore: number;
  leadLevel: string;
  summary: string;
  previousLevel?: string;
}

export interface LeadHotEvent {
  leadId: number;
  leadScore: number;
  summary: string;
  email: string;
  fullName: string;
  company?: string;
}

export interface LeadStatusChangedEvent {
  leadId: number;
  previousStatus: string;
  newStatus: string;
  performedBy?: string;
}

export interface NewsletterSubscribedEvent {
  subscriberId: number;
  email: string;
  source?: string;
}

export type EventPayloads = {
  'lead:created': LeadCreatedEvent;
  'lead:qualified': LeadQualifiedEvent;
  'lead:requalified': LeadQualifiedEvent;
  'lead:hot': LeadHotEvent;
  'lead:status_changed': LeadStatusChangedEvent;
  'newsletter:subscribed': NewsletterSubscribedEvent;
};
