import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Alert } from 'react-native';
import { X, Target, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TherapyGoal, goalService } from '../services/goalService';
import { SmileyImage } from './SmileyImage';
import { goalCheckInStyles as styles } from '../styles/components/GoalCheckIn.styles';

interface GoalCheckInModalProps {
  visible: boolean;
  goal: TherapyGoal | null;
  onClose: () => void;
  onCheckInComplete: () => void;
}

export const GoalCheckInModal: React.FC<GoalCheckInModalProps> = ({
  visible,
  goal,
  onClose,
  onCheckInComplete
}) => {
  const [progressRating, setProgressRating] = useState(0);
  const [reflection, setReflection] = useState('');
  const [challenges, setChallenges] = useState('');
  const [wins, setWins] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setProgressRating(0);
    setReflection('');
    setChallenges('');
    setWins('');
    setNextSteps('');
  };

  const handleSubmit = async () => {
    if (!goal || progressRating === 0) {
      Alert.alert('Missing Information', 'Please rate your progress before submitting.');
      return;
    }

    if (!reflection.trim()) {
      Alert.alert('Missing Information', 'Please add a brief reflection on your progress.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await goalService.addCheckIn(goal.id, {
        progressRating,
        reflection: reflection.trim(),
        challenges: challenges.trim() || undefined,
        wins: wins.trim() || undefined,
        nextSteps: nextSteps.trim() || undefined
      });

      resetForm();
      onCheckInComplete();
      onClose();
      
      Alert.alert(
        'Check-in Complete! 🎉',
        'Your progress has been recorded. Keep up the great work!'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save your check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingButtons = () => {
    const ratings = [
      { value: 1, label: 'Struggling', color: '#ef4444', emoji: '😔' },
      { value: 2, label: 'Some challenges', color: '#f97316', emoji: '😐' },
      { value: 3, label: 'Making progress', color: '#eab308', emoji: '🙂' },
      { value: 4, label: 'Going well', color: '#22c55e', emoji: '😊' },
      { value: 5, label: 'Excellent progress', color: '#10b981', emoji: '🤩' }
    ];

    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.sectionTitle}>How are you feeling about your progress?</Text>
        <View style={styles.ratingButtons}>
          {ratings.map((rating) => (
            <TouchableOpacity
              key={rating.value}
              style={[
                styles.ratingButton,
                progressRating === rating.value && styles.ratingButtonSelected,
                progressRating === rating.value && { borderColor: rating.color }
              ]}
              onPress={() => setProgressRating(rating.value)}
              activeOpacity={0.7}
            >
              <SmileyImage emoji={rating.emoji} size={24} />
              <Text style={[
                styles.ratingLabel,
                progressRating === rating.value && styles.ratingLabelSelected
              ]}>
                {rating.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
          
          <View style={styles.headerContent}>
            <Target size={32} color="#92400e" />
            <Text style={styles.headerTitle}>Goal Check-In</Text>
            <Text style={styles.headerSubtitle}>How are things going?</Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Goal summary */}
          <View style={styles.goalSummary}>
            <Text style={styles.goalTitle}>{goal.mainGoal}</Text>
            <Text style={styles.goalStep}>Current step: {goal.practicalStep}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{goal.progress}%</Text>
            </View>
          </View>

          {/* Rating section */}
          {renderRatingButtons()}

          {/* Reflection section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <TrendingUp size={16} color="#f59e0b" /> How has it been going?
            </Text>
            <TextInput
              style={styles.textArea}
              value={reflection}
              onChangeText={setReflection}
              placeholder="Reflect on your progress, feelings, and experiences..."
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </View>

          {/* Optional sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitleOptional}>
              Challenges (optional)
            </Text>
            <TextInput
              style={styles.textInput}
              value={challenges}
              onChangeText={setChallenges}
              placeholder="Any obstacles or difficulties you've faced?"
              multiline
              textAlignVertical="top"
              numberOfLines={2}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitleOptional}>
              Wins & successes (optional)
            </Text>
            <TextInput
              style={styles.textInput}
              value={wins}
              onChangeText={setWins}
              placeholder="What went well? What are you proud of?"
              multiline
              textAlignVertical="top"
              numberOfLines={2}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitleOptional}>
              <Lightbulb size={16} color="#f59e0b" /> Next steps (optional)
            </Text>
            <TextInput
              style={styles.textInput}
              value={nextSteps}
              onChangeText={setNextSteps}
              placeholder="What would you like to focus on next?"
              multiline
              textAlignVertical="top"
              numberOfLines={2}
            />
          </View>
        </ScrollView>

        {/* Submit button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, (!progressRating || !reflection.trim()) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting || !progressRating || !reflection.trim()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={(!progressRating || !reflection.trim()) ? ['#d1d5db', '#9ca3af'] : ['#f59e0b', '#d97706']}
              style={styles.submitGradient}
            >
              <CheckCircle size={20} color="white" />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Saving...' : 'Complete Check-In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};