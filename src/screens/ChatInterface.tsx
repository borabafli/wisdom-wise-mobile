import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Send, Mic, ChevronLeft, MicOff, Sparkles, Heart, User, AlertCircle, Volume2, VolumeX, Pause, Play, Square, Check, X } from 'lucide-react-native';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

// Import our new services
import { storageService, Message } from '../services/storageService';
import { contextService } from '../services/contextService';
import { apiService } from '../services/apiService';
import { rateLimitService } from '../services/rateLimitService';
import { ttsService } from '../services/ttsService';
import { sttService } from '../services/sttService';
import { API_CONFIG } from '../config/constants';

// Import separated styles
import { chatInterfaceStyles as styles } from '../styles/components/ChatInterface.styles';
import { colors } from '../styles/tokens';


// Message interface moved to storageService

interface Exercise {
  type: string;
  name: string;
  duration: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface ChatInterfaceProps {
  onBack: () => void;
  currentExercise?: Exercise;
  startWithActionPalette?: boolean;
  onActionSelect: (actionId: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onBack, 
  currentExercise, 
  startWithActionPalette, 
  onActionSelect 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rateLimitStatus, setRateLimitStatus] = useState({ used: 0, total: 50, percentage: 0, message: '' });
  const [ttsStatus, setTtsStatus] = useState<{ isSpeaking: boolean; isPaused: boolean; currentSpeechId: string | null }>({ isSpeaking: false, isPaused: false, currentSpeechId: null });
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [partialTranscript, setPartialTranscript] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  

  // Audio level state for real sound wave visualization with animation
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(5).fill(0.3));
  const waveAnimations = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0.3))
  ).current;


  const exerciseFlows: Record<string, any> = {
    mindfulness: {
      name: '🌸 Morning Mindfulness',
      color: 'blue',
      steps: [
        {
          title: 'Welcome to your mindfulness session',
          content: '**Let\'s start with some gentle breathing** 🌸\n\nFind a comfortable position and let\'s begin this peaceful journey together.',
          suggestions: ['Feeling calm 😌', 'A bit anxious 😰', 'Ready to relax 🌟', 'Just checking in 👋']
        },
        {
          title: 'Let\'s focus on your breath',
          content: '**Take a deep breath in... and slowly out** 🌊\n\nNotice how your body feels as you breathe. There\'s no rush, just gentle awareness.',
          suggestions: ['My breathing feels shallow 💭', 'I\'m feeling more relaxed 🕊️', 'Hard to focus 🌀', 'This feels nice ✨']
        },
        {
          title: 'Beautiful work!',
          content: '**You\'ve completed your mindfulness practice** 🙏\n\n**Well done!** You took time for yourself today. How does this peaceful moment feel?',
          suggestions: ['More centered 🎯', 'Peaceful 🌸', 'Grateful 🙏', 'Ready for my day ☀️']
        }
      ]
    },
    'stress-relief': {
      name: '🌿 Stress Relief',
      color: 'green',
      steps: [
        {
          title: 'Let\'s release that tension',
          content: '**Welcome to your stress relief session** 🌿\n\n**You\'re safe here.** Let\'s work together to ease that stress and find your calm.',
          suggestions: ['Work pressure 💼', 'Personal worries 💭', 'General anxiety 😤', 'Physical tension 🏃']
        },
        {
          title: 'Progressive relaxation',
          content: '**Let\'s relax your body step by step** 💆\n\nStart by **tensing your shoulders** for 5 seconds... now **release and feel the tension melt away**.',
          suggestions: ['More relaxed 😌', 'Still tense 😬', 'Feeling lighter ☁️', 'Need more time ⏰']
        },
        {
          title: 'You\'ve done amazing!',
          content: '**Stress relief complete** 🌟\n\n**You handled that beautifully!** Your body and mind deserve this care. Notice how different you feel now.',
          suggestions: ['Much calmer 🌊', 'Less tense 💆', 'More peaceful 🕊️', 'Proud of myself 💪']
        }
      ]
    },
    gratitude: {
      name: '✨ Gratitude Practice', 
      color: 'purple',
      steps: [
        {
          title: 'Let\'s celebrate the good',
          content: '**Welcome to gratitude practice** ✨\n\n**Every day has gifts,** even small ones. Let\'s discover what you\'re grateful for today.',
          suggestions: ['My health 💪', 'Family & friends 👨‍👩‍👧‍👦', 'A warm home 🏠', 'This moment ⭐']
        },
        {
          title: 'Feel that warmth',
          content: '**Beautiful choice** 🙏\n\n**Take a moment** to really feel that gratitude in your heart. Let that warm feeling spread through you.',
          suggestions: ['Warming my heart ❤️', 'Making me smile 😊', 'Feeling blessed 🌟', 'More positive 🌈']
        },
        {
          title: 'Gratitude completed',
          content: '**What a wonderful practice** 🌸\n\n**You\'ve filled your heart** with appreciation. Carry this grateful energy with you today.',
          suggestions: ['To notice the good 👀', 'Gratitude feels powerful 💫', 'I have much to appreciate 🙏', 'This made me happy 😊']
        }
      ]
    }
  };

  // Initialize services and load data
  useEffect(() => {
    initializeChatSession();
  }, [currentExercise]);


  const initializeChatSession = async () => {
    try {
      setIsLoading(true);
      
      // Initialize API service with key
      apiService.setApiKey(API_CONFIG.API_KEY);
      
      // Load rate limit status
      const rateLimitStatus = await rateLimitService.getRateLimitStatus();
      setRateLimitStatus(rateLimitStatus);
      
      // Handle exercise flow vs regular chat
      if (currentExercise && exerciseFlows[currentExercise.type]) {
        // Exercise flow - use existing logic
        const flow = exerciseFlows[currentExercise.type];
        const initialMessage: Message = {
          id: Date.now().toString(),
          type: 'exercise',
          title: flow.steps[0].title,
          content: flow.steps[0].content,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([initialMessage]);
        setSuggestions(flow.steps[0].suggestions);
        setExerciseStep(0);
      } else {
        // Regular chat - load from storage or create welcome
        await loadOrCreateChatSession();
      }
    } catch (error) {
      console.error('Error initializing chat session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrCreateChatSession = async () => {
    try {
      // Always start with a fresh session - don't load existing messages
      // This ensures each chat starts clean after ending previous sessions
      await storageService.clearCurrentSession();
      
      // Create new conversation with welcome message
      const welcomeMessage = contextService.createWelcomeMessage();
      setMessages([welcomeMessage]);
      setSuggestions(['Feeling good today 😊', 'A bit stressed 😰', 'Need support 🤗', 'Just checking in 👋']);
      
      // Save welcome message to storage
      await storageService.addMessage(welcomeMessage);
    } catch (error) {
      console.error('Error creating fresh chat session:', error);
      // Fallback to local welcome message
      const welcomeMessage = contextService.createWelcomeMessage();
      setMessages([welcomeMessage]);
      setSuggestions(['Feeling good today 😊', 'A bit stressed 😰', 'Need support 🤗', 'Just checking in 👋']);
    }
  };

  // Handle session end with confirmation
  const handleEndSession = () => {
    console.log('handleEndSession called, messages length:', messages.length);
    
    // Check if we have any user messages (real conversation)
    const userMessages = messages.filter(msg => msg.type === 'user');
    console.log('User messages count:', userMessages.length);
    
    if (userMessages.length > 0) {
      console.log('Showing save dialog');
      Alert.alert(
        "End Session?",
        "Would you like to save this conversation to your history?",
        [
          {
            text: "Don't Save",
            style: "destructive",
            onPress: () => {
              console.log('User chose: Don\'t Save');
              storageService.clearCurrentSession()
                .catch(err => console.error('Clear session error:', err))
                .finally(() => {
                  console.log('Calling onBack()');
                  onBack();
                });
            }
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => console.log('User chose: Cancel')
          },
          {
            text: "Save & End",
            style: "default", 
            onPress: () => {
              console.log('User chose: Save & End');
              saveSessionToHistory()
                .then(() => storageService.clearCurrentSession())
                .catch(err => console.error('Save/clear error:', err))
                .finally(() => {
                  console.log('Calling onBack() after save');
                  onBack();
                });
            }
          }
        ],
        { cancelable: false } // Prevent dismissing by tapping outside
      );
    } else {
      console.log('No user messages, going back directly');
      onBack();
    }
  };

  // Save current session to history
  const saveSessionToHistory = async () => {
    try {
      await storageService.saveToHistory();
    } catch (error) {
      console.error('Error saving session to history:', error);
    }
  };

  // TTS Control Functions
  const handlePlayTTS = async (messageId: string, text: string) => {
    try {
      // Stop any current speech
      await ttsService.stop();
      
      // Start speaking with turtle voice settings
      const speechId = await ttsService.speak(text, ttsService.getTurtleVoiceSettings());
      
      if (speechId) {
        setPlayingMessageId(messageId);
        setTtsStatus({ isSpeaking: true, isPaused: false, currentSpeechId: speechId });
      }
    } catch (error) {
      console.error('Error starting TTS:', error);
    }
  };

  const handleStopTTS = async () => {
    try {
      await ttsService.stop();
      setPlayingMessageId(null);
      setTtsStatus({ isSpeaking: false, isPaused: false, currentSpeechId: null });
    } catch (error) {
      console.error('Error stopping TTS:', error);
    }
  };

  // Update TTS status periodically
  useEffect(() => {
    const updateTTSStatus = () => {
      const status = ttsService.getStatus();
      setTtsStatus(status);
      
      // Clear playing message if speech stopped
      if (!status.isSpeaking && playingMessageId) {
        setPlayingMessageId(null);
      }
    };

    const interval = setInterval(updateTTSStatus, 500); // Check every 500ms
    return () => clearInterval(interval);
  }, [playingMessageId]);

  const handleSend = async (text = inputText) => {
    if (!text.trim()) return;

    // Clear any previous API errors

    // Create user message
    const userMessage: Message = {
      id: (Date.now() + Math.random()).toString(),
      type: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message to UI and storage
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    try {
      await storageService.addMessage(userMessage);
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    // Handle exercise flow progression
    if (currentExercise && exerciseFlows[currentExercise.type]) {
      const flow = exerciseFlows[currentExercise.type];
      if (exerciseStep < flow.steps.length - 1) {
        const nextStep = exerciseStep + 1;
        setTimeout(async () => {
          const nextMessage: Message = {
            id: (Date.now() + Math.random()).toString(),
            type: 'exercise',
            title: flow.steps[nextStep].title,
            content: flow.steps[nextStep].content,
            exerciseType: currentExercise.type,
            color: flow.color,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, nextMessage]);
          setSuggestions(flow.steps[nextStep].suggestions);
          setExerciseStep(nextStep);
          
          // Save exercise message
          try {
            await storageService.addMessage(nextMessage);
          } catch (error) {
            console.error('Error saving exercise message:', error);
          }
        }, 1500);
      }
      return;
    }

    // Regular AI chat - check rate limit first
    try {
      const rateLimit = await rateLimitService.canMakeRequest();
      
      if (rateLimit.isLimitReached) {
        const limitMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'system',
          content: rateLimitService.getRateLimitMessage(rateLimit),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, limitMessage]);
        await storageService.addMessage(limitMessage);
        return;
      }

      // Show typing indicator
      setIsTyping(true);

      // Get conversation context
      const recentMessages = await storageService.getLastMessages(20); // Get more for context
      const context = contextService.assembleContext(recentMessages);

      // Make API call
      const response = await apiService.getChatCompletionWithContext(context);

      setIsTyping(false);

      if (response.success && response.message) {
        // Record successful request for rate limiting
        await rateLimitService.recordRequest();
        
        // Update rate limit status
        const newRateLimitStatus = await rateLimitService.getRateLimitStatus();
        setRateLimitStatus(newRateLimitStatus);

        // Create AI response message
        const aiResponse: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'system',
          content: response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Add to UI and storage
        setMessages(prev => [...prev, aiResponse]);
        await storageService.addMessage(aiResponse);

        // Auto-play TTS if enabled
        await ttsService.speakIfAutoPlay(response.message);

        // Update suggestions based on conversation
        setSuggestions(contextService.generateSuggestions([...recentMessages, userMessage, aiResponse]));
      } else {
        // API error - show fallback response
        const fallbackContent = response.error || 'I\'m having trouble connecting right now. Please try again in a moment.';
        const fallbackMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'system',
          content: apiService.getFallbackResponse(text),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, fallbackMessage]);
        await storageService.addMessage(fallbackMessage);
        // Log API error instead of showing in UI
        console.error('API Error:', response.error || 'Connection failed');
      }
    } catch (error) {
      setIsTyping(false);
      console.error('Error in handleSend:', error);
      
      // Show fallback response for any unexpected errors
      const fallbackMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'system',
        content: apiService.getFallbackResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, fallbackMessage]);
      try {
        await storageService.addMessage(fallbackMessage);
      } catch (storageError) {
        console.error('Error saving fallback message:', error);
      }
      console.error('Unexpected error occurred');
    }
  };

  const handleMicToggle = async () => {
    console.log('=== MIC BUTTON CLICKED ===');
    console.log('Current recording state:', isRecording);
    console.log('STT supported:', sttService.isSupported());
    
    try {
      if (isRecording) {
        console.log('Stopping recording...');
        await stopRecording();
      } else {
        console.log('Starting recording...');
        await startRecording();
      }
    } catch (error) {
      console.error('Error in handleMicToggle:', error);
      Alert.alert('Microphone Error', `Failed to toggle microphone: ${error.message}`);
    }
  };

  const startRecording = async () => {
    console.log('startRecording called');
    console.log('STT service supported:', sttService.isSupported());
    
    if (!sttService.isSupported()) {
      console.log('STT not supported, showing alert');
      Alert.alert(
        'Not Supported',
        'Speech recognition is not supported on this device. Please type your message instead.',
        [{ text: 'OK' }]
      );
      return;
    }


    console.log('Starting STT recording...');

    setSttError(null);
    setPartialTranscript('');
    
    const success = await sttService.startRecognition(
      // On result
      (result) => {
        if (result.isFinal) {

          // Final result - just update the input text, don't stop recording
          setInputText(prev => prev + result.transcript);
          setPartialTranscript('');
        } else {
          // Partial result - don't show as preview (removed blue text)

          setPartialTranscript(result.transcript);
        }
      },
      // On error
      (error) => {
        setSttError(error);
        setIsRecording(false);
        setIsListening(false);
        setPartialTranscript('');
        
        Alert.alert('Speech Recognition Error', error, [{ text: 'OK' }]);
      },

      // On end - only update UI when recording truly ends (not restarts)
      () => {
        console.log('STT service ended - checking if should update UI');
        // Only update UI if we're not in continuous recording mode
        // The service will handle restarts internally
        if (!isRecording) {
          console.log('Updating UI - recording ended');
          setIsListening(false);
          setPartialTranscript('');
          resetSoundWaves();
        }
      },
      // On audio level - real-time sound wave data
      (level, frequencyData) => {
        updateSoundWaves(level, frequencyData);

      }
    );

    if (success) {
      setIsRecording(true);
      setIsListening(true);

    }
  };

  // Update sound waves based on real frequency spectrum data
  const updateSoundWaves = (audioLevel: number, frequencyData?: number[]) => {
    if (frequencyData && frequencyData.length >= 5) {
      // Use real frequency data for each bar - animate smoothly to new values
      frequencyData.forEach((level, index) => {
        const targetHeight = Math.max(0.3, Math.min(1, level));
        
        // Animate to the new frequency level with smooth transition
        Animated.timing(waveAnimations[index], {
          toValue: targetHeight,
          duration: 80, // Fast response for real-time feel
          useNativeDriver: false,
        }).start();
      });
      
      // Also update state for immediate rendering (fallback)
      setAudioLevels(frequencyData.map(level => Math.max(0.3, Math.min(1, level))));
    } else {
      // Fallback to single level distributed across bars with animation
      const baseLevel = Math.max(0.3, Math.min(1, audioLevel));
      const newLevels = Array.from({ length: 5 }, (_, i) => {
        // Create dynamic variation for organic feel
        const timeOffset = Date.now() / 200 + i;
        const variation = Math.sin(timeOffset) * 0.15 + (Math.random() - 0.5) * 0.1;
        return Math.max(0.3, Math.min(1, baseLevel + variation));
      });
      
      // Animate all bars
      newLevels.forEach((targetLevel, index) => {
        Animated.timing(waveAnimations[index], {
          toValue: targetLevel,
          duration: 80,
          useNativeDriver: false,
        }).start();
      });
      
      setAudioLevels(newLevels);
    }
  };

  const resetSoundWaves = () => {
    // Reset all animations to baseline
    waveAnimations.forEach(anim => {
      Animated.timing(anim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
    
    setAudioLevels(Array(5).fill(0.3));
  };

  const stopRecording = async () => {
    await sttService.stopRecognition();
    setIsRecording(false);
    setIsListening(false);
    setPartialTranscript('');
    resetSoundWaves();
  };

  const cancelRecording = async () => {
    console.log('Cancelling recording...');
    try {
      // Cancel the STT service without processing results
      await sttService.cancelRecognition();
      setIsRecording(false);
      setIsListening(false);
      setPartialTranscript('');
      setSttError(null);
      resetSoundWaves();
      console.log('Recording cancelled successfully');
    } catch (error) {
      console.error('Error cancelling recording:', error);
      setSttError('Failed to cancel recording');

    }
  };

  const formatMessageContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\n/g, '\n');
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'user') {
      return (
        <View key={message.id} style={styles.userMessageContainer}>
          <View style={styles.userMessageWrapper}>
            <LinearGradient
              colors={colors.gradients.messageUser}
              style={styles.userMessageBubble}
            >
              <Text style={styles.userMessageText}>
                {message.text}
              </Text>
            </LinearGradient>
          </View>
        </View>
      );
    }

    return (
      <View key={message.id} style={styles.systemMessageContainer}>
        <View style={styles.systemMessageBubble}>
          <View style={styles.systemMessageContent}>
            <View style={styles.turtleAvatarContainer}>
              <Image 
                source={require('../../assets/images/turtle9.png')}
                style={styles.turtleAvatar}
                contentFit="cover"
              />
            </View>
            
            <View style={styles.systemMessageTextContainer}>
              <Text style={styles.systemMessageText}>
                {formatMessageContent(message.content || message.text || 'Hello! I\'m here to listen and support you. 🌸')}
              </Text>
              
              {/* TTS Controls */}
              <View style={styles.ttsControls}>
                {playingMessageId === message.id && ttsStatus.isSpeaking ? (
                  <TouchableOpacity
                    onPress={handleStopTTS}
                    style={[styles.ttsButton, styles.ttsButtonActive]}
                    activeOpacity={0.7}
                  >
                    <VolumeX size={16} color="#ef4444" />
                    <Text style={[styles.ttsButtonText, { color: '#ef4444' }]}>Stop</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handlePlayTTS(message.id, message.content || message.text || '')}
                    style={styles.ttsButton}
                    activeOpacity={0.7}
                  >
                    <Volume2 size={16} color="#3b82f6" />
                    <Text style={styles.ttsButtonText}>Listen</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colors.gradients.primaryLight}
        style={styles.backgroundGradient}
      />
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                onPress={() => {

                  if (Platform.OS === 'web') {
                    // For web, directly call the back handler without confirmation
                    handleEndSession();
                  } else {
                    // Show confirmation dialog before ending session for mobile
                    Alert.alert(
                      'End Session?',
                      'Are you sure you want to end this session? Your conversation will be saved to your chat history.',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'End Session',
                          style: 'destructive',
                          onPress: async () => {
                            console.log('User confirmed session end');
                            try {
                              // Save current session to history if there are messages
                              if (messages.length > 0) {
                                await storageService.saveToHistory();
                                console.log('Session saved to history');
                              }
                              
                              // Clear current session
                              await storageService.clearCurrentSession();
                              console.log('Current session cleared');
                              
                              onBack();
                              console.log('Session ended successfully');
                            } catch (err) {
                              const message = err instanceof Error ? err.message : String(err);
                              console.error('Error ending session:', err);
                              Alert.alert('Error', `Failed to end session: ${message}`);
                            }
                          },
                        },
                      ],
                      { cancelable: true }
                    );
                  }
                }}
                style={styles.backButton}

                activeOpacity={0.7}
              >
                <ChevronLeft size={20} color="#475569" />
              </TouchableOpacity>
              <View style={styles.headerInfo}>
                {!currentExercise && (
                  <LinearGradient
                    colors={['rgba(52, 211, 153, 0.2)', 'rgba(20, 184, 166, 0.2)']}
                    style={styles.sessionIcon}
                  >
                    <Heart size={20} color="#059669" />
                  </LinearGradient>
                )}
                <View style={styles.sessionDetails}>
                  <Text style={styles.sessionTitle}>
                    {currentExercise && exerciseFlows[currentExercise.type] 
                      ? exerciseFlows[currentExercise.type].name 
                      : '🌸 Gentle Session'
                    }
                  </Text>
                  <Text style={styles.sessionSubtitle}>
                    {currentExercise && exerciseFlows[currentExercise.type] ? (
                      `${currentExercise.duration || '5 min'} • Step ${exerciseStep + 1} of ${exerciseFlows[currentExercise.type].steps.length}`
                    ) : (
                      isLoading ? 'Loading your gentle space...' :
                      // Don't show API errors in header, just show friendly message
                      (rateLimitStatus.message || `${Math.max(0, (rateLimitStatus.total || 0) - (rateLimitStatus.used || 0))} messages remaining today`)
                    )}
                  </Text>
                  
                  {/* Rate limit warning */}
                  {!currentExercise && typeof rateLimitStatus?.percentage === 'number' && rateLimitStatus.percentage >= 80 && (
                    <View style={styles.warningContainer}>
                      <AlertCircle size={14} color="#f59e0b" />
                      <Text style={styles.warningText}>
                        {rateLimitStatus.percentage >= 90 
                          ? `Almost at daily limit! ${Math.max(0, (rateLimitStatus.total || 0) - (rateLimitStatus.used || 0))} left.`
                          : `${rateLimitStatus.percentage}% of daily limit used.`
                        }
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Messages Area */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesArea}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={true}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
          
          {/* Typing Indicator */}
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <View style={styles.typingContent}>
                  <LinearGradient
                    colors={colors.gradients.messageUser}
                    style={styles.typingAvatar}
                  >
                    <User size={16} color="white" />
                  </LinearGradient>
                  <View style={styles.typingTextContainer}>
                    <View style={styles.typingDots}>
                      <View style={styles.typingDot} />
                      <View style={styles.typingDot} />
                      <View style={styles.typingDot} />
                    </View>
                    <Text style={styles.typingText}>Your therapist is reflecting...</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Suggestion Chips */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsScroll}
            >
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSend(suggestion)}
                  style={styles.suggestionChip}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestionText}>
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputPrompt}>
                Tell me about a moment today that brought you peace 🌸
              </Text>
              
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={isRecording ? "Listening... speak now" : "Share what's on your mind..."}
                placeholderTextColor="#94a3b8"
                multiline
                style={[styles.textInput, { textAlignVertical: 'top' }]}
                editable={!isRecording}
                allowFontScaling={false}
                selectionColor="#3b82f6"
              />
              

            </View>
            
            <View style={styles.inputActions}>
              <View style={styles.actionsRow}>
                {!isRecording ? (
                  <TouchableOpacity 
                    onPress={handleMicToggle}
                    style={styles.micButtonBeautiful}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={colors.gradients.micButton}
                      style={styles.micButtonGradient}
                    >
                      <Mic size={24} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.recordingControls}>

                    {/* Cancel Button (X) */}
                    <TouchableOpacity 
                      onPress={cancelRecording}
                      style={styles.minimalActionButton}
                      activeOpacity={0.6}
                    >
                      <X size={18} color={colors.text.tertiary} />

                    </TouchableOpacity>
                  </View>
                )}
                
                <View style={styles.centerActions}>
                  {isRecording && (

                    <View style={styles.modernSoundWave}>
                      {waveAnimations.map((anim, i) => (
                        <Animated.View 

                          key={i}
                          style={[
                            styles.modernWaveBar,
                            {
                              height: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [4, 40], // Wider range for more dramatic effect
                              }),
                              opacity: anim.interpolate({
                                inputRange: [0.2, 1],
                                outputRange: [0.4, 1],
                                extrapolate: 'clamp',
                              }),
                            }
                          ]}
                        />
                      ))}
                    </View>
                  )}
                  
                  <Text style={styles.actionText}>

                    {isRecording ? 'Listening... Tap ✓ when done' : 

                     sttService.isSupported() ? 'Share through voice or text' : 
                     'Share your thoughts through text'}
                  </Text>
                </View>
                
                {isRecording ? (
                  <TouchableOpacity 
                    onPress={stopRecording}
                    style={styles.minimalActionButton}
                    activeOpacity={0.6}
                  >
                    <Check size={18} color={colors.primary[400]} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleSend()}
                    disabled={!inputText.trim()}
                    style={[
                      styles.sendButton,
                      inputText.trim() ? styles.sendButtonActive : styles.sendButtonDisabled
                    ]}
                    activeOpacity={0.8}
                  >
                    <Send 
                      size={20} 
                      color={inputText.trim() ? 'white' : '#94a3b8'} 
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatInterface;