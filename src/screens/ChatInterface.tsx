import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, Animated, ImageBackground } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';
import { ChevronLeft, AlertCircle, Brain, Wind, Eye, BookOpen, Heart, Star } from 'lucide-react-native';
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
import { 
  useTypewriterAnimation, 
  useVoiceRecording, 
  useChatSession,
  useTTSControls
} from '../hooks/chat';

// Import services and utilities (keeping existing ones)
import { storageService, Message } from '../services/storageService';
import { contextService } from '../services/contextService';
import { apiService } from '../services/apiService';
import { rateLimitService } from '../services/rateLimitService';
import { ttsService } from '../services/ttsService';
import { sttService } from '../services/sttService';
import { insightService } from '../services/insightService';
import { API_CONFIG } from '../config/constants';
import { exerciseLibraryData } from '../data/exerciseLibrary';

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
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseData, setExerciseData] = useState<Record<string, any>>({});
  const [exerciseMode, setExerciseMode] = useState(false);
  
  // Animation refs
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Dynamic exercise flow generation - no hardcoded flows
  // Determine when to show exercise suggestion button
  const shouldShowExerciseButton = () => {
    // Show button after a few message exchanges and when not already showing an exercise card
    const userMessages = chatSession.messages.filter(msg => msg.type === 'user');
    return userMessages.length >= 2 && !chatSession.showExerciseCard && !exerciseMode;
  };

  // Get predefined exercise flow instead of generating with AI
  const getExerciseFlow = (exerciseType: string, exerciseName: string) => {
    // Predefined exercise flows for different types
    const exerciseFlows: Record<string, any> = {
      'automatic-thoughts': {
        name: exerciseName,
        color: "purple",
        useAI: true,
        steps: [
          {
            title: "Welcome & Awareness",
            stepNumber: 1,
            description: "Introduction to automatic thoughts",
            aiPrompt: "Welcome them to the Automatic Thoughts exercise. Explain that we'll identify unhelpful thought patterns together. Ask what situation has been on their mind lately that's causing stress."
          },
          {
            title: "Thought Identification",
            stepNumber: 2,
            description: "Recognize automatic thoughts",
            aiPrompt: "Help them identify the automatic thoughts in that situation. Ask: 'When you think about that situation, what thoughts go through your mind?' Guide them to notice patterns."
          },
          {
            title: "Challenge & Reframe",
            stepNumber: 3,
            description: "Question and reframe thoughts",
            aiPrompt: "Guide them to challenge those thoughts. Ask: 'Is this thought helpful? What evidence supports or contradicts it? What would you tell a friend in this situation?'"
          },
          {
            title: "New Perspective",
            stepNumber: 4,
            description: "Develop balanced thinking",
            aiPrompt: "Help them develop a more balanced thought. Ask them to create a realistic, compassionate alternative to the automatic thought they identified."
          }
        ]
      },
      'breathing': {
        name: exerciseName,
        color: "blue",
        useAI: true,
        steps: [
          {
            title: "Setup & Preparation",
            stepNumber: 1,
            description: "Getting comfortable",
            aiPrompt: "Welcome them to the 4-7-8 breathing exercise. Ask them to find a comfortable position and explain how this technique calms the nervous system. Ask how they're feeling right now."
          },
          {
            title: "Learning the Technique",
            stepNumber: 2,
            description: "Practice the rhythm",
            aiPrompt: "Teach them 4-7-8 breathing: breathe in for 4, hold for 7, exhale for 8. Walk them through it slowly, counting with them. Ask them to try a few cycles."
          },
          {
            title: "Guided Practice",
            stepNumber: 3,
            description: "Full breathing session",
            aiPrompt: "Guide them through several rounds of 4-7-8 breathing. Count with them and offer gentle encouragement. Remind them it's normal if it feels awkward at first."
          },
          {
            title: "Reflection & Integration",
            stepNumber: 4,
            description: "Process the experience",
            aiPrompt: "Ask how they feel now compared to when they started. Help them reflect on when this technique might be useful in their daily life."
          }
        ]
      },
      'mindfulness': {
        name: exerciseName,
        color: "green",
        useAI: true,
        steps: [
          {
            title: "Settling In",
            stepNumber: 1,
            description: "Preparation for body scan",
            aiPrompt: "Welcome them to the Body Scan exercise. Ask them to get comfortable and explain how this practice helps with awareness and relaxation. Ask what tension they're noticing today."
          },
          {
            title: "Starting the Scan",
            stepNumber: 2,
            description: "Begin with awareness",
            aiPrompt: "Guide them to start with their feet, noticing sensations without changing anything. Walk them through slowly, asking what they notice in each area."
          },
          {
            title: "Full Body Awareness",
            stepNumber: 3,
            description: "Complete body scan",
            aiPrompt: "Continue guiding them up through their body - legs, torso, arms, face. Remind them to simply notice, not judge. Ask them to breathe into any tense areas."
          },
          {
            title: "Integration & Closing",
            stepNumber: 4,
            description: "Reflect on the experience",
            aiPrompt: "Ask them what they discovered about their body today. Help them reflect on how this awareness might help them in stressful moments."
          }
        ]
      },
      'gratitude': {
        name: exerciseName,
        color: "orange",
        useAI: true,
        steps: [
          {
            title: "Opening & Intention",
            stepNumber: 1,
            description: "Setting up for gratitude",
            aiPrompt: "Welcome them to the Gratitude Practice. Explain how gratitude can shift our perspective and mood. Ask them to think about their day so far."
          },
          {
            title: "Finding Three Things",
            stepNumber: 2,
            description: "Identifying specific gratitudes",
            aiPrompt: "Ask them to share three things they're grateful for today - they can be big or small. Help them be specific and explore why each one matters to them."
          },
          {
            title: "Deepening Appreciation",
            stepNumber: 3,
            description: "Exploring gratitude deeply",
            aiPrompt: "For each thing they mentioned, ask them to go deeper. How did it make them feel? What impact did it have? Help them really savor the positive emotions."
          },
          {
            title: "Carrying It Forward",
            stepNumber: 4,
            description: "Integrating gratitude practice",
            aiPrompt: "Ask them how they might remember to notice good things throughout their day. Help them think of ways to make gratitude a regular practice."
          }
        ]
      },
      'self-compassion': {
        name: exerciseName,
        color: "pink",
        useAI: true,
        steps: [
          {
            title: "Understanding Self-Compassion",
            stepNumber: 1,
            description: "Introduction to self-kindness",
            aiPrompt: "Welcome them to the Self-Compassion Break. Explain that we'll practice treating themselves with kindness. Ask about a situation where they've been hard on themselves lately."
          },
          {
            title: "Mindful Awareness",
            stepNumber: 2,
            description: "Acknowledging the pain",
            aiPrompt: "Help them acknowledge their struggle without judgment. Guide them to notice: 'This is a moment of difficulty.' Ask them to place a hand on their heart and breathe."
          },
          {
            title: "Common Humanity",
            stepNumber: 3,
            description: "Recognizing shared experience",
            aiPrompt: "Help them recognize they're not alone in this struggle. Ask them to consider: 'Other people have felt this way too. This is part of being human.' Guide them to feel connected."
          },
          {
            title: "Self-Kindness Practice",
            stepNumber: 4,
            description: "Offering yourself compassion",
            aiPrompt: "Ask them what they would say to a good friend in this situation. Help them offer that same kindness to themselves. Guide them to create a compassionate phrase they can use."
          }
        ]
      }
    };

    // Return the specific flow or a default one
    return exerciseFlows[exerciseType] || {
      name: exerciseName,
      color: "blue",
      useAI: true,
      steps: [
        {
          title: "Welcome & Setup",
          stepNumber: 1,
          description: "Introduction and preparation",
          aiPrompt: `Welcome them warmly to the ${exerciseName} exercise. Explain what we'll do together and ask how they're feeling right now.`
        },
        {
          title: "Core Practice",
          stepNumber: 2,
          description: "Main therapeutic technique",
          aiPrompt: `Guide them through the main ${exerciseType} technique step by step. Be encouraging and supportive.`
        },
        {
          title: "Reflection",
          stepNumber: 3,
          description: "Process the experience",
          aiPrompt: "Help them reflect on what they noticed during the exercise. Ask open-ended questions about their experience."
        }
      ]
    };
  };

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

  // Initialize on mount
  useEffect(() => {
    // Check if this is an exercise that needs special handling
    if (currentExercise) {
      console.log('Starting dynamic AI-guided exercise:', currentExercise.type);
      enterExerciseMode();
      startDynamicAIGuidedExercise();
      return;
    }
    
    // Regular chat session
    chatSession.initializeChatSession();
  }, [currentExercise]);

  // Start dynamic AI-guided exercise
  const startDynamicAIGuidedExercise = async () => {
    try {
      console.log('Generating and starting dynamic exercise:', currentExercise.type);
      
      // Get predefined exercise flow
      const flow = getExerciseFlow(currentExercise.type, currentExercise.name);
      
      if (!flow || !flow.steps || flow.steps.length === 0) {
        console.error('Failed to generate exercise flow, falling back to simple chat');
        exitExerciseMode();
        chatSession.initializeChatSession();
        return;
      }
      
      console.log('Generated dynamic flow with', flow.steps.length, 'steps');
      setExerciseMode(true);
      setExerciseStep(0);
      
      const currentStep = flow.steps[0];
      
      // Get AI response for first step - no hardcoded suggestions
      const systemPrompt = `You're a warm therapist starting "${currentExercise.name}".

Step 1: ${currentStep.title}
Goal: ${currentStep.description}
Guidance: ${currentStep.aiPrompt}

Welcome warmly, explain benefits briefly, start therapeutic conversation. Ask engaging questions.

Generate appropriate user reply suggestions that match the exercise context.`;

      chatSession.setIsTyping(true);
      const response = await apiService.getChatCompletionWithContext([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `I'm ready to start the ${currentExercise.name} exercise. Please guide me through step 1.` }
      ]);
      chatSession.setIsTyping(false);

      if (response.success && response.message) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'exercise',
          title: `Step ${currentStep.stepNumber}: ${currentStep.title}`,
          content: response.message,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };
        
        chatSession.setMessages([aiMessage]);
        await storageService.addMessage(aiMessage);
        
        // Extract suggestions using robust parsing
        const suggestions = extractSuggestionsFromResponse(response);
        chatSession.setSuggestions(suggestions);
        
        // Store the dynamic flow for later use
        setExerciseData({ ...exerciseData, dynamicFlow: flow });
      } else {
        console.error('Failed to start exercise with AI, exiting exercise mode');
        exitExerciseMode();
        chatSession.initializeChatSession();
      }
    } catch (error) {
      console.error('Error starting dynamic AI-guided exercise:', error);
      exitExerciseMode();
      chatSession.initializeChatSession();
    }
  };

  // Handle input text changes
  const handleInputTextChange = (text: string) => {
    setInputText(text);
  };

  // Handle sending messages
  const handleSend = async (text = inputText) => {
    if (!text.trim()) return;

    // Clear input
    setInputText('');

    // Check if we're in a dynamic exercise mode
    if (exerciseMode && exerciseData.dynamicFlow) {
      // Dynamic AI-guided exercise
      await handleDynamicAIGuidedExerciseResponse(text, exerciseData.dynamicFlow);
      return;
    }
    
    // Regular chat session
    await chatSession.handleSendMessage(text);
  };

  // Handle dynamic AI-guided exercise responses
  const handleDynamicAIGuidedExerciseResponse = async (userText: string, flow: any) => {
    try {
      console.log('Handling dynamic AI-guided exercise response for step:', exerciseStep + 1);
      
      const currentStep = flow.steps[exerciseStep];
      
      // Create user message
      const userMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Add user message to UI and storage
      chatSession.setMessages((prev: Message[]) => [...prev, userMessage]);
      await storageService.addMessage(userMessage);
      
      // Build conversation context
      const recentMessages = await storageService.getLastMessages(5);
      const conversationHistory = recentMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text || msg.content || ''
      }));
      conversationHistory.push({ role: 'user', content: userText });
      
      // Check if we should move to next step
      const shouldAdvance = userText.trim().length >= 8; // Simple advancement logic
      
      if (shouldAdvance && exerciseStep < flow.steps.length - 1) {
        // Move to next step
        const nextStepIndex = exerciseStep + 1;
        const nextStep = flow.steps[nextStepIndex];
        
        const systemPrompt = `Continuing "${currentExercise.name}" exercise.

Previous: "${currentStep.title}" - they shared: "${userText}"
Next: Step ${nextStep.stepNumber}/${flow.steps.length}: ${nextStep.title}
Goal: ${nextStep.description}
Guidance: ${nextStep.aiPrompt}

Acknowledge their sharing, validate, connect to therapy. Transition to next step naturally. Ask engaging questions.

Generate appropriate user reply suggestions that match the exercise context.`;

        chatSession.setIsTyping(true);
        const response = await apiService.getChatCompletionWithContext([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userText }
        ]);
        chatSession.setIsTyping(false);

        if (response.success && response.message) {
          const aiResponse: Message = {
            id: (Date.now() + Math.random()).toString(),
            type: 'exercise',
            title: `Step ${nextStep.stepNumber}: ${nextStep.title}`,
            content: response.message,
            exerciseType: currentExercise.type,
            color: flow.color,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAIGuided: true
          };

          await addAIMessageWithTypewriter(aiResponse);
          
          // Extract suggestions using robust parsing
          const suggestions = extractSuggestionsFromResponse(response);
          chatSession.setSuggestions(suggestions);
          
          setExerciseStep(nextStepIndex);
          await ttsService.speakIfAutoPlay(response.message);
        }
        
      } else if (exerciseStep >= flow.steps.length - 1) {
        // Exercise completed
        console.log('Dynamic exercise completed');
        
        const completionMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'exercise',
          title: '🎉 Exercise Complete!',
          content: `**Excellent work!** 🌟

**You've completed all ${flow.steps.length} steps of the ${currentExercise.name} exercise!**

**Your insights have been captured and will be available in your Insights tab.** Great job practicing this therapeutic skill! 💪`,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };

        chatSession.setMessages((prev: Message[]) => [...prev, completionMessage]);
        await storageService.addMessage(completionMessage);
        
        // Exit exercise mode
        exitExerciseMode();
        
        // Only show suggestions if AI provides them
        chatSession.setSuggestions([]);
        
      } else {
        // Stay on current step - ask for more clarification
        const clarificationPrompt = `Continuing current step.

They shared: "${userText}"
Step ${currentStep.stepNumber}/${flow.steps.length}: ${currentStep.title}
Goal: ${currentStep.description}
Guidance: ${currentStep.aiPrompt}

Acknowledge, validate, show curiosity. Ask follow-up questions to go deeper. Stay present with emotions.

Generate appropriate user reply suggestions that match the exercise context.`;

        chatSession.setIsTyping(true);
        const response = await apiService.getChatCompletionWithContext([
          { role: 'system', content: clarificationPrompt },
          { role: 'user', content: userText }
        ]);
        chatSession.setIsTyping(false);

        if (response.success && response.message) {
          const aiResponse: Message = {
            id: (Date.now() + Math.random()).toString(),
            type: 'exercise',
            title: `Step ${currentStep.stepNumber}: ${currentStep.title} (continued)`,
            content: response.message,
            exerciseType: currentExercise.type,
            color: flow.color,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAIGuided: true
          };

          await addAIMessageWithTypewriter(aiResponse);
          
          // Extract suggestions using robust parsing
          const suggestions = extractSuggestionsFromResponse(response);
          chatSession.setSuggestions(suggestions);
          
          await ttsService.speakIfAutoPlay(response.message);
        }
      }
      
    } catch (error) {
      console.error('Error in handleDynamicAIGuidedExerciseResponse:', error);
    }
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
  };

  // Handle exercise card actions
  const handleExerciseCardStart = (exerciseInfo: any) => {
    console.log('=== EXERCISE CARD START ===');
    console.log('Exercise info:', exerciseInfo);
    
    // Hide the card first
    console.log('🔴 Setting showExerciseCard to null...');
    chatSession.setShowExerciseCard(null);
    console.log('🔴 showExerciseCard should now be null');
    console.log('🔴 Current showExerciseCard value:', chatSession.showExerciseCard);
    
    // Create proper exercise object 
    const exercise = {
      type: exerciseInfo.type,
      name: exerciseInfo.name,
      duration: exerciseInfo.duration,
      description: exerciseInfo.description || 'AI-guided exercise'
    };
    
    console.log('Exercise object created:', exercise);
    
    // Use onExerciseClick to start the exercise properly
    if (onExerciseClick) {
      console.log('Using onExerciseClick to start exercise');
      onExerciseClick(exercise);
    } else {
      console.error('onExerciseClick not available - cannot start exercise');
    }
  };

  // Helper function to extract suggestions from AI response with multiple fallback methods
  const extractSuggestionsFromResponse = (response: any): string[] => {
    console.log('🔍 Full AI Response:', response);
    
    // Method 1: Check if already parsed by Edge Function
    if (response.suggestions && response.suggestions.length > 0) {
      console.log('✅ Method 1: Using Edge Function parsed suggestions:', response.suggestions);
      return response.suggestions;
    }

    // Method 2: Parse from message content manually
    const content = response.message || '';
    console.log('🔍 Method 2: Attempting manual parsing from content:', content);
    
    // Method 2a: Check for JSON code block format
    const codeBlockMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      try {
        console.log('🔧 Found JSON code block, attempting to parse...');
        const jsonString = codeBlockMatch[1].trim();
        const jsonResponse = JSON.parse(jsonString);
        
        if (jsonResponse.message && jsonResponse.suggestions && Array.isArray(jsonResponse.suggestions)) {
          console.log('✅ Method 2a: Parsed JSON from code block:', jsonResponse);
          // Update the response object to use the parsed content
          response.message = jsonResponse.message;
          return jsonResponse.suggestions.slice(0, 4);
        }
      } catch (e) {
        console.log('❌ Method 2a: Failed to parse JSON from code block:', e);
      }
    }
    
    // Look for SUGGESTION_CHIPS format - more flexible regex
    const suggestionChipsMatch = content.match(/\n*\s*SUGGESTION_CHIPS:\s*(\[.*?\])\s*$/s);
    if (suggestionChipsMatch) {
      try {
        console.log('Found SUGGESTION_CHIPS match:', suggestionChipsMatch[1]);
        const suggestionsArray = JSON.parse(suggestionChipsMatch[1]);
        const cleanSuggestions = suggestionsArray
          .filter(s => typeof s === 'string' && s.trim().length > 0)
          .map(s => s.replace(/["""]/g, '').trim())
          .slice(0, 4);
        if (cleanSuggestions.length > 0) {
          console.log('✅ Method 2a: Parsed SUGGESTION_CHIPS:', cleanSuggestions);
          return cleanSuggestions;
        }
      } catch (e) {
        console.log('❌ Method 2a: Failed to parse SUGGESTION_CHIPS JSON:', e);
      }
    }

    // Method 3: Look for quoted strings at end of message
    const quotedSuggestions = content.match(/"([^"]{2,25})"/g);
    if (quotedSuggestions && quotedSuggestions.length >= 2) {
      const suggestions = quotedSuggestions
        .map(s => s.replace(/"/g, '').trim())
        .slice(-4); // Take last 4 quoted strings
      console.log('✅ Method 3: Found quoted suggestions:', suggestions);
      return suggestions;
    }

    // Method 4: Look for bullet points or numbered lists at end
    const lines = content.split('\n').reverse();
    const suggestionLines = [];
    for (const line of lines) {
      const cleaned = line.replace(/^[\d\-\*\•]\s*/, '').trim();
      if (cleaned.length > 0 && cleaned.length <= 25 && !cleaned.includes('**')) {
        suggestionLines.push(cleaned);
        if (suggestionLines.length >= 4) break;
      }
    }
    if (suggestionLines.length >= 2) {
      console.log('✅ Method 4: Found list-based suggestions:', suggestionLines.reverse());
      return suggestionLines.reverse();
    }

    console.log('❌ All methods failed: No suggestions found');
    return [];
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

  // Smooth transitions for exercise mode (keeping existing)
  const enterExerciseMode = () => {
    setExerciseMode(true);
    
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

  const exitExerciseMode = () => {
    setExerciseMode(false);
    
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
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background1.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.backgroundOverlay} />
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
                      {exerciseMode && currentExercise && exerciseData.dynamicFlow ? (
                        exerciseData.dynamicFlow.name || 'Exercise in Progress'
                      ) : currentExercise ? (
                        currentExercise.name
                      ) : (
                        '🌸 Gentle Session'
                      )}
                    </Text>
                    <Text style={styles.sessionSubtitle}>
                      {exerciseMode && exerciseData.dynamicFlow ? (
                        `Step ${exerciseStep + 1} of ${exerciseData.dynamicFlow.steps.length} • ${exerciseData.dynamicFlow.steps[exerciseStep]?.title || currentExercise?.duration || '5 min'}`
                      ) : currentExercise ? (
                        `${currentExercise.duration || '5 min'} • Therapeutic Exercise`
                      ) : (
                        chatSession.isLoading ? 'Loading your gentle space...' :
                        `${Math.max(0, (chatSession.rateLimitStatus.total || 0) - (chatSession.rateLimitStatus.used || 0))} messages remaining today`
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
            {chatSession.showExerciseCard && (
              <ExerciseCard
                exercise={chatSession.showExerciseCard}
                onStart={handleExerciseCardStart}
                onDismiss={() => chatSession.setShowExerciseCard(null)}
              />
            )}
            
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
                      <Text style={styles.typingText}>Your therapist is reflecting...</Text>
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
            onSuggestExercise={chatSession.handleSuggestExercise}
            showExerciseButton={shouldShowExerciseButton()}
            isVisible={chatSession.suggestions.length > 0 || shouldShowExerciseButton()}
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
    </SafeAreaView>
  );
};

export default ChatInterface;