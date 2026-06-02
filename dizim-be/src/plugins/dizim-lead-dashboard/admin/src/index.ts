import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';

const pluginId = pluginPkg.name.replace(/^(@[^-,.][\w,-]+\/|strapi-)/, '');

export default {
  register(app: any) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: 'CastForEducation',
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Lead Dashboard',
      },
      Component: async () => {
        const component = await import('./pages/Dashboard');
        return component;
      },
      permissions: [],
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}/leads`,
      icon: 'List',
      intlLabel: {
        id: `${pluginId}.plugin.leads`,
        defaultMessage: 'Leads',
      },
      Component: async () => {
        const component = await import('./pages/LeadList');
        return component;
      },
      permissions: [],
    });

    app.registerPlugin({
      id: pluginId,
      name: 'Lead Dashboard',
    });
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app;
    const importedTrads = await Promise.all(
      (locales as any[]).map((locale: any) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );
    return Promise.resolve(importedTrads);
  },
};
