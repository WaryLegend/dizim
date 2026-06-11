import { getEventBus, InMemoryEventBus, setEventBus } from './events';
import { leadQualificationQueue, newsletterQueue, notificationQueue } from './queues';

export default {
  async register({ strapi }: { strapi: any }) {
    const eventBus = new InMemoryEventBus();
    setEventBus(eventBus);

    // Password validation rules (apply to register, change-password, reset-password)
    strapi.config.set('plugin::users-permissions.validationRules', {
      validatePassword: async (password: string) => {
        const errors: string[] = [];
        if (!password || password.length < 8) {
          errors.push('Mật khẩu phải có ít nhất 8 ký tự');
        }
        if (!/[A-Z]/.test(password)) {
          errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
        }
        if (!/[a-z]/.test(password)) {
          errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
        }
        if (!/[0-9]/.test(password)) {
          errors.push('Mật khẩu phải có ít nhất 1 số');
        }
        if (errors.length > 0) {
          throw new Error(errors.join('. '));
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
