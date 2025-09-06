import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { X, Target, Clock, Heart, BookOpen, Edit3, CheckCircle, TrendingUp, Calendar, Lightbulb } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TherapyGoal, goalService, FOCUS_AREAS, TIMELINE_OPTIONS } from '../services/goalService';
import { exerciseLibraryData } from '../data/exerciseLibrary';
import { memoryService, Summary } from '../services/memoryService';
import { goalDetailsStyles as styles } from '../styles/components/GoalDetails.styles';

interface GoalDetailsModalProps {
  visible: boolean;
  goal: TherapyGoal | null;
  onClose: () => void;
  onGoalUpdated: () => void;
  onStartExercise?: (exerciseType: string) => void;
}

export const GoalDetailsModal: React.FC<GoalDetailsModalProps> = ({
  visible,
  goal,
  onClose,
  onGoalUpdated,
  onStartExercise
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState<Partial<TherapyGoal>>({});
  const [recommendedExercises, setRecommendedExercises] = useState<any[]>([]);
  const [relatedSessions, setRelatedSessions] = useState<Summary[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (goal) {
      setEditedGoal({
        mainGoal: goal.mainGoal,
        practicalStep: goal.practicalStep,
        motivation: goal.motivation,
        timeline: goal.timeline
      });
      loadRecommendedExercises();
      loadRelatedSessions();
    }
  }, [goal]);

  const loadRecommendedExercises = () => {
    if (!goal) return;

    // Get exercises linked to this goal's focus area
    const linkedExerciseTypes = goal.linkedExercises || [];
    const exercises = linkedExerciseTypes
      .map(type => exerciseLibraryData[type])
      .filter(Boolean)
      .slice(0, 4); // Show max 4 recommendations

    setRecommendedExercises(exercises);
  };

  const loadRelatedSessions = async () => {
    if (!goal) return;

    try {
      const summaries = await memoryService.getSummaries();
      // Find sessions that might be related to this goal's focus area or keywords
      const focusAreaObj = FOCUS_AREAS.find(area => area.id === goal.focusArea);
      const keywords = [
        goal.focusArea,
        focusAreaObj?.title.toLowerCase(),
        ...goal.mainGoal.toLowerCase().split(' ').filter(word => word.length > 3)
      ];

      const related = summaries.filter(summary => {
        const summaryText = summary.text.toLowerCase();
        return keywords.some(keyword => summaryText.includes(keyword));
      }).slice(0, 3); // Show max 3 related sessions

      setRelatedSessions(related);
    } catch (error) {
      console.error('Error loading related sessions:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!goal || !editedGoal.mainGoal?.trim()) {
      Alert.alert('Error', 'Please enter a valid goal.');
      return;
    }

    setIsSaving(true);
    try {
      await goalService.updateGoal(goal.id, editedGoal);
      setIsEditing(false);
      onGoalUpdated();
      Alert.alert('Success', 'Goal updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'completed' | 'paused') => {
    if (!goal) return;

    try {
      await goalService.updateGoal(goal.id, { 
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : goal.progress
      });
      onGoalUpdated();
      Alert.alert('Success', `Goal marked as ${newStatus}!`);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal status.');
    }
  };

  const renderGoalHeader = () => {
    const focusAreaObj = FOCUS_AREAS.find(area => area.id === goal?.focusArea);
    const timelineObj = TIMELINE_OPTIONS.find(t => t.id === goal?.timeline);

    return (
      <LinearGradient
        colors={['#fef3c7', '#fbbf24']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <X size={24} color="#92400e" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
          activeOpacity={0.7}
        >
          <Edit3 size={20} color="#92400e" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Target size={32} color="#92400e" />
          <Text style={styles.headerTitle}>Your Therapy Goal</Text>
          <Text style={styles.focusArea}>
            {goal?.focusArea === 'other' ? goal?.customFocusArea : focusAreaObj?.title}
          </Text>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, styles[`status_${goal?.status}`]]}>
              <Text style={styles.statusText}>{goal?.status?.toUpperCase()}</Text>
            </View>
            <View style={styles.timelineBadge}>
              <Clock size={14} color="#f59e0b" />
              <Text style={styles.timelineText}>{timelineObj?.label}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderGoalDetails = () => (
    <View style={styles.detailsContainer}>
      {/* Main Goal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Target size={18} color="#f59e0b" /> Main Goal
        </Text>
        {isEditing ? (
          <TextInput
            style={styles.textArea}
            value={editedGoal.mainGoal}
            onChangeText={(text) => setEditedGoal(prev => ({ ...prev, mainGoal: text }))}
            placeholder="What would you like to achieve?"
            multiline
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.goalText}>{goal?.mainGoal}</Text>
        )}
      </View>

      {/* Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <TrendingUp size={18} color="#f59e0b" /> Progress
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${goal?.progress || 0}%` }]} />
          </View>
          <Text style={styles.progressText}>{goal?.progress || 0}%</Text>
        </View>
        <Text style={styles.checkInsText}>
          {goal?.checkIns.length || 0} check-ins completed
        </Text>
      </View>

      {/* Practical Step */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <CheckCircle size={18} color="#f59e0b" /> Current Step
        </Text>
        {isEditing ? (
          <TextInput
            style={styles.textArea}
            value={editedGoal.practicalStep}
            onChangeText={(text) => setEditedGoal(prev => ({ ...prev, practicalStep: text }))}
            placeholder="What's your next small step?"
            multiline
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.stepText}>{goal?.practicalStep}</Text>
        )}
      </View>

      {/* Motivation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Heart size={18} color="#f59e0b" /> Why This Matters
        </Text>
        {isEditing ? (
          <TextInput
            style={styles.textArea}
            value={editedGoal.motivation}
            onChangeText={(text) => setEditedGoal(prev => ({ ...prev, motivation: text }))}
            placeholder="Why is this goal important to you?"
            multiline
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.motivationText}>{goal?.motivation}</Text>
        )}
      </View>
    </View>
  );

  const renderRecommendedExercises = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        <BookOpen size={18} color="#f59e0b" /> Recommended Exercises
      </Text>
      <Text style={styles.sectionSubtitle}>
        These exercises can help you work toward your goal
      </Text>
      
      <View style={styles.exercisesList}>
        {recommendedExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.type}
            style={styles.exerciseCard}
            onPress={() => onStartExercise?.(exercise.type)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={exercise.color}
              style={styles.exerciseIcon}
            >
              <exercise.icon size={20} color="white" />
            </LinearGradient>
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDuration}>{exercise.duration} • {exercise.category}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRelatedSessions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        <Calendar size={18} color="#f59e0b" /> Related Sessions
      </Text>
      <Text style={styles.sectionSubtitle}>
        Past sessions that connect to this goal
      </Text>
      
      {relatedSessions.length > 0 ? (
        <View style={styles.sessionsList}>
          {relatedSessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <Text style={styles.sessionDate}>
                {new Date(session.date).toLocaleDateString()}
              </Text>
              <Text style={styles.sessionSummary}>{session.text}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noSessionsText}>
          No related sessions found yet. As you continue therapy, relevant sessions will appear here.
        </Text>
      )}
    </View>
  );

  const renderActionButtons = () => {
    if (isEditing) {
      return (
        <View style={styles.editActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setIsEditing(false);
              setEditedGoal({
                mainGoal: goal?.mainGoal,
                practicalStep: goal?.practicalStep,
                motivation: goal?.motivation,
                timeline: goal?.timeline
              });
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveEdit}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.saveGradient}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.actionButtons}>
        {goal?.status === 'active' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleStatusChange('paused')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Pause Goal</Text>
          </TouchableOpacity>
        )}
        
        {goal?.status === 'paused' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleStatusChange('active')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Resume Goal</Text>
          </TouchableOpacity>
        )}
        
        {goal?.status !== 'completed' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleStatusChange('completed')}
            activeOpacity={0.7}
          >
            <CheckCircle size={16} color="white" />
            <Text style={styles.completeButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!goal) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {renderGoalHeader()}
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderGoalDetails()}
          {renderRecommendedExercises()}
          {renderRelatedSessions()}
        </ScrollView>

        <View style={styles.footer}>
          {renderActionButtons()}
        </View>
      </View>
    </Modal>
  );
};