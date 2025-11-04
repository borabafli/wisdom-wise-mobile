import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { ArrowLeft, Target, Plus, ChevronRight, CheckCircle2, Clock, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { goalService, TherapyGoal } from '../services/goalService';
import { GoalDetailsModal } from '../components/GoalDetailsModal';
import { useNavigationBarStyle, navigationBarConfigs } from '../hooks/useNavigationBarStyle';
import { therapyGoalsScreenStyles as styles } from '../styles/components/TherapyGoalsScreen.styles';

interface TherapyGoalsScreenProps {
  onBack: () => void;
  onStartGoalSetting: () => void;
}

const TherapyGoalsScreen: React.FC<TherapyGoalsScreenProps> = ({
  onBack,
  onStartGoalSetting,
}) => {
  const [activeGoals, setActiveGoals] = useState<TherapyGoal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<TherapyGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<TherapyGoal | null>(null);
  const [goalDetailsVisible, setGoalDetailsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Apply dynamic navigation bar styling
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.default);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const allGoals = await goalService.getAllGoals();
      const active = allGoals.filter(goal => goal.status === 'active');
      const completed = allGoals.filter(goal => goal.status === 'completed');

      setActiveGoals(active);
      setCompletedGoals(completed);
    } catch (error) {
      console.error('Failed to load goals:', error);
      Alert.alert('Error', 'Failed to load your goals. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadGoals();
  };

  const handleGoalPress = (goal: TherapyGoal) => {
    setSelectedGoal(goal);
    setGoalDetailsVisible(true);
  };

  const handleGoalUpdate = () => {
    setGoalDetailsVisible(false);
    setSelectedGoal(null);
    loadGoals(); // Refresh goals list
  };

  const getFocusAreaDisplayName = (focusArea: string, customFocusArea?: string) => {
    if (focusArea === 'other' && customFocusArea) {
      return customFocusArea;
    }
    return focusArea.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTimelineDisplayText = (timeline: string) => {
    switch (timeline) {
      case 'short': return 'Short-term';
      case 'medium': return 'Medium-term';
      case 'long': return 'Long-term';
      default: return timeline;
    }
  };

  const renderGoalCard = (goal: TherapyGoal, isCompleted: boolean = false) => (
    <TouchableOpacity
      key={goal.id}
      onPress={() => handleGoalPress(goal)}
      style={[styles.goalCard, isCompleted && styles.completedGoalCard]}
      activeOpacity={0.9}
    >
      <View style={styles.goalCardHeader}>
        <View style={styles.goalFocusArea}>
          <Text style={styles.goalFocusAreaText}>
            {getFocusAreaDisplayName(goal.focusArea, goal.customFocusArea)}
          </Text>
        </View>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <CheckCircle2 size={16} color="#FFFFFF" />
          </View>
        )}
      </View>

      <Text style={styles.goalTitle}>{goal.mainGoal}</Text>
      <Text style={styles.goalStep}>Current step: {goal.practicalStep}</Text>

      {!isCompleted && (
        <View style={styles.goalProgressContainer}>
          <View style={styles.goalProgressBar}>
            <View
              style={[
                styles.goalProgressFill,
                { width: `${goal.progress}%` }
              ]}
            />
          </View>
          <Text style={styles.goalProgressText}>{goal.progress}% complete</Text>
        </View>
      )}

      <View style={styles.goalMeta}>
        <View style={styles.goalMetaItem}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.goalMetaText}>{getTimelineDisplayText(goal.timeline)}</Text>
        </View>
        <View style={styles.goalMetaItem}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.goalMetaText}>
            {new Date(goal.createdDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.goalCardArrow}>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Image
          source={require('../../assets/images/New Icons/icon-12.png')}
          style={{ width: 80, height: 80 }}
          contentFit="contain"
        />
      </View>

      <Text style={styles.emptyStateTitle}>No Therapy Goals Yet</Text>
      <Text style={styles.emptyStateDescription}>
        Setting therapy goals can give direction and motivation to your healing journey.
        Goals help you track progress and stay focused on what matters most to you.
      </Text>

      <TouchableOpacity
        onPress={onStartGoalSetting}
        style={styles.primaryButton}
        activeOpacity={0.8}
      >
        <Target size={20} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Set Your First Goal</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style={statusBarStyle} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Therapy Goals</Text>
          <Text style={styles.headerSubtitle}>
            {activeGoals.length > 0
              ? `${activeGoals.length} active • ${completedGoals.length} completed`
              : 'Your therapeutic journey starts here'
            }
          </Text>
        </View>

        {activeGoals.length > 0 && (
          <TouchableOpacity onPress={onStartGoalSetting} style={styles.addButton}>
            <Plus size={20} color="#059669" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeGoals.length === 0 && completedGoals.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Active Goals Section */}
            {activeGoals.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Active Goals</Text>
                  <Text style={styles.sectionCount}>{activeGoals.length}</Text>
                </View>

                {activeGoals.map(goal => renderGoalCard(goal, false))}
              </View>
            )}

            {/* Completed Goals Section */}
            {completedGoals.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Completed Goals</Text>
                  <Text style={styles.sectionCount}>{completedGoals.length}</Text>
                </View>

                {completedGoals.map(goal => renderGoalCard(goal, true))}
              </View>
            )}

            {/* Add New Goal Button */}
            {activeGoals.length > 0 && (
              <TouchableOpacity
                onPress={onStartGoalSetting}
                style={styles.addGoalButton}
                activeOpacity={0.8}
              >
                <Plus size={20} color="#059669" />
                <Text style={styles.addGoalButtonText}>Add New Goal</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      {/* Goal Details Modal */}
      <GoalDetailsModal
        visible={goalDetailsVisible}
        goal={selectedGoal}
        onClose={() => setGoalDetailsVisible(false)}
        onGoalUpdated={handleGoalUpdate}
      />
    </SafeAreaWrapper>
  );
};

export default TherapyGoalsScreen;