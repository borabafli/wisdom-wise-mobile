import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { ArrowLeft, Lock, Eye, Database, Download, Trash2, ExternalLink } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { dataPrivacyStyles as styles } from '../styles/components/DataPrivacyScreen.styles';
import { LEGAL_URLS, CONTACT_INFO } from '../constants/legal';
import { dataManagementService } from '../services/dataManagementService';
import { useTranslation } from 'react-i18next';

interface DataPrivacyScreenProps {
  onBack: () => void;
}

const DataPrivacyScreen: React.FC<DataPrivacyScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenPrivacyPolicy = async () => {
    try {
      await Linking.openURL(LEGAL_URLS.PRIVACY_POLICY);
    } catch (error) {
      console.error('Error opening privacy policy:', error);
      Alert.alert('Error', 'Unable to open privacy policy. Please try again.');
    }
  };

  const handleEmailPrivacy = async () => {
    try {
      await Linking.openURL(`mailto:${CONTACT_INFO.PRIVACY_EMAIL}`);
    } catch (error) {
      console.error('Error opening email:', error);
      Alert.alert('Error', 'Unable to open email client.');
    }
  };

  const handleDeleteAllData = async () => {
    try {
      // First, get data summary to show user what will be deleted
      const summary = await dataManagementService.getDataSummary();

      // Show first confirmation with data summary
      Alert.alert(
        t('profile.deleteData.title'),
        t('profile.deleteData.summaryMessage', {
          sessions: summary.chatSessions,
          thoughts: summary.thoughtPatterns,
          moods: summary.moodRatings,
          goals: summary.goals,
          values: summary.values,
          total: summary.totalItems
        }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('profile.deleteData.continue'),
            style: 'destructive',
            onPress: () => {
              // Show second confirmation (are you sure?)
              Alert.alert(
                t('profile.deleteData.confirmTitle'),
                t('profile.deleteData.confirmMessage'),
                [
                  { text: t('common.cancel'), style: 'cancel' },
                  {
                    text: t('profile.deleteData.deleteButton'),
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        setIsDeleting(true);

                        // Perform deletion
                        const result = await dataManagementService.deleteAllUserData();

                        setIsDeleting(false);

                        // Show result
                        if (result.success) {
                          Alert.alert(
                            t('profile.deleteData.successTitle'),
                            t('profile.deleteData.successMessage', {
                              sessions: result.deletedItems.chatSessions,
                              thoughts: result.deletedItems.thoughtPatterns,
                              moods: result.deletedItems.moodRatings,
                              total: Object.values(result.deletedItems).reduce((sum, val) => sum + val, 0)
                            }),
                            [
                              {
                                text: t('common.ok'),
                                onPress: () => {
                                  // Close the privacy screen
                                  onBack();
                                }
                              }
                            ]
                          );
                        } else {
                          Alert.alert(
                            t('profile.deleteData.partialSuccessTitle'),
                            t('profile.deleteData.partialSuccessMessage', {
                              errors: result.errors.join(', ')
                            })
                          );
                        }
                      } catch (error) {
                        setIsDeleting(false);
                        console.error('Error deleting data:', error);
                        Alert.alert(
                          t('common.error'),
                          t('profile.deleteData.errorMessage')
                        );
                      }
                    },
                  },
                ]
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error preparing data deletion:', error);
      Alert.alert(t('common.error'), t('errors.genericError'));
    }
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style="dark" backgroundColor="#e9eff1" translucent />

      {/* Background */}
      <View style={[styles.backgroundGradient, { backgroundColor: '#e9eff1' }]} pointerEvents="none" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#002d14" />
        </TouchableOpacity>
        <View style={styles.simplifiedHeaderContent}>
          <Image
            source={require('../../assets/images/New Icons/8.png')}
            style={styles.simplifiedHeaderIcon}
            contentFit="contain"
          />
          <Text style={styles.simplifiedHeaderTitle}>Your Data & Privacy</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>

          {/* Main Content Text */}
          <Text style={styles.cardText}>
            This is a private space. Your notes, exercises, moods, and insights are saved so Anu can guide you and so you can see your progress over time. We keep your data encrypted and we don't sell it. No one at our company can read your private entries unless you choose to share them.
          </Text>

          <Text style={styles.cardText}>
            When you chat, your message is sent securely to our AI service to generate a reply. We don't use your personal data to train AI models unless you say yes. Some features (like timers and local tools) run on your device; your journals and exercise history sync to our secure servers so you can use multiple devices.
          </Text>

          <Text style={styles.cardText}>
            You're in control. You can turn off personalized suggestions, switch off anonymous analytics, or opt in/out of helping us improve the app with anonymized data. You can also edit, export, or delete your data at any time from this screen.
          </Text>

          <Text style={styles.cardText}>
            If you ever have questions, write to us. We'll answer in plain language. Your wellbeing comes first, and your data stays yours.
          </Text>

          {/* Privacy Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Privacy Features</Text>

            <View style={styles.featuresList}>
              {/* Encryption */}
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Lock size={20} color="#36657d" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>End-to-end encryption</Text>
                  <Text style={styles.featureDescription}>Your data is encrypted both in transit and at rest</Text>
                </View>
              </View>

              {/* Privacy */}
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Eye size={20} color="#36657d" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Private by default</Text>
                  <Text style={styles.featureDescription}>No one can access your personal entries</Text>
                </View>
              </View>

              {/* Data Control */}
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Database size={20} color="#36657d" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>You own your data</Text>
                  <Text style={styles.featureDescription}>Edit, export, or delete anytime</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#D8E9E9', '#E7F3F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButtonGradient}
              >
                <Download size={20} color="#002d14" />
                <Text style={styles.actionButtonText}>Export My Data</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={handleDeleteAllData}
              disabled={isDeleting}
            >
              <LinearGradient
                colors={['rgba(254, 202, 202, 0.3)', 'rgba(252, 165, 165, 0.2)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.actionButtonGradient, isDeleting && { opacity: 0.5 }]}
              >
                <Trash2 size={20} color="#ef4444" />
                <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>
                  {isDeleting ? 'Deleting...' : 'Delete My Data'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Full Privacy Policy Link */}
          <TouchableOpacity 
            style={styles.policyLinkButton}
            onPress={handleOpenPrivacyPolicy}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.policyLinkGradient}
            >
              <ExternalLink size={20} color="#36657d" />
              <Text style={styles.policyLinkText}>View Full Privacy Policy</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactText}>
              Have questions? Email us at{' '}
              <Text style={styles.contactLink} onPress={handleEmailPrivacy}>
                {CONTACT_INFO.PRIVACY_EMAIL}
              </Text>
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default DataPrivacyScreen;
