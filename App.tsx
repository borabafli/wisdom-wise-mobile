import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Global error handler to catch crashes
if (typeof ErrorUtils !== 'undefined') {
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('💥 GLOBAL ERROR:', error);
    Alert.alert('App Error', `${error.name}: ${error.message}`);
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
}

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('Step 2: Testing splash screen...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        console.log('Step 2: Splash test complete');
      } catch (e) {
        console.error('Error in splash test:', e);
        Alert.alert('Splash Error', String(e));
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: '#e9eff1' }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#e9eff1', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Step 2: Splash Screen ✅</Text>
    </View>
  );
}
