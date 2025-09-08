import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Animated, ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';
import { ChevronLeft, AlertCircle } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

// Import new components and hooks
import { 
  MessageItem, 
  AnimatedTypingCursor, 
  SuggestionChips, 
  ChatInput, 
  ExerciseCard 
} from '../components/chat';
import { MoodRatingCard } from '../components/chat/MoodRatingCard';
import { PreExerciseMoodCard } from '../components/chat/PreExerciseMoodCard';
import { ValueReflectionSummaryCard } from '../components/chat/ValueReflectionSummaryCard';
import { ThinkingPatternSummaryCard } from '../components/chat/ThinkingPatternSummaryCard';
import { VisionSummaryCard } from '../components/chat/VisionSummaryCard';
import TestButton from '../components/TestButton';
import { 
  useTypewriterAnimation, 
  useVoiceRecording, 
  useChatSession,
  useTTSControls
} from '../hooks/chat';
import { useExerciseFlow } from '../hooks';

// Import services and utilities
import { storageService, Message } from '../services/storageService';
import { exerciseLibraryData } from '../data/exerciseLibrary';

// Import styles
import { chatInterfaceStyles as styles } from '../styles/components/ChatInterface.styles';
import { colors } from '../styles/tokens';

// Import types
import { ChatInterfaceProps } from '../types';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onBack, 
  currentExercise, 
  onActionSelect,
  onExerciseClick
}) => {
  const [fontsLoaded] = useFonts({
    Caveat_400Regular,
  });

  const insets = useSafeAreaInsets();

  // Basic state
  const [inputText, setInputText] = useState('');
  const textBeforeVoiceRef = useRef(''); // Store text that was typed before voice recording
  
  // Animation refs
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const endReflectionButtonAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Custom hooks
  const chatSession = useChatSession(currentExercise);
  const ttsControls = useTTSControls();
  const typewriterAnimation = useTypewriterAnimation(
    chatSession.setMessages,
    scrollViewRef
  );
  const voiceRecording = useVoiceRecording((transcript: string) => {
    // For final results, append transcript to text that existed before recording
    // This prevents accumulation of partial results while preserving typed text
    const finalText = textBeforeVoiceRef.current + (textBeforeVoiceRef.current ? ' ' : '') + transcript;
    setInputText(finalText);
  });

  const {
    exerciseMode,
    exerciseStep, 
    exerciseData,
    showMoodRating,
    showPreExerciseMoodSlider,
    isValueReflection,
    isThinkingPatternReflection,
    showValueReflectionSummary,
    valueReflectionSummary,
    showThinkingPatternSummary,
    thinkingPatternSummary,
    showVisionSummary,
    visionSummary,
    reflectionMessageCount,
    canEndReflection,
    startDynamicAIGuidedExercise,
    handleDynamicAIGuidedExerciseResponse,
    startValueReflection,
    handleValueReflectionResponse,
    endValueReflection,
    saveValueReflectionSummary,
    cancelValueReflectionSummary,
    startThinkingPatternReflection,
    handleThinkingPatternReflectionResponse,
    endThinkingPatternReflection,
    saveThinkingPatternSummary,
    cancelThinkingPatternSummary,
    saveVisionSummary,
    cancelVisionSummary,
    handleMoodRatingComplete,
    handleMoodRatingSkip,
    handlePreExerciseMoodComplete,
    enterExerciseMode,
    exitExerciseMode,
  } = useExerciseFlow();

  // Track initialization
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on mount
  useEffect(() => {
    if (isInitialized) return;

    if (currentExercise) {
      console.log('Initializing chat with exercise:', currentExercise.type);
      
      if (currentExercise.type === 'value_reflection') {
        console.log('Starting value reflection with context:', currentExercise.context);
        startValueReflection(
          currentExercise.context,
          chatSession.setMessages,
          chatSession.setIsTyping,
          chatSession.setSuggestions
        );
      } else if (currentExercise.type === 'thinking_pattern_reflection') {
        console.log('Starting thinking pattern reflection with context:', currentExercise.context);
        startThinkingPatternReflection(
          currentExercise.context,
          chatSession.setMessages,
          chatSession.setIsTyping,
          chatSession.setSuggestions
        );
      } else {
        enterExerciseMode();
        startDynamicAIGuidedExercise(
          currentExercise,
          chatSession.setMessages,
          chatSession.setIsTyping,
          chatSession.setSuggestions
        );
      }
      
      setIsInitialized(true);
      return;
    }
    
    chatSession.initializeChatSession();
    setIsInitialized(true);
  }, [currentExercise]);

  // Handle input text changes
  const handleInputTextChange = (text: string) => {
    setInputText(text);
  };

  // Handle keyboard dismiss
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Handle sending messages
  const handleSend = async (text = inputText) => {
    if (!text.trim()) return;
    setInputText('');

    if (isValueReflection) {
      await handleValueReflectionResponse(
        text,
        chatSession.setMessages,
        chatSession.setIsTyping,
        chatSession.setSuggestions
      );
      return;
    }

    if (isThinkingPatternReflection) {
      await handleThinkingPatternReflectionResponse(
        text,
        chatSession.setMessages,
        chatSession.setIsTyping,
        chatSession.setSuggestions
      );
      return;
    }

    if (exerciseMode && exerciseData.dynamicFlow) {
      await handleDynamicAIGuidedExerciseResponse(
        text, 
        exerciseData.dynamicFlow, 
        exerciseData.currentExercise,   // ✅ use currentExercise from exerciseData
        chatSession.setMessages,
        chatSession.setIsTyping,
        chatSession.setSuggestions
      );
      return;
    }
    
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
    handleSend(text);
  };

    // Handle exercise card actions
    // Handle exercise card actions
const handleExerciseCardStart = (exerciseInfo: any) => {
  console.log("=== EXERCISE CARD CLICKED FROM CHAT ===", exerciseInfo);

  // Clear the card
  chatSession.setShowExerciseCard(null);

  // ✅ Start exercise inline (keep chat messages)
  startDynamicAIGuidedExercise(
    exerciseInfo,
    chatSession.setMessages,
    chatSession.setIsTyping,
    chatSession.setSuggestions
  );
};


    // Helper function to add AI messages with typewriter animation
    const addAIMessageWithTypewriter = async (message: Message) => {
      const fullText = message.content || message.text || '';
      const messageWithEmptyContent = { ...message, content: '', text: '' };
      
      chatSession.setMessages((prev: Message[]) => [...prev, messageWithEmptyContent]);
      typewriterAnimation.startTypewriterAnimation(messageWithEmptyContent, fullText);
      await storageService.addMessage(message);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    // Animations
    const startExerciseAnimations = () => {
      Animated.timing(backgroundAnimation, { toValue: 1, duration: 600, useNativeDriver: false }).start();
      Animated.timing(headerAnimation, { toValue: 1, duration: 400, useNativeDriver: false }).start();
    };

    const stopExerciseAnimations = () => {
      Animated.timing(backgroundAnimation, { toValue: 0, duration: 600, useNativeDriver: false }).start();
      Animated.timing(headerAnimation, { toValue: 0, duration: 400, useNativeDriver: false }).start();
    };

    useEffect(() => {
      const isInExerciseMode = exerciseMode && exerciseData.dynamicFlow;
      if (isInExerciseMode) startExerciseAnimations();
      else stopExerciseAnimations();
    }, [exerciseMode, exerciseData]);

    // Animate end reflection button
    useEffect(() => {
      if (canEndReflection) {
        Animated.spring(endReflectionButtonAnimation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      } else {
        endReflectionButtonAnimation.setValue(0);
      }
    }, [canEndReflection]);

    const normalGradient = [...colors.gradients.primaryLight];
    const exerciseGradient = ['#f0fdf4', '#ecfdf5', '#d1fae5'];

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
    <SafeAreaWrapper style={styles.container} edges={['top', 'left', 'right']}>
      <ImageBackground
        source={require('../../assets/images/background1.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(255, 253, 232, 0.7)', 'rgba(187, 242, 255, 0.7)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundOverlay}
        />
        <View style={styles.backgroundGradient}>
          <Animated.View style={[
            styles.backgroundGradient,
            { opacity: backgroundAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
          ]}>
            <LinearGradient colors={normalGradient as any} style={styles.backgroundGradient} />
          </Animated.View>
          <Animated.View style={[
            styles.backgroundGradient,
            { opacity: backgroundAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }
          ]}>
            <LinearGradient colors={exerciseGradient as any} style={styles.backgroundGradient} />
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
            { backgroundColor: headerAnimation.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0)', 'rgba(248,250,252,0.85)'] }) }
          ]}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <TouchableOpacity 
                  onPress={() => {
                    const exerciseContext = {
                      exerciseMode,
                      exerciseType: exerciseData.currentExercise?.type,
                      isValueReflection,
                      isThinkingPatternReflection,
                      isVisionExercise: showVisionSummary || exerciseData.currentExercise?.type === 'vision-of-future'
                    };
                    chatSession.handleEndSession(onBack, exerciseContext);
                  }}
                  style={styles.backButton}
                  activeOpacity={0.7}
                >
                  <ChevronLeft size={20} color="#475569" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                  <View style={styles.sessionDetails}>
                    <Text style={[styles.sessionTitle, (currentExercise || exerciseData.currentExercise) && styles.exerciseTitle]}>
                      {exerciseMode && exerciseData.dynamicFlow
                        ? exerciseData.currentExercise?.name || 'Exercise'
                        : currentExercise
                          ? currentExercise.name
                          : '💭 Reflection Space'}
                    </Text>
                    <Text style={styles.sessionSubtitle}>
                      {exerciseMode && exerciseData.dynamicFlow
                        ? `Step ${exerciseStep + 1} of ${exerciseData.dynamicFlow.steps.length} • ${exerciseData.dynamicFlow.steps[exerciseStep]?.title || 'In Progress'}`
                        : currentExercise
                          ? `${currentExercise.duration || '5 min'} • Therapeutic Exercise`
                          : chatSession.isLoading
                            ? 'Loading your gentle space...'
                            : 'Your safe space for reflection'}
                    </Text>
                    
                    {!currentExercise && typeof chatSession.rateLimitStatus?.percentage === 'number' && chatSession.rateLimitStatus.percentage >= 80 && (
                      <View style={styles.warningContainer}>
                        <AlertCircle size={14} color="#f59e0b" />
                        <Text style={styles.warningText}>
                          {chatSession.rateLimitStatus.percentage >= 90 
                            ? `Almost at daily limit! ${Math.max(0, (chatSession.rateLimitStatus.total || 0) - (chatSession.rateLimitStatus.used || 0))} left.`
                            : `${chatSession.rateLimitStatus.percentage}% of daily limit used.`}
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
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          >

            
            {chatSession.messages.map(renderMessage)}
            
            {chatSession.showExerciseCard && (
              <ExerciseCard
                exercise={chatSession.showExerciseCard}
                onStart={handleExerciseCardStart}
                onDismiss={() => chatSession.setShowExerciseCard(null)}
              />
            )}

            {chatSession.isTyping && (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <View style={styles.typingContent}>
                    <View style={styles.typingAvatar}>
                      <Image 
                        source={require('../../assets/images/turtle-simple-3a.png')}
                        style={styles.typingTurtleAvatar}
                        contentFit="contain"
                      />
                    </View>
                    <View style={styles.typingTextContainer}>
                      <View style={styles.typingDots}>
                        <View style={styles.typingDot} />
                        <View style={styles.typingDot} />
                        <View style={styles.typingDot} />

                      </View>
                    </View>
                  </View>
                </View>

              </View>
            )}

            {showPreExerciseMoodSlider && exerciseData.currentExercise && (
              <PreExerciseMoodCard
                exerciseName={exerciseData.currentExercise.name}
                onComplete={(rating) => handlePreExerciseMoodComplete(
                  rating,
                  chatSession.setMessages,
                  chatSession.setIsTyping,
                  chatSession.setSuggestions
                )}
                onSkip={() => handlePreExerciseMoodComplete(
                  2.5,
                  chatSession.setMessages,
                  chatSession.setIsTyping,
                  chatSession.setSuggestions
                )}
              />
            )}

            {showMoodRating && exerciseData.currentExercise && (
              <MoodRatingCard
                exerciseType={exerciseData.currentExercise.type}
                exerciseName={exerciseData.currentExercise.name}
                sessionId={Date.now().toString()}
                onComplete={handleMoodRatingComplete}
                onSkip={handleMoodRatingSkip}
              />
            )}

            {showValueReflectionSummary && valueReflectionSummary && (
              <ValueReflectionSummaryCard
                valueContext={exerciseData.valueContext}
                summary={valueReflectionSummary}
                onSave={saveValueReflectionSummary}
                onCancel={cancelValueReflectionSummary}
              />
            )}

            {showThinkingPatternSummary && thinkingPatternSummary && (
              <ThinkingPatternSummaryCard
                patternContext={exerciseData.patternContext}
                summary={thinkingPatternSummary}
                onSave={saveThinkingPatternSummary}
                onCancel={cancelThinkingPatternSummary}
              />
            )}

            {showVisionSummary && visionSummary && (
              <VisionSummaryCard
                summary={visionSummary}
                onSave={saveVisionSummary}
                onCancel={cancelVisionSummary}
              />
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
            showExerciseButton={
              chatSession.messages.filter(msg => msg.type === 'user').length >= 2 &&
              !chatSession.showExerciseCard &&
              !(exerciseMode && exerciseData.dynamicFlow) &&
              !isValueReflection &&
              !isThinkingPatternReflection
            }
            isVisible={chatSession.suggestions.length > 0}
            isTyping={chatSession.isTyping}
          />

          {/* End Reflection Button - Positioned after suggestion chips */}
          {(isValueReflection || isThinkingPatternReflection) && !showValueReflectionSummary && !showThinkingPatternSummary && canEndReflection && (
            <Animated.View 
              style={[
                styles.endReflectionContainer,
                {
                  opacity: endReflectionButtonAnimation,
                  transform: [{
                    scale: endReflectionButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1]
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  if (isValueReflection) {
                    endValueReflection(
                      chatSession.setMessages,
                      chatSession.setIsTyping,
                      chatSession.setSuggestions
                    );
                  } else {
                    endThinkingPatternReflection(
                      chatSession.setMessages,
                      chatSession.setIsTyping,
                      chatSession.setSuggestions
                    );
                  }
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#5DA4CD', '#7FC4C4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.endReflectionButton}
                >
                  <Text style={styles.endReflectionButtonText}>End Reflection</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Input Area */}
          <ChatInput
            inputText={inputText}
            onInputTextChange={handleInputTextChange}
            onSend={handleSend}
            isRecording={voiceRecording.isRecording}
            audioLevels={voiceRecording.audioLevels}
            partialTranscript={voiceRecording.partialTranscript}
            onMicPressIn={async () => {
              // Store current text before starting voice recording
              textBeforeVoiceRef.current = inputText.trim();
              await voiceRecording.startRecording();
            }}
            onMicPressOut={async () => {
              if (voiceRecording.isRecording) {
                await voiceRecording.stopRecording();
              }
            }}
            onStopRecording={voiceRecording.stopRecording}
            onCancelRecording={async () => {
              await voiceRecording.cancelRecording();
              // Restore text that was there before recording started
              setInputText(textBeforeVoiceRef.current);
            }}
          />

          {/* Development Test Button */}
          <TestButton
            exerciseMode={exerciseMode}
            exerciseData={exerciseData}
            isValueReflection={isValueReflection}
            isThinkingPatternReflection={isThinkingPatternReflection}
            exerciseStep={exerciseStep}
            onSendMessage={(message) => handleSendMessage(message, '')}
            onStartExercise={(exerciseType) => {
              // Find the exercise in the library and start it
              const exercises = {
                'breathing': { type: 'breathing', name: '4-7-8 Breathing' },
                'automatic-thoughts': { type: 'automatic-thoughts', name: 'Automatic Thoughts CBT' },
                'gratitude': { type: 'gratitude', name: 'Gratitude Practice' },
                'vision-of-future': { type: 'vision-of-future', name: 'Vision of the Future' }
              };
              const exercise = exercises[exerciseType];
              if (exercise) {
                enterExerciseMode();
                startDynamicAIGuidedExercise(
                  exercise,
                  chatSession.setMessages,
                  chatSession.setIsTyping,
                  chatSession.setSuggestions
                );
              }
            }}
          />
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaWrapper>
  );
};

export default ChatInterface;
