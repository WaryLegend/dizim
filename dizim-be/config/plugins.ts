export default ({ env }) => ({
  'users-permissions': {
    config: {
      register: {
        allowedFields: ['fullName', 'phone', 'userType'],
      },
    },
  },
  'dizim-lead-dashboard': {
    enabled: true,
    resolve: './src/plugins/dizim-lead-dashboard',
  },
});
