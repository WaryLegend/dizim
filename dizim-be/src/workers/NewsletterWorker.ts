import { Worker, Job } from 'bullmq';
import { connection, deadLetterQueue } from '../queues';
import { getNotificationProvider } from '../notifications';

export function createNewsletterWorker(): Worker {
  const worker = new Worker(
    'newsletter:send',
    async (job: Job) => {
      const { email, name, source } = job.data;

      console.log(`[NewsletterWorker] Sending welcome email to ${email}`);

      const provider = getNotificationProvider();
      await provider.sendWelcomeEmail({ email, name });

      return { sent: true, email };
    },
    {
      connection,
      concurrency: 5,
      lockDuration: 30000,
    }
  );

  worker.on('completed', (job: Job) => {
    console.log(`[NewsletterWorker] Welcome email sent to ${job.data.email}`);
  });

  worker.on('failed', async (job: Job | undefined, error: Error) => {
    console.error(`[NewsletterWorker] Failed to send email to ${job?.data?.email}:`, error.message);

    if (job && (job.attemptsMade || 0) >= 3) {
      await deadLetterQueue.add('newsletter:failed', {
        originalQueue: 'newsletter:send',
        originalJobId: job.id,
        data: job.data,
        error: error.message,
        failedAt: new Date().toISOString(),
      });
      console.warn(`[NewsletterWorker] Job ${job.id} moved to DLQ`);
    }
  });

  return worker;
}
