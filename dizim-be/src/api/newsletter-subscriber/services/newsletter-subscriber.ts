import { factories } from '@strapi/strapi';

const NEWSLETTER_UID = 'api::newsletter-subscriber.newsletter-subscriber';

export default factories.createCoreService(NEWSLETTER_UID);
