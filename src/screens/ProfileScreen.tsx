import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Heart, Award, Calendar, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const profileStats = [
    { label: 'Sessions', value: '12', icon: Calendar },
    { label: 'Streak', value: '5 days', icon: Award },
    { label: 'Minutes', value: '47', icon: Heart },
  ];

  const menuItems = [
    { 
      id: 1, 
      title: 'Notification Settings', 
      subtitle: 'Manage your reminders', 
      icon: Bell,
      color: ['#3b82f6', '#1d4ed8']
    },
    { 
      id: 2, 
      title: 'General Settings', 
      subtitle: 'App preferences', 
      icon: Settings,
      color: ['#6b7280', '#4b5563']
    },
    { 
      id: 3, 
      title: 'My Progress', 
      subtitle: 'View detailed insights', 
      icon: Award,
      color: ['#10b981', '#059669']
    },
    { 
      id: 4, 
      title: 'Wellness Goals', 
      subtitle: 'Set and track goals', 
      icon: Heart,
      color: ['#f59e0b', '#d97706']
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#dbeafe', '#f0f9ff', '#bfdbfe']}
        style={styles.backgroundGradient}
      />
      
      {/* Background shapes */}
      <View style={[styles.watercolorBlob, styles.blob1]} />
      <View style={[styles.watercolorBlob, styles.blob2]} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.headerSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              {/* Profile Avatar */}
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8']}
                  style={styles.avatar}
                >
                  <User size={40} color="white" />
                </LinearGradient>
                
                {/* Gentle Turtle Companion - smaller version */}
                <View style={styles.turtleCompanion}>
                  <LinearGradient
                    colors={['rgba(59, 130, 246, 0.4)', 'rgba(147, 197, 253, 0.3)']}
                    style={styles.turtleContainer}
                  >
                    <Image 
                      source={require('../../assets/images/turtle9.png')}
                      style={styles.turtleImage}
                      contentFit="contain"
                    />
                  </LinearGradient>
                </View>
              </View>
              
              <Text style={styles.welcomeText}>
                Welcome, Friend
              </Text>
              <Text style={styles.subtitleText}>
                Your gentle companion on this wellness journey
              </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              {profileStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <View key={index} style={styles.statItem}>
                    <LinearGradient
                      colors={['#bfdbfe', '#7dd3fc']}
                      style={styles.statIcon}
                    >
                      <Icon size={20} color="#1e40af" />
                    </LinearGradient>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.9}
              >
                <View style={styles.menuItemContent}>
                  <LinearGradient
                    colors={item.color}
                    style={styles.menuIcon}
                  >
                    <Icon size={24} color="white" />
                  </LinearGradient>
                  
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>
                      {item.title}
                    </Text>
                    <Text style={styles.menuSubtitle}>
                      {item.subtitle}
                    </Text>
                  </View>
                  
                  <ChevronRight size={20} color="#94a3b8" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Wellness Quote */}
        <View style={styles.quoteSection}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "Progress is not about perfection. It's about showing up for yourself, one gentle step at a time."
            </Text>
            <Text style={styles.quoteAuthor}>
              — Your Daily Reminder 🌸
            </Text>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>
            WisdomWise v1.0.0
          </Text>
        </View>
      </ScrollView>
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
    opacity: 0.3,
  },
  blob1: {
    top: 0,
    right: -80,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  blob2: {
    bottom: 0,
    left: -96,
    width: 384,
    height: 384,
    backgroundColor: 'rgba(125, 211, 252, 0.15)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    padding: 24,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  turtleCompanion: {
    position: 'absolute',
    bottom: -8,
    right: -8,
  },
  turtleContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turtleImage: {
    width: 40,
    height: 40,
    opacity: 0.8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.6)',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    padding: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  quoteSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 24,
  },
  quoteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    padding: 24,
  },
  quoteText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#374151',
    lineHeight: 26,
    fontWeight: '500',
    marginBottom: 12,
  },
  quoteAuthor: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  versionSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
  },
});

export default ProfileScreen;