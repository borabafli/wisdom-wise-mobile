import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Settings, LogOut, LogIn, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useNavigationBarStyle, navigationBarConfigs } from '../hooks/useNavigationBarStyle';
import ChatHistory from '../components/ChatHistory';
import TTSSettings from '../components/TTSSettings';
import EditProfileModal from '../components/EditProfileModal';
import DataPrivacyScreen from './DataPrivacyScreen';
import NotificationSettingsModal from '../components/NotificationSettingsModal';
import { LanguageSelector } from '../components/LanguageSelector';
import { LanguageSelectorModal } from '../components/LanguageSelectorModal';
import { useAuth } from '../contexts';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { useOnboardingControl } from '../components/AppContent';
import { profileScreenStyles as styles } from '../styles/components/ProfileScreen.styles';
import streakService from '../services/streakService';

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, profile, isAnonymous, signOut, requestLogin } = useAuth();
  const { restartOnboarding } = useOnboardingControl();
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.profileScreen);

  const [displayName, setDisplayName] = useState('Friend');
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showTTSSettings, setShowTTSSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDataPrivacy, setShowDataPrivacy] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  useEffect(() => {
    const updateDisplayNameAndStreak = async () => {
      try {
        const name = await storageService.getDisplayNameWithPriority(user);
        setDisplayName(name);

        const streak = await streakService.getStreak();
        setCurrentStreak(streak);
      } catch (error) {
        console.error('Error updating display name or streak:', error);
        const fallbackName = profile
          ? `${profile.first_name} ${profile.last_name}`.trim() || 'Friend'
          : user?.email?.split('@')[0] || 'Friend';
        setDisplayName(fallbackName);
      }
    };
    updateDisplayNameAndStreak();
  }, [user, profile]);

  const handleSignOut = () => {
    Alert.alert(
      t('alerts.signOut.title'),
      t('alerts.signOut.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert(t('common.error'), t('errors.genericError'));
            }
          },
        },
      ]
    );
  };

  const handleLogin = () => {
    Alert.alert(
      'Create Account',
      'Sign up to save your progress and access all features!',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Sign Up', style: 'default', onPress: () => requestLogin() },
      ]
    );
  };

  const handleTestNotification = async () => {
    try {
      const { canRequest, shouldGoToSettings } = await notificationService.canRequestPermissions();
      const hasPermission = await notificationService.getPermissionStatus();

      if (hasPermission !== 'granted') {
        if (shouldGoToSettings) {
          const guidance = notificationService.getDeniedGuidance();
          Alert.alert(
            guidance.title,
            guidance.message,
            [
              { text: 'Not Now', style: 'cancel' },
              { text: 'Open Settings', style: 'default', onPress: () => notificationService.openSettings() }
            ]
          );
          return;
        } else if (canRequest) {
          const granted = await notificationService.requestPermissions();
          if (!granted) {
            Alert.alert('Permission Required', 'Test notifications require notification permissions to be enabled.');
            return;
          }
        } else {
          Alert.alert('Permission Required', 'Please enable notifications in your device settings to test notifications.');
          return;
        }
      }

      await notificationService.sendTestNotification();
      Alert.alert('Test Notification Sent!', 'Check your notification panel to see if it appeared.');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification. Please try again.');
    }
  };

  const handleRestartOnboarding = () => {
    Alert.alert(
      t('profile.restartOnboarding.title'),
      t('profile.restartOnboarding.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.restartOnboarding.confirm'),
          style: 'default',
          onPress: async () => {
            try {
              await restartOnboarding();
            } catch (error) {
              console.error('Error resetting onboarding:', error);
              Alert.alert(t('common.error'), t('errors.genericError'));
            }
          },
        },
      ]
    );
  };

  const stats = [
    { label: t('profile.stats.sessions'), value: '47', iconImage: require('../../assets/images/New Icons/icon-6.png') },
    { label: t('profile.stats.streak'), value: t('profile.stats.days', { count: currentStreak }), iconImage: require('../../assets/images/New Icons/icon-7.png') },
    { label: t('profile.stats.insights'), value: '23', iconImage: require('../../assets/images/New Icons/icon-8.png') },
    { label: t('profile.stats.exercises'), value: '31', iconImage: require('../../assets/images/New Icons/icon-9.png') }
  ];

  const menuItems = [
    { iconImage: require('../../assets/images/New Icons/icon-10.png'), label: t('profile.menu.editProfile'), action: () => setShowEditProfile(true), subtitle: t('profile.menuSubtitles.editProfile') },
    { iconImage: require('../../assets/images/New Icons/icon-11.png'), label: t('profile.menu.chatHistory'), action: () => setShowChatHistory(true), subtitle: t('profile.menuSubtitles.chatHistory') },
    { iconImage: require('../../assets/images/New Icons/icon-12.png'), label: t('profile.menu.voiceSettings'), action: () => setShowTTSSettings(true), subtitle: t('profile.menuSubtitles.voiceSettings') },
    { iconImage: require('../../assets/images/New Icons/14.png'), label: 'Your Data & Privacy', action: () => setShowDataPrivacy(true), subtitle: 'How we protect and handle your information' },

    { iconImage: require('../../assets/images/New Icons/13.png'), label: t('profile.menu.restartOnboarding'), action: handleRestartOnboarding, subtitle: t('profile.menuSubtitles.restartOnboarding') },
    { iconImage: require('../../assets/images/New Icons/11.png'), label: t('profile.menu.notifications'), action: () => { console.log('Notifications menu item pressed'); setShowNotificationSettings(true); }, subtitle: t('profile.menuSubtitles.notifications') },
    { iconImage: require('../../assets/images/New Icons/11.png'), label: 'Test Notification', action: handleTestNotification, subtitle: 'Send a test notification now' },
    { iconImage: require('../../assets/images/New Icons/icon-14.png'), label: t('profile.menu.privacy'), action: () => console.log('Privacy tapped'), subtitle: t('profile.menuSubtitles.privacy') },
    { iconImage: require('../../assets/images/New Icons/icon-15.png'), label: t('profile.menu.darkMode'), toggle: true, action: () => console.log('Dark mode toggled'), subtitle: t('profile.menuSubtitles.darkMode') },
    { iconImage: require('../../assets/images/New Icons/icon-16.png'), label: t('profile.menu.help'), action: () => console.log('Help tapped'), subtitle: t('profile.menuSubtitles.help') },
    ...(isAnonymous
      ? [{ iconImage: require('../../assets/images/New Icons/16.png'), label: 'Create Account', action: handleLogin, highlight: true, subtitle: 'Save your progress and access all features' }]
      : [{ icon: LogOut, label: t('profile.menu.signOut'), danger: true, action: handleSignOut, subtitle: t('profile.menuSubtitles.signOut') }]
    )
  ];

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent />

      <View
        style={[styles.backgroundGradient, { backgroundColor: '#e9eff1' }]}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <Image
                source={require('../../assets/new-design/Turtle Hero Section/profile-hero.png')}
                style={styles.headerTurtleIcon}
                contentFit="contain"
              />
              <View style={styles.titleAndSubtitleContainer}>
                <Text style={styles.headerTitle}>{t('profile.title')}</Text>
                <Text style={styles.headerSubtitle}>{t('profile.subtitle')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* User Info */}
          <View style={styles.userInfoSection}>
            <TouchableOpacity
              style={styles.userInfoCard}
              activeOpacity={0.9}
              onPress={() => setShowEditProfile(true)}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 1)', 'rgba(244, 248, 250, 1)', 'rgba(226, 238, 243, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.userInfoCardGradient}
              >
                <View style={styles.userInfoContent}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <Image
                        source={require('../../assets/images/New Icons/15.png')}
                        style={styles.avatarImage}
                        contentFit="contain"
                      />
                    </View>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{displayName}</Text>
                    <Text style={styles.memberSince}>
                      {isAnonymous
                        ? t('profile.anonymousGuest')
                        : profile?.created_at
                          ? `${t('profile.memberSince')} ${new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                          : user?.email || t('profile.welcomeMessage')}
                    </Text>
                    <Text style={styles.premiumBadge}>
                      {isAnonymous ? t('profile.anonymousGuest') : t('profile.premiumMember')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowEditProfile(true)}
                    style={styles.userEditButton}
                    activeOpacity={0.7}
                  >
                    <Settings size={20} color="#2B475E" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('profile.yourProgress')}</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statsRow}>
                {stats.slice(0, 2).map((stat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.statCard}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#D8E9E9', '#E7F3F1']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.statCardGradient}
                    >
                      <View style={styles.statCardContent}>
                        <View style={styles.statIcon}>
                          <Image
                            source={stat.iconImage}
                            style={styles.statIconImage}
                            contentFit="contain"
                          />
                        </View>
                        <View style={styles.statInfo}>
                          <Text style={styles.statValue}>{stat.value}</Text>
                          <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.statsRow}>
                {stats.slice(2, 4).map((stat, index) => (
                  <TouchableOpacity
                    key={index + 2}
                    style={styles.statCard}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#D8E9E9', '#E7F3F1']}
                      start={{ x: 0.2, y: 0 }}
                      end={{ x: 0.8, y: 1 }}
                      style={styles.statCardGradient}
                    >
                      <View style={styles.statCardContent}>
                        <View style={styles.statIcon}>
                          <Image
                            source={stat.iconImage}
                            style={styles.statIconImage}
                            contentFit="contain"
                          />
                        </View>
                        <View style={styles.statInfo}>
                          <Text style={styles.statValue}>{stat.value}</Text>
                          <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Menu Items Section */}
          <View style={styles.menuSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
            </View>

            <LanguageSelector onPress={() => setShowLanguageSelector(true)} />

            <View style={styles.menuGrid}>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuCard}
                    activeOpacity={0.9}
                    onPress={item.action}
                  >
                    <LinearGradient
                      colors={['#FFFFFF', '#FFFFFF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.menuCardGradient}
                    >
                      <View style={styles.menuCardContent}>
                        <View style={styles.menuIconContainer}>
                          {item.iconImage ? (
                            <Image
                              source={item.iconImage}
                              style={styles.menuIconImage}
                              contentFit="contain"
                            />
                          ) : Icon ? (
                            <Icon
                              size={24}
                              color={item.danger ? '#ef4444' : item.highlight ? '#22c55e' : '#002d14'}
                            />
                          ) : null}
                        </View>
                        <View style={styles.menuTitleContainer}>
                          <Text style={[
                            styles.menuTitle,
                            item.danger && styles.menuTitleDanger,
                            item.highlight && { color: '#22c55e', fontWeight: '600' }
                          ]}>
                            {item.label}
                          </Text>
                          <Text style={styles.menuSubtitle}>
                            {item.subtitle || t('profile.menuSubtitles.default')}
                          </Text>
                        </View>
                        <View style={styles.menuActions}>
                          {item.badge && (
                            <View style={styles.badge}>
                              <Text style={styles.badgeText}>{item.badge}</Text>
                            </View>
                          )}
                          {item.toggle && (
                            <Switch
                              value={false}
                              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                              thumbColor="#ffffff"
                              ios_backgroundColor="#d1d5db"
                              style={styles.switch}
                            />
                          )}
                          {!item.toggle && !item.badge && (
                            <ArrowRight
                              size={16}
                              color={item.danger ? '#ef4444' : item.highlight ? '#22c55e' : '#002d14'}
                            />
                          )}
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* App Version */}
          <View style={styles.versionSection}>
            <Text style={styles.versionText}>{t('profile.version')}</Text>
            <Text style={styles.versionSubtext}>{t('profile.madeWith')}</Text>
          </View>
        </View>
      </ScrollView>

      <ChatHistory visible={showChatHistory} onClose={() => setShowChatHistory(false)} />
      <TTSSettings visible={showTTSSettings} onClose={() => setShowTTSSettings(false)} />
      <EditProfileModal visible={showEditProfile} onClose={() => setShowEditProfile(false)} />
      <Modal visible={showDataPrivacy} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowDataPrivacy(false)}>
        <DataPrivacyScreen onBack={() => setShowDataPrivacy(false)} />
      </Modal>
      <NotificationSettingsModal visible={showNotificationSettings} onClose={() => setShowNotificationSettings(false)} />
      <LanguageSelectorModal visible={showLanguageSelector} onClose={() => setShowLanguageSelector(false)} />
    </SafeAreaWrapper>
  );
};

export default ProfileScreen;




