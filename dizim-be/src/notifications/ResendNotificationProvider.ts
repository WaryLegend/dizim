import { Resend } from 'resend';
import { NotificationProvider, SendEmailInput } from './NotificationProvider';

export class ResendNotificationProvider implements NotificationProvider {
  private client: Resend;
  private fromEmail: string;

  constructor(apiKey?: string, fromEmail?: string) {
    const key = apiKey || process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY is required for ResendNotificationProvider');
    }
    this.client = new Resend(key);
    this.fromEmail = fromEmail || process.env.RESEND_FROM_EMAIL || 'noreply@dizim.ai';
  }

  async sendWelcomeEmail(input: { email: string; name?: string }): Promise<void> {
    const name = input.name || input.email.split('@')[0];
    await this.send({
      to: input.email,
      subject: 'Welcome to Dizim AI Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6C5CE7;">Welcome to Dizim AI!</h1>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thank you for subscribing to our newsletter. You'll now receive the latest updates about:</p>
          <ul>
            <li>AI-powered livestream commerce insights</li>
            <li>Platform updates and new features</li>
            <li>Industry trends and best practices</li>
          </ul>
          <p>Stay tuned for exciting content!</p>
          <p>Best regards,<br/>The Dizim AI Team</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">
            If you wish to unsubscribe, <a href="{{unsubscribeUrl}}">click here</a>.
          </p>
        </div>
      `,
    });
  }

  async sendLeadAlert(input: {
    email: string;
    leadName: string;
    leadScore: number;
    leadLevel: string;
    summary: string;
  }): Promise<void> {
    const salesEmail = process.env.SALES_ALERT_EMAIL || 'sales@dizim.ai';
    await this.send({
      to: salesEmail,
      subject: `🔥 HOT Lead Alert: ${escapeHtml(input.leadName)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #e74c3c;">🔥 Hot Lead Detected!</h1>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Name</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(input.leadName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Score</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${input.leadScore}/100</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Level</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                <span style="background: #e74c3c; color: white; padding: 4px 8px; border-radius: 4px;">${escapeHtml(input.leadLevel)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Summary</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(input.summary)}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">
            <a href="${process.env.ADMIN_URL || 'http://localhost:1337'}/admin/plugins/dizim-lead-dashboard/leads/${input.email}"
               style="background: #6C5CE7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              View Lead in Dashboard
            </a>
          </p>
        </div>
      `,
    });
  }

  private async send(input: SendEmailInput): Promise<void> {
    await this.client.emails.send({
      from: input.from || this.fromEmail,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text || input.html.replace(/<[^>]*>/g, ''),
    });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
