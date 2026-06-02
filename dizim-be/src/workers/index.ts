import { createLeadWorker } from './LeadWorker';
import { createNewsletterWorker } from './NewsletterWorker';
import { createNotificationWorker } from './NotificationWorker';
import { createExportWorker } from './ExportWorker';

export function startWorkers(): void {
  const leadWorker = createLeadWorker();
  const newsletterWorker = createNewsletterWorker();
  const notificationWorker = createNotificationWorker();
  const exportWorker = createExportWorker();

  console.log('[Workers] All workers started');
}

export { createLeadWorker } from './LeadWorker';
export { createNewsletterWorker } from './NewsletterWorker';
export { createNotificationWorker } from './NotificationWorker';
export { createExportWorker } from './ExportWorker';
