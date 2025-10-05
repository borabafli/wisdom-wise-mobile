import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { StatusBar } from 'expo-status-bar';
import { profileScreenStyles as styles } from '../styles/components/ProfileScreen.styles';

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      <View
        style={[styles.backgroundGradient, { backgroundColor: '#e9eff1' }]}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.titleAndSubtitleContainer}>
                <Text style={styles.headerTitle}>Profile</Text>
                <Text style={styles.headerSubtitle}>Test Minimal Version</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={{ fontSize: 16, padding: 20 }}>
            If you can see this, the basic structure works!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ProfileScreen;
