import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import with fallback for expo-localization
let Localization: any;
try {
  Localization = require('expo-localization');
} catch (error) {
  console.warn('expo-localization not available, using fallback');
  Localization = {
    locale: 'en-US',
    locales: ['en-US'],
    timezone: 'America/New_York',
    isoCurrencyCodes: ['USD'],
    region: 'US',
    isRTL: false
  };
}
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import language files
import en from '../locales/en.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import tr from '../locales/tr.json';
import es from '../locales/es.json';
import pt from '../locales/pt.json';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  tr: 'Türkçe',
  es: 'Español',
  pt: 'Português'
};

export const LANGUAGE_CODES = Object.keys(SUPPORTED_LANGUAGES);

// Storage key for user's language preference
const LANGUAGE_STORAGE_KEY = 'user_preferred_language';

// Language detection function
const detectLanguage = async (): Promise<string> => {
  try {
    // First, check if user has a saved preference
    let savedLanguage: string | null = null;
    try {
      savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (storageError) {
      console.warn('AsyncStorage not available:', storageError);
    }

    if (savedLanguage && LANGUAGE_CODES.includes(savedLanguage)) {
      return savedLanguage;
    }

    // If no saved preference, detect device language
    let deviceLanguage = 'en';
    try {
      // Safely access Localization.locale with fallback
      const locale = Localization?.locale || Localization?.locales?.[0] || 'en-US';
      if (typeof locale === 'string' && locale.includes('-')) {
        deviceLanguage = locale.split('-')[0]; // Extract language code (e.g., 'en' from 'en-US')
      } else if (typeof locale === 'string') {
        deviceLanguage = locale; // Already just a language code
      }
    } catch (localizationError) {
      console.warn('Localization not available:', localizationError);
    }

    // Determine the language we will use (device language if supported, otherwise English)
    const resolvedLanguage = LANGUAGE_CODES.includes(deviceLanguage) ? deviceLanguage : 'en';

    // Persist the resolved language so we don't override user choice on subsequent launches
    try {
      await saveLanguagePreference(resolvedLanguage);
    } catch (persistError) {
      console.warn('Failed to persist initial language preference:', persistError);
    }

    return resolvedLanguage;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Fallback to English
  }
};

// Save language preference
export const saveLanguagePreference = async (languageCode: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.warn('Error saving language preference (AsyncStorage may not be available):', error);
  }
};

// Get current language for AI context
export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

// Get language name for display
export const getLanguageName = (code: string): string => {
  return SUPPORTED_LANGUAGES[code as keyof typeof SUPPORTED_LANGUAGES] || 'English';
};

// Get language instruction for AI
export const getLanguageInstruction = (): string => {
  const currentLang = getCurrentLanguage();
  const languageNames = {
    en: 'English',
    de: 'German',
    fr: 'French',
    tr: 'Turkish',
    es: 'Spanish',
    pt: 'Portuguese'
  };

  const languageName = languageNames[currentLang as keyof typeof languageNames] || 'English';

  if (currentLang === 'en') {
    return ''; // No instruction needed for English
  }

  return `Please respond in ${languageName}. `;
};

// Initialize i18n
const initI18n = async () => {
  try {
    console.log('Starting i18n initialization...');
    const detectedLanguage = await detectLanguage();
    console.log('Detected language:', detectedLanguage);

    await i18n
      .use(initReactI18next)
      .init({
        resources: {
          en: { translation: en },
          de: { translation: de },
          fr: { translation: fr },
          tr: { translation: tr },
          es: { translation: es },
          pt: { translation: pt }
        },
        lng: detectedLanguage,
        fallbackLng: 'en',
        returnNull: false,
        returnEmptyString: false,
        saveMissing: false,
        debug: false, // Disabled - production mode
        interpolation: {
          escapeValue: false, // React already escapes values
        },
        react: {
          useSuspense: false, // Disable suspense for React Native
        }
      });

    console.log('i18n initialized successfully with language:', detectedLanguage);
  } catch (error) {
    console.error('Error initializing i18n:', error);
    // Fallback initialization with minimal config
    try {
      await i18n
        .use(initReactI18next)
        .init({
          resources: {
            en: { translation: en }
          },
          lng: 'en',
          fallbackLng: 'en',
          debug: false,
          interpolation: {
            escapeValue: false,
          },
          react: {
            useSuspense: false,
          }
        });
      console.log('i18n fallback initialization successful');
    } catch (fallbackError) {
      console.error('i18n fallback initialization also failed:', fallbackError);
    }
  }
};

// Change language function
export const changeLanguage = async (languageCode: string): Promise<void> => {
  try {
    if (!LANGUAGE_CODES.includes(languageCode)) {
      throw new Error(`Unsupported language: ${languageCode}`);
    }

    // Save preference
    await saveLanguagePreference(languageCode);

    // Change i18n language
    await i18n.changeLanguage(languageCode);

    console.log('Language changed to:', languageCode);
  } catch (error) {
    console.error('Error changing language:', error);
    throw error;
  }
};

// Initialize i18n service
initI18n().catch(error => {
  console.error('Failed to initialize i18n:', error);
});

// Safe translation wrapper that ensures we always get a string
export const safeT = (key: string, defaultValue?: string): string => {
  try {
    const result = i18n.t(key);
    // If result is the key itself (translation missing), use default or key
    if (result === key && defaultValue) {
      return defaultValue;
    }
    // Always return a string, never null/undefined
    return String(result || defaultValue || key);
  } catch (error) {
    console.warn(`Translation error for key: ${key}`, error);
    return defaultValue || key;
  }
};

export default i18n;