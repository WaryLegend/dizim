import { Worker, Job } from 'bullmq';
import { connection } from '../queues';
import { getNotificationProvider } from '../notifications';

export function createNotificationWorker(): Worker {
  const worker = new Worker(
    'notification:send',
    async (job: Job) => {
      const { leadId, leadName, leadScore, leadLevel, summary, email } = job.data;

      console.log(`[NotificationWorker] Sending lead alert for ${leadName} (score: ${leadScore})`);

      const provider = getNotificationProvider();
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
