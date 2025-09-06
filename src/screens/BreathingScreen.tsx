import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Vibration, Platform, TextInput, Modal } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { ArrowLeft, Play, Pause, RotateCcw, Settings2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
// import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { colors, shadows, spacing } from '../styles/tokens';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface BreathingScreenProps {
  onBack: () => void;
}

interface BreathingPreset {
  id: string;
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfterExhale?: number;
  description: string;
  cycles: number;
}

const BREATHING_PRESETS: BreathingPreset[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: 'Calming technique for relaxation and sleep',
    cycles: 4,
  },
  {
    id: 'box',
    name: 'Box Breathing',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    description: 'Balanced breathing for focus and stress relief',
    cycles: 6,
  },
  {
    id: 'triangle',
    name: 'Triangle Breathing',
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: 'Simple rhythmic breathing for mindfulness',
    cycles: 8,
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    inhale: 5,
    hold: 0,
    exhale: 5,
    description: 'Heart-focused breathing for balance',
    cycles: 10,
  },
  {
    id: 'custom',
    name: 'Custom',
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: 'Create your own breathing pattern',
    cycles: 5,
  },
];

const STORAGE_KEY = 'breathing_last_preset';

const BreathingScreen: React.FC<BreathingScreenProps> = ({ onBack }) => {
  const [selectedPreset, setSelectedPreset] = useState<BreathingPreset>(BREATHING_PRESETS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'>('inhale');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 0,
    cycles: 5,
    enableHoldAfterExhale: false,
  });

  const scaleAnimation = useRef(new Animated.Value(0.3)).current;
  const opacityAnimation = useRef(new Animated.Value(0.4)).current;
  const ringAnimation = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const phaseIndexRef = useRef(0);
  const cycleCountRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Load user preferences on mount
  useEffect(() => {
    loadUserPreferences();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadUserPreferences = async () => {
    try {
      // For now, we'll just use the default preset
      // In production, uncomment the AsyncStorage import and these lines:
      // const savedPresetId = await AsyncStorage.getItem(STORAGE_KEY);
      // if (savedPresetId) {
      //   const preset = BREATHING_PRESETS.find(p => p.id === savedPresetId);
      //   if (preset) {
      //     setSelectedPreset(preset);
      //   }
      // }
      console.log('Using default breathing preset');
    } catch (error) {
      console.log('Error loading user preferences:', error);
    }
  };

  const saveUserPreference = async (presetId: string) => {
    try {
      // For now, we'll just log the preference
      // In production, uncomment the AsyncStorage import and this line:
      // await AsyncStorage.setItem(STORAGE_KEY, presetId);
      console.log('Would save breathing preset:', presetId);
    } catch (error) {
      console.log('Error saving user preference:', error);
    }
  };

  const playSound = async (phase: 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale') => {
    if (!soundEnabled) return;

    try {
      const sound = new Audio.Sound();
      
      // Load the appropriate sound file based on phase
      let soundFile;
      switch (phase) {
        case 'inhale':
          soundFile = require('../../assets/sounds/breathe-in.mp3');
          break;
        case 'hold':
        case 'holdAfterExhale':
          soundFile = require('../../assets/sounds/hold.mp3');
          break;
        case 'exhale':
          soundFile = require('../../assets/sounds/breathe-out.mp3');
          break;
        default:
          return; // No sound for unknown phases
      }
      
      await sound.loadAsync(soundFile);
      await sound.setVolumeAsync(0.8); // Increased from 0.3 to 0.8 (80% volume)
      await sound.playAsync();
      
      // Clean up after playing
      setTimeout(async () => {
        try {
          await sound.unloadAsync();
        } catch (cleanupError) {
          console.log('Sound cleanup error:', cleanupError);
        }
      }, 3000);
      
    } catch (error) {
      console.log('Sound files not found, using haptic feedback fallback:', error);
      // Graceful fallback to haptics when sound files are missing
      const hapticType = phase === 'exhale' ? 'medium' : phase === 'inhale' ? 'light' : 'heavy';
      triggerHaptics(hapticType);
    }
  };

  const triggerHaptics = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticsEnabled) return;
    
    if (Platform.OS === 'ios') {
      // For now using vibration fallback
      // In production, install expo-haptics and use:
      // switch (type) {
      //   case 'light':
      //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      //     break;
      //   case 'medium':
      //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      //     break;
      //   case 'heavy':
      //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      //     break;
      // }
      Vibration.vibrate(type === 'heavy' ? 100 : type === 'medium' ? 50 : 25);
    } else {
      Vibration.vibrate(type === 'heavy' ? 100 : type === 'medium' ? 50 : 25);
    }
  };

  const animateBreathingCycle = useCallback((phase: string, duration: number) => {
    const scaleValue = phase === 'inhale' ? 1 : phase === 'exhale' ? 0.3 : 0.7;
    const opacityValue = phase === 'inhale' ? 0.9 : phase === 'exhale' ? 0.4 : 0.7;

    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: scaleValue,
        duration: duration * 1000,
        useNativeDriver: false, // Fixed: removed native driver for web compatibility
      }),
      Animated.timing(opacityAnimation, {
        toValue: opacityValue,
        duration: duration * 1000,
        useNativeDriver: false, // Fixed: removed native driver for web compatibility
      }),
      Animated.timing(ringAnimation, {
        toValue: phase === 'inhale' ? 1 : 0,
        duration: duration * 1000,
        useNativeDriver: false, // Fixed: removed native driver for web compatibility
      }),
    ]).start();
  }, [scaleAnimation, opacityAnimation, ringAnimation]);

  const startBreathingCycle = useCallback(() => {
    console.log('=== STARTING BREATHING CYCLE ===');
    console.log('isPaused:', isPaused, 'isPlaying:', isPlaying);
    
    if (isPaused) {
      // Resume from current state
      setIsPaused(false);
    } else {
      // Start fresh
      phaseIndexRef.current = 0;
      cycleCountRef.current = 0;
      setCyclesCompleted(0);
    }
    
    const phases: Array<keyof BreathingPreset> = ['inhale', 'hold', 'exhale'];
    if (selectedPreset.holdAfterExhale) {
      phases.push('holdAfterExhale');
    }

    const runPhase = () => {
      console.log('Running phase:', phaseIndexRef.current);
      
      const phaseName = phases[phaseIndexRef.current] as 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';
      const duration = selectedPreset[phaseName] || 0;
      
      console.log('Phase:', phaseName, 'Duration:', duration);
      
      setCurrentPhase(phaseName);
      setTimeRemaining(duration);
      
      // Play sounds and haptics for all phases
      playSound(phaseName);
      
      // Additional haptics for tactile feedback
      if (phaseName === 'inhale') {
        triggerHaptics('light');
      } else if (phaseName === 'exhale') {
        triggerHaptics('medium');
      } else if (phaseName === 'hold' || phaseName === 'holdAfterExhale') {
        triggerHaptics('heavy');
      }
      
      // Animate the breathing circle
      animateBreathingCycle(phaseName, duration);
      
      // Start countdown
      let timeLeft = duration;
      const countdown = setInterval(() => {
        // Check current playing state using ref instead of captured closure state
        if (!isPlayingRef.current) {
          console.log('Stopping countdown - not playing');
          clearInterval(countdown);
          return;
        }
        
        timeLeft -= 1;
        setTimeRemaining(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdown);
          
          phaseIndexRef.current++;
          
          // Check if cycle is complete
          if (phaseIndexRef.current >= phases.length) {
            phaseIndexRef.current = 0;
            cycleCountRef.current++;
            setCyclesCompleted(cycleCountRef.current);
            
            // End session if all cycles completed
            if (cycleCountRef.current >= selectedPreset.cycles) {
              console.log('All cycles completed, ending session');
              setIsPlaying(false);
              isPlayingRef.current = false;
              setIsPaused(false);
              triggerHaptics('heavy');
              return;
            }
          }
          
          // Continue to next phase only if still playing
          if (isPlayingRef.current) {
            setTimeout(runPhase, 100);
          }
        }
      }, 1000);
      
      timerRef.current = countdown;
    };
    
    // Add small delay to ensure state is properly set
    setTimeout(runPhase, 50);
  }, [selectedPreset, animateBreathingCycle, playSound, triggerHaptics]);

  const handlePlayPause = () => {
    console.log('=== PLAY/PAUSE BUTTON CLICKED ===');
    console.log('Current isPlaying state:', isPlaying);
    
    if (isPlaying) {
      // Pause
      console.log('Pausing breathing session');
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      // Play/Resume
      console.log('Starting/resuming breathing session');
      setIsPlaying(true);
      isPlayingRef.current = true;
      startBreathingCycle();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsPaused(false);
    setCyclesCompleted(0);
    setCurrentPhase('inhale');
    setTimeRemaining(0);
    
    // Reset refs
    phaseIndexRef.current = 0;
    cycleCountRef.current = 0;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Reset animations
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 0.3,
        duration: 300,
        useNativeDriver: false, // Fixed: removed native driver for web compatibility
      }),
      Animated.timing(opacityAnimation, {
        toValue: 0.4,
        duration: 300,
        useNativeDriver: false, // Fixed: removed native driver for web compatibility
      }),
      Animated.timing(ringAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false, // Fixed: removed native driver for web compatibility
      }),
    ]).start();
  };

  const handlePresetChange = (preset: BreathingPreset) => {
    if (preset.id === 'custom') {
      setShowCustomModal(true);
    } else {
      setSelectedPreset(preset);
      saveUserPreference(preset.id);
      handleReset();
      setShowSettings(false);
    }
  };

  const applyCustomSettings = () => {
    const customPreset: BreathingPreset = {
      id: 'custom',
      name: 'Custom',
      inhale: customSettings.inhale,
      hold: customSettings.hold,
      exhale: customSettings.exhale,
      holdAfterExhale: customSettings.enableHoldAfterExhale ? customSettings.holdAfterExhale : undefined,
      description: `${customSettings.inhale}s in • ${customSettings.hold}s hold • ${customSettings.exhale}s out${customSettings.enableHoldAfterExhale ? ` • ${customSettings.holdAfterExhale}s hold` : ''}`,
      cycles: customSettings.cycles,
    };
    
    setSelectedPreset(customPreset);
    setShowCustomModal(false);
    setShowSettings(false);
    handleReset();
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'holdAfterExhale':
        return 'Hold';
      default:
        return 'Breathe';
    }
  };

  const getPhaseColor = (): [string, string] => {
    switch (currentPhase) {
      case 'inhale':
        return ['#3BB4F5', '#5EEAD4'];
      case 'hold':
        return ['#A78BFA', '#C084FC'];
      case 'exhale':
        return ['#34D399', '#6EE7B7'];
      case 'holdAfterExhale':
        return ['#FBBF24', '#FCD34D'];
      default:
        return ['#3BB4F5', '#5EEAD4'];
    }
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      {/* Ocean Background */}
      <Image
        source={require('../../assets/images/ocean.png')}
        style={styles.oceanBackground}
        contentFit="cover"
      />
      
      {/* Subtle overlay for better content readability */}
      <View style={styles.oceanOverlay} />
      
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{selectedPreset.name}</Text>
            <Text style={styles.headerSubtitle}>{selectedPreset.description}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(!showSettings)}
            activeOpacity={0.7}
          >
            <Settings2 size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Settings Panel */}
        {showSettings && (
          <View style={styles.settingsPanel}>
            <Text style={styles.settingsTitle}>Breathing Techniques</Text>
            {BREATHING_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetOption,
                  selectedPreset.id === preset.id && styles.presetOptionSelected
                ]}
                onPress={() => handlePresetChange(preset)}
                activeOpacity={0.7}
              >
                <View>
                  <Text style={[
                    styles.presetName,
                    selectedPreset.id === preset.id && styles.presetNameSelected
                  ]}>
                    {preset.name}
                  </Text>
                  <Text style={styles.presetDescription}>{preset.description}</Text>
                  <Text style={styles.presetTiming}>
                    {preset.inhale}s in • {preset.hold}s hold • {preset.exhale}s out
                    {preset.holdAfterExhale ? ` • ${preset.holdAfterExhale}s hold` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            
            <View style={styles.settingsDivider} />
            
            <View style={styles.toggleSection}>
              <TouchableOpacity
                style={styles.toggleOption}
                onPress={() => setSoundEnabled(!soundEnabled)}
                activeOpacity={0.7}
              >
                <Text style={styles.toggleLabel}>Sound Cues</Text>
                <View style={[styles.toggle, soundEnabled && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, soundEnabled && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.toggleOption}
                onPress={() => setHapticsEnabled(!hapticsEnabled)}
                activeOpacity={0.7}
              >
                <Text style={styles.toggleLabel}>Haptic Feedback</Text>
                <View style={[styles.toggle, hapticsEnabled && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, hapticsEnabled && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Breathing Circle */}
        <View style={styles.breathingContainer}>
          <View style={styles.breathingCircleContainer}>
            {/* Blurred background ring for depth */}
            <BlurView intensity={20} style={styles.blurRing} />
            
            {/* Outer ring animation with enhanced blur effect */}
            <Animated.View
              style={[
                styles.outerRing,
                {
                  opacity: ringAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.8],
                  }),
                  transform: [
                    {
                      scale: ringAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <BlurView intensity={40} style={styles.outerRingBlur} />
            </Animated.View>
            
            {/* Main breathing circle */}
            <Animated.View
              style={[
                styles.breathingCircle,
                {
                  opacity: opacityAnimation,
                  transform: [{ scale: scaleAnimation }],
                },
              ]}
            >
              <LinearGradient
                colors={getPhaseColor()}
                style={styles.breathingGradient}
              >
                <Text style={styles.phaseText}>{getPhaseText()}</Text>
                {timeRemaining > 0 && (
                  <Text style={styles.timerText}>{timeRemaining}</Text>
                )}
              </LinearGradient>
            </Animated.View>
          </View>
        </View>

        {/* Progress Info */}
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            Cycle {cyclesCompleted + 1} of {selectedPreset.cycles}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((cyclesCompleted) / selectedPreset.cycles) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <RotateCcw size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.playButton, isPlaying && styles.playButtonActive]}
            onPress={handlePlayPause}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#9ED0DD', '#7BC1CE']}
              style={styles.playButtonGradient}
            >
              {isPlaying ? (
                <Pause size={32} color="white" />
              ) : (
                <Play size={32} color="white" />
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.secondaryButton} />
        </View>
      </View>

      {/* Custom Settings Modal */}
      <Modal
        visible={showCustomModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <SafeAreaWrapper style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Custom Breathing Pattern</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCustomModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Breathing Timings */}
            <View style={styles.settingsGroup}>
              <Text style={styles.settingsGroupTitle}>Breathing Timings (seconds)</Text>
              
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Inhale</Text>
                <TextInput
                  style={styles.timingInput}
                  value={customSettings.inhale.toString()}
                  onChangeText={(text) => setCustomSettings(prev => ({ ...prev, inhale: Math.max(1, parseInt(text) || 1) }))}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
              </View>

              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Hold</Text>
                <TextInput
                  style={styles.timingInput}
                  value={customSettings.hold.toString()}
                  onChangeText={(text) => setCustomSettings(prev => ({ ...prev, hold: Math.max(0, parseInt(text) || 0) }))}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
              </View>

              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Exhale</Text>
                <TextInput
                  style={styles.timingInput}
                  value={customSettings.exhale.toString()}
                  onChangeText={(text) => setCustomSettings(prev => ({ ...prev, exhale: Math.max(1, parseInt(text) || 1) }))}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
              </View>

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setCustomSettings(prev => ({ ...prev, enableHoldAfterExhale: !prev.enableHoldAfterExhale }))}
                activeOpacity={0.7}
              >
                <Text style={styles.timingLabel}>Hold After Exhale</Text>
                <View style={[styles.toggle, customSettings.enableHoldAfterExhale && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, customSettings.enableHoldAfterExhale && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>

              {customSettings.enableHoldAfterExhale && (
                <View style={styles.timingRow}>
                  <Text style={styles.timingLabel}>Hold Duration</Text>
                  <TextInput
                    style={styles.timingInput}
                    value={customSettings.holdAfterExhale.toString()}
                    onChangeText={(text) => setCustomSettings(prev => ({ ...prev, holdAfterExhale: Math.max(0, parseInt(text) || 0) }))}
                    keyboardType="numeric"
                    selectTextOnFocus
                  />
                </View>
              )}
            </View>

            {/* Session Settings */}
            <View style={styles.settingsGroup}>
              <Text style={styles.settingsGroupTitle}>Session Settings</Text>
              
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Number of Cycles</Text>
                <TextInput
                  style={styles.timingInput}
                  value={customSettings.cycles.toString()}
                  onChangeText={(text) => setCustomSettings(prev => ({ ...prev, cycles: Math.max(1, parseInt(text) || 1) }))}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Preview</Text>
              <Text style={styles.previewText}>
                {customSettings.inhale}s in • {customSettings.hold}s hold • {customSettings.exhale}s out
                {customSettings.enableHoldAfterExhale ? ` • ${customSettings.holdAfterExhale}s hold` : ''}
              </Text>
              <Text style={styles.previewSubtext}>
                {customSettings.cycles} cycles • ~{Math.ceil((customSettings.inhale + customSettings.hold + customSettings.exhale + (customSettings.enableHoldAfterExhale ? customSettings.holdAfterExhale : 0)) * customSettings.cycles / 60)} minutes
              </Text>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalApplyButton}
              onPress={applyCustomSettings}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3BB4F5', '#0EA5E9']}
                style={styles.modalApplyGradient}
              >
                <Text style={styles.modalApplyText}>Apply Custom Pattern</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaWrapper>
      </Modal>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Ocean Background
  oceanBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  oceanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(240, 249, 255, 0.85)', // Light blue overlay for readability
  },
  contentContainer: {
    flex: 1,
    zIndex: 1, // Ensure content is above background
  },
  background: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.therapy.lg,
    paddingTop: spacing.therapy.md,
    paddingBottom: spacing.therapy.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.therapy.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },

  // Settings Panel
  settingsPanel: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.therapy.lg,
    borderRadius: 16,
    padding: spacing.therapy.lg,
    marginBottom: spacing.therapy.md,
    ...shadows.md,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.therapy.md,
  },
  presetOption: {
    padding: spacing.therapy.md,
    borderRadius: 12,
    marginBottom: spacing.therapy.sm,
    backgroundColor: colors.background.secondary,
  },
  presetOptionSelected: {
    backgroundColor: '#E0F2FE',
    borderWidth: 2,
    borderColor: '#3BB4F5',
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  presetNameSelected: {
    color: '#0EA5E9',
  },
  presetDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  presetTiming: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontFamily: 'mono',
  },
  settingsDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.therapy.md,
  },
  toggleSection: {
    gap: spacing.therapy.sm,
  },
  toggleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.therapy.sm,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray[300],
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#3BB4F5',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: shadows.sm.shadowOffset,
    shadowOpacity: shadows.sm.shadowOpacity,
    shadowRadius: shadows.sm.shadowRadius,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },

  // Breathing Circle
  breathingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircleContainer: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: width * 0.35,
    borderWidth: 2,
    borderColor: 'rgba(59, 180, 245, 0.3)',
  },
  breathingCircle: {
    width: '80%',
    height: '80%',
    borderRadius: width * 0.28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  breathingGradient: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.therapy.xs,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },

  // Progress
  progressInfo: {
    alignItems: 'center',
    paddingHorizontal: spacing.therapy.lg,
    marginBottom: spacing.therapy.xl,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: spacing.therapy.sm,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3BB4F5',
    borderRadius: 4,
  },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.therapy.xl,
    paddingBottom: spacing.therapy.xl,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  playButtonActive: {
    ...shadows.xl,
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Blur Effects
  blurRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: width * 0.35,
  },
  outerRingBlur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: width * 0.35,
  },

  // Custom Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.therapy.lg,
    paddingVertical: spacing.therapy.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  modalCloseButton: {
    paddingVertical: spacing.therapy.sm,
    paddingHorizontal: spacing.therapy.md,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3BB4F5',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.therapy.lg,
    paddingTop: spacing.therapy.lg,
  },
  settingsGroup: {
    marginBottom: spacing.therapy.xl,
  },
  settingsGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.therapy.md,
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.therapy.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.therapy.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  timingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
  timingInput: {
    width: 80,
    height: 40,
    backgroundColor: colors.background.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  previewSection: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: spacing.therapy.lg,
    marginTop: spacing.therapy.md,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.therapy.sm,
  },
  previewText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.therapy.xs,
  },
  previewSubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  modalActions: {
    padding: spacing.therapy.lg,
    paddingTop: 0,
  },
  modalApplyButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    ...shadows.md,
  },
  modalApplyGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalApplyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
});

export default BreathingScreen;