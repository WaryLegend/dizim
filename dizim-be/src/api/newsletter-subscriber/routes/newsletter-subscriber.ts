export default {
  routes: [
    {
      method: 'POST',
      path: '/newsletter/subscribe',
      handler: 'newsletter-subscriber.subscribe',
      config: {
        auth: false,
        middlewares: ['api::lead.rate-limit-newsletter'],
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/newsletter/unsubscribe',
      handler: 'newsletter-subscriber.unsubscribe',
      config: {
        auth: false,
        middlewares: ['api::lead.rate-limit-newsletter'],
        policies: [],
      },
    },
  ],
};
