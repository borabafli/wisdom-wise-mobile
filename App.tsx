// BINARY SEARCH TEST: Remove ALL potentially problematic imports
// Keep ONLY what worked in minimal test

import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';

// REMOVED (testing):
// - global.css
// - Sentry
// - i18n service
// - notification service
// - contexts (AuthProvider, AppProvider)
// - ErrorBoundary, AppContent, NotificationPrompt

// Keep basic expo modules for now
import * as SplashScreen from 'expo-splash-screen';
import { loadFonts } from './src/config/fonts';

// Global error handler
if (typeof ErrorUtils !== 'undefined') {
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    Alert.alert('CRASH', `${error.message}`);
    if (originalHandler) originalHandler(error, isFatal);
  });
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  console.log('App component rendering, fontsLoaded:', fontsLoaded);

  useEffect(() => {
    async function prepare() {
      try {
        Alert.alert('Test', 'Loading fonts...');
        await loadFonts();
        Alert.alert('Success!', 'Fonts loaded ✅');
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9eff1' }}>
      {/* Fonts loaded successfully - app works! */}
    </View>
  );
}