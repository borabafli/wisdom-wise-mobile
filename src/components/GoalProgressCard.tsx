import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Target, CheckCircle, Clock, TrendingUp, Plus, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { goalService, TherapyGoal, GoalProgress } from '../services/goalService';
import { goalProgressStyles as styles } from '../styles/components/GoalProgress.styles';

interface GoalProgressCardProps {
  onGoalClick?: (goal: TherapyGoal) => void;
  onAddGoal?: () => void;
  compact?: boolean;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ 
  onGoalClick, 
  onAddGoal, 
  compact = false 
}) => {
  const [activeGoals, setActiveGoals] = useState<TherapyGoal[]>([]);
  const [goalProgress, setGoalProgress] = useState<GoalProgress>({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    averageProgress: 0,
    recentActivity: 0
  });
  const [goalsNeedingCheckIn, setGoalsNeedingCheckIn] = useState<TherapyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoalData();
  }, []);

  const loadGoalData = async () => {
    try {
      setIsLoading(true);
      const [goals, progress, needingCheckIn] = await Promise.all([
        goalService.getActiveGoals(),
        goalService.getGoalProgress(),
        goalService.getGoalsNeedingCheckIn()
      ]);

      setActiveGoals(goals);
      setGoalProgress(progress);
      setGoalsNeedingCheckIn(needingCheckIn);
    } catch (error) {
      console.error('Error loading goal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCheckIn = async (goal: TherapyGoal) => {
    Alert.alert(
      'Quick Check-In',
      `How are you feeling about your progress on "${goal.mainGoal}"?`,
      [
        { text: 'Struggling (1)', onPress: () => addQuickCheckIn(goal, 1) },
        { text: 'Some progress (3)', onPress: () => addQuickCheckIn(goal, 3) },
        { text: 'Going well (5)', onPress: () => addQuickCheckIn(goal, 5) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const addQuickCheckIn = async (goal: TherapyGoal, rating: number) => {
    try {
      await goalService.addCheckIn(goal.id, {
        progressRating: rating,
        reflection: 'Quick check-in from insights dashboard'
      });
      loadGoalData(); // Refresh data
      Alert.alert('Great!', 'Your progress has been recorded.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save check-in. Please try again.');
    }
  };

  const renderProgressStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{goalProgress.activeGoals}</Text>
        <Text style={styles.statLabel}>Active Goals</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValueSuccess}>{goalProgress.completedGoals}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{goalProgress.averageProgress}%</Text>
        <Text style={styles.statLabel}>Avg Progress</Text>
      </View>
    </View>
  );

  const renderActiveGoal = (goal: TherapyGoal, index: number) => {
    const needsCheckIn = goalsNeedingCheckIn.some(g => g.id === goal.id);
    
    return (
      <TouchableOpacity
        key={goal.id}
        style={[styles.goalCard, needsCheckIn && styles.goalCardNeedsCheckIn]}
        onPress={() => onGoalClick?.(goal)}
        activeOpacity={0.8}
      >
        <View style={styles.goalContent}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>{goal.mainGoal}</Text>
            <Text style={styles.goalTimeline}>{goal.timelineText}</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{goal.progress}%</Text>
          </View>

          <Text style={styles.practicalStep}>
            Next step: {goal.practicalStep}
          </Text>

          {needsCheckIn && (
            <TouchableOpacity
              style={styles.checkInButton}
              onPress={(e) => {
                e.stopPropagation();
                handleQuickCheckIn(goal);
              }}
              activeOpacity={0.7}
            >
              <Clock size={14} color="#f59e0b" />
              <Text style={styles.checkInButtonText}>Quick check-in</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <ArrowRight size={16} color="#6b7280" />
      </TouchableOpacity>
    );
  };

  const renderCompactView = () => (
    <View style={styles.compactCard}>
      <View style={styles.compactHeader}>
        <LinearGradient
          colors={['#fbbf24', '#f59e0b']}
          style={styles.compactIcon}
        >
          <Target size={20} color="#92400e" />
        </LinearGradient>
        <View style={styles.compactTitleContainer}>
          <Text style={styles.compactTitle}>Therapy Goals</Text>
          <Text style={styles.compactSubtitle}>
            {goalProgress.activeGoals > 0 
              ? `${goalProgress.activeGoals} active • ${goalProgress.averageProgress}% progress`
              : 'No goals set yet'
            }
          </Text>
        </View>
        <TouchableOpacity 
          onPress={onAddGoal}
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <Plus size={18} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      {goalProgress.activeGoals > 0 && (
        <View style={styles.compactProgress}>
          {goalsNeedingCheckIn.length > 0 && (
            <Text style={styles.checkInReminder}>
              {goalsNeedingCheckIn.length} goal{goalsNeedingCheckIn.length > 1 ? 's' : ''} need a check-in
            </Text>
          )}
        </View>
      )}
    </View>
  );

  const renderFullView = () => (
    <View style={styles.fullCard}>
      <View style={styles.cardHeader}>
        <LinearGradient
          colors={['#fbbf24', '#f59e0b']}
          style={styles.headerIcon}
        >
          <Target size={24} color="#92400e" />
        </LinearGradient>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.cardTitle}>Your Therapy Goals</Text>
          <Text style={styles.cardSubtitle}>Track progress toward meaningful change</Text>
        </View>
      </View>

      {goalProgress.totalGoals > 0 ? (
        <>
          {renderProgressStats()}
          
          {activeGoals.length > 0 ? (
            <View style={styles.goalsContainer}>
              {activeGoals.slice(0, compact ? 2 : 5).map((goal, index) => renderActiveGoal(goal, index))}
              
              {activeGoals.length > (compact ? 2 : 5) && (
                <TouchableOpacity style={styles.viewMoreButton} activeOpacity={0.7}>
                  <Text style={styles.viewMoreText}>
                    View all {activeGoals.length} goals
                  </Text>
                  <ArrowRight size={16} color="#f59e0b" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <CheckCircle size={32} color="#10b981" />
              <Text style={styles.emptyStateTitle}>All goals completed! 🎉</Text>
              <Text style={styles.emptyStateText}>
                You've achieved all your current therapy goals. Ready to set new ones?
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Target size={32} color="#6b7280" />
          <Text style={styles.emptyStateTitle}>No goals set yet</Text>
          <Text style={styles.emptyStateText}>
            Setting therapy goals can help give direction and motivation to your healing journey.
          </Text>
          <TouchableOpacity
            style={styles.createGoalButton}
            onPress={onAddGoal}
            activeOpacity={0.8}
          >
            <Plus size={18} color="white" />
            <Text style={styles.createGoalButtonText}>Create Your First Goal</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={compact ? styles.compactCard : styles.fullCard}>
        <Text style={styles.loadingText}>Loading goals...</Text>
      </View>
    );
  }

  return compact ? renderCompactView() : renderFullView();
};