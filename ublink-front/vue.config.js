module.exports = {
  // 빌드 위치는 추 후 정의
  // publicPath: '/front',
  // outputDir: '../main/webapp/front/',
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
    },
  },
  devServer: {
    proxy: {
      '/business': {
        target: 'https://cloud2.ubsales.co.kr',
        changeOrigin: true,
        pathRewrite: {
          '^/business': '',
        },
      },
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
  configureWebpack: {
    devServer: {
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
  },
};
