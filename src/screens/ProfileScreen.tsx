import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, Moon, Heart, Award, Calendar, Brain, MessageCircle, History, Volume2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChatHistory from '../components/ChatHistory';
import TTSSettings from '../components/TTSSettings';

const { width, height } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const stats = [
    { label: 'Sessions', value: '47', icon: Heart },
    { label: 'Streak', value: '7 days', icon: Award },
    { label: 'Insights', value: '23', icon: Brain },
    { label: 'Exercises', value: '31', icon: Calendar }
  ];

  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showTTSSettings, setShowTTSSettings] = useState(false);

  const menuItems = [
    { icon: History, label: 'Chat History', action: () => setShowChatHistory(true) },
    { icon: Volume2, label: 'Voice Settings', action: () => setShowTTSSettings(true) },
    { icon: Bell, label: 'Notifications', badge: '3' },
    { icon: Shield, label: 'Privacy & Security' },
    { icon: Moon, label: 'Dark Mode', toggle: true },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: LogOut, label: 'Sign Out', danger: true }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#dbeafe', '#f0f9ff', '#bfdbfe']}
        style={styles.backgroundGradient}
      />
      
      {/* Background watercolor blobs */}
      <View style={[styles.watercolorBlob, styles.blob1]} />
      <View style={[styles.watercolorBlob, styles.blob2]} />
      <View style={[styles.watercolorBlob, styles.blob3]} />
      <View style={[styles.watercolorBlob, styles.blob4]} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
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
                <Text style={styles.userName}>Sarah Johnson</Text>
                <Text style={styles.memberSince}>Member since October 2024</Text>
                <Text style={styles.premiumBadge}>Premium Member</Text>
              </View>
              <Settings size={20} color="#6b7280" />
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
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
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  item.danger && styles.menuItemDanger
                ]}
                activeOpacity={0.7}
                onPress={item.action}
              >
                <LinearGradient
                  colors={
                    item.danger 
                      ? ['rgba(254, 242, 242, 0.9)', 'rgba(254, 226, 226, 0.8)']
                      : ['rgba(255, 255, 255, 0.9)', 'rgba(239, 246, 255, 0.8)']
                  }
                  style={styles.menuItemGradient}
                >
                  <View style={styles.menuItemContent}>
                    <Icon 
                      size={20} 
                      color={item.danger ? '#ef4444' : '#6b7280'} 
                    />
                    <Text style={[
                      styles.menuItemLabel,
                      item.danger && styles.menuItemLabelDanger
                    ]}>
                      {item.label}
                    </Text>
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
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with 💙 for your wellness</Text>
        </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  watercolorBlob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.4,
  },
  blob1: {
    top: 80,
    left: -72,
    width: 288,
    height: 224,
    backgroundColor: 'rgba(186, 230, 253, 0.5)',
  },
  blob2: {
    top: height * 0.25,
    right: -80,
    width: 320,
    height: 256,
    backgroundColor: 'rgba(191, 219, 254, 0.3)',
  },
  blob3: {
    top: height * 0.65,
    left: width * 0.25,
    width: 256,
    height: 192,
    backgroundColor: 'rgba(125, 211, 252, 0.4)',
  },
  blob4: {
    bottom: 128,
    right: width * 0.33,
    width: 224,
    height: 168,
    backgroundColor: 'rgba(191, 219, 254, 0.25)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  userInfoSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  userInfoCard: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  userInfoContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    flexShrink: 0,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  premiumBadge: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    padding: 16,
  },
  statCardContent: {
    alignItems: 'flex-start',
  },
  statIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  menuSection: {
    paddingHorizontal: 24,
    gap: 12,
  },
  menuItem: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  menuItemDanger: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  menuItemGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  menuItemLabelDanger: {
    color: '#dc2626',
  },
  badge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 50,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  versionSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default ProfileScreen;