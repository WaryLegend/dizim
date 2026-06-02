import { NotificationProvider } from './NotificationProvider';
import { ResendNotificationProvider } from './ResendNotificationProvider';

let provider: NotificationProvider | null = null;

export function getNotificationProvider(): NotificationProvider {
  if (!provider) {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      provider = new ResendNotificationProvider(apiKey);
    } else {
      throw new Error('No notification provider configured. Set RESEND_API_KEY environment variable.');
    }
  }
  return provider;
}

export function setNotificationProvider(p: NotificationProvider): void {
  provider = p;
}

export { NotificationProvider } from './NotificationProvider';
export { ResendNotificationProvider } from './ResendNotificationProvider';
