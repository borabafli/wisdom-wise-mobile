import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings } from 'lucide-react-native';
import { useAuth } from '../contexts';
import { storageService } from '../services/storageService';
import { LanguageSelector } from '../components/LanguageSelector';
import { profileScreenStyles as styles } from '../styles/components/ProfileScreen.styles';

const ProfileScreenTest: React.FC = () => {
  const { t } = useTranslation();
  const { user, profile, isAnonymous } = useAuth();
  const [displayName, setDisplayName] = useState('Friend');

  useEffect(() => {
    const updateDisplayName = async () => {
      try {
        const name = await storageService.getDisplayNameWithPriority(user);
        setDisplayName(name);
      } catch (error) {
        console.error('Error updating display name:', error);
        const fallbackName = profile
          ? `${profile.first_name} ${profile.last_name}`.trim() || 'Friend'
          : user?.email?.split('@')[0] || 'Friend';
        setDisplayName(fallbackName);
      }
    };
    updateDisplayName();
  }, [user, profile]);

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style="dark-content" backgroundColor="transparent" translucent />

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
              <Image
                source={require('../../assets/new-design/Turtle Hero Section/insights-hero.png')}
                style={styles.headerTurtleIcon}
                contentFit="contain"
              />
              <View style={styles.titleAndSubtitleContainer}>
                <Text style={styles.headerTitle}>
                  {String(t('profile.title') || 'Profile')}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {String(t('profile.subtitle') || 'Your wellness companion')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <View style={styles.userInfoCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 1)', 'rgba(249, 250, 251, 1)', 'rgba(243, 244, 246, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.userInfoCardGradient}
              >
                <View style={styles.userInfoContent}>
                  <View style={styles.avatarContainer}>
                    <LinearGradient
                      colors={['#3b82f6', '#0ea5e9']}
                      style={styles.avatar}
                    >
                      <User size={32} color="white" />
                    </LinearGradient>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>
                      {String(displayName || 'Friend')}
                    </Text>
                    <Text style={styles.memberSince}>
                      {String(isAnonymous
                        ? t('profile.anonymousGuest')
                        : profile && profile.created_at
                          ? `${t('profile.memberSince')} ${new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                          : (user?.email || t('profile.welcomeMessage'))
                      )}
                    </Text>
                    <Text style={styles.premiumBadge}>
                      {String(isAnonymous ? t('profile.anonymousGuest') : t('profile.premiumMember'))}
                    </Text>
                  </View>
                  <TouchableOpacity style={{ padding: 4 }}>
                    <Settings size={20} color="#002d14" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Stats Section - FULL */}
          <View style={styles.statsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {String(t('profile.yourProgress') || 'Your Progress')}
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statsRow}>
                {[
                  { label: String(t('profile.stats.sessions') || 'Sessions'), value: '47' },
                  { label: String(t('profile.stats.streak') || 'Streak'), value: String(t('profile.stats.daysStreak') || '7 days') }
                ].map((stat, index) => (
                  <TouchableOpacity key={index} style={styles.statCard} activeOpacity={0.9}>
                    <LinearGradient
                      colors={['#D8E9E9', '#E7F3F1']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.statCardGradient}
                    >
                      <View style={styles.statCardContent}>
                        <View style={styles.statInfo}>
                          <Text style={styles.statValue}>{String(stat.value || '')}</Text>
                          <Text style={styles.statLabel}>{String(stat.label || '')}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.statsRow}>
                {[
                  { label: String(t('profile.stats.insights') || 'Insights'), value: '23' },
                  { label: String(t('profile.stats.exercises') || 'Exercises'), value: '31' }
                ].map((stat, index) => (
                  <TouchableOpacity key={index + 2} style={styles.statCard} activeOpacity={0.9}>
                    <LinearGradient
                      colors={['#D8E9E9', '#E7F3F1']}
                      start={{ x: 0.2, y: 0 }}
                      end={{ x: 0.8, y: 1 }}
                      style={styles.statCardGradient}
                    >
                      <View style={styles.statCardContent}>
                        <View style={styles.statInfo}>
                          <Text style={styles.statValue}>{String(stat.value || '')}</Text>
                          <Text style={styles.statLabel}>{String(stat.label || '')}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Menu Section - FULL */}
          <View style={styles.menuSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{String(t('profile.settings') || 'Settings')}</Text>
            </View>

            {/* Language Selector - THE SUSPECT */}
            <LanguageSelector onLanguageChange={(lang) => console.log('Language changed to:', lang)} />

            <View style={styles.menuGrid}>
              {[
                { label: String(t('profile.menu.editProfile') || 'Edit Profile'), subtitle: String(t('profile.menuSubtitles.editProfile') || 'Update your info') },
                { label: String(t('profile.menu.chatHistory') || 'Chat History'), subtitle: String(t('profile.menuSubtitles.chatHistory') || 'View past conversations') }
              ].map((item, index) => (
                <TouchableOpacity key={index} style={styles.menuCard} activeOpacity={0.9}>
                  <LinearGradient
                    colors={['rgba(161, 214, 242, 0.25)', 'rgba(184, 224, 245, 0.15)', 'rgba(255, 255, 255, 0.8)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.menuCardGradient}
                  >
                    <View style={styles.menuCardContent}>
                      <View style={styles.menuTitleContainer}>
                        <Text style={styles.menuTitle}>{String(item.label)}</Text>
                        <Text style={styles.menuSubtitle}>{String(item.subtitle)}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Version */}
          <View style={styles.versionSection}>
            <Text style={styles.versionText}>{String(t('profile.version') || 'v1.0.0')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ProfileScreenTest;
