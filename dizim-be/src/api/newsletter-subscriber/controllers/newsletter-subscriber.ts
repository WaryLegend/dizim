import { factories } from '@strapi/strapi';
import { Context } from 'koa';

const NEWSLETTER_UID = 'api::newsletter-subscriber.newsletter-subscriber';

export default factories.createCoreController(NEWSLETTER_UID, ({ strapi }) => ({
  async subscribe(ctx: Context): Promise<void> {
    try {
      const { email, source } = ctx.request.body as any;
      if (!email || !isValidEmail(email)) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid email address' };
        return;
      }

      const existing = await strapi.entityService.findMany(NEWSLETTER_UID, {
        filters: { email: { $eq: email } },
      });

      if (existing && existing.length > 0) {
        const subscriber = existing[0];
        if (subscriber.status === 'active') {
          ctx.body = { data: subscriber, message: 'Already subscribed' };
          return;
        }
        const updated = await strapi.entityService.update(NEWSLETTER_UID, subscriber.id, {
          data: {
            status: 'active',
            unsubscribed_at: null,
            source: source || subscriber.source,
            publishedAt: null,
          },
        });
        ctx.body = { data: updated, message: 'Resubscribed successfully' };
        return;
      }

      const subscriber = await strapi.entityService.create(NEWSLETTER_UID, {
        data: {
          email,
          status: 'active',
          source: source || 'website',
          subscribed_at: new Date().toISOString(),
          publishedAt: null,
        },
      });

      const { getEventBus } = await import('../../../events');
      getEventBus().emit('newsletter:subscribed', {
        subscriberId: subscriber.id,
        email,
        source: source || 'website',
      });

      ctx.status = 201;
      ctx.body = { data: subscriber, message: 'Subscribed successfully' };
    } catch (error: any) {
      console.error('[Newsletter] Subscribe error:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },

  async unsubscribe(ctx: Context): Promise<void> {
    try {
      const { email } = ctx.request.body as any;
      if (!email || !isValidEmail(email)) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid email address' };
        return;
      }

      const existing = await strapi.entityService.findMany(NEWSLETTER_UID, {
        filters: { email: { $eq: email } },
      });

      if (!existing || existing.length === 0) {
        ctx.body = { message: 'Email not found in subscribers' };
        return;
      }

      const subscriber = existing[0];
      if (subscriber.status === 'unsubscribed') {
        ctx.body = { data: subscriber, message: 'Already unsubscribed' };
        return;
      }

      const updated = await strapi.entityService.update(NEWSLETTER_UID, subscriber.id, {
        data: {
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
          publishedAt: null,
        },
      });

      ctx.body = { data: updated, message: 'Unsubscribed successfully' };
    } catch (error: any) {
      console.error('[Newsletter] Unsubscribe error:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
}));

function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
}
