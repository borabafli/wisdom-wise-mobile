import "./global.css";
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';
import { loadFonts } from './src/config/fonts';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';

// Import components and contexts
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AppProvider } from './src/contexts';
import { AppContent } from './src/components/AppContent';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        
        // Configure Android navigation bar
        if (Platform.OS === 'android') {
          await NavigationBar.setBackgroundColorAsync('#ffffff');
          await NavigationBar.setButtonStyleAsync('dark');
          await NavigationBar.setVisibilityAsync('visible');
        }
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
    return <View className="flex-1 bg-blue-50" />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
