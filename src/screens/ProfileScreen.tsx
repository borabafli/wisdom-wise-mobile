import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Switch, Alert } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, Moon, Heart, Award, Calendar, Brain, MessageCircle, History, Volume2, Edit3, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useNavigationBarStyle, navigationBarConfigs } from '../hooks/useNavigationBarStyle';
import ChatHistory from '../components/ChatHistory';
import TTSSettings from '../components/TTSSettings';
import EditProfileModal from '../components/EditProfileModal';
import { useAuth } from '../contexts';
import { profileScreenStyles as styles } from '../styles/components/ProfileScreen.styles';

const { width, height } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const { user, profile, isAnonymous, signOut } = useAuth();
  
  // Apply dynamic navigation bar styling
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.profileScreen);
  
  const stats = [
    { label: 'Sessions', value: '47', icon: Heart },
    { label: 'Streak', value: '7 days', icon: Award },
    { label: 'Insights', value: '23', icon: Brain },
    { label: 'Exercises', value: '31', icon: Calendar }
  ];

  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showTTSSettings, setShowTTSSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Get display name from auth profile
  const displayName = profile 
    ? `${profile.first_name} ${profile.last_name}`.trim() || 'Friend'
    : user?.email?.split('@')[0] || 'Friend';

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: Edit3, label: 'Edit Profile', action: () => setShowEditProfile(true) },
    { icon: History, label: 'Chat History', action: () => setShowChatHistory(true) },
    { icon: Volume2, label: 'Voice Settings', action: () => setShowTTSSettings(true) },
    { icon: Bell, label: 'Notifications', badge: '3' },
    { icon: Shield, label: 'Privacy & Security' },
    { icon: Moon, label: 'Dark Mode', toggle: true },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: LogOut, label: 'Sign Out', danger: true, action: handleSignOut }
  ];

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent />
      
      {/* Background Gradient - Clean like Exercise screen */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.8)', '#F8FAFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          {/* Header - Now inside ScrollView so it scrolls away */}
          <View style={styles.scrollableHeader}>
            <Text style={styles.compactTitle}>
              Profile 👤
            </Text>
            <Text style={styles.subtitle}>
              Your wellness companion
            </Text>
          </View>

        {/* User Info */}
        <View style={styles.userInfoSection}>
          <View style={styles.userInfoCard}>
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
                <Text style={styles.userName}>{displayName}</Text>
                <Text style={styles.memberSince}>
                  {isAnonymous 
                    ? 'Anonymous Guest' 
                    : profile 
                      ? `Member since ${new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` 
                      : user?.email || 'Welcome to WisdomWise'
                  }
                </Text>
                <Text style={styles.premiumBadge}>
                  {isAnonymous ? 'Guest User' : 'Premium Member'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowEditProfile(true)} style={{ padding: 4 }}>
                <Settings size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Grid - Insights Card Style */}
        <View style={styles.statsCard}>
          <View style={styles.statsGrid}>
            {/* First Row: Sessions and Streak */}
            <View style={styles.statsRow}>
              {stats.slice(0, 2).map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <View key={index} style={styles.statCard}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.95)', 'rgba(239, 246, 255, 0.9)']}
                      style={styles.statCardGradient}
                    >
                      <View style={styles.statCardContent}>
                        <View style={styles.statIconContainer}>
                          <Icon size={18} color="#2563eb" />
                          <Text style={styles.statValue}>{stat.value}</Text>
                        </View>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                );
              })}
            </View>
            {/* Second Row: Insights and Exercises */}
            <View style={styles.statsRow}>
              {stats.slice(2, 4).map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <View key={index + 2} style={styles.statCard}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.95)', 'rgba(239, 246, 255, 0.9)']}
                      style={styles.statCardGradient}
                    >
                      <View style={styles.statCardContent}>
                        <View style={styles.statIconContainer}>
                          <Icon size={18} color="#2563eb" />
                          <Text style={styles.statValue}>{stat.value}</Text>
                        </View>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Menu Items - Insights Pattern */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <View key={index} style={styles.menuCard}>
              <TouchableOpacity
                style={[
                  styles.menuItemInsights,
                  item.danger && styles.menuItemDanger
                ]}
                activeOpacity={0.7}
                onPress={item.action}
              >
                <View style={styles.menuIconContainer}>
                  <View style={styles.menuIconBackground}>
                    <Icon 
                      size={24} 
                      color={item.danger ? '#ef4444' : '#6b7280'} 
                    />
                  </View>
                </View>
                <View style={styles.menuTitleContainer}>
                  <Text style={[
                    styles.menuTitle,
                    item.danger && styles.menuTitleDanger
                  ]}>
                    {item.label}
                  </Text>
                  <Text style={styles.menuSubtitle}>
                    {item.label === 'Edit Profile' ? 'Update your information' :
                     item.label === 'Chat History' ? 'View past conversations' :
                     item.label === 'Voice Settings' ? 'Configure speech options' :
                     item.label === 'Notifications' ? 'Manage alerts' :
                     item.label === 'Privacy & Security' ? 'Control your data' :
                     item.label === 'Dark Mode' ? 'Toggle dark theme' :
                     item.label === 'Help & Support' ? 'Get assistance' :
                     item.label === 'Sign Out' ? 'Leave your account' :
                     'Tap to access'}
                  </Text>
                </View>
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
                {!item.toggle && (
                  <View style={styles.menuArrow}>
                    <ArrowRight 
                      size={16} 
                      color={item.danger ? '#ef4444' : '#1e40af'} 
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with 💙 for your wellness</Text>
        </View>
        </View> {/* Close contentContainer */}
      </ScrollView>

      {/* Chat History Modal */}
      <ChatHistory
        visible={showChatHistory}
        onClose={() => setShowChatHistory(false)}
      />

      {/* TTS Settings Modal */}
      <TTSSettings
        visible={showTTSSettings}
        onClose={() => setShowTTSSettings(false)}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </SafeAreaWrapper>
  );
};



export default ProfileScreen;