import './global.css';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { loadFonts } from './src/config/fonts';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import * as Notifications from 'expo-notifications';

// Global error handler to catch crashes
if (typeof ErrorUtils !== 'undefined') {
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('💥 GLOBAL ERROR CAUGHT:', error);
    console.error('💥 IS FATAL:', isFatal);
    console.error('💥 ERROR STACK:', error.stack);
    Alert.alert(
      'App Error',
      `${error.name}: ${error.message}\n\nStack: ${error.stack?.substring(0, 200)}`,
      [{ text: 'OK' }]
    );
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
}

// Import components and contexts
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AppProvider, AuthProvider } from './src/contexts';
import { AppContent } from './src/components/AppContent';
import { NotificationPrompt } from './src/components/NotificationPrompt';

// Import i18n service to initialize it
try {
  require('./src/services/i18nService');
  console.log('✅ i18n service imported successfully');
} catch (e) {
  console.error('❌ CRASH: Failed to import i18n service:', e);
  if (typeof Alert !== 'undefined') {
    Alert.alert('IMPORT ERROR', `i18n: ${e.message}`);
  }
}

let notificationService: any = null;
try {
  notificationService = require('./src/services/notificationService').notificationService;
  console.log('✅ notification service imported successfully');
} catch (e) {
  console.error('❌ CRASH: Failed to import notification service:', e);
  if (typeof Alert !== 'undefined') {
    Alert.alert('IMPORT ERROR', `notifications: ${e.message}`);
  }
}

import * as Sentry from '@sentry/react-native';

try {
  Sentry.init({
    dsn: 'https://b89c4c218716d1508037918de6c943f9@o4510130467766272.ingest.de.sentry.io/4510130469994576',
    sendDefaultPii: true,
    enableLogs: true,
  });
  console.log('✅ Sentry initialized successfully');
} catch (e) {
  console.error('❌ CRASH: Failed to initialize Sentry:', e);
}

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function App() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  console.log('App component rendering, fontsLoaded:', fontsLoaded);

  // Show alert IMMEDIATELY when component mounts (before useEffect)
  useEffect(() => {
    Alert.alert('🎯 APP STARTED', 'App component mounted successfully!');
  }, []);

  useEffect(() => {
    console.log('🚀 [APP] useEffect starting...');
    async function prepare() {
      try {
        Alert.alert('Checkpoint 1', 'About to load fonts');
        console.log('📝 [APP] Step 1: Starting font loading...');
        await loadFonts();
        console.log('✅ [APP] Step 1: Fonts loaded successfully');
        Alert.alert('Checkpoint 2', 'Fonts loaded! ✅');

        // Proper Android navigation bar configuration
        if (Platform.OS === 'android') {
          Alert.alert('Checkpoint 3', 'About to configure navigation bar');
          console.log('📝 [APP] Step 2: Configuring Android navigation bar...');
          await NavigationBar.setBackgroundColorAsync('#e9eff1');
          await NavigationBar.setButtonStyleAsync('dark');
          console.log('✅ [APP] Step 2: Android navigation bar configured');
          Alert.alert('Checkpoint 4', 'Nav bar configured! ✅');
        }

        // Initialize notification service
        Alert.alert('Checkpoint 5', 'About to initialize notifications');
        console.log('📝 [APP] Step 3: Initializing notification service...');
        await notificationService.initialize();
        console.log('✅ [APP] Step 3: Notification service initialized');
        Alert.alert('Checkpoint 6', 'Notifications initialized! ✅');
      } catch (e) {
        console.error('❌ [APP] FATAL ERROR in prepare function:', e);
        console.error('❌ [APP] Error stack:', e.stack);
        Alert.alert('ERROR in prepare', `${e.name}: ${e.message}`);
        // Even if there's an error, allow app to load
        // This prevents crashes from non-critical initialization failures
      } finally {
        console.log('📝 [APP] Step 4: Setting fontsLoaded to true');
        setFontsLoaded(true);
        // Safely hide splash screen
        try {
          Alert.alert('Checkpoint 7', 'About to hide splash');
          console.log('📝 [APP] Step 5: Hiding splash screen...');
          await SplashScreen.hideAsync();
          console.log('✅ [APP] Step 5: Splash screen hidden');
          Alert.alert('Checkpoint 8', 'Splash hidden! ✅');
        } catch (err) {
          console.error('❌ [APP] Error hiding splash screen:', err);
          Alert.alert('ERROR hiding splash', String(err));
        }
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded) {
    console.log('Fonts not loaded yet, showing loading view');
    return <View style={{ flex: 1, backgroundColor: '#e9eff1' }} />;
  }

  console.log('Fonts loaded, rendering main app');

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthProvider>
            <AppProvider>
              <AppContent />
              <NotificationPrompt />
            </AppProvider>
          </AuthProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
});