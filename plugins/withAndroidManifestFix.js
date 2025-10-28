const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withAndroidManifestFix(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Add tools namespace if not present
    if (!androidManifest.manifest.$['xmlns:tools']) {
      androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // Add appComponentFactory value AND tools:replace to application element
    const application = androidManifest.manifest.application[0];
    if (application) {
      application.$['android:appComponentFactory'] = 'androidx.core.app.CoreComponentFactory';
      application.$['tools:replace'] = 'android:appComponentFactory';
    }

    return config;
  });
};
