export default {
  dev: {
    '/admin/': {
      // target: 'http://192.168.0.33:9880/',
      target: 'http://api.live-mall.nodewebapp.com/',
      // target:'https://api.live-mall.omesell.com/',
      changeOrigin: true,
    },
    '/v1/': {
      // target: 'http://192.168.0.33:9880/',
      //  target: 'https://api.live-mall.omesell.com/',
      target: 'http://api.live-mall.nodewebapp.com/',
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
