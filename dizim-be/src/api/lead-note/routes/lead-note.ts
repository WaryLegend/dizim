export default {
  routes: [
    {
      method: 'GET',
      path: '/lead-notes',
      handler: 'lead-note.find',
      config: { auth: true },
    },
    {
      method: 'GET',
      path: '/lead-notes/:id',
      handler: 'lead-note.findOne',
      config: { auth: true },
    },
  ],
};
