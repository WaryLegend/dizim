import leadController from './controllers/lead-controller';

export default {
  register({ strapi }: { strapi: any }) {
    const pluginId = 'dizim-lead-dashboard';

    const routes = {
      'content-api': {
        type: 'content-api',
        routes: [
          {
            method: 'GET',
            path: '/stats',
            handler: 'lead.stats',
            config: { auth: true, policies: ['global::internal-role'] },
          },
          {
            method: 'GET',
            path: '/leads',
            handler: 'lead.find',
            config: { auth: true, policies: ['global::internal-role'] },
          },
          {
            method: 'GET',
            path: '/leads/:id',
            handler: 'lead.findOne',
            config: { auth: true, policies: ['global::internal-role'] },
          },
          {
            method: 'PUT',
            path: '/leads/:id',
            handler: 'lead.update',
            config: { auth: true, policies: ['global::internal-role'] },
          },
          {
            method: 'POST',
            path: '/leads/:id/notes',
            handler: 'lead.addNote',
            config: { auth: true, policies: ['global::internal-role'] },
          },
          {
            method: 'POST',
            path: '/leads/:id/requalify',
            handler: 'lead.requalify',
            config: { auth: true, policies: ['global::internal-role'] },
          },
          {
            method: 'POST',
            path: '/leads/:id/mark-spam',
            handler: 'lead.markSpam',
            config: { auth: true, policies: ['global::internal-role'] },
          },
          {
            method: 'POST',
            path: '/export',
            handler: 'lead.export',
            config: { auth: true, policies: ['global::internal-role'] },
          },
        ],
      },
    };

    strapi.plugin(pluginId).routes = routes;
    strapi.plugin(pluginId).controllers['lead'] = leadController;
  },

  bootstrap({ strapi }: { strapi: any }) {},
};
