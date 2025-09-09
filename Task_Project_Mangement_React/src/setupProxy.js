const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['/api', '/swagger', '/hubs', '/hubs/notifications'],
    createProxyMiddleware({
      target: 'https://localhost:7193',
      changeOrigin: true,
      secure: false, // trust dev HTTPS cert
      ws: true,
      logLevel: 'silent',
    })
  );
};
