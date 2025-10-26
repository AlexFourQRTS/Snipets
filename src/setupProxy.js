const path = require('path');

module.exports = function(app) {
  // Настройка алиасов для Webpack
  const alias = {
    '@': path.resolve(__dirname, '.'),
    '@/components': path.resolve(__dirname, 'components'),
    '@/hooks': path.resolve(__dirname, 'hooks'),
    '@/utils': path.resolve(__dirname, 'utils'),
    '@/types': path.resolve(__dirname, 'types'),
    '@/data': path.resolve(__dirname, 'data'),
  };

  // Применяем алиасы к Webpack конфигурации
  if (app && app.get) {
    const webpackConfig = app.get('webpack');
    if (webpackConfig && webpackConfig.resolve) {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        ...alias,
      };
    }
  }
};
