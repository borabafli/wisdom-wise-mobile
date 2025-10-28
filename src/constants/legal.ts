/**
 * Legal Documents URLs
 * 
 * These URLs point to the publicly hosted legal documents on GitHub Pages.
 * Required for App Store submission and user transparency.
 */

export const LEGAL_URLS = {
  PRIVACY_POLICY: 'https://borabafli.github.io/zenify-legal/privacy-policy.html',
  TERMS_OF_SERVICE: 'https://borabafli.github.io/zenify-legal/terms-of-service.html',
  HOME: 'https://borabafli.github.io/zenify-legal/',
} as const;

export const CONTACT_INFO = {
  PRIVACY_EMAIL: 'privacy@wisdomwise.app',
  SUPPORT_EMAIL: 'support@wisdomwise.app',
} as const;

/**
 * Helper function to open URL in browser
 * Use this for consistent URL opening across the app
 */
export const openLegalDocument = async (url: string): Promise<void> => {
  const { Linking, Alert } = await import('react-native');
  
  try {
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'Cannot Open Link',
        `Unable to open ${url}. Please try again later.`
      );
    }
  } catch (error) {
    console.error('Error opening URL:', error);
    Alert.alert(
      'Error',
      'Failed to open the document. Please try again.'
    );
  }
};

