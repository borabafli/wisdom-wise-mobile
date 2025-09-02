import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, Animated, ImageBackground } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';
import { ChevronLeft, AlertCircle, Brain, Wind, Eye, BookOpen, Heart, Star } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Import new components and hooks
import { 
  MessageItem, 
  AnimatedTypingCursor, 
  SuggestionChips, 
  ChatInput, 
  ExerciseCard 
} from '../components/chat';
import { 
  useTypewriterAnimation, 
  useVoiceRecording, 
  useChatSession,
  useTTSControls
} from '../hooks/chat';
import { useExerciseFlow } from '../hooks';

// Import services and utilities (keeping existing ones)
import { storageService, Message } from '../services/storageService';
import { contextService } from '../services/contextService';
import { apiService } from '../services/apiService';
import { rateLimitService } from '../services/rateLimitService';
import { ttsService } from '../services/ttsService';
import { sttService } from '../services/sttService';
import { insightService } from '../services/insightService';
import { API_CONFIG } from '../config/constants';
import { exerciseLibraryData, getExerciseFlow } from '../data/exerciseLibrary';

// Import separated styles
import { chatInterfaceStyles as styles } from '../styles/components/ChatInterface.styles';
import { colors } from '../styles/tokens';

// Import types
import { Exercise, ChatInterfaceProps } from '../types';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onBack, 
  currentExercise, 
  startWithActionPalette, 
  onActionSelect,
  onExerciseClick
}) => {
  const [fontsLoaded] = useFonts({
    Caveat_400Regular,
  });

  // Basic state
  const [inputText, setInputText] = useState('');
  
  // Animation refs
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // === DEBUGGING: Add logs to confirm props are received ===
  useEffect(() => {
    console.log('DEBUG: ChatInterface received props:');
    console.log('onExerciseClick is a function:', typeof onExerciseClick === 'function');
    console.log('onActionSelect is a function:', typeof onActionSelect === 'function');
  }, [onExerciseClick, onActionSelect]);
  // =========================================================

  // Dynamic exercise flow generation - no hardcoded flows
  // Determine when to show exercise suggestion button
  const shouldShowExerciseButton = () => {
    // Show button after a few message exchanges and when not already showing an exercise card or in exercise mode
    const userMessages = chatSession.messages.filter(msg => msg.type === 'user');
    const isInExerciseMode = chatSession.currentExerciseStep && chatSession.exerciseFlow;
    return userMessages.length >= 2 && !chatSession.showExerciseCard && !isInExerciseMode;
  };

  // Use centralized exercise flow from exerciseLibrary.ts
  // Removed local getExerciseFlow function - now using centralized version

  // Custom hooks
  const chatSession = useChatSession(currentExercise);
  const ttsControls = useTTSControls();
  const typewriterAnimation = useTypewriterAnimation(
    chatSession.setMessages,
    scrollViewRef
  );
  const voiceRecording = useVoiceRecording((transcript: string) => {
    setInputText(prev => prev + transcript);
  });
  const {
    exerciseMode,
    exerciseStep, 
    exerciseData,
    startDynamicAIGuidedExercise,
    handleDynamicAIGuidedExerciseResponse,
    enterExerciseMode,
    exitExerciseMode,
    extractSuggestionsFromResponse
  } = useExerciseFlow();

  // Track initialization to prevent multiple calls
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on mount
  useEffect(() => {
    if (isInitialized) return; // Prevent multiple initializations
    
    // Check if this is an exercise that needs special handling
    if (currentExercise) {
      console.log('Starting dynamic AI-guided exercise:', currentExercise.type);
      enterExerciseMode();
      startDynamicAIGuidedExercise(
        currentExercise,
        chatSession.setMessages,
        chatSession.setIsTyping,
        chatSession.setSuggestions
      );
      setIsInitialized(true);
      return;
    }
    
    // Regular chat session
    chatSession.initializeChatSession();
    setIsInitialized(true);
  }, [currentExercise]); // Simplified dependencies


  // Handle input text changes
  const handleInputTextChange = (text: string) => {
    setInputText(text);
  };

  // Handle sending messages
  const handleSend = async (text = inputText) => {
    if (!text.trim()) return;

    // Clear input
    setInputText('');

    // Check if we're in exercise mode (from exerciseFlow)
    if (exerciseMode && exerciseData.dynamicFlow) {
      // Exercise mode: use exercise-specific message handler
      await handleDynamicAIGuidedExerciseResponse(
        text, 
        exerciseData.dynamicFlow, 
        currentExercise,
        chatSession.setMessages,
        chatSession.setIsTyping,
        chatSession.setSuggestions,
        addAIMessageWithTypewriter
      );
      return;
    }
    
    // Regular chat session
    await chatSession.handleSendMessage(text);
  };


  // Handle message actions
  const handleCopyMessage = async (content: string) => {
    try {
      await Clipboard.setStringAsync(content);
    } catch (error) {
      console.error('Error copying message:', error);
    }
  };

  const handlePromptSuggestion = (text: string) => {
    setInputText(text);
    // Automatically send the message
    handleSend(text);
  };

  // Handle exercise card actions - same behavior as exercise library
  const handleExerciseCardStart = (exerciseInfo: any) => {
    console.log('=== EXERCISE CARD CLICKED FROM CHAT ===');
    console.log('Exercise info:', exerciseInfo);
    
    // Clear the exercise card first
    chatSession.setShowExerciseCard(null);
    
    // Use EXACTLY the same flow as library - go through app state
    if (onExerciseClick) {
      console.log('DEBUG: onExerciseClick is valid, attempting to navigate...');
      onExerciseClick(exerciseInfo);
    } else {
      console.error('onExerciseClick not available - this is the source of the problem!');
    }
  };


  // Helper function to add AI messages with typewriter animation
  const addAIMessageWithTypewriter = async (message: Message) => {
    const fullText = message.content || message.text || '';
    
    // Add message to UI immediately with empty content
    const messageWithEmptyContent = {
      ...message,
      content: '',
      text: ''
    };
    
    chatSession.setMessages((prev: Message[]) => [...prev, messageWithEmptyContent]);
    
    // Start typewriter animation
    typewriterAnimation.startTypewriterAnimation(messageWithEmptyContent, fullText);
    
    // Save to storage with full content
    await storageService.addMessage(message);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Smooth transitions for exercise mode (keeping local for animations)
  const startExerciseAnimations = () => {
    Animated.timing(backgroundAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
    
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const stopExerciseAnimations = () => {
    Animated.timing(backgroundAnimation, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
    
    Animated.timing(headerAnimation, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  // Update animations when exercise mode changes
  React.useEffect(() => {
    const isInExerciseMode = chatSession.currentExerciseStep && chatSession.exerciseFlow;
    if (isInExerciseMode) {
      startExerciseAnimations();
    } else {
      stopExerciseAnimations();
    }
  }, [chatSession.currentExerciseStep, chatSession.exerciseFlow]);

  // Define animated background gradients
  const normalGradient = [...colors.gradients.primaryLight];
  const exerciseGradient = ['#f0fdf4', '#ecfdf5', '#d1fae5'];

  // Render messages using the new MessageItem component
  const renderMessage = (message: Message) => (
    <MessageItem
      key={message.id}
      message={message}
      isTypewriting={typewriterAnimation.isTypewriting}
      currentTypewriterMessage={typewriterAnimation.currentTypewriterMessage}
      typewriterText={typewriterAnimation.typewriterText}
      playingMessageId={ttsControls.playingMessageId}
      ttsStatus={ttsControls.ttsStatus}
      onSkipTypewriter={typewriterAnimation.skipTypewriterAnimation}
      onPlayTTS={ttsControls.handlePlayTTS}
      onStopTTS={ttsControls.handleStopTTS}
      onCopyMessage={handleCopyMessage}
      onPromptSuggestion={handlePromptSuggestion}
      AnimatedTypingCursor={() => <AnimatedTypingCursor isActive={typewriterAnimation.isTypewriting} />}
    />
  );

  return (
    <SafeAreaWrapper style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background1.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(255, 253, 232, 0.7)', 'rgba(187, 242, 255, 0.7)']} // Gradient from #FFFDE8 to #BBF2FF with transparency
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundOverlay}
        />
        <View style={styles.backgroundGradient}>
          <Animated.View style={[
            styles.backgroundGradient,
            {
              opacity: backgroundAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }
          ]}>
            <LinearGradient
              colors={normalGradient as any}
              style={styles.backgroundGradient}
            />
          </Animated.View>
          <Animated.View style={[
            styles.backgroundGradient,
            {
              opacity: backgroundAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            }
          ]}>
            <LinearGradient
              colors={exerciseGradient as any}
              style={styles.backgroundGradient}
            />
          </Animated.View>
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardView} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
        >
          {/* Header */}
          <Animated.View style={[
            styles.header,
            {
              backgroundColor: headerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(255, 255, 255, 0)', 'rgba(248, 250, 252, 0.85)'],
              }),
            }
          ]}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <TouchableOpacity 
                  onPress={() => chatSession.handleEndSession(onBack)}
                  style={styles.backButton}
                  activeOpacity={0.7}
                >
                  <ChevronLeft size={20} color="#475569" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                  <View style={styles.sessionDetails}>
                    <Text style={[
                      styles.sessionTitle,
                      currentExercise && styles.exerciseTitle
                    ]}>
                      {currentExercise ? (
                        exerciseMode && exerciseData.dynamicFlow ? (
                          exerciseData.dynamicFlow.name || currentExercise.name
                        ) : (
                          currentExercise.name
                        )
                      ) : (
                        '💭 Reflection Space'
                      )}
                    </Text>
                    <Text style={styles.sessionSubtitle}>
                      {currentExercise && exerciseMode ? (
                        exerciseData.dynamicFlow ? (
                          `Step ${exerciseStep + 1} of ${exerciseData.dynamicFlow.steps.length} • ${exerciseData.dynamicFlow.steps[exerciseStep]?.title || 'In Progress'}`
                        ) : (
                          `Step ${exerciseStep + 1} • Exercise Starting...`
                        )
                      ) : currentExercise ? (
                        `${currentExercise.duration || '5 min'} • Therapeutic Exercise`
                      ) : (
                        chatSession.isLoading ? 'Loading your gentle space...' : 'Your safe space for reflection'
                      )}
                    </Text>
                    
                    {/* Rate limit warning */}
                    {!currentExercise && typeof chatSession.rateLimitStatus?.percentage === 'number' && chatSession.rateLimitStatus.percentage >= 80 && (
                      <View style={styles.warningContainer}>
                        <AlertCircle size={14} color="#f59e0b" />
                        <Text style={styles.warningText}>
                          {chatSession.rateLimitStatus.percentage >= 90 
                            ? `Almost at daily limit! ${Math.max(0, (chatSession.rateLimitStatus.total || 0) - (chatSession.rateLimitStatus.used || 0))} left.`
                            : `${chatSession.rateLimitStatus.percentage}% of daily limit used.`
                          }
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

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
            {chatSession.messages.map(renderMessage)}
            
            {/* Exercise Suggestion Card */}
            {console.log('🔍 Render check - showExerciseCard:', chatSession.showExerciseCard)}
            {chatSession.showExerciseCard && (
              <ExerciseCard
                exercise={chatSession.showExerciseCard}
                onStart={handleExerciseCardStart}
                onDismiss={() => chatSession.setShowExerciseCard(null)}
              />
            )}
            
            {/* DEBUG TEST BUTTONS */}
            <View style={{padding: 10, gap: 5}}>
              <View style={{flexDirection: 'row', gap: 5}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#4CAF50',
                    padding: 8,
                    borderRadius: 5,
                    flex: 1
                  }}
                  onPress={() => {
                    console.log('🧪 TEST: Manual exercise card trigger');
                    const testExercise = exerciseLibraryData['breathing'];
                    chatSession.setShowExerciseCard(testExercise);
                  }}
                >
                  <Text style={{color: 'white', fontSize: 10, textAlign: 'center'}}>🧪 Card</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    backgroundColor: '#2196F3',
                    padding: 8,
                    borderRadius: 5,
                    flex: 2
                  }}
                  onPress={() => {
                    console.log('🧪 TEST: Sending stress message to AI');
                    handleSend("I'm feeling really anxious and overwhelmed. I have negative thoughts racing through my mind and I need help.");
                  }}
                >
                  <Text style={{color: 'white', fontSize: 10, textAlign: 'center'}}>🧪 AI Stress Test</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={{
                  backgroundColor: '#FF9800',
                  padding: 8,
                  borderRadius: 5
                }}
                onPress={() => {
                  console.log('🧪 TEST: Sending exercise confirmation');
                  handleSend("Yes, let's try it! I want to do the exercise.");
                }}
              >
                <Text style={{color: 'white', fontSize: 10, textAlign: 'center'}}>🧪 Confirm Exercise ("Yes, let's try it!")</Text>
              </TouchableOpacity>
            </View>
            
            {/* Typing Indicator */}
            {chatSession.isTyping && (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <View style={styles.typingContent}>
                    <View style={styles.typingAvatar}>
                      <Image 
                        source={require('../../assets/images/turtle-simple-3a.png')}
                        style={styles.typingTurtleAvatar}
                        contentFit="cover"
                      />
                    </View>
                    <View style={styles.typingTextContainer}>
                      <View style={styles.typingDots}>
                        <View style={styles.typingDot} />
                        <View style={styles.typingDot} />
                        <View style={styles.typingDot} />
                      </View>
                      <Text style={styles.typingText}>Anu is reflecting...</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Suggestion Chips */}
          <SuggestionChips
            suggestions={chatSession.suggestions}
            onSuggestionPress={handleSend}
            onSuggestExercise={() => {
              if (onExerciseClick) {
                const breathingExercise = exerciseLibraryData['breathing'];
                onExerciseClick(breathingExercise);
              }
            }}
            onActionSelect={() => {
              if (onActionSelect) {
                onActionSelect('guided-session');
              }
            }}
            showExerciseButton={shouldShowExerciseButton()}
            isVisible={chatSession.suggestions.length > 0 || shouldShowExerciseButton()}
            isTyping={chatSession.isTyping}
          />

          {/* Input Area */}
          <ChatInput
            inputText={inputText}
            onInputTextChange={handleInputTextChange}
            onSend={handleSend}
            isRecording={voiceRecording.isRecording}
            audioLevels={voiceRecording.audioLevels}
            onMicToggle={async () => {
              if (voiceRecording.isRecording) {
                await voiceRecording.stopRecording();
              } else {
                await voiceRecording.startRecording();
              }
            }}
            onStopRecording={voiceRecording.stopRecording}
            onCancelRecording={voiceRecording.cancelRecording}
          />
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaWrapper>
  );
};

export default ChatInterface;
