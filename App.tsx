// Full app restored with AuthProvider fix
// Sentry removed (not needed for now)

import './global.css';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { loadFonts } from './src/config/fonts';

// Components and contexts
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AppProvider, AuthProvider } from './src/contexts';
import { AppContent } from './src/components/AppContent';
import { NotificationPrompt } from './src/components/NotificationPrompt';

// Services
import './src/services/i18nService';
import { notificationService } from './src/services/notificationService';

// Global error handler
if (typeof ErrorUtils !== 'undefined') {
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('💥 GLOBAL ERROR CAUGHT:', error);
    console.error('💥 IS FATAL:', isFatal);
    console.error('💥 ERROR STACK:', error.stack);
    if (originalHandler) originalHandler(error, isFatal);
  });
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  console.log('App component rendering, fontsLoaded:', fontsLoaded);

  useEffect(() => {
    console.log('🚀 [APP] useEffect starting...');
    async function prepare() {
      try {
        console.log('📝 [APP] Step 1: Starting font loading...');
        await loadFonts();
        console.log('✅ [APP] Step 1: Fonts loaded successfully');

        // Proper Android navigation bar configuration
        if (Platform.OS === 'android') {
          console.log('📝 [APP] Step 2: Configuring Android navigation bar...');
          await NavigationBar.setBackgroundColorAsync('#e9eff1');
          await NavigationBar.setButtonStyleAsync('dark');
          console.log('✅ [APP] Step 2: Android navigation bar configured');
        }

        // Initialize notification service
        console.log('📝 [APP] Step 3: Initializing notification service...');
        await notificationService.initialize();
        console.log('✅ [APP] Step 3: Notification service initialized');
      } catch (e) {
        console.error('❌ [APP] FATAL ERROR in prepare function:', e);
        console.error('❌ [APP] Error stack:', e.stack);
        // Even if there's an error, allow app to load
        // This prevents crashes from non-critical initialization failures
      } finally {
        console.log('📝 [APP] Step 4: Setting fontsLoaded to true');
        setFontsLoaded(true);
        // Safely hide splash screen
        try {
          console.log('📝 [APP] Step 5: Hiding splash screen...');
          await SplashScreen.hideAsync();
          console.log('✅ [APP] Step 5: Splash screen hidden');
        } catch (err) {
          console.error('❌ [APP] Error hiding splash screen:', err);
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
}