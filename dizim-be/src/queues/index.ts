import { Queue, Worker, QueueScheduler, ConnectionOptions } from 'bullmq';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const leadQualificationQueue = new Queue('lead:qualification', { connection });
export const newsletterQueue = new Queue('newsletter:send', { connection });
export const notificationQueue = new Queue('notification:send', { connection });
export const exportQueue = new Queue('lead:export', { connection });
export const deadLetterQueue = new Queue('dead-letter', { connection });

export async function closeQueues(): Promise<void> {
  await Promise.all([
    leadQualificationQueue.close(),
    newsletterQueue.close(),
    notificationQueue.close(),
    exportQueue.close(),
    deadLetterQueue.close(),
    redis.quit(),
  ]);
}
