export default {
  routes: [
    {
      method: 'POST',
      path: '/extract-pdf',
      handler: 'extract-pdf.extract',
      config: {
        auth: false, // đổi thành true nếu muốn yêu cầu auth
        policies: [],
        middlewares: [],
      },
    },
  ],
};