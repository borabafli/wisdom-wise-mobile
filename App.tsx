// BINARY SEARCH TEST - STEP 3: Add back services (Sentry, i18n, notifications)
// Working: fonts, splash, global.css, SafeAreaProvider, GestureHandler, ErrorBoundary
// Testing: Sentry, i18n service, notification service
// Still removed: contexts (AuthProvider, AppProvider), AppContent, NotificationPrompt

import './global.css';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { loadFonts } from './src/config/fonts';
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Add back services
import './src/services/i18nService';
import { notificationService } from './src/services/notificationService';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://b89c4c218716d1508037918de6c943f9@o4510130467766272.ingest.de.sentry.io/4510130469994576',
  sendDefaultPii: true,
  enableLogs: true,
});

// Global error handler
if (typeof ErrorUtils !== 'undefined') {
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    Alert.alert('CRASH', `${error.message}`);
    if (originalHandler) originalHandler(error, isFatal);
  });
}

SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function App() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  console.log('App component rendering, fontsLoaded:', fontsLoaded);

  useEffect(() => {
    async function prepare() {
      try {
        Alert.alert('Test', 'Loading fonts...');
        await loadFonts();
        Alert.alert('Success!', 'Fonts loaded ✅');

        // Android navigation bar
        if (Platform.OS === 'android') {
          await NavigationBar.setBackgroundColorAsync('#e9eff1');
          await NavigationBar.setButtonStyleAsync('dark');
        }

        // Initialize notification service
        await notificationService.initialize();

        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      } catch (e) {
        Alert.alert('ERROR', String(e));
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#e9eff1' }} />;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9eff1' }}>
            {/* UI infrastructure loaded - if you see this blank screen, these imports work! */}
          </View>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}