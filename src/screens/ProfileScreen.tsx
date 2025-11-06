import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, Modal, Platform, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Settings, LogOut, ArrowRight, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useNavigationBarStyle, navigationBarConfigs } from '../hooks/useNavigationBarStyle';
import ChatHistory from '../components/ChatHistory';
import EditProfileModal from '../components/EditProfileModal';
import DataPrivacyScreen from './DataPrivacyScreen';
import NotificationSettingsModal from '../components/NotificationSettingsModal';
import { LanguageSelector } from '../components/LanguageSelector';
import { LanguageSelectorModal } from '../components/LanguageSelectorModal';
import FeatureRequestModal from '../components/modals/FeatureRequestModal';
import HelpSupportModal from '../components/modals/HelpSupportModal';
import { PaywallModal } from '../components/PaywallModal';
import { useAuth } from '../contexts';
import { useSubscription } from '../contexts/SubscriptionContext';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { entitlementService } from '../services/entitlementService';
import { useOnboardingControl } from '../hooks/useOnboardingControl';
import { profileScreenStyles as styles } from '../styles/components/ProfileScreen.styles';
import streakService from '../services/streakService';
import { ExerciseCompletionService } from '../services/exerciseCompletionService';
import { LEGAL_URLS } from '../constants/legal';
import { dataManagementService } from '../services/dataManagementService';
import { subscriptionTestUtils, printSubscriptionDebug } from '../utils/subscriptionTestUtils';

const ProfileScreen: React.FC = () => {
  const dataPrivacyPresentationStyle = Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen';
  const { t } = useTranslation();
  const { user, profile, isAnonymous, signOut, requestLogin } = useAuth();
  const { isPremium, subscriptionStatus } = useSubscription();
  const { restartOnboarding } = useOnboardingControl();
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.profileScreen);

  const [displayName, setDisplayName] = useState('Friend');
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium'>('free');
  const [hasCustomName, setHasCustomName] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDataPrivacy, setShowDataPrivacy] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showFeatureRequest, setShowFeatureRequest] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sessionsCount, setSessionsCount] = useState<number>(0);
  const [insightsCount, setInsightsCount] = useState<number>(0);
  const [exercisesCount, setExercisesCount] = useState<number>(0);

  useEffect(() => {
    const updateDisplayNameAndStats = async () => {
      try {
        const name = await storageService.getDisplayNameWithPriority(user);
        setDisplayName(name);

        // Check if user has set a custom name
        const localProfile = await storageService.getUserProfile();
        setHasCustomName(!!localProfile?.firstName && localProfile.firstName.trim() !== '');

        // Get subscription tier
        const tier = await entitlementService.getSubscriptionTier();
        setSubscriptionTier(tier);

        // Debug logging (only in development)
        if (__DEV__) {
          console.log('[Profile] Subscription tier:', tier);
          console.log('[Profile] isPremium from context:', isPremium);
          console.log('[Profile] isAnonymous:', isAnonymous);
          console.log('[Profile] subscriptionStatus:', subscriptionStatus);
        }

        // Get streak
        const streak = await streakService.getStreak();
        setCurrentStreak(streak);

        // Get sessions count from chat history
        const history = await storageService.getChatHistory();
        setSessionsCount(history.length);

        // Get insights count from thought patterns
        const patterns = await storageService.getThoughtPatterns();
        setInsightsCount(patterns.length);

        // Get completed exercises count
        const completedExercises = await ExerciseCompletionService.getAllCompletedExercisesInfo();
        setExercisesCount(completedExercises.length);
      } catch (error) {
        console.error('Error updating display name or stats:', error);
        const fallbackName = profile
          ? `${profile.first_name} ${profile.last_name}`.trim() || 'Friend'
          : user?.email?.split('@')[0] || 'Friend';
        setDisplayName(fallbackName);
        setHasCustomName(false);
      }
    };
    updateDisplayNameAndStats();
  }, [user, profile, refreshTrigger, isPremium]);

  const handleProfileUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getMemberSinceText = () => {
    if (isAnonymous && !hasCustomName) {
      return t('profile.anonymousGuest');
    }
    if (isAnonymous && hasCustomName) {
      return t('profile.welcomeMessage');
    }
    if (profile?.created_at) {
      return `${t('profile.memberSince')} ${new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
    return user?.email || t('profile.welcomeMessage');
  };

  const getPremiumBadgeText = () => {
    if (subscriptionTier === 'premium' || isPremium) {
      return t('profile.planStatus.premium');
    }

    if (isAnonymous) {
      return t('profile.planStatus.guest');
    }

    return t('profile.planStatus.free');
  };

  const handleSignOut = () => {
    Alert.alert(
      t('alerts.signOut.title'),
      t('alerts.signOut.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: () => {
            signOut().catch((error) => {
              console.error('Error signing out:', error);
              Alert.alert(t('common.error'), t('errors.genericError'));
            });
          },
        },
      ]
    );
  };

  const handleLogin = () => {
    Alert.alert(
      t('profile.alerts.createAccount.title'),
      t('profile.alerts.createAccount.message'),
      [
        { text: t('profile.alerts.createAccount.cancel'), style: 'cancel' },
        { text: t('profile.alerts.createAccount.confirm'), style: 'default', onPress: () => requestLogin() },
      ]
    );
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
          onPress: () => {
            restartOnboarding().catch((error) => {
              console.error('Error resetting onboarding:', error);
              Alert.alert(t('common.error'), t('errors.genericError'));
            });
          },
        },
      ]
    );
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
                        // Show loading state
                        Alert.alert(
                          t('profile.deleteData.deleting'),
                          t('profile.deleteData.pleaseWait')
                        );

                        // Perform deletion
                        const result = await dataManagementService.deleteAllUserData();

                        // Dismiss loading alert and show result
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
                                  // Refresh the profile screen to show updated stats
                                  setRefreshTrigger(prev => prev + 1);
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

  const handleOpenPrivacyPolicy = () => {
    Linking.openURL(LEGAL_URLS.PRIVACY_POLICY).catch((error) => {
      console.error('Error opening privacy policy:', error);
      Alert.alert('Error', 'Failed to open privacy policy. Please try again later.');
    });
  };

  const isFreeTierUser = !isPremium && subscriptionTier !== 'premium';

  const stats = [
    { label: t('profile.stats.sessions'), value: sessionsCount.toString(), iconImage: require('../../assets/images/New Icons/icon-6.png') },
    { label: t('profile.stats.streak'), value: t('profile.stats.days', { count: currentStreak }), iconImage: require('../../assets/images/New Icons/icon-7.png') },
    { label: t('profile.stats.insights'), value: insightsCount.toString(), iconImage: require('../../assets/images/New Icons/icon-8.png') },
    { label: t('profile.stats.exercises'), value: exercisesCount.toString(), iconImage: require('../../assets/images/New Icons/icon-9.png') }
  ];

  const menuItems = [
    { iconImage: require('../../assets/images/New Icons/icon-10.png'), label: t('profile.menu.editProfile'), action: () => setShowEditProfile(true), subtitle: t('profile.menuSubtitles.editProfile') },
    { iconImage: require('../../assets/images/New Icons/icon-11.png'), label: t('profile.menu.chatHistory'), action: () => setShowChatHistory(true), subtitle: t('profile.menuSubtitles.chatHistory') },
    { iconImage: require('../../assets/images/New Icons/14.png'), label: t('profile.menu.dataPrivacy'), action: () => setShowDataPrivacy(true), subtitle: t('profile.menuSubtitles.dataPrivacy') },

    { iconImage: require('../../assets/images/New Icons/13.png'), label: t('profile.menu.restartOnboarding'), action: handleRestartOnboarding, subtitle: t('profile.menuSubtitles.restartOnboarding') },
    { iconImage: require('../../assets/images/New Icons/11.png'), label: t('profile.menu.notifications'), action: () => setShowNotificationSettings(true), subtitle: t('profile.menuSubtitles.notifications') },
    { iconImage: require('../../assets/images/New Icons/icon-16.png'), label: t('profile.menu.help'), action: () => setShowHelpSupport(true), subtitle: t('profile.menuSubtitles.help') },
    { iconImage: require('../../assets/images/New Icons/icon-12.png'), label: t('profile.menu.featureRequest'), action: () => setShowFeatureRequest(true), subtitle: t('profile.menuSubtitles.featureRequest') },
    ...(__DEV__
      ? [{ iconImage: require('../../assets/images/New Icons/icon-16.png'), label: '🧪 Developer Tools', action: () => setShowDevMenu(true), subtitle: 'Testing utilities (DEV only)' }]
      : []
    ),
    ...(isAnonymous
      ? [{ iconImage: require('../../assets/images/New Icons/16.png'), label: t('profile.menu.createAccount'), action: handleLogin, highlight: true, subtitle: t('profile.menuSubtitles.createAccount') }]
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
          {isFreeTierUser && (
            <View style={styles.planCardContainer}>
              <LinearGradient
                colors={['#f1fbf7', '#d8efe6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.planCardGradient}
              >
                <View style={styles.planCardHeader}>
                  <Text style={styles.planCardTag}>{t('profile.freePlanCard.tag')}</Text>
                  <Lock size={18} color="#1F4F4C" />
                </View>
                <Text style={styles.planCardTitle}>{t('profile.freePlanCard.title')}</Text>
                <Text style={styles.planCardSubtitle}>{t('profile.freePlanCard.subtitle')}</Text>
                <TouchableOpacity
                  style={styles.planCardButton}
                  activeOpacity={0.85}
                  onPress={() => setShowPaywallModal(true)}
                >
                  <Text style={styles.planCardButtonText}>{t('profile.freePlanCard.cta')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

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
                      {getMemberSinceText()}
                    </Text>
                    <Text style={styles.premiumBadge}>
                      {getPremiumBadgeText()}
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

          {/* App Version & Legal Links */}
          <View style={styles.versionSection}>
            <TouchableOpacity 
              onPress={handleOpenPrivacyPolicy}
              style={styles.legalLink}
              activeOpacity={0.7}
            >
              <Text style={styles.legalLinkText}>{t('profile.menu.privacy')}</Text>
            </TouchableOpacity>
            
            <Text style={styles.versionText}>{t('profile.version')}</Text>
            <Text style={styles.versionSubtext}>{t('profile.madeWith')}</Text>
          </View>
        </View>
      </ScrollView>

      <ChatHistory visible={showChatHistory} onClose={() => setShowChatHistory(false)} />
      <EditProfileModal 
        visible={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
        onProfileUpdated={handleProfileUpdated}
      />
      <Modal visible={showDataPrivacy} animationType="slide" presentationStyle={dataPrivacyPresentationStyle} onRequestClose={() => setShowDataPrivacy(false)}>
        <DataPrivacyScreen onBack={() => setShowDataPrivacy(false)} />
      </Modal>
      <NotificationSettingsModal visible={showNotificationSettings} onClose={() => setShowNotificationSettings(false)} />
      <LanguageSelectorModal visible={showLanguageSelector} onClose={() => setShowLanguageSelector(false)} />
      <FeatureRequestModal visible={showFeatureRequest} onClose={() => setShowFeatureRequest(false)} />
      <HelpSupportModal visible={showHelpSupport} onClose={() => setShowHelpSupport(false)} />
      <PaywallModal
        visible={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        trigger="profile_upgrade"
      />

      {/* Developer Tools Modal (only in __DEV__) */}
      {__DEV__ && (
        <Modal
          visible={showDevMenu}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowDevMenu(false)}
        >
          <SafeAreaWrapper style={{ flex: 1, backgroundColor: '#F8F5FF' }}>
            <View style={{ flex: 1, padding: 20 }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: '#2D2644', flex: 1 }}>
                  🧪 Developer Tools
                </Text>
                <TouchableOpacity onPress={() => setShowDevMenu(false)}>
                  <Text style={{ fontSize: 16, color: '#8B7FD9', fontWeight: '600' }}>Close</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Subscription Testing */}
                <View style={{ marginBottom: 32 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: '#2D2644', marginBottom: 16 }}>
                    Subscription Testing
                  </Text>

                  <TouchableOpacity
                    style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
                    onPress={async () => {
                      try {
                        await subscriptionTestUtils.resetToFreeTier();
                        Alert.alert(
                          'Reset Complete',
                          'Subscription reset to free tier. Force quit and relaunch the app to see changes.',
                          [{ text: 'OK' }]
                        );
                      } catch (error: any) {
                        Alert.alert('Error', error.message);
                      }
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#8B7FD9', marginBottom: 4 }}>
                      Reset to Free Tier
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6B6B8A' }}>
                      Clear RevenueCat purchases and reset to free plan
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
                    onPress={async () => {
                      try {
                        await printSubscriptionDebug();
                        const info = await subscriptionTestUtils.getDebugInfo();
                        Alert.alert(
                          'Debug Info',
                          `Tier: ${info.subscriptionStatus.tier}\n` +
                          `Premium: ${info.subscriptionStatus.isPremium ? 'Yes' : 'No'}\n` +
                          `Messages: ${info.dailyUsage.messages}/${info.featureLimits.MESSAGES_PER_DAY}\n` +
                          `Check console for full details`,
                          [{ text: 'OK' }]
                        );
                      } catch (error: any) {
                        Alert.alert('Error', error.message);
                      }
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#6EC1B8', marginBottom: 4 }}>
                      Show Debug Info
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6B6B8A' }}>
                      Print subscription status and usage to console
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Usage Testing */}
                <View style={{ marginBottom: 32 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: '#2D2644', marginBottom: 16 }}>
                    Usage Testing
                  </Text>

                  <TouchableOpacity
                    style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
                    onPress={async () => {
                      try {
                        await subscriptionTestUtils.forceResetDailyUsage();
                        Alert.alert(
                          'Usage Reset',
                          'Daily usage counters reset to 0. You can now test hitting the daily limits.',
                          [{ text: 'OK' }]
                        );
                      } catch (error: any) {
                        Alert.alert('Error', error.message);
                      }
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFB800', marginBottom: 4 }}>
                      Reset Daily Usage
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6B6B8A' }}>
                      Reset message, voice, and exercise counters
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
                    onPress={async () => {
                      try {
                        const result = await subscriptionTestUtils.checkMessageLimit();
                        Alert.alert(
                          'Message Limit Check',
                          `Can send: ${result.hasAccess ? 'Yes ✅' : 'No ❌'}\n` +
                          `Current: ${result.currentCount}/${result.limit}\n` +
                          `Tier: ${result.tier}\n` +
                          (result.reason ? `Reason: ${result.reason}` : ''),
                          [{ text: 'OK' }]
                        );
                      } catch (error: any) {
                        Alert.alert('Error', error.message);
                      }
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#9B7FD9', marginBottom: 4 }}>
                      Check Message Limit
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6B6B8A' }}>
                      Test if user can send messages
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Danger Zone */}
                <View style={{ marginBottom: 32 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: '#D9534F', marginBottom: 16 }}>
                    ⚠️ Danger Zone
                  </Text>

                  <TouchableOpacity
                    style={{ backgroundColor: '#FFF5F5', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FFE0E0' }}
                    onPress={() => {
                      Alert.alert(
                        '⚠️ Clear All Data?',
                        'This will delete ALL app data including chat history, user profile, and settings. The app will be like a fresh install.\n\nAre you sure?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Clear All Data',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                await subscriptionTestUtils.clearAllStorage();
                                Alert.alert(
                                  'All Data Cleared',
                                  'Force quit and relaunch the app.',
                                  [{ text: 'OK' }]
                                );
                              } catch (error: any) {
                                Alert.alert('Error', error.message);
                              }
                            }
                          }
                        ]
                      );
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#D9534F', marginBottom: 4 }}>
                      Clear All Storage
                    </Text>
                    <Text style={{ fontSize: 14, color: '#8B6B6B' }}>
                      Delete all app data (DESTRUCTIVE)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Info */}
                <View style={{ backgroundColor: '#F0EEFF', padding: 16, borderRadius: 12, marginBottom: 20 }}>
                  <Text style={{ fontSize: 14, color: '#6B6B8A', lineHeight: 20 }}>
                    💡 These tools are only available in development mode. After making changes, you may need to force quit and relaunch the app to see the effects.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </SafeAreaWrapper>
        </Modal>
      )}
    </SafeAreaWrapper>
  );
};

export default ProfileScreen;





