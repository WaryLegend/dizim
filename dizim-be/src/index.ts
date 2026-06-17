import { errors } from '@strapi/utils';
import { getEventBus, InMemoryEventBus, setEventBus } from './events';
import { leadQualificationQueue, newsletterQueue, notificationQueue } from './queues';

const { ValidationError } = errors;

export default {
  async register({ strapi }: { strapi: any }) {
    const eventBus = new InMemoryEventBus();
    setEventBus(eventBus);

    // Password validation rules (apply to register, change-password, reset-password)
    strapi.config.set('plugin::users-permissions.validationRules', {
      validatePassword: async (password: string) => {
        const messages: string[] = [];
        if (!password || password.length < 8) {
          messages.push('Password must be at least 8 characters');
        }
        if (!/[A-Z]/.test(password)) {
          messages.push('Password must contain at least 1 uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
          messages.push('Password must contain at least 1 lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
          messages.push('Password must contain at least 1 number');
        }
        if (messages.length > 0) {
          throw new ValidationError(messages.join('. '));
        }
        return true;
      },
    });

    // Rate limit for auth endpoints (login, register, forgot-password, etc.)
    strapi.config.set('plugin::users-permissions.ratelimit', {
      enabled: true,
      interval: { min: 1 },
      max: 5,
    });

    console.log('[Dizim Lead] Event bus initialized');
  },

  async bootstrap({ strapi }: { strapi: any }) {
    const eventBus = getEventBus();

    eventBus.subscribe('lead:created', async (payload) => {
      await leadQualificationQueue.add('qualify', { leadId: payload.leadId });

      if (process.env.ADMIN_NOTIFY_EMAIL) {
        await notificationQueue.add('contact-notification', {
          leadId: payload.leadId,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          company: payload.company,
          inquiryType: payload.inquiryType,
          message: payload.message,
          createdAt: payload.createdAt,
        });
      }
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
