export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface NotificationProvider {
  sendWelcomeEmail(input: { email: string; name?: string }): Promise<void>;
  sendLeadAlert(input: {
    email: string;
    leadName: string;
    leadScore: number;
    leadLevel: string;
    summary: string;
  }): Promise<void>;
}
