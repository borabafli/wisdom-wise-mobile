const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Adds OAuth deep linking intent filters to AndroidManifest.xml
 * This ensures the app can handle OAuth callbacks from Google Sign-In
 */
module.exports = function withAndroidOAuthIntents(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    if (!mainApplication) {
      console.warn('No application element found in AndroidManifest');
      return config;
    }

    // Find the main activity
    const mainActivity = mainApplication.activity?.find(
      activity => activity.$?.['android:name'] === '.MainActivity'
    );

    if (!mainActivity) {
      console.warn('MainActivity not found in AndroidManifest');
      return config;
    }

    // Ensure intent-filter array exists
    if (!mainActivity['intent-filter']) {
      mainActivity['intent-filter'] = [];
    }

    // Check if OAuth intent filter already exists
    const hasOAuthIntent = mainActivity['intent-filter'].some(filter => {
      return filter.data?.some(d => d.$?.['android:scheme'] === 'zenmind');
    });

    if (!hasOAuthIntent) {
      // Add OAuth deep link intent filter for Google Sign-In callbacks
      mainActivity['intent-filter'].push({
        action: [
          { $: { 'android:name': 'android.intent.action.VIEW' } }
        ],
        category: [
          { $: { 'android:name': 'android.intent.category.DEFAULT' } },
          { $: { 'android:name': 'android.intent.category.BROWSABLE' } }
        ],
        data: [
          {
            $: {
              'android:scheme': 'zenmind',
              'android:host': 'auth',
              'android:pathPrefix': '/verify'
            }
          }
        ]
      });

      console.log('✅ Added OAuth deep link intent filter to AndroidManifest');
    } else {
      console.log('OAuth intent filter already exists in AndroidManifest');
    }

    return config;
  });
};
