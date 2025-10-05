import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView, // Import the built-in component
  ScrollView,         // Import ScrollView for the messages
} from 'react-native';

export const KeyboardTest: React.FC = () => {
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        // This is the key prop. 'padding' for iOS and 'height' for Android
        // are the most reliable behaviors.
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* The messages are in a separate ScrollView */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.mockMessages}>
            <Text style={styles.mockText}>Keyboard Test 💬</Text>
            <Text style={styles.mockText}>
              Tap below — this should now move smoothly above the keyboard without jumping.
            </Text>
          </View>
        </ScrollView>

        {/* The input bar is OUTSIDE the ScrollView but INSIDE the KeyboardAvoidingView */}
        <View style={styles.inputBar}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => setMessage('')}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  // The KeyboardAvoidingView needs to take up all available space
  keyboardAvoidingView: {
    flex: 1,
  },
  // The ScrollView content should be able to grow
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end', // Aligns mock messages to the bottom
  },
  mockMessages: {
    padding: 16,
  },
  mockText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    // Add padding for the bottom safe area (the "notch" on iPhones)
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8, // Increased padding for better feel
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default KeyboardTest;