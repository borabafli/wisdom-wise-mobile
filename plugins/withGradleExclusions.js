const { withAppBuildGradle } = require('expo/config-plugins');

module.exports = function withGradleExclusions(config) {
  return withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;

    // Add configurations to exclude old support libraries
    const exclusionConfig = `
configurations.all {
    exclude group: 'com.android.support', module: 'support-compat'
    exclude group: 'com.android.support', module: 'support-core-utils'
    exclude group: 'com.android.support', module: 'support-core-ui'
    exclude group: 'com.android.support', module: 'support-v4'
}
`;

    // Insert before dependencies block
    if (!buildGradle.includes('exclude group: \'com.android.support\'')) {
      buildGradle = buildGradle.replace(
        /dependencies\s*{/,
        `${exclusionConfig}\ndependencies {`
      );
    }

    config.modResults.contents = buildGradle;
    return config;
  });
};
