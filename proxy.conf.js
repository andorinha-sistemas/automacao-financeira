module.exports = {
  '/rest': {
    target: 'http://localhost:9090',
    secure: false,
    changeOrigin: true,
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.removeHeader('origin');
        proxyReq.removeHeader('Origin');
        proxyReq.removeHeader('referer');
        proxyReq.removeHeader('Referer');
      });
    },
  },
};
