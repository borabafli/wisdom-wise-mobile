const { withAppBuildGradle } = require('expo/config-plugins');

module.exports = function withForceExcludeSupport(config) {
  return withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;

    // Force exclude all android.support libraries at configuration level
    const exclusionConfig = `
configurations.all {
    exclude group: 'com.android.support'
}
`;

    // Insert at the top of the file, after buildscript
    if (!buildGradle.includes('exclude group: \'com.android.support\'')) {
      buildGradle = buildGradle.replace(
        /(apply plugin:.*?\n)/,
        `$1\n${exclusionConfig}\n`
      );
    }

    config.modResults.contents = buildGradle;
    return config;
  });
};
