import './global.css';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { loadFonts } from './src/config/fonts';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import * as Notifications from 'expo-notifications';

// Import components and contexts
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AppProvider, AuthProvider } from './src/contexts';
import { AppContent } from './src/components/AppContent';
import { NotificationPrompt } from './src/components/NotificationPrompt';

// Import i18n service to initialize it
import './src/services/i18nService';
import { notificationService } from './src/services/notificationService';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  console.log('App component rendering, fontsLoaded:', fontsLoaded);

  useEffect(() => {
    console.log('App useEffect starting...');
    async function prepare() {
      try {
        console.log('Starting font loading...');
        await loadFonts();
        console.log('Fonts loaded successfully');

        // Proper Android navigation bar configuration
        if (Platform.OS === 'android') {
          console.log('Configuring Android navigation bar...');
          await NavigationBar.setBackgroundColorAsync('#e9eff1');
          await NavigationBar.setButtonStyleAsync('dark');
          console.log('Android navigation bar configured');
        }

        // Initialize notification service
        await notificationService.initialize();
        console.log('Notification service initialized');
      } catch (e) {
        console.error('Error in prepare function:', e);
        // Even if there's an error, allow app to load
        // This prevents crashes from non-critical initialization failures
      } finally {
        console.log('Setting fontsLoaded to true');
        setFontsLoaded(true);
        // Safely hide splash screen
        try {
          await SplashScreen.hideAsync();
        } catch (err) {
          console.error('Error hiding splash screen:', err);
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