const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('https://api.syui.ai', {target: 'http://localhost:8080'}));
};
