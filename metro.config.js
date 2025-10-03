const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver with platform-specific extensions and alias handling
config.resolver.platforms = ['web', 'native', 'ios', 'android'];
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  // Alias global.css to platform-specific versions
  './global.css': require.resolve('./global.web.css'),
  'lightningcss': require.resolve('./web-lightningcss-shim.js'),
};

module.exports = config;