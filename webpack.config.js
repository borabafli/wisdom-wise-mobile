const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Override CSS handling to bypass lightningcss issues
  config.module.rules = config.module.rules.map(rule => {
    if (rule.test && rule.test.toString().includes('css')) {
      return {
        ...rule,
        use: rule.use.map(loader => {
          if (typeof loader === 'object' && loader.loader && loader.loader.includes('lightningcss')) {
            return 'css-loader';
          }
          return loader;
        })
      };
    }
    return rule;
  });
  
  return config;
};