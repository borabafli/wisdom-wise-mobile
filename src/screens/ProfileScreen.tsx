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
    { label: 'Sessions', value: '47', iconImage: require('../../assets/images/New Icons/icon-6.png') },
    { label: 'Streak', value: '7 days', iconImage: require('../../assets/images/New Icons/icon-7.png') },
    { label: 'Insights', value: '23', iconImage: require('../../assets/images/New Icons/icon-8.png') },
    { label: 'Exercises', value: '31', iconImage: require('../../assets/images/New Icons/icon-9.png') }
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
    { iconImage: require('../../assets/images/New Icons/icon-10.png'), label: 'Edit Profile', action: () => setShowEditProfile(true) },
    { iconImage: require('../../assets/images/New Icons/icon-11.png'), label: 'Chat History', action: () => setShowChatHistory(true) },
    { iconImage: require('../../assets/images/New Icons/icon-12.png'), label: 'Voice Settings', action: () => setShowTTSSettings(true) },
    { iconImage: require('../../assets/images/New Icons/icon-13.png'), label: 'Notifications', badge: '3' },
    { iconImage: require('../../assets/images/New Icons/icon-14.png'), label: 'Privacy & Security' },
    { iconImage: require('../../assets/images/New Icons/icon-15.png'), label: 'Dark Mode', toggle: true },
    { iconImage: require('../../assets/images/New Icons/icon-16.png'), label: 'Help & Support' },
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
            <LinearGradient
              colors={['#D8E9E9', '#E7F3F1']}
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
                  <Settings size={20} color="#002d14" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Stats Grid - HomeScreen Style */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
          </View>
          
          <View style={styles.statsGrid}>
            {/* First Row: Sessions and Streak */}
            <View style={styles.statsRow}>
              {stats.slice(0, 2).map((stat, index) => {
                return (
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
                );
              })}
            </View>
            {/* Second Row: Insights and Exercises */}
            <View style={styles.statsRow}>
              {stats.slice(2, 4).map((stat, index) => {
                return (
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
                );
              })}
            </View>
          </View>
        </View>

        {/* Menu Items Section */}
        <View style={styles.menuSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          
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
                    colors={item.danger 
                      ? ['rgba(254, 202, 202, 0.25)', 'rgba(252, 165, 165, 0.15)', 'rgba(255, 255, 255, 0.8)']
                      : ['rgba(161, 214, 242, 0.25)', 'rgba(184, 224, 245, 0.15)', 'rgba(255, 255, 255, 0.8)']
                    }
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
                        ) : (
                          <Icon 
                            size={24} 
                            color={item.danger ? '#ef4444' : '#002d14'} 
                          />
                        )}
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
                            color={item.danger ? '#ef4444' : '#002d14'} 
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