export default {
  routes: [
    {
      method: 'POST',
      path: '/leads/contact',
      handler: 'lead.contact',
      config: {
        auth: false,
        middlewares: ['api::lead.rate-limit-contact'],
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/leads/demo',
      handler: 'lead.demo',
      config: {
        auth: false,
        middlewares: ['api::lead.rate-limit-demo'],
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/leads/chatbot',
      handler: 'lead.chatbot',
      config: {
        auth: false,
        middlewares: ['api::lead.rate-limit-chatbot'],
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/leads/cta',
      handler: 'lead.cta',
      config: {
        auth: false,
        middlewares: ['api::lead.rate-limit-cta'],
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/leads',
      handler: 'lead.find',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/leads/:id',
      handler: 'lead.findOne',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/leads/:id',
      handler: 'lead.update',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/leads/:id',
      handler: 'lead.delete',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/leads/:id/notes',
      handler: 'lead.addNote',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/leads/:id/requalify',
      handler: 'lead.requalify',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/leads/:id/mark-spam',
      handler: 'lead.markSpam',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/leads/export',
      handler: 'lead-export.create',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/leads/export/:jobId',
      handler: 'lead-export.status',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/leads/export/download/:jobId',
      handler: 'lead-export.download',
      config: {
        auth: true,
        policies: [],
      },
    },
  ],
};
