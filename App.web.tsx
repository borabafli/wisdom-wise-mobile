// Web-specific App component without CSS imports to avoid lightningcss
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { loadFonts } from './src/config/fonts';
import * as SplashScreen from 'expo-splash-screen';

// Import components and contexts
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AppProvider, AuthProvider } from './src/contexts';
import { AppContent } from './src/components/AppContent';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#f0f9ff' }} />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}