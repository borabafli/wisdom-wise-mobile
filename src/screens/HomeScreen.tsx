import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Clock, Heart, Zap, BookOpen, Brain, Mic } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  onStartSession: (exercise?: any) => void;
  onExerciseClick: (exercise?: any) => void;
  onInsightClick: (type: string, insight?: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartSession, onExerciseClick, onInsightClick }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Background watercolor effects */}
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
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.welcomeTitle}>Welcome back</Text>
              <Text style={styles.welcomeSubtitle}>How are you feeling today?</Text>
            </View>
            
            {/* Turtle Companion */}
            <View style={styles.turtleContainer}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(147, 197, 253, 0.08)', 'transparent']}
                style={styles.turtleGradient}
              />
              <Image 
                source={require('../../assets/images/turtle11.png')}
                style={styles.turtleImage}
                contentFit="contain"
              />
            </View>
          </View>
        </View>

        {/* Main CTA - Start Guided Session */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            onPress={() => onStartSession()}
            style={styles.ctaButton}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.3)']}
              style={styles.ctaGradient}
            >
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>Begin your journey</Text>
                <Text style={styles.ctaSubtitle}>Let's start a guided session</Text>
                
                {/* Minimalist input area */}
                <View style={styles.inputContainer}>
                  <MessageCircle size={18} color="#1e293b" />
                  <Text style={styles.inputText}>Type or talk to start...</Text>
                  <View style={styles.micButton}>
                    <Mic size={16} color="#1e293b" />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* For You Today Section */}
        <View style={styles.exercisesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For You Today</Text>
            <TouchableOpacity 
              onPress={() => onExerciseClick()}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Exercise Cards */}
          <View style={styles.exercisesList}>
            {/* Morning Mindfulness */}
            <TouchableOpacity
              onPress={() => onStartSession({ type: 'mindfulness', name: 'Morning Mindfulness', duration: '5 min', description: 'breathing' })}
              style={styles.exerciseCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(239, 246, 255, 0.9)']}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <LinearGradient
                    colors={['#bfdbfe', '#7dd3fc']}
                    style={styles.exerciseIcon}
                  >
                    <Heart size={20} color="#1e40af" />
                  </LinearGradient>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>Morning Mindfulness</Text>
                    <View style={styles.exerciseMeta}>
                      <Clock size={12} color="#6b7280" />
                      <Text style={styles.exerciseTime}>5 min breathing</Text>
                    </View>
                  </View>
                  <View style={styles.exerciseAction}>
                    <LinearGradient
                      colors={['rgba(59, 130, 246, 0.2)', 'rgba(14, 165, 233, 0.3)']}
                      style={styles.actionIcon}
                    >
                      <Zap size={14} color="#1e40af" />
                    </LinearGradient>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Stress Relief */}
            <TouchableOpacity
              onPress={() => onStartSession({ type: 'stress-relief', name: 'Stress Relief', duration: '3 min', description: 'progressive relaxation' })}
              style={styles.exerciseCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(239, 246, 255, 0.9)']}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <LinearGradient
                    colors={['#bae6fd', '#7dd3fc']}
                    style={styles.exerciseIcon}
                  >
                    <Brain size={20} color="#0369a1" />
                  </LinearGradient>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>Stress Relief</Text>
                    <View style={styles.exerciseMeta}>
                      <Clock size={12} color="#6b7280" />
                      <Text style={styles.exerciseTime}>3 min progressive relaxation</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Gratitude Practice */}
            <TouchableOpacity
              onPress={() => onStartSession({ type: 'gratitude', name: 'Gratitude Practice', duration: '2 min', description: 'reflection' })}
              style={styles.exerciseCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(239, 246, 255, 0.9)']}
                style={styles.exerciseCardGradient}
              >
                <View style={styles.exerciseCardContent}>
                  <LinearGradient
                    colors={['#bfdbfe', '#7dd3fc']}
                    style={styles.exerciseIcon}
                  >
                    <BookOpen size={20} color="#1e40af" />
                  </LinearGradient>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>Gratitude Practice</Text>
                    <View style={styles.exerciseMeta}>
                      <Clock size={12} color="#6b7280" />
                      <Text style={styles.exerciseTime}>2 min reflection</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              onPress={() => onExerciseClick()}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <Image 
                source={require('../../assets/images/13.png')}
                style={styles.quickActionBackgroundImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={['rgba(186, 230, 253, 0.5)', 'rgba(59, 130, 246, 0.4)']}
                style={styles.quickActionGradient}
              >
                <BookOpen size={24} color="#0369a1" />
                <Text style={styles.quickActionText}>Browse Exercises</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => onInsightClick('insights')}
              style={styles.quickActionButton}
              activeOpacity={0.9}
            >
              <Image 
                source={require('../../assets/images/15.png')}
                style={styles.quickActionBackgroundImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={['rgba(186, 230, 253, 0.5)', 'rgba(59, 130, 246, 0.4)']}
                style={styles.quickActionGradient}
              >
                <Brain size={24} color="#0369a1" />
                <Text style={styles.quickActionText}>View Insights</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteSection}>
          <View style={styles.quoteCard}>
            <Image 
              source={require('../../assets/images/4.jpeg')}
              style={styles.quoteBackgroundImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.4)', 'rgba(14, 165, 233, 0.3)', 'rgba(37, 99, 235, 0.5)']}
              style={styles.quoteGradient}
            >
              <View style={styles.quoteIcon}>
                <Text style={styles.quoteSymbol}>"</Text>
              </View>
              <Text style={styles.quoteText}>
                Progress is progress, no matter how small
              </Text>
              <Text style={styles.quoteAuthor}>— Daily Mindfulness</Text>
            </LinearGradient>
          </View>
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
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
  },
  turtleContainer: {
    width: 128,
    height: 128,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  turtleGradient: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  turtleImage: {
    width: 120,
    height: 120,
    opacity: 0.8,
  },
  ctaSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  ctaButton: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  ctaGradient: {
    borderRadius: 24,
    padding: 32,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(30, 41, 59, 0.9)',
    fontWeight: '400',
    marginBottom: 28,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    gap: 16,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exercisesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  exercisesList: {
    gap: 16,
  },
  exerciseCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  exerciseCardGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseTime: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  exerciseAction: {
    marginLeft: 'auto',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  quickActionBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  quickActionGradient: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
    gap: 8,
  },
  quickActionText: {
    color: '#075985',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  quoteSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quoteCard: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  quoteBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  quoteGradient: {
    padding: 32,
    alignItems: 'center',
  },
  quoteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  quoteSymbol: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  quoteText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;