import { getEventBus, InMemoryEventBus, setEventBus } from './events';
import { leadQualificationQueue, newsletterQueue, notificationQueue } from './queues';

export default {
  async register({ strapi }: { strapi: any }) {
    const eventBus = new InMemoryEventBus();
    setEventBus(eventBus);
    console.log('[Dizim Lead] Event bus initialized');
  },

  async bootstrap({ strapi }: { strapi: any }) {
    const eventBus = getEventBus();

    eventBus.subscribe('lead:created', async (payload) => {
      await leadQualificationQueue.add('qualify', { leadId: payload.leadId });
    });

    eventBus.subscribe('lead:hot', async (payload) => {
      await notificationQueue.add('alert', {
        leadId: payload.leadId, leadName: payload.fullName,
        leadScore: payload.leadScore, leadLevel: payload.leadLevel,
        summary: payload.summary, email: payload.email,
      });
    });

    eventBus.subscribe('newsletter:subscribed', async (payload) => {
      await newsletterQueue.add('welcome', {
        email: payload.email, subscriberId: payload.subscriberId,
      }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
    });

    const { startWorkers } = await import('./workers');
    startWorkers();
    console.log('[Dizim Lead] Module bootstrapped successfully');
  },
};
