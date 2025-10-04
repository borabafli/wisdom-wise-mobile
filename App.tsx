import React from 'react';
import { View, Text, Alert } from 'react-native';

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

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#e9eff1', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>WisdomWise Minimal Test</Text>
    </View>
  );
}
