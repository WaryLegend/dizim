import { Worker, Job } from 'bullmq';
import { connection } from '../queues';
import { getNotificationProvider } from '../notifications';

export function createNotificationWorker(): Worker {
  const worker = new Worker(
    'notification:send',
    async (job: Job) => {
      const provider = getNotificationProvider();

      if (job.name === 'contact-notification') {
        const { leadId, fullName, email, phone, company, inquiryType, message, createdAt } = job.data;
        const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;

        if (!adminEmail) {
          console.warn('[NotificationWorker] ADMIN_NOTIFY_EMAIL not set, skipping contact notification');
          return { skipped: true, reason: 'ADMIN_NOTIFY_EMAIL not configured' };
        }

        console.log(`[NotificationWorker] Sending contact notification for ${fullName}`);

        await provider.sendContactNotification({
          adminEmail,
          fullName,
          email,
          phone,
          company,
          inquiryType,
          message,
          createdAt,
        });

        return { sent: true, leadId };
      }

      const { leadId, leadName, leadScore, leadLevel, summary, email } = job.data;

      console.log(`[NotificationWorker] Sending lead alert for ${leadName} (score: ${leadScore})`);

      await provider.sendLeadAlert({
        email,
        leadName,
        leadScore,
        leadLevel,
        summary,
      });

      return { sent: true, leadId };
    },
    {
      connection,
      concurrency: 5,
      lockDuration: 30000,
    }
  );

  worker.on('completed', (job: Job) => {
    console.log(`[NotificationWorker] Alert sent for lead ${job.data.leadId}`);
  });

  worker.on('failed', (job: Job | undefined, error: Error) => {
    console.error(`[NotificationWorker] Failed to send alert:`, error.message);
  });

  return worker;
}
