import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Mic, ChevronLeft, MicOff, Sparkles, Heart, User, AlertCircle, Volume2, VolumeX, Pause, Play, Square } from 'lucide-react-native';
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

const { width, height } = Dimensions.get('window');

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
  const [apiError, setApiError] = useState<string | null>(null);
  const [ttsStatus, setTtsStatus] = useState({ isSpeaking: false, isPaused: false, currentSpeechId: null });
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [partialTranscript, setPartialTranscript] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values for recording dots
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.7)).current;
  const dot3Anim = useRef(new Animated.Value(1)).current;

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
      apiService.setApiKey(API_CONFIG.OPENROUTER_API_KEY);
      
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
      setApiError('Failed to initialize chat session');
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
    setApiError(null);

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
      const response = await apiService.getChatCompletion(context);

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
        setApiError(response.error || 'Connection failed');
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
      setApiError('An unexpected error occurred');
    }
  };

  const handleMicToggle = async () => {
    if (isRecording) {
      // Stop recording
      await stopRecording();
    } else {
      // Start recording
      await startRecording();
    }
  };

  const startRecording = async () => {
    if (!sttService.isSupported()) {
      Alert.alert(
        'Not Supported',
        'Speech recognition is not supported on this device. Please type your message instead.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSttError(null);
    setPartialTranscript('');
    
    const success = await sttService.startRecognition(
      // On result
      (result) => {
        if (result.isFinal) {
          // Final result - add to input
          setInputText(prev => prev + result.transcript);
          setPartialTranscript('');
          setIsRecording(false);
          setIsListening(false);
        } else {
          // Partial result - show as preview
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
      // On end
      () => {
        setIsRecording(false);
        setIsListening(false);
        setPartialTranscript('');
      }
    );

    if (success) {
      setIsRecording(true);
      setIsListening(true);
    }
  };

  const stopRecording = async () => {
    await sttService.stopRecognition();
    setIsRecording(false);
    setIsListening(false);
    setPartialTranscript('');
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
              colors={['rgba(59, 130, 246, 0.9)', 'rgba(37, 99, 235, 0.9)']}
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
        <View style={styles.systemMessageWrapper}>
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
                  {formatMessageContent(message.content || message.text || '')}
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
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f0f9ff', '#e0f2fe']}
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
                  console.log('=== BACK BUTTON PRESSED ===');
                  console.log('Timestamp:', new Date().toISOString());
                  console.log('onBack function exists:', typeof onBack === 'function');
                  console.log('onBack function:', onBack.toString().substring(0, 200));
                  
                  try {
                    onBack(); // Just exit, no dialog for now
                    console.log('onBack called successfully');
                  } catch (error) {
                    console.error('Error calling onBack:', error);
                    Alert.alert('Error', `Back button error: ${error.message}`);
                  }
                }}
                style={[styles.backButton, { backgroundColor: 'rgba(255, 0, 0, 0.1)' }]}
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
                      apiError ? `Connection issues: ${apiError}` :
                      `${rateLimitStatus.requestsRemaining} messages remaining today`
                    )}
                  </Text>
                  
                  {/* Rate limit warning */}
                  {!currentExercise && rateLimitStatus.percentage >= 80 && (
                    <View style={styles.warningContainer}>
                      <AlertCircle size={14} color="#f59e0b" />
                      <Text style={styles.warningText}>
                        {rateLimitStatus.percentage >= 90 
                          ? `Almost at daily limit! ${rateLimitStatus.requestsRemaining} left.`
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
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
          
          {/* Typing Indicator */}
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <View style={styles.typingContent}>
                  <LinearGradient
                    colors={['rgba(59, 130, 246, 0.8)', 'rgba(37, 99, 235, 0.8)']}
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
              />
              
              {/* Show partial transcript inline */}
              {partialTranscript && (
                <Text style={styles.partialTranscriptOverlay}>
                  {partialTranscript}
                </Text>
              )}
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
                      colors={['#3b82f6', '#1d4ed8']}
                      style={styles.micButtonGradient}
                    >
                      <Mic size={24} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.recordingControls}>
                    <View style={styles.recordingIndicator}>
                      <View style={[styles.recordingDot, { opacity: 1 }]} />
                      <View style={[styles.recordingDot, { opacity: 0.7 }]} />
                      <View style={[styles.recordingDot, { opacity: 0.4 }]} />
                    </View>
                    <TouchableOpacity 
                      onPress={stopRecording}
                      style={styles.stopButtonBeautiful}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#ef4444', '#dc2626']}
                        style={styles.stopButtonGradient}
                      >
                        <Square size={20} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
                
                <View style={styles.centerActions}>
                  {isRecording && (
                    <View style={styles.listeningWaves}>
                      {[...Array(6)].map((_, i) => (
                        <View 
                          key={i}
                          style={[
                            styles.waveBar,
                            { height: 12 + (i % 3) * 4 }
                          ]}
                        />
                      ))}
                    </View>
                  )}
                  
                  <Text style={styles.actionText}>
                    {isRecording ? 'Listening... Tap mic to stop' : 
                     sttService.isSupported() ? 'Share through voice or text' : 
                     'Share your thoughts through text'}
                  </Text>
                </View>
                
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
              </View>
            </View>
          </View>
          
          {/* Listening Indicator */}
          {isListening && (
            <View style={styles.listeningIndicator}>
              <View style={styles.listeningBadge}>
                <Text style={styles.listeningBadgeText}>
                  Listening...
                </Text>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1e293b',
  },
  sessionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  warningText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
    flex: 1,
  },
  messagesArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  userMessageWrapper: {
    maxWidth: width * 0.75,
  },
  userMessageBubble: {
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: 'white',
  },
  systemMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
  systemMessageWrapper: {
    maxWidth: width * 0.85,
  },
  systemMessageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  systemMessageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  turtleAvatarContainer: {
    marginTop: 4,
  },
  turtleAvatar: {
    width: 48,
    height: 48,
  },
  systemMessageTextContainer: {
    flex: 1,
  },
  systemMessageText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  ttsControls: {
    alignItems: 'flex-start',
  },
  ttsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  ttsButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  ttsButtonText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  typingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  typingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  typingContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  typingTextContainer: {
    flex: 1,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  typingDot: {
    width: 10,
    height: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 5,
  },
  typingText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  suggestionsScroll: {
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  suggestionText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputHeader: {
    padding: 24,
  },
  inputPrompt: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 12,
  },
  textInput: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
    minHeight: 60,
    maxHeight: 120,
  },
  partialTranscriptOverlay: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    fontSize: 16,
    color: '#3b82f6',
    fontStyle: 'italic',
    opacity: 0.7,
    pointerEvents: 'none',
  },
  micButtonBeautiful: {
    borderRadius: 50,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  micButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  stopButtonBeautiful: {
    borderRadius: 50,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputActions: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(241, 245, 249, 0.6)',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  micButton: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  micButtonIdle: {
    backgroundColor: '#0ea5e9',
  },
  micButtonRecording: {
    backgroundColor: '#ef4444',
  },
  centerActions: {
    flex: 1,
    alignItems: 'center',
  },
  listeningWaves: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  waveBar: {
    width: 4,
    backgroundColor: '#fca5a5',
    borderRadius: 2,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  sendButton: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButtonActive: {
    backgroundColor: '#0ea5e9',
  },
  sendButtonDisabled: {
    backgroundColor: '#e2e8f0',
  },
  listeningIndicator: {
    position: 'absolute',
    top: 8,
    left: '50%',
    transform: [{ translateX: -50 }],
    zIndex: 30,
  },
  listeningBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  listeningBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
});

export default ChatInterface;