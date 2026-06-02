import pluginPkg from '../../package.json';

const pluginId = pluginPkg.name.replace(/^(@[^-,.][\w,-]+\/|strapi-)/, '');

export default pluginId;
