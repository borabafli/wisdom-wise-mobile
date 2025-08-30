import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Send, Mic, ChevronLeft, MicOff, Sparkles, Heart, AlertCircle, Volume2, VolumeX, Pause, Play, Square, Check, X } from 'lucide-react-native';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

// Import our new services
import { storageService, Message } from '../services/storageService';
import { contextService } from '../services/contextService';
import { apiService } from '../services/apiService';
import { rateLimitService } from '../services/rateLimitService';
import { ttsService } from '../services/ttsService';
import { sttService } from '../services/sttService';
import { insightService } from '../services/insightService';
import { API_CONFIG } from '../config/constants';

// Import separated styles
import { chatInterfaceStyles as styles } from '../styles/components/ChatInterface.styles';
import { colors } from '../styles/tokens';

// Import types
import { Exercise, ChatInterfaceProps } from '../types';

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
  const [exerciseData, setExerciseData] = useState<Record<string, any>>({});
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
    },
    'automatic-thoughts': {
      name: '🧠 Recognizing Automatic Thoughts',
      color: 'purple',
      useAI: true,
      steps: [
        {
          title: 'Welcome & Understanding',
          stepNumber: 1,
          description: 'Learn about automatic thoughts and identify the triggering situation',
          aiPrompt: `Welcome them warmly to the CBT exercise. Explain what automatic thoughts are in simple, relatable terms. Then guide them to describe a specific situation that triggered distressing thoughts - emphasize facts only, no interpretations.`,
          dataToCapture: 'situation',
          suggestions: ['At work today...', 'During a conversation...', 'When I was thinking about...', 'Something happened that upset me...']
        },
        {
          title: 'Emotion Recognition',
          stepNumber: 2,
          description: 'Identify and rate the emotional intensity',
          aiPrompt: `Help them identify the specific emotion they felt in that situation. Explain why emotional awareness matters in CBT. Ask them to rate the intensity on a 0-100 scale and explain what that number means to them.`,
          dataToCapture: 'emotion',
          suggestions: ['Anxious (80/100)', 'Sad (60/100)', 'Angry (90/100)', 'Overwhelmed (70/100)']
        },
        {
          title: 'Capturing Automatic Thoughts',
          stepNumber: 3,
          description: 'Identify the exact unhelpful thoughts',
          aiPrompt: `Gently guide them to identify the automatic thought that popped up. Explain that these are often fast, fleeting thoughts we barely notice. Ask them to write it exactly as it appeared - no editing or softening.`,
          dataToCapture: 'thought',
          suggestions: ['I always mess up', 'They think I\'m stupid', 'Nothing will work out', 'I can\'t handle this']
        },
        {
          title: 'Spotting Thinking Patterns',
          stepNumber: 4,
          description: 'Identify cognitive distortions in the thought',
          aiPrompt: `Educate them about cognitive distortions - common thinking traps we all fall into. Help them identify which distortion(s) might be present in their thought. Be encouraging that everyone has these patterns.`,
          dataToCapture: 'distortion',
          suggestions: ['All-or-Nothing Thinking', 'Catastrophizing', 'Mind Reading', 'Fortune Telling', 'Emotional Reasoning']
        },
        {
          title: 'Examining Evidence',
          stepNumber: 5,
          description: 'Look at facts that support and contradict the thought',
          aiPrompt: `Guide them through examining evidence like a detective. Ask for facts that support their thought, then facts that contradict it. Help them see this isn't about being right or wrong, but about getting a balanced view.`,
          dataToCapture: 'evidence',
          suggestions: ['Evidence for...', 'Evidence against...', 'The facts show...', 'Looking objectively...']
        },
        {
          title: 'Creating Balance',
          stepNumber: 6,
          description: 'Develop a realistic, supportive alternative thought',
          aiPrompt: `Help them create a more balanced thought based on the evidence. It shouldn't be fake positivity, but realistic and kind. Guide them to find a thought that acknowledges reality while being more supportive.`,
          dataToCapture: 'reframe',
          suggestions: ['A more balanced view is...', 'Realistically speaking...', 'A kinder thought might be...']
        },
        {
          title: 'Measuring Change',
          stepNumber: 7,
          description: 'Re-evaluate emotional intensity after reframing',
          aiPrompt: `Ask them to re-rate their emotion now (0-100). Celebrate any decrease, normalize if it stayed the same. Explain that even small shifts matter and this skill takes practice.`,
          dataToCapture: 'emotion-after',
          suggestions: ['Much better (30/100)', 'Somewhat improved (50/100)', 'About the same', 'I notice a difference']
        }
      ]
    }
  };

  // Initialize services and load data
  useEffect(() => {
    initializeChatSession();
  }, [currentExercise]);

  // Start AI-driven exercise
  const startAIExercise = async (flow: any) => {
    try {
      console.log('Starting AI-driven exercise with prompt:', flow.initialPrompt);
      
      // Set up context for AI exercise
      const exerciseContext = `EXERCISE_MODE: ${currentExercise.type}
EXERCISE_NAME: ${currentExercise.name}
EXERCISE_DURATION: ${currentExercise.duration}
USER_DATA_COLLECTED: {}

${flow.initialPrompt}`;

      // Get initial AI response
      setIsTyping(true);
      const response = await apiService.getChatCompletionWithContext([
        { role: 'system', content: flow.initialPrompt },
        { role: 'user', content: `I want to do the ${currentExercise.name} exercise. Please guide me through it.` }
      ]);
      setIsTyping(false);

      if (response.success && response.message) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'exercise',
          title: `${currentExercise.name}`,
          content: response.message,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };
        
        setMessages([aiMessage]);
        await storageService.addMessage(aiMessage);
        
        // Generate contextual suggestions
        setSuggestions(['I understand', 'Can you explain more?', 'I\'m ready to start', 'I have questions']);
      } else {
        // Fallback to welcoming message if API fails
        const fallbackMessage: Message = {
          id: Date.now().toString(),
          type: 'exercise', 
          title: 'Welcome to CBT Practice',
          content: 'Welcome to automatic thoughts recognition! This exercise will help you identify and reframe unhelpful thinking patterns. Let\'s start by sharing a situation that caused you distress recently.',
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };
        setMessages([fallbackMessage]);
        setSuggestions(['At work today...', 'During a conversation...', 'When I was thinking about...', 'Something happened that upset me...']);
      }
    } catch (error) {
      console.error('Error starting AI exercise:', error);
    }
  };


  const initializeChatSession = async () => {
    try {
      setIsLoading(true);
      
      // API service is now initialized automatically
      
      // Load rate limit status
      const rateLimitStatus = await rateLimitService.getRateLimitStatus();
      setRateLimitStatus(rateLimitStatus);
      
      // Debug logging
      console.log('=== CHAT INITIALIZATION ===');
      console.log('currentExercise:', currentExercise);
      console.log('Exercise type:', currentExercise?.type);
      console.log('Available exercise flows:', Object.keys(exerciseFlows));
      console.log('Flow found:', exerciseFlows[currentExercise?.type]);
      
      // Handle exercise flow vs regular chat
      if (currentExercise && exerciseFlows[currentExercise.type]) {
        const flow = exerciseFlows[currentExercise.type];
        
        if (flow.useAI && flow.steps.length > 0) {
          // AI-guided exercise with step structure
          console.log('Starting AI-guided exercise:', currentExercise.type);
          await startAIGuidedExercise(flow);
        } else if (flow.useAI) {
          // AI-driven exercise - get initial response from AI  
          console.log('Starting AI-driven exercise:', currentExercise.type);
          await startAIExercise(flow);
        } else {
          // Static exercise flow - use existing logic
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
        }
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

  // Start AI-guided exercise with step structure
  const startAIGuidedExercise = async (flow: any) => {
    try {
      console.log('Starting AI-guided exercise with steps:', flow.steps.length);
      
      // Start with step 0
      setExerciseStep(0);
      const currentStep = flow.steps[0];
      
      // Get AI response for this step
      const systemPrompt = `You are a warm, compassionate CBT therapist. You're guiding someone through the "${currentExercise.name}" exercise.

CURRENT STEP: ${currentStep.stepNumber}/7 - ${currentStep.title}
STEP GOAL: ${currentStep.description}
GUIDANCE: ${currentStep.aiPrompt}

Be friendly, understanding, and therapeutic. Explain concepts clearly and create a safe, supportive environment.`;

      setIsTyping(true);
      const response = await apiService.getChatCompletionWithContext([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `I'm ready to start the ${currentExercise.name} exercise. Please guide me through step 1.` }
      ]);
      setIsTyping(false);

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
        
        setMessages([aiMessage]);
        await storageService.addMessage(aiMessage);
        setSuggestions(currentStep.suggestions);
      } else {
        // Fallback to static step content
        const fallbackMessage: Message = {
          id: Date.now().toString(),
          type: 'exercise', 
          title: `Step ${currentStep.stepNumber}: ${currentStep.title}`,
          content: `Welcome to the ${currentExercise.name} exercise! Let's start by describing a situation that triggered some difficult thoughts. Please share just the facts of what happened, without any interpretations.`,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };
        setMessages([fallbackMessage]);
        setSuggestions(currentStep.suggestions);
      }
    } catch (error) {
      console.error('Error starting AI-guided exercise:', error);
    }
  };

  // Handle AI-driven exercise responses
  const handleAIExerciseResponse = async (userText: string, flow: any) => {
    try {
      console.log('Handling AI exercise response for:', currentExercise.type);
      
      // Build conversation context for the AI
      const recentMessages = await storageService.getLastMessages(10);
      const conversationHistory = recentMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text || msg.content || ''
      }));
      
      // Add current user response
      conversationHistory.push({ role: 'user', content: userText });
      
      // Build exercise context with current data
      const exerciseContextData = JSON.stringify(exerciseData, null, 2);
      const systemPrompt = `${flow.initialPrompt}

EXERCISE_MODE: ${currentExercise.type}
EXERCISE_NAME: ${currentExercise.name} 
EXERCISE_DURATION: ${currentExercise.duration}
USER_DATA_COLLECTED: ${exerciseContextData}

Respond therapeutically to the user's input. Assess if you need more information for the current CBT step, or if you can guide them to the next step. Be warm, supportive, and educational.`;

      // Build messages array with system prompt and conversation history
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory
      ];

      setIsTyping(true);
      const response = await apiService.getChatCompletionWithContext(messages);
      setIsTyping(false);

      if (response.success && response.message) {
        // Record successful request for rate limiting
        await rateLimitService.recordRequest();
        
        const aiResponse: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'exercise',
          title: `${currentExercise.name} - AI Guidance`,
          content: response.message,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };

        setMessages(prev => [...prev, aiResponse]);
        await storageService.addMessage(aiResponse);

        // Auto-play TTS if enabled
        await ttsService.speakIfAutoPlay(response.message);

        // Generate dynamic suggestions based on conversation
        setSuggestions(contextService.generateSuggestions([...recentMessages, aiResponse]));
        
        // Extract any structured data from the AI response for insights
        await extractExerciseDataFromAIResponse(response.message, userText);
        
      } else {
        // Fallback response for API errors
        const fallbackMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'exercise',
          content: "I'm here to support you through this exercise. Could you share a bit more about what you're experiencing?",
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };
        setMessages(prev => [...prev, fallbackMessage]);
        setSuggestions(['I need help understanding', 'Let me try again', 'Can you guide me?', 'I\'m feeling stuck']);
      }
    } catch (error) {
      console.error('Error in handleAIExerciseResponse:', error);
    }
  };

  // Handle AI-guided exercise with step structure
  const handleAIGuidedExerciseResponse = async (userText: string, flow: any) => {
    try {
      console.log('Handling AI-guided exercise response for step:', exerciseStep + 1);
      
      const currentStep = flow.steps[exerciseStep];
      
      // Store user response for this step
      if (currentStep.dataToCapture) {
        setExerciseData(prev => ({
          ...prev,
          [currentStep.dataToCapture]: userText
        }));
        console.log(`Captured ${currentStep.dataToCapture}: ${userText}`);
      }
      
      // Build conversation context
      const recentMessages = await storageService.getLastMessages(5);
      const conversationHistory = recentMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text || msg.content || ''
      }));
      conversationHistory.push({ role: 'user', content: userText });
      
      // Check if we should move to next step or stay on current
      const shouldAdvance = await assessStepCompletion(userText, currentStep, conversationHistory);
      
      if (shouldAdvance && exerciseStep < flow.steps.length - 1) {
        // Move to next step
        const nextStepIndex = exerciseStep + 1;
        const nextStep = flow.steps[nextStepIndex];
        
        const systemPrompt = `You are a warm, compassionate CBT therapist. 

PREVIOUS STEP COMPLETED: "${currentStep.title}" - User provided: "${userText}"
NOW STARTING: Step ${nextStep.stepNumber}/7 - ${nextStep.title}
STEP GOAL: ${nextStep.description}
GUIDANCE: ${nextStep.aiPrompt}

Acknowledge their previous response warmly, then guide them into the next step. Be friendly, understanding, and therapeutic.`;

        setIsTyping(true);
        const response = await apiService.getChatCompletionWithContext([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `I just completed step ${currentStep.stepNumber}. Please guide me to step ${nextStep.stepNumber}.` }
        ]);
        setIsTyping(false);

        if (response.success && response.message) {
          await rateLimitService.recordRequest();
          
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

          setMessages(prev => [...prev, aiResponse]);
          await storageService.addMessage(aiResponse);
          setSuggestions(nextStep.suggestions);
          setExerciseStep(nextStepIndex);
          
          await ttsService.speakIfAutoPlay(response.message);
        }
        
      } else if (exerciseStep >= flow.steps.length - 1) {
        // Exercise completed - show completion message, save data for later processing
        console.log('CBT exercise completed - will process insights when session ends');
        
        const completionMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'exercise',
          title: '🎉 Exercise Complete!',
          content: `**Excellent work!** 🌟

**You've completed all 7 CBT steps:**
• Identified situation & emotions
• Captured automatic thoughts  
• Examined evidence & patterns
• Created balanced alternatives

**Your insights will be saved when you end the session.** Great job practicing this skill! 💪`,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };

        setMessages(prev => [...prev, completionMessage]);
        await storageService.addMessage(completionMessage);
        setSuggestions(['That was helpful 😊', 'I learned something new 🌟', 'I want to try again 🔄', 'Thank you 🙏']);
        
      } else {
        // Stay on current step - ask for more clarification
        const clarificationPrompt = `You are a warm, compassionate CBT therapist.

CURRENT STEP: ${currentStep.stepNumber}/7 - ${currentStep.title}  
STEP GOAL: ${currentStep.description}
USER RESPONSE: "${userText}"

The user's response needs more detail or clarity before moving to the next step. Gently ask follow-up questions or provide guidance to help them complete this step. Be supportive and encouraging.`;

        setIsTyping(true);
        const response = await apiService.getChatCompletionWithContext([
          { role: 'system', content: clarificationPrompt },
          { role: 'user', content: userText }
        ]);
        setIsTyping(false);

        if (response.success && response.message) {
          await rateLimitService.recordRequest();
          
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

          setMessages(prev => [...prev, aiResponse]);
          await storageService.addMessage(aiResponse);
          setSuggestions(currentStep.suggestions);
          
          await ttsService.speakIfAutoPlay(response.message);
        }
      }
      
    } catch (error) {
      console.error('Error in handleAIGuidedExerciseResponse:', error);
    }
  };

  // Assess if user response is complete enough to advance to next step
  const assessStepCompletion = async (userResponse: string, currentStep: any, conversationHistory: any[]): Promise<boolean> => {
    // Simple heuristics for now - can be enhanced with AI assessment later
    const response = userResponse.trim();
    
    // Minimum length requirements by step type
    const minLengths = {
      'situation': 10,
      'emotion': 5,
      'thought': 8,
      'distortion': 5,
      'evidence': 15,
      'reframe': 10,
      'emotion-after': 3
    };
    
    const requiredLength = minLengths[currentStep.dataToCapture] || 5;
    
    // Check if response meets minimum criteria
    if (response.length < requiredLength) {
      return false;
    }
    
    // Step-specific validation
    switch (currentStep.dataToCapture) {
      case 'emotion':
        // Should include either emotion name or number
        return response.includes('/100') || /\b(anxious|sad|angry|frustrated|overwhelmed|worried|happy|calm)\b/i.test(response);
      
      case 'emotion-after':
        // Should include number or comparative language  
        return response.includes('/100') || /\b(better|worse|same|improved|different|lower|higher)\b/i.test(response);
        
      default:
        return true; // Accept other responses if they meet length requirement
    }
  };

  // Extract structured exercise data from AI responses
  const extractExerciseDataFromAIResponse = async (aiMessage: string, userResponse: string) => {
    try {
      // Use simple keyword detection to capture exercise data
      const lowerAI = aiMessage.toLowerCase();
      const lowerUser = userResponse.toLowerCase();
      
      // Detect which step we might be on based on AI response content
      if (lowerAI.includes('situation') || lowerAI.includes('what happened')) {
        setExerciseData(prev => ({ ...prev, situation: userResponse }));
      } else if (lowerAI.includes('emotion') && lowerAI.includes('rate')) {
        setExerciseData(prev => ({ ...prev, emotion: userResponse }));
      } else if (lowerAI.includes('thought') && (lowerAI.includes('automatic') || lowerAI.includes('came to mind'))) {
        setExerciseData(prev => ({ ...prev, thought: userResponse }));
      } else if (lowerAI.includes('distortion') || lowerAI.includes('thinking pattern')) {
        setExerciseData(prev => ({ ...prev, distortion: userResponse }));
      } else if (lowerAI.includes('evidence')) {
        setExerciseData(prev => ({ ...prev, evidence: userResponse }));
      } else if (lowerAI.includes('balanced') || lowerAI.includes('reframe')) {
        setExerciseData(prev => ({ ...prev, reframe: userResponse }));
      } else if (lowerAI.includes('re-rate') || lowerAI.includes('now that')) {
        setExerciseData(prev => ({ ...prev, 'emotion-after': userResponse }));
      }
      
      // Check if exercise seems complete and process insights
      const hasKey = (key: string) => exerciseData[key] || userResponse;
      if (hasKey('situation') && hasKey('thought') && hasKey('reframe')) {
        console.log('CBT exercise data seems complete, processing insights...');
        setTimeout(() => {
          processAutomaticThoughtExercise();
        }, 2000); // Delay to let final AI response process
      }
    } catch (error) {
      console.error('Error extracting exercise data:', error);
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
      setSuggestions(contextService.generateSuggestions([])); // Empty array for first message suggestions
      
      // Save welcome message to storage
      await storageService.addMessage(welcomeMessage);
    } catch (error) {
      console.error('Error creating fresh chat session:', error);
      // Fallback to local welcome message
      const welcomeMessage = contextService.createWelcomeMessage();
      setMessages([welcomeMessage]);
      setSuggestions(contextService.generateSuggestions([])); // Empty array for first message suggestions
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
      
      if (Platform.OS === 'web') {
        // Use browser's native confirm for web
        const shouldSave = window.confirm(
          "Would you like to save this conversation to your history?\n\nClick 'OK' to save or 'Cancel' to discard."
        );
        
        if (shouldSave) {
          console.log('User chose: Save & End (web)');
          // Extract insights before saving and ending session
          extractInsightsAndSaveSession();
        } else {
          console.log('User chose: Don\'t Save (web)');
          // Still extract insights for user benefit, but don't save conversation
          extractInsightsAndEnd();
        }
      } else {
        // Use React Native Alert for mobile
        Alert.alert(
          "End Session?",
          "Would you like to save this conversation to your history?",
          [
            {
              text: "Don't Save",
              style: "destructive",
              onPress: () => {
                console.log('User chose: Don\'t Save');
                extractInsightsAndEnd();
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
                extractInsightsAndSaveSession();
              }
            }
          ],
          { cancelable: false }
        );
      }
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

  // Extract insights and save session
  const extractInsightsAndSaveSession = async () => {
    try {
      console.log('Saving session and extracting insights...');
      
      // Process any completed exercise data first
      if (currentExercise?.type === 'automatic-thoughts' && 
          exerciseData.situation && exerciseData.thought && exerciseData.reframe) {
        console.log('Processing completed CBT exercise data...');
        await processAutomaticThoughtExercise();
      }
      
      // Extract insights from full conversation
      const patterns = await insightService.extractAtSessionEnd();
      
      if (patterns.length > 0) {
        console.log(`✅ Extracted ${patterns.length} thought patterns from conversation`);
      }
      
      // Then save conversation to history
      await saveSessionToHistory();
      await storageService.clearCurrentSession();
      
      console.log('Session saved and insights extracted successfully');
      onBack();
    } catch (error) {
      console.error('Error in extractInsightsAndSaveSession:', error);
      // Still try to save and exit even if insights fail
      saveSessionToHistory()
        .then(() => storageService.clearCurrentSession())
        .finally(() => onBack());
    }
  };

  // Extract insights but don't save conversation
  const extractInsightsAndEnd = async () => {
    try {
      console.log('Extracting insights from conversation (not saving)...');
      
      // Extract insights for user benefit
      const patterns = await insightService.extractAtSessionEnd();
      
      if (patterns.length > 0) {
        console.log(`✅ Extracted ${patterns.length} thought patterns (conversation not saved)`);
      }
      
      // Clear session and exit
      await storageService.clearCurrentSession();
      console.log('Insights extracted, session cleared');
      onBack();
    } catch (error) {
      console.error('Error in extractInsightsAndEnd:', error);
      // Still clear and exit even if insights fail
      storageService.clearCurrentSession()
        .finally(() => onBack());
    }
  };

  // Process automatic thought exercise data and save as insights
  const processAutomaticThoughtExercise = async () => {
    try {
      console.log('Processing automatic thought exercise data:', exerciseData);
      
      // Validate we have the minimum required data
      if (!exerciseData.thought || !exerciseData.reframe) {
        console.log('Incomplete exercise data - skipping insight extraction');
        return;
      }

      // Create a thought pattern from the exercise
      const thoughtPattern = {
        id: `exercise_${Date.now()}_${Math.random()}`,
        originalThought: exerciseData.thought,
        distortionTypes: exerciseData.distortion ? [exerciseData.distortion] : ['Exercise Identified'],
        reframedThought: exerciseData.reframe,
        confidence: 0.95, // High confidence since user manually identified
        extractedFrom: {
          messageId: 'exercise_completion',
          sessionId: (await storageService.getCurrentSession())?.id || 'unknown'
        },
        timestamp: new Date().toISOString(),
        context: `CBT Exercise - Situation: ${exerciseData.situation || 'Not specified'}, Emotion: ${exerciseData.emotion || 'Not specified'}`
      };

      // Save to insights
      await storageService.addThoughtPattern(thoughtPattern);
      
      console.log('✅ Saved automatic thought exercise as insight pattern');
      
      // Show completion message
      const completionMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'exercise',
        title: '🎉 Exercise Complete!',
        content: `**Excellent work!** 🌟\n\nYou've successfully:\n• Identified an automatic thought\n• Spotted the thinking pattern\n• Created a balanced alternative\n\n${exerciseData['emotion-after'] ? `Your emotion shifted from the original intensity to ${exerciseData['emotion-after']} - notice how reframing thoughts can change how we feel!` : 'This insight has been saved to help you recognize similar patterns in the future.'}\n\n**Keep practicing this skill!** 💪`,
        exerciseType: currentExercise?.type,
        color: 'purple',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, completionMessage]);
      setSuggestions(['That was helpful 😊', 'I learned something new 🌟', 'I want to try again 🔄', 'Thank you 🙏']);
      
      // Save completion message
      await storageService.addMessage(completionMessage);
      
    } catch (error) {
      console.error('Error processing automatic thought exercise:', error);
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
      
      if (flow.useAI && flow.steps.length > 0) {
        // AI-guided exercise with step structure
        await handleAIGuidedExerciseResponse(text, flow);
        return;
      } else if (flow.useAI) {
        // AI-driven exercise - let AI handle the conversation dynamically
        await handleAIExerciseResponse(text, flow);
        return;
      } else {
        // Static exercise flow - use existing logic
        // Store user response if this is an exercise step
        if (flow.steps[exerciseStep]?.stepType) {
          const stepType = flow.steps[exerciseStep].stepType;
          setExerciseData(prev => ({
            ...prev,
            [stepType]: text
          }));
          console.log(`Captured ${stepType}: ${text}`);
        }
        
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
        } else {
          // Exercise completed - process the data
          if (currentExercise.type === 'automatic-thoughts') {
            setTimeout(() => {
              processAutomaticThoughtExercise();
            }, 1000);
          }
        }
        return;
      }
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
    // Enhanced formatting for therapeutic responses
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold for now - we'll handle it in rendering
      .replace(/\n/g, '\n');
  };

  // Enhanced message content renderer with rich formatting
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*|• .*?\n|^\d+\. .*$)/gm);
    
    return parts.map((part, index) => {
      // Bold text
      if (part.match(/^\*\*(.*)\*\*$/)) {
        const text = part.replace(/\*\*/g, '');
        return (
          <Text key={index} style={[styles.systemMessageText, { fontWeight: '600', color: '#1e293b' }]}>
            {text}
          </Text>
        );
      }
      
      // Bullet points
      if (part.match(/^• /)) {
        const text = part.replace(/^• /, '');
        return (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4 }}>
            <View style={{ 
              width: 6, 
              height: 6, 
              borderRadius: 3, 
              backgroundColor: '#3b82f6', 
              marginTop: 8, 
              marginRight: 12 
            }} />
            <Text style={[styles.systemMessageText, { flex: 1 }]}>
              {text}
            </Text>
          </View>
        );
      }
      
      // Numbered lists
      if (part.match(/^\d+\. /)) {
        return (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4 }}>
            <Text style={[styles.systemMessageText, { fontWeight: '600', color: '#3b82f6', marginRight: 8 }]}>
              {part.match(/^\d+\./)?.[0]}
            </Text>
            <Text style={[styles.systemMessageText, { flex: 1 }]}>
              {part.replace(/^\d+\. /, '')}
            </Text>
          </View>
        );
      }
      
      // Regular text
      return (
        <Text key={index} style={styles.systemMessageText}>
          {part}
        </Text>
      );
    });
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
                source={require('../../assets/images/turtle11.png')}
                style={styles.turtleAvatar}
                contentFit="cover"
              />
            </View>
            
            <View style={styles.systemMessageTextContainer}>
              {message.isAIGuided ? (
                <View>
                  {renderFormattedContent(message.content || message.text || 'Hello! I\'m here to listen and support you. 🌸')}
                </View>
              ) : (
                <Text style={styles.systemMessageText}>
                  {formatMessageContent(message.content || message.text || 'Hello! I\'m here to listen and support you. 🌸')}
                </Text>
              )}
              
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
                <View style={styles.sessionDetails}>
                  <Text style={styles.sessionTitle}>
                    {currentExercise && exerciseFlows[currentExercise.type] 
                      ? exerciseFlows[currentExercise.type].name 
                      : '🌸 Gentle Session'
                    }
                  </Text>
                  <Text style={styles.sessionSubtitle}>
                    {currentExercise && exerciseFlows[currentExercise.type] ? (
                      exerciseFlows[currentExercise.type].useAI && exerciseFlows[currentExercise.type].steps.length > 0 ?
                        `Step ${exerciseStep + 1} of ${exerciseFlows[currentExercise.type].steps.length} • ${exerciseFlows[currentExercise.type].steps[exerciseStep]?.title || currentExercise.duration}` :
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
                  <View style={styles.typingAvatar}>
                    <Image 
                      source={require('../../assets/images/turtle11.png')}
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