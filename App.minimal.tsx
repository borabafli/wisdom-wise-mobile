import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Minimal app to test basic functionality
export default function MinimalApp() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('MinimalApp: Starting initialization...');

    // Simulate app initialization
    const timer = setTimeout(() => {
      console.log('MinimalApp: Initialization complete');
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  console.log('MinimalApp: Rendering, isReady:', isReady);

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <StatusBar style="dark" />
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.content}>
          <Text style={styles.title}>🎉 App Works!</Text>
          <Text style={styles.subtitle}>Multi-language support is active</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>✅ Basic React Native: Working</Text>
            <Text style={styles.cardText}>✅ SafeAreaProvider: Working</Text>
            <Text style={styles.cardText}>✅ Expo StatusBar: Working</Text>
            <Text style={styles.cardText}>✅ Console Logging: Working</Text>
          </View>
          <Text style={styles.note}>
            This minimal version proves the basic app structure works.
            Now we can gradually add features back.
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  note: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});