import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, Animated } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';

import { Send, Mic, ChevronLeft, MicOff, Sparkles, Heart, AlertCircle, Volume2, VolumeX, Pause, Play, Square, Check, X, Brain, Wind, Eye, BookOpen, Clock, Star, Copy, ArrowUp } from 'lucide-react-native';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import SoundWaveAnimation from '../components/SoundWaveAnimation';

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
  onActionSelect,
  onExerciseClick
}) => {
  const [fontsLoaded] = useFonts({
    Caveat_400Regular,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rateLimitStatus, setRateLimitStatus] = useState({ used: 0, total: 300, percentage: 0, message: '' });
  
  // Typewriter animation states
  const [typewriterText, setTypewriterText] = useState('');
  const [isTypewriting, setIsTypewriting] = useState(false);
  const [currentTypewriterMessage, setCurrentTypewriterMessage] = useState<Message | null>(null);
  const [ttsStatus, setTtsStatus] = useState<{ isSpeaking: boolean; isPaused: boolean; currentSpeechId: string | null }>({ isSpeaking: false, isPaused: false, currentSpeechId: null });
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [partialTranscript, setPartialTranscript] = useState('');
  const [exerciseData, setExerciseData] = useState<Record<string, any>>({});
  const [showExerciseCard, setShowExerciseCard] = useState<any>(null); // Exercise suggestion card
  
  // Debug: Monitor exercise card state changes
  useEffect(() => {
    console.log('=== EXERCISE CARD STATE CHANGE ===');
    console.log('showExerciseCard state:', showExerciseCard);
  }, [showExerciseCard]);
  const [exerciseMode, setExerciseMode] = useState(false); // Header state for exercise
  const backgroundAnimation = useRef(new Animated.Value(0)).current; // Background transition
  const headerAnimation = useRef(new Animated.Value(0)).current; // Header transition
  const scrollViewRef = useRef<ScrollView>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Modern animated typing cursor component
  const AnimatedTypingCursor = () => {
    const cursorOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, {
            toValue: 0.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(cursorOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );

      blinkAnimation.start();

      return () => blinkAnimation.stop();
    }, [cursorOpacity]);

    return (
      <Animated.View 
        style={{ 
          marginLeft: 3,
          marginTop: 2,
          opacity: cursorOpacity
        }}
      >
        <View
          style={{
            width: 2,
            height: 18,
            backgroundColor: '#3b82f6',
            borderRadius: 1,
          }}
        />
      </Animated.View>
    );
  };
  

  // Audio level state for real sound wave visualization with animation
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(7).fill(0.3));
  const waveAnimations = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(0.3))
  ).current;


  // Complete exercise library data for proper card display
  const exerciseLibraryData: Record<string, any> = {
    'automatic-thoughts': {
      id: 1,
      type: 'automatic-thoughts',
      name: 'Recognizing Automatic Thoughts',
      duration: '15 min',
      description: 'Identify and reframe negative thought patterns with CBT',
      category: 'CBT',
      difficulty: 'Intermediate',
      icon: Brain,
      color: ['#B5A7C6', '#D4B5D0'],
      image: require('../../assets/images/4.jpeg')
    },
    'breathing': {
      id: 2,
      type: 'breathing',
      name: '4-7-8 Breathing',
      duration: '5 min',
      description: 'Calm your nervous system with rhythmic breathing',
      category: 'Breathing',
      difficulty: 'Beginner',
      icon: Wind,
      color: ['#8FA5B3', '#C3D9E6'],
      image: require('../../assets/images/5.jpeg')
    },
    'mindfulness': {
      id: 3,
      type: 'mindfulness',
      name: 'Body Scan',
      duration: '10 min',
      description: 'Release tension through mindful awareness',
      category: 'Mindfulness',
      difficulty: 'Beginner',
      icon: Eye,
      color: ['#95B99C', '#B8C5A6'],
      image: require('../../assets/images/7.jpeg')
    },
    'gratitude': {
      id: 4,
      type: 'gratitude',
      name: 'Gratitude Practice',
      duration: '10 min',
      description: 'Shift focus to positive moments and appreciation',
      category: 'Mindfulness',
      difficulty: 'Beginner',
      icon: BookOpen,
      color: ['#FFD4BA', '#FFE5D4'],
      image: require('../../assets/images/8.jpeg')
    },
    'self-compassion': {
      id: 5,
      type: 'self-compassion',
      name: 'Self-Compassion Break',
      duration: '5 min',
      description: 'Practice kindness towards yourself',
      category: 'Self-Care',
      difficulty: 'Beginner',
      icon: Heart,
      color: ['#E8B5A6', '#F5E6D3'],
      image: require('../../assets/images/9.jpeg')
    },
    'stress-relief': {
      id: 6,
      type: 'stress-relief',
      name: 'Stress Relief',
      duration: '10 min',
      description: 'Release tension and find calm',
      category: 'Wellness',
      difficulty: 'Beginner',
      icon: Heart,
      color: ['#A8E6CF', '#DCEDC8'],
      image: require('../../assets/images/4.jpeg')
    },
    'values-clarification': {
      id: 6,
      type: 'values-clarification',
      name: '🌱 Living Closer to My Values',
      duration: '15 min',
      description: 'Discover what truly matters to you and align your actions (ACT)',
      category: 'ACT',
      difficulty: 'Intermediate',
      icon: Star,
      color: ['#D4C5B9', '#E5E5E5'],
      image: require('../../assets/images/2.jpeg')
    }
  };

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
    'breathing': {
      name: '🌬️ 4-7-8 Breathing',
      color: 'blue',
      useAI: true,
      steps: [
        {
          title: 'Welcome to Calming Breath',
          stepNumber: 1,
          description: 'Learn the 4-7-8 breathing technique for immediate calm',
          aiPrompt: `Welcome them warmly to this calming practice. Explain that 4-7-8 breathing activates the parasympathetic nervous system for quick stress relief. Ask how they're feeling right now and what brought them to try breathing exercises.`,
          dataToCapture: 'initial-state',
          suggestions: ['Feeling anxious', 'Very stressed', 'Can\'t relax', 'Need to calm down']
        },
        {
          title: 'Practice Together',
          stepNumber: 2,
          description: 'Guide through several rounds of 4-7-8 breathing',
          aiPrompt: `Guide them through 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8. Do 3-4 rounds together. Be encouraging and check in on how they're feeling. Remind them it's normal if it feels awkward at first.`,
          dataToCapture: 'breathing-experience',
          suggestions: ['That felt calming', 'Still feeling tense', 'Getting more relaxed', 'Hard to focus']
        },
        {
          title: 'Notice the Change',
          stepNumber: 3,
          description: 'Reflect on how you feel after the breathing practice',
          aiPrompt: `Ask them to notice any changes in their body or mind. Celebrate any shift, however small. Remind them this technique can be used anytime. Ask how they might use this tool in their daily life.`,
          dataToCapture: 'post-breathing-state',
          suggestions: ['Feel more relaxed', 'Mind is clearer', 'Still a bit tense', 'Would use this again']
        }
      ]
    },
    'self-compassion': {
      name: '💚 Self-Compassion Break',
      color: 'pink',
      useAI: true,
      steps: [
        {
          title: 'Recognizing Your Pain',
          stepNumber: 1,
          description: 'Acknowledge what you\'re struggling with right now',
          aiPrompt: `Create a safe space for them to share what's causing them pain or self-criticism. Validate that self-criticism is a common human experience. Ask them to share what's been hard on them lately - be deeply empathetic.`,
          dataToCapture: 'current-struggle',
          suggestions: ['I\'m being hard on myself', 'I made a mistake', 'I feel like I\'m failing', 'I\'m disappointed in myself']
        },
        {
          title: 'Understanding Common Humanity',
          stepNumber: 2,
          description: 'Recognize that struggle and imperfection are part of being human',
          aiPrompt: `Help them see that their struggle is part of the shared human experience. Share that everyone faces challenges, makes mistakes, and has difficult moments. Ask them to reflect on how they might comfort a good friend facing the same situation.`,
          dataToCapture: 'friend-compassion',
          suggestions: ['I\'d be kind to a friend', 'I\'d listen without judgment', 'I\'d remind them they\'re human', 'I\'d offer comfort']
        },
        {
          title: 'Offering Yourself Kindness',
          stepNumber: 3,
          description: 'Practice speaking to yourself with the same kindness you\'d show a friend',
          aiPrompt: `Guide them to offer themselves the same compassion they'd give a friend. Help them craft kind, supportive words for themselves. Encourage them to speak to themselves like a caring friend would. Practice self-compassionate language together.`,
          dataToCapture: 'self-kindness',
          suggestions: ['I\'m learning and growing', 'I deserve compassion', 'I\'m doing my best', 'This is hard, and that\'s okay']
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
          aiPrompt: `Welcome them warmly to this therapeutic exploration. Explain automatic thoughts in a relatable way - we all have them! Show genuine interest in their experience. Ask about a specific situation that triggered difficult thoughts, emphasizing they should share just the facts. Be curious and supportive.`,
          dataToCapture: 'situation',
          suggestions: ['At work today', 'During a conversation', 'Something happened', 'I was thinking about...']
        },
        {
          title: 'Emotion Recognition',
          stepNumber: 2,
          description: 'Identify and rate the emotional intensity',
          aiPrompt: `Respond with empathy to their situation. Help them connect with the emotion they felt - be patient and curious. Explain gently why noticing emotions matters. Ask for a 0-100 intensity rating, but focus on understanding what that feeling was like for them personally.`,
          dataToCapture: 'emotion',
          suggestions: ['I felt anxious', 'I was really sad', 'I got angry', 'I felt overwhelmed']
        },
        {
          title: 'Capturing Automatic Thoughts',
          stepNumber: 3,
          description: 'Identify the exact unhelpful thoughts',
          aiPrompt: `Show empathy for their emotion, then guide them gently toward the thought that popped up. Explain that automatic thoughts are like mental reflexes - fast and often harsh. Be patient as they try to remember. Encourage them to share the exact thought, even if it feels silly or harsh.`,
          dataToCapture: 'thought',
          suggestions: ['I always mess up', 'I\'m not good enough', 'This will go wrong', 'I can\'t do this']
        },
        {
          title: 'Spotting Thinking Patterns',
          stepNumber: 4,
          description: 'Identify cognitive distortions in the thought',
          aiPrompt: `Acknowledge their thought with understanding - normalize that we all have harsh inner voices. Introduce cognitive distortions as common human thinking patterns, not flaws. Help them explore which distortion might fit their thought. Be curious and non-judgmental.`,
          dataToCapture: 'distortion',
          suggestions: ['All-or-Nothing Thinking', 'Catastrophizing', 'Mind Reading', 'Fortune Telling', 'Emotional Reasoning']
        },
        {
          title: 'Examining Evidence',
          stepNumber: 5,
          description: 'Look at facts that support and contradict the thought',
          aiPrompt: `Respond thoughtfully to their identified distortion. Guide them like a curious detective to examine evidence. Ask what facts support their thought, then what contradicts it. Emphasize this is about understanding, not proving right/wrong. Be patient with their process.`,
          dataToCapture: 'evidence',
          suggestions: ['Evidence for...', 'Evidence against...', 'The facts show...', 'Looking objectively...']
        },
        {
          title: 'Creating Balance',
          stepNumber: 6,
          description: 'Develop a realistic, supportive alternative thought',
          aiPrompt: `Acknowledge their evidence exploration thoughtfully. Help them craft a more balanced thought - not fake positivity, but realistic kindness. Guide them to create something that honors reality while being more supportive. Be encouraging about their insight.`,
          dataToCapture: 'reframe',
          suggestions: ['A more balanced view is...', 'Realistically speaking...', 'A kinder thought might be...']
        },
        {
          title: 'Measuring Change',
          stepNumber: 7,
          description: 'Re-evaluate emotional intensity after reframing',
          aiPrompt: `Celebrate their reframed thought genuinely. Ask them to re-rate their emotion (0-100) with curiosity about any shift. Validate whatever happens - even small changes matter. Reflect on their growth and normalize that this skill develops with practice.`,
          dataToCapture: 'emotion-after',
          suggestions: ['Much better (30/100)', 'Somewhat improved (50/100)', 'About the same', 'I notice a difference']
        }
      ]
    },
    'values-clarification': {
      name: '🌱 Living Closer to My Values',
      color: 'green',
      useAI: true,
      steps: [
        {
          title: 'Discover Your Values',
          stepNumber: 1,
          description: 'Identify what truly matters to you through reflection',
          aiPrompt: `Start the ACT Values exercise warmly. Ask: "Think of a moment you felt proud, alive, or deeply satisfied. What mattered most to you in that moment?" Help them reflect on a specific proud moment to identify their core values. Be encouraging and guide them to write a short phrase about what mattered.`,
          dataToCapture: 'values-moment',
          suggestions: ['Connection with others', 'Personal growth', 'Being helpful', 'Creating something', 'Learning new things']
        },
        {
          title: 'Choose Your Core Values', 
          stepNumber: 2,
          description: 'Select 1-2 values from common values or add your own',
          aiPrompt: `Present this list of common values: **Growth, Family, Health, Honesty, Creativity, Connection, Freedom, Justice, Adventure, Security, Achievement, Compassion, Independence, Peace**. Ask them to pick 1-2 that resonate most deeply, or they can add their own. Explain why identifying core values matters for well-being.`,
          dataToCapture: 'core-values',
          suggestions: ['Growth', 'Connection', 'Health', 'Creativity', 'Family', 'Add my own value']
        },
        {
          title: 'Rate Your Alignment',
          stepNumber: 3,
          description: 'Assess how close your daily life feels to your values (0-100)',
          aiPrompt: `Ask them: "In your day-to-day life, how close do you feel to living this value? Rate it from 0-100." Be curious about their rating. If it's lower, normalize that - perfect alignment isn't expected. Ask what contributes to that specific number.`,
          dataToCapture: 'alignment-rating',
          suggestions: ['85/100 - Pretty aligned', '60/100 - Somewhat close', '40/100 - Not very close', '20/100 - Far from it']
        },
        {
          title: 'Plan One Small Action',
          stepNumber: 4,
          description: 'Identify one concrete step you can take today',
          aiPrompt: `Ask: "What's one small thing you could do today that reflects this value?" Emphasize SMALL and SPECIFIC actions. Help them think of something achievable today. Be encouraging - any step toward values matters. This becomes their Values Action.`,
          dataToCapture: 'values-action',
          suggestions: ['Text someone I care about', 'Read for 10 minutes', 'Take a walk outside', 'Write in my journal', 'Try something creative']
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
          enterExerciseMode(); // Add smooth transition for library exercises too
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
      console.log('Ensuring exercise mode is properly set...');
      
      // Ensure exercise mode is properly maintained
      setExerciseMode(true);
      
      // Start with step 0
      setExerciseStep(0);
      const currentStep = flow.steps[0];
      
      // Get AI response for this step
      const systemPrompt = `You are a warm, compassionate CBT therapist starting the "${currentExercise.name}" exercise.

**THERAPEUTIC APPROACH:**
You're beginning a therapeutic conversation that will naturally guide through CBT concepts. This isn't a rigid questionnaire - it's a real therapeutic interaction.

**STARTING FOCUS:**
Step 1: ${currentStep.title}
Goal: ${currentStep.description}
Guidance: ${currentStep.aiPrompt}

**YOUR THERAPEUTIC RESPONSE:**
- **Welcome them warmly** to this therapeutic space
- **Explain briefly** what this exercise can help with
- **Start the conversation naturally** based on the step guidance
- **Be genuinely interested** in their experience
- **Ask engaging questions** that invite reflection

**REMEMBER:** You're having a real therapeutic conversation that happens to follow a CBT structure. Focus on building connection and understanding, not just collecting information.

**FORMATTING YOUR RESPONSE:**
• Use **bold text** for key concepts, emotions, or important phrases
• Use bullet points (•) to organize information clearly  
• Use numbered lists (1., 2., 3.) for steps or sequences
• Keep your message well-structured and easy to read
• Break up longer thoughts with line breaks`;

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
        
        // For exercise mode, start with clean messages or use current messages
        const currentMessages = messages.length > 0 ? messages : [];
        const updatedMessages = [...currentMessages, aiMessage];
        setMessages(updatedMessages);
        await storageService.addMessage(aiMessage);
        
        console.log('Exercise mode state after AI response:', true);
        console.log('Messages updated, exercise should be visible');
        console.log('Current exercise type:', currentExercise.type);
        console.log('Exercise step:', 0);
        
        // Extract AI suggestions or use step defaults
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
        
        // For exercise mode, start with clean messages or use current messages  
        const currentMessages = messages.length > 0 ? messages : [];
        const updatedMessages = [...currentMessages, fallbackMessage];
        setMessages(updatedMessages);
        setSuggestions(currentStep.suggestions);
        
        console.log('Fallback exercise message created, exercise mode should be active');
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

        await addAIMessageWithTypewriter(aiResponse);

        // Auto-play TTS if enabled
        await ttsService.speakIfAutoPlay(response.message);

        // Check for exercise suggestions and generate contextual responses
        console.log('Checking for exercise suggestions in AI response...');
        const exerciseSuggestions = detectAndParseExerciseSuggestions(response.message);
        console.log('Exercise suggestions found:', exerciseSuggestions);
        const contextualSuggestions = contextService.generateSuggestions([...recentMessages, aiResponse]);
        
        // Use exercise suggestions if available, otherwise use contextual suggestions
        const finalSuggestions = exerciseSuggestions.length > 0 
          ? exerciseSuggestions
          : contextualSuggestions;
        
        setSuggestions(finalSuggestions);
        
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
        
        const systemPrompt = `You are a warm, compassionate CBT therapist. You're having a real therapeutic conversation within the structure of a CBT exercise.

**THERAPEUTIC CONTEXT:**
Previous step: "${currentStep.title}" 
What they shared: "${userText}"

**MOVING TO NEXT STEP:**
Step ${nextStep.stepNumber}/7: ${nextStep.title}
Goal: ${nextStep.description}

**BE A REAL THERAPIST:**
1. **Respond authentically** to what they just shared - acknowledge, validate, reflect
2. **Make meaningful connections** between their sharing and the therapeutic process
3. **Transition naturally** to the next step when therapeutically appropriate
4. **Ask engaging questions** that show you're listening and want to understand
5. **Be genuinely curious** about their experience

**GUIDANCE FOR THIS STEP:** ${nextStep.aiPrompt}

**REMEMBER:** You're not just following a script - you're having a real therapeutic conversation that happens to follow CBT structure. Respond to their emotions, ask follow-ups if needed, and make them feel truly heard.

**FORMATTING YOUR RESPONSE:**
• Use **bold text** for key concepts, emotions, or important phrases
• Use bullet points (•) to organize information clearly  
• Use numbered lists (1., 2., 3.) for steps or sequences
• Keep your message well-structured and easy to read
• Break up longer thoughts with line breaks`;

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

          await addAIMessageWithTypewriter(aiResponse);
          
          // Extract AI suggestions or use step defaults
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
        
        // Exit exercise mode with smooth transition
        exitExerciseMode();
        
        // Show saved insight card after a delay
        setTimeout(() => {
          const insightCard: Message = {
            id: (Date.now() + Math.random()).toString(),
            type: 'system',
            content: `**Saved to Insights** ✅\n\nYour thought reframe has been added to your personal patterns. You can review all your insights in the Insights tab.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAIGuided: true
          };
          
          setMessages(prev => [...prev, insightCard]);
          storageService.addMessage(insightCard);
        }, 2000);
        
        setSuggestions(['That was helpful 😊', 'I learned something new 🌟', 'I want to try again 🔄', 'Thank you 🙏']);
        
      } else {
        // Stay on current step - ask for more clarification
        const clarificationPrompt = `You are a warm, compassionate CBT therapist having a real therapeutic conversation.

**WHAT THEY SHARED:** "${userText}"

**CURRENT THERAPEUTIC FOCUS:**
Step ${currentStep.stepNumber}/7: ${currentStep.title}
Goal: ${currentStep.description}

**YOUR THERAPEUTIC RESPONSE:**
You sense this person has more to share or process around this topic. As a skilled therapist, you want to:

1. **Acknowledge what they shared** - validate their experience
2. **Show genuine curiosity** - what resonates with you about their response?
3. **Ask thoughtful follow-up questions** that help them go deeper
4. **Stay present with their emotions** - what do you sense they're feeling?
5. **Guide gently toward more insight** without rushing

**THERAPEUTIC GUIDANCE:** ${currentStep.aiPrompt}

**BE REAL:** Don't just ask for "more detail" - be a real therapist who's genuinely interested in understanding this person's experience. What would you naturally want to know more about? What therapeutic curiosity do you have?`;

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

          await addAIMessageWithTypewriter(aiResponse);
          
          // Extract AI suggestions or use step defaults
          setSuggestions(currentStep.suggestions);
          
          await ttsService.speakIfAutoPlay(response.message);
        }
      }
      
    } catch (error) {
      console.error('Error in handleAIGuidedExerciseResponse:', error);
    }
  };

  // AI-powered therapeutic assessment - decides when to move forward vs. explore deeper
  const assessStepCompletion = async (userResponse: string, currentStep: any, conversationHistory: any[]): Promise<boolean> => {
    try {
      // Use AI to make therapeutic decision about progression
      const assessmentPrompt = `You are an expert CBT therapist assessing whether to move forward in an exercise or explore deeper.

**EXERCISE CONTEXT:**
Step ${currentStep.stepNumber}/7: ${currentStep.title}
Goal: ${currentStep.description}

**USER'S RESPONSE:** 
"${userResponse}"

**CONVERSATION HISTORY:**
${conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

**THERAPEUTIC ASSESSMENT NEEDED:**
Decide whether this response shows sufficient depth and engagement for this CBT step, or if you should ask follow-up questions to understand better.

**RESPOND WITH ONLY:**
- "ADVANCE" - if their response shows good self-awareness and completion of this step's goal
- "EXPLORE" - if you need to ask clarifying questions, probe deeper, or help them process more

**DECISION FACTORS:**
- Quality of self-reflection, not just length
- Emotional engagement with the topic  
- Specificity appropriate for this CBT step
- Therapeutic readiness to move forward

Your decision:`;

      const response = await apiService.getChatCompletionWithContext([
        { role: 'system', content: assessmentPrompt }
      ]);

      if (response.success && response.message) {
        const decision = response.message.trim().toUpperCase();
        console.log('AI therapeutic assessment:', decision);
        return decision.includes('ADVANCE');
      }
      
      // Fallback to simple heuristic if AI fails
      return userResponse.trim().length >= 8;
      
    } catch (error) {
      console.error('Error in AI step assessment:', error);
      // Fallback to simple heuristic
      return userResponse.trim().length >= 8;
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

  // Extract insights and save session - BACKGROUND PROCESSING
  const extractInsightsAndSaveSession = async () => {
    try {
      console.log('Starting background session save and insight extraction...');
      
      // IMMEDIATELY return to main app - don't block the user!
      onBack();
      
      // Continue processing in background
      // Save conversation to history first (fast operation)
      await saveSessionToHistory();
      await storageService.clearCurrentSession();
      console.log('Session saved to history and cleared');
      
      // Process insights in background (slow AI operations)
      setTimeout(async () => {
        try {
          if (currentExercise?.type === 'automatic-thoughts' && 
              exerciseData.situation && exerciseData.thought && exerciseData.reframe) {
            console.log('Background: Processing completed CBT exercise data...');
            await processAutomaticThoughtExercise();
          }
          
          // Extract insights from full conversation
          const patterns = await insightService.extractAtSessionEnd();
          
          if (patterns.length > 0) {
            console.log(`✅ Background: Extracted ${patterns.length} thought patterns`);
          }
        } catch (error) {
          console.error('Background insight extraction failed:', error);
        }
      }, 100); // Small delay to ensure UI transition completes
      
    } catch (error) {
      console.error('Error in extractInsightsAndSaveSession:', error);
      // Ensure user still gets back to main app
      onBack();
    }
  };

  // Extract insights but don't save conversation - BACKGROUND PROCESSING
  const extractInsightsAndEnd = async () => {
    try {
      console.log('Background insight extraction (not saving conversation)...');
      
      // IMMEDIATELY return to main app - don't block the user!
      onBack();
      
      // Clear session first (fast operation)
      await storageService.clearCurrentSession();
      console.log('Session cleared');
      
      // Extract insights in background (slow AI operation)
      setTimeout(async () => {
        try {
          const patterns = await insightService.extractAtSessionEnd();
          
          if (patterns.length > 0) {
            console.log(`✅ Background: Extracted ${patterns.length} thought patterns (conversation not saved)`);
          }
        } catch (error) {
          console.error('Background insight extraction failed:', error);
        }
      }, 100); // Small delay to ensure UI transition completes
      
    } catch (error) {
      console.error('Error in extractInsightsAndEnd:', error);
      // Ensure user still gets back to main app
      onBack();
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

  const handleCopyMessage = async (content: string) => {
    try {
      await Clipboard.setStringAsync(content);
      // Could add a toast notification here
    } catch (error) {
      console.error('Error copying message:', error);
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
    
    // Check if user is accepting a previously suggested exercise
    // Look for acceptance keywords after AI has suggested exercises
    const isAcceptance = /^(yes|ok|sure|let's try|let's do it|sounds good|i'd like to|that would help|let's start)$/i.test(text.trim()) ||
                        text.toLowerCase().includes('yes, let\'s try') ||
                        text.toLowerCase().includes('sounds like a good idea');
    
    if (isAcceptance) {
      // Check the last few messages to see if AI suggested an exercise
      const recentMessages = await storageService.getLastMessages(5);
      const lastAiMessage = recentMessages
        .filter(msg => msg.type === 'system')
        .pop();
      
      if (lastAiMessage) {
        console.log('Checking last AI message for exercise suggestion:', lastAiMessage.text);
        const exerciseSuggestions = detectAndParseExerciseSuggestions(lastAiMessage.text || lastAiMessage.content || '');
        if (exerciseSuggestions.length > 0) {
          console.log('User accepted exercise suggestion from previous AI message');
          return; // The detection function already showed the card
        }
      }
    }
    
    // Simple test triggers - remove these when AI system is working
    if (text.toLowerCase().includes('show exercise card')) {
      const exercise = exerciseLibraryData['breathing'];
      setShowExerciseCard(exercise);
      console.log('Test exercise card shown');
    }
    
    if (text.toLowerCase().includes('test values')) {
      console.log('🧪 TEST VALUES TRIGGER ACTIVATED');
      const exercise = exerciseLibraryData['values-clarification'];
      console.log('Exercise found:', exercise);
      console.log('Exercise name:', exercise?.name);
      console.log('Exercise type:', exercise?.type);
      setShowExerciseCard(exercise);
      console.log('✅ Test values exercise card set in state');
      console.log('Current showExerciseCard state should now be:', exercise);
      return;
    }
    
    try {
      await storageService.addMessage(userMessage);
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    // Check if user is accepting an exercise suggestion
    if (showExerciseCard && (
      text.toLowerCase().includes('yes') || 
      text.toLowerCase().includes('let\'s try') ||
      text.toLowerCase().includes('start') ||
      text.includes('✨')
    )) {
      console.log('=== USER ACCEPTED EXERCISE SUGGESTION ===');
      console.log('User typed:', text);
      console.log('Exercise to start:', showExerciseCard);
      console.log('About to call handleExerciseCardStart...');
      handleExerciseCardStart(showExerciseCard);
      return;
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
      console.log('Main chat API response:', response);

      setIsTyping(false);

      if (response.success && response.message) {
        console.log('API Response received:', response.message);
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

        // Add to UI with typewriter animation
        await addAIMessageWithTypewriter(aiResponse);

        // Auto-play TTS if enabled
        await ttsService.speakIfAutoPlay(response.message);

        // Extract AI-generated suggestions or use contextual fallback
        const contextualSuggestions = contextService.generateSuggestions([...recentMessages, userMessage, aiResponse]);
        setSuggestions(contextualSuggestions);
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
        console.log('Audio level received:', level, 'Frequency data length:', frequencyData?.length);
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
    console.log('updateSoundWaves called - audioLevel:', audioLevel, 'frequencyData:', frequencyData);
    if (frequencyData && frequencyData.length >= 7) {
      // Use real frequency data for each bar - animate smoothly to new values
      frequencyData.forEach((level, index) => {
        if (index < waveAnimations.length) {
          const targetHeight = Math.max(0.3, Math.min(1, level));
          
          // Animate to the new frequency level with smooth transition
          Animated.timing(waveAnimations[index], {
            toValue: targetHeight,
            duration: 80, // Fast response for real-time feel
            useNativeDriver: false,
          }).start();
        }
      });
      
      // Also update state for immediate rendering (fallback)
      setAudioLevels(frequencyData.map(level => Math.max(0.3, Math.min(1, level))));
    } else {
      // Fallback to single level distributed across bars with animation
      const baseLevel = Math.max(0.3, Math.min(1, audioLevel));
      const newLevels = Array.from({ length: 7 }, (_, i) => {
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
    
    setAudioLevels(Array(7).fill(0.3));
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


  // Enhanced message content renderer with rich formatting
  const renderFormattedContent = (content: string) => {
    // Split by lines first, then process each line
    const lines = content.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (!line.trim()) {
        return <View key={lineIndex} style={{ height: 8 }} />;
      }
      
      // Check for bold text with **
      if (line.includes('**')) {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <View key={lineIndex} style={{ marginVertical: 2 }}>
            <Text style={styles.systemMessageText}>
              {parts.map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  const boldText = part.replace(/\*\*/g, '');
                  return (
                    <Text key={partIndex} style={{ fontWeight: '700', color: '#1e293b' }}>
                      {boldText}
                    </Text>
                  );
                }
                return part;
              })}
            </Text>
          </View>
        );
      }
      
      // Check for bullet points
      if (line.startsWith('• ')) {
        const text = line.replace(/^• /, '');
        return (
          <View key={lineIndex} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 3 }}>
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
      
      // Check for numbered lists
      if (/^\d+\. /.test(line)) {
        const match = line.match(/^(\d+\.) (.+)$/);
        if (match) {
          return (
            <View key={lineIndex} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 3 }}>
              <Text style={[styles.systemMessageText, { fontWeight: '600', color: '#3b82f6', marginRight: 8 }]}>
                {match[1]}
              </Text>
              <Text style={[styles.systemMessageText, { flex: 1 }]}>
                {match[2]}
              </Text>
            </View>
          );
        }
      }
      
      // Regular text
      return (
        <Text key={lineIndex} style={[styles.systemMessageText, { marginVertical: 2 }]}>
          {line}
        </Text>
      );
    });
  };


  // AI-powered exercise detection - parse natural AI suggestions
  const detectAndParseExerciseSuggestions = (aiMessage: string): string[] => {
    console.log('=== AI-POWERED EXERCISE DETECTION ===');
    console.log('AI Message length:', aiMessage.length);
    console.log('AI Message (first 200 chars):', aiMessage.substring(0, 200));
    console.log('Full AI Message:', aiMessage);
    
    // Look for AI exercise suggestions in natural language format:
    // "Would you like to try a brief [EXERCISE NAME] exercise that might help with this?"
    const exerciseSuggestionMatch = aiMessage.match(/Would you like to try a brief (.+?) exercise/i);
    
    // Also try alternative patterns for exercise suggestions
    const alternativePattern1 = aiMessage.match(/try a brief (.+?) exercise that might help/i);
    const alternativePattern2 = aiMessage.match(/Would you like to try.*?([A-Z][^?]*?).*?exercise/i);
    
    // Specific pattern for "Living Closer to My Values" 
    const valuesPattern = aiMessage.match(/Living Closer to (?:My )?Values/i);
    
    // Check for specific exercise names mentioned anywhere in the message
    const specificExercisePatterns = {
      'values-clarification': [
        /Living Closer to (?:My )?Values/i,
        /values clarification/i,
        /values exercise/i
      ],
      'automatic-thoughts': [
        /Automatic Thoughts CBT/i,
        /CBT exercise/i,
        /thought challenge/i
      ],
      'mindfulness': [
        /Body Scan Mindfulness/i,
        /mindfulness exercise/i,
        /body scan/i
      ],
      'breathing': [
        /4-7-8 Breathing/i,
        /breathing exercise/i,
        /breath work/i
      ],
      'gratitude': [
        /Gratitude Practice/i,
        /gratitude exercise/i
      ],
      'self-compassion': [
        /Self-Compassion Break/i,
        /self-compassion exercise/i
      ]
    };
    
    let exerciseName = null;
    if (exerciseSuggestionMatch) {
      exerciseName = exerciseSuggestionMatch[1].toLowerCase().trim();
    } else if (alternativePattern1) {
      exerciseName = alternativePattern1[1].toLowerCase().trim();
    } else if (alternativePattern2) {
      exerciseName = alternativePattern2[1].toLowerCase().trim();
    }
    
    console.log('=== EXERCISE DETECTION PATTERNS ===');
    console.log('Main pattern match:', exerciseSuggestionMatch?.[1]);
    console.log('Alternative pattern 1:', alternativePattern1?.[1]);
    console.log('Alternative pattern 2:', alternativePattern2?.[1]);
    console.log('Values pattern match:', valuesPattern?.[0]);
    console.log('Final exercise name:', exerciseName);
    
    // First check for specific exercise patterns before general parsing
    for (const [exerciseType, patterns] of Object.entries(specificExercisePatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(aiMessage)) {
          console.log('🎯 DIRECT EXERCISE PATTERN MATCH:', exerciseType, pattern);
          const exercise = exerciseLibraryData[exerciseType];
          if (exercise) {
            setShowExerciseCard(exercise);
            console.log('✅ Exercise card shown via direct pattern:', exercise.name);
            return [`✨ Yes, let's try it`, '💭 Tell me more about it first', '🤔 Maybe later'];
          }
        }
      }
    }
    
    if (exerciseName) {
      console.log('=== EXACT MATCH FOUND ===');
      console.log('AI suggested exercise name:', exerciseName);
      
      // Map exercise names to types - more comprehensive mapping
      const nameToType = {
        'automatic thoughts cbt': 'automatic-thoughts',
        'automatic thoughts': 'automatic-thoughts',
        'cbt': 'automatic-thoughts',
        'body scan mindfulness': 'mindfulness', 
        'body scan': 'mindfulness',
        'mindfulness': 'mindfulness',
        '4-7-8 breathing': 'breathing',
        'breathing': 'breathing',
        'breath work': 'breathing',
        'gratitude practice': 'gratitude',
        'gratitude': 'gratitude',
        'self-compassion break': 'self-compassion',
        'self-compassion': 'self-compassion',
        'living closer to my values': 'values-clarification',
        'values clarification': 'values-clarification',
        'values': 'values-clarification',
        'value': 'values-clarification',
        'stress relief': 'stress-relief',
        'stress': 'stress-relief'
      };
      
      const exerciseType = nameToType[exerciseName];
      console.log('Mapped exercise name to type:', exerciseName, '->', exerciseType);
      
      if (exerciseType) {
        const exercise = exerciseLibraryData[exerciseType];
        if (exercise) {
          setShowExerciseCard(exercise);
          console.log('✅ AI-suggested exercise card shown:', exercise.name, 'for type:', exerciseType);
          return [`✨ Yes, let's try it`, '💭 Tell me more about it first', '🤔 Maybe later'];
        }
      } else {
        console.warn('❌ Unknown exercise name from AI:', exerciseName);
        console.log('Available mappings:', Object.keys(nameToType));
        
        // Try partial matching for debugging
        console.log('=== PARTIAL MATCH ATTEMPTS ===');
        const partialMatches = Object.keys(nameToType).filter(key => 
          key.includes(exerciseName) || exerciseName.includes(key)
        );
        console.log('Partial matches found:', partialMatches);
        
        // Check for values-related terms specifically
        if (exerciseName.includes('value') || exerciseName.includes('living') || exerciseName.includes('closer')) {
          console.log('💡 This seems to be a values exercise, forcing values-clarification type');
          const exercise = exerciseLibraryData['values-clarification'];
          if (exercise) {
            setShowExerciseCard(exercise);
            console.log('✅ Values exercise card shown via fallback');
            return [`✨ Yes, let's try it`, '💭 Tell me more about it first', '🤔 Maybe later'];
          }
        }
      }
    } else {
      console.log('No exact "Would you like to try a brief..." pattern found');
    }
    
    // Also look for simpler suggestion patterns
    const simplePatterns = [
      /try.*breathing.*exercise/i,
      /breathing.*technique.*help/i,
      /mindfulness.*practice.*might.*help/i,
      /gratitude.*exercise.*would.*help/i,
      /cbt.*exercise.*for.*thoughts/i,
      /self-compassion.*practice/i
    ];
    
    for (const pattern of simplePatterns) {
      if (pattern.test(aiMessage)) {
        let exerciseType = 'breathing'; // default
        const lower = aiMessage.toLowerCase();
        
        if (lower.includes('breathing') || lower.includes('breath')) {
          exerciseType = 'breathing';
        } else if (lower.includes('mindfulness') || lower.includes('meditation')) {
          exerciseType = 'mindfulness';
        } else if (lower.includes('gratitude')) {
          exerciseType = 'gratitude';
        } else if (lower.includes('cbt') || lower.includes('thoughts')) {
          exerciseType = 'automatic-thoughts';
        } else if (lower.includes('compassion')) {
          exerciseType = 'self-compassion';
        } else if (lower.includes('stress') || lower.includes('tension')) {
          exerciseType = 'stress-relief';
        }
        
        const exercise = exerciseLibraryData[exerciseType];
        if (exercise) {
          setShowExerciseCard(exercise);
          console.log('Pattern-matched exercise card shown:', exercise.name);
          return [`✨ Yes, let's try it`, '💭 Tell me more about it first', '🤔 Maybe later'];
        }
        break;
      }
    }
    
    // Map of exercise detection keywords to actual exercise library data
    const exerciseKeywords = {
      'automatic thoughts': 'automatic-thoughts',
      'thought challenge': 'automatic-thoughts', 
      'cbt': 'automatic-thoughts',
      'negative thoughts': 'automatic-thoughts',
      'thinking patterns': 'automatic-thoughts',
      'body scan': 'mindfulness',
      'mindfulness': 'mindfulness',
      'meditation': 'mindfulness',
      'breathing': 'breathing',
      '4-7-8': 'breathing',
      'breath': 'breathing',
      'gratitude': 'gratitude',
      'thankful': 'gratitude',
      'appreciation': 'gratitude',
      'self-compassion': 'self-compassion',
      'self compassion': 'self-compassion',
      'be kind to yourself': 'self-compassion',
      'values': 'values-clarification',
      'living closer to my values': 'values-clarification',
      'purpose': 'values-clarification',
      'direction': 'values-clarification',
      'meaning': 'values-clarification',
      'stress': 'stress-relief',
      'stressed': 'stress-relief',
      'tension': 'stress-relief',
      'overwhelmed': 'stress-relief'
    };
    
    // Check if AI is suggesting an exercise - much simpler detection
    const lower = aiMessage.toLowerCase();
    const containsExerciseKeywords = Object.keys(exerciseKeywords).some(keyword => lower.includes(keyword));
    const containsSuggestionWords = lower.includes('try') || lower.includes('help') || lower.includes('practice') || 
                                   lower.includes('exercise') || lower.includes('technique') || lower.includes('would you');
    
    const isExerciseSuggestion = containsExerciseKeywords && containsSuggestionWords;
    
    console.log('Is Exercise Suggestion:', isExerciseSuggestion);
    console.log('Contains Exercise Keywords:', containsExerciseKeywords);
    console.log('Contains Suggestion Words:', containsSuggestionWords);
    console.log('AI message analysis:', {
      'contains any exercise keyword': containsExerciseKeywords,
      'contains suggestion word': containsSuggestionWords,
      'detected keywords': Object.keys(exerciseKeywords).filter(keyword => lower.includes(keyword)),
      'message length': aiMessage.length,
      'first 100 chars': aiMessage.substring(0, 100)
    });
    
    if (!isExerciseSuggestion) {
      console.log('No exercise suggestion detected');
      return [];
    }
    
    // Find which exercise is being suggested
    for (const [keyword, exerciseType] of Object.entries(exerciseKeywords)) {
      if (lower.includes(keyword)) {
        const exerciseData = exerciseLibraryData[exerciseType];
        if (exerciseData) {
          console.log('Exercise detected:', keyword, exerciseData);
          setShowExerciseCard(exerciseData);
          console.log('Exercise card set:', exerciseData);
          return [`✨ Try ${exerciseData.name}`, '💭 Tell me more first', '🤔 Not right now'];
        }
      }
    }
    
    // Generic exercise suggestion - if detected but no specific type found, suggest breathing
    if (isExerciseSuggestion) {
      console.log('Generic exercise suggestion detected, showing breathing exercise');
      const defaultExercise = exerciseLibraryData['breathing'];
      setShowExerciseCard(defaultExercise);
      console.log('Default exercise card set:', defaultExercise);
      return ['✨ Yes, let\'s try it', '💭 Tell me more first', '🤔 Maybe later'];
    }
    
    return [];
  };

  // Typewriter animation for AI messages - modern and fast
  const startTypewriterAnimation = (message: Message, fullText: string, speed = 8) => {
    setCurrentTypewriterMessage(message);
    setTypewriterText('');
    setIsTypewriting(true);
    
    // Clear any existing timeout
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    let currentIndex = 0;
    
    const typeNextCharacter = () => {
      if (currentIndex < fullText.length) {
        // Modern approach: type 1-3 characters at once for more natural feel
        const charsToAdd = Math.min(
          fullText.length - currentIndex,
          Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : 1
        );
        
        currentIndex += charsToAdd;
        setTypewriterText(fullText.substring(0, currentIndex));
        
        // Auto-scroll during typing (less frequently to avoid performance issues)
        if (currentIndex % 8 === 0) {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 30);
        }
        
        // Variable speed for more natural typing rhythm
        const variableSpeed = speed + Math.random() * 4;
        typewriterTimeoutRef.current = setTimeout(typeNextCharacter, variableSpeed);
      } else {
        // Animation complete
        setIsTypewriting(false);
        setCurrentTypewriterMessage(null);
        setTypewriterText('');
        
        // Update the actual message content
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === message.id 
              ? { ...msg, content: fullText, text: fullText }
              : msg
          )
        );
        
        // Final scroll to ensure everything is visible
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    };
    
    typeNextCharacter();
  };

  // Stop typewriter animation and show full text immediately
  const skipTypewriterAnimation = () => {
    if (currentTypewriterMessage && typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
      typewriterTimeoutRef.current = null;
      
      // Get the full text that should be displayed
      const fullText = currentTypewriterMessage.content || currentTypewriterMessage.text || '';
      
      // Update the message immediately with full content
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === currentTypewriterMessage.id 
            ? { ...msg, content: fullText, text: fullText }
            : msg
        )
      );
      
      // Clean up animation state
      setIsTypewriting(false);
      setCurrentTypewriterMessage(null);
      setTypewriterText('');
    }
  };

  // Stop typewriter animation if needed (cleanup version)
  const stopTypewriterAnimation = () => {
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
      typewriterTimeoutRef.current = null;
    }
    setIsTypewriting(false);
    setCurrentTypewriterMessage(null);
    setTypewriterText('');
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
    
    setMessages(prev => [...prev, messageWithEmptyContent]);
    
    // Start typewriter animation
    startTypewriterAnimation(messageWithEmptyContent, fullText);
    
    // Save to storage with full content
    await storageService.addMessage(message);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, []);

  // Smooth transition into exercise mode
  const enterExerciseMode = () => {
    console.log('=== ENTERING EXERCISE MODE ===');
    console.log('Setting exercise mode to true');
    setExerciseMode(true);
    
    console.log('Starting background animation...');
    // Animate background to calm gradient
    Animated.timing(backgroundAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start(() => {
      console.log('Background animation completed');
    });
    
    console.log('Starting header animation...');
    // Animate header transition
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      console.log('Header animation completed');
    });
  };

  // Smooth transition out of exercise mode
  const exitExerciseMode = () => {
    setExerciseMode(false);
    
    // Animate background back to normal
    Animated.timing(backgroundAnimation, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
    
    // Animate header back to normal
    Animated.timing(headerAnimation, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  // Handle exercise card start
  const handleExerciseCardStart = (exerciseInfo: any) => {
    console.log('=== EXERCISE CARD START ===');
    console.log('Exercise info:', exerciseInfo);
    
    // Hide the card first
    setShowExerciseCard(null);
    
    // Create proper exercise object 
    const exercise = {
      type: exerciseInfo.type,
      name: exerciseInfo.name,
      duration: exerciseInfo.duration,
      description: exerciseInfo.description || 'AI-guided exercise'
    };
    
    console.log('Exercise object created:', exercise);
    
    // Use onExerciseClick to start the exercise properly (this will cause a full restart with the exercise)
    if (onExerciseClick) {
      console.log('Using onExerciseClick to start exercise');
      onExerciseClick(exercise);
    } else {
      console.error('onExerciseClick not available - cannot start exercise');
    }
  };

  // Extract AI-generated suggestions from response
  const extractAISuggestions = (aiMessage: string): string[] => {
    // Look for SUGGESTION_CHIPS: ["option1", "option2", "option3"] pattern
    const suggestionMatch = aiMessage.match(/SUGGESTION_CHIPS:\s*\[(.*?)\]/);
    
    if (suggestionMatch) {
      try {
        // Parse the suggestions array
        const suggestionsStr = suggestionMatch[1];
        const suggestions = suggestionsStr
          .split(',')
          .map(s => s.trim().replace(/['"]/g, ''))
          .filter(s => s.length > 0 && s.length <= 25); // Reasonable length filter
        
        return suggestions.slice(0, 4); // Max 4 suggestions
      } catch (error) {
        console.log('Error parsing AI suggestions:', error);
      }
    }
    
    return []; // Return empty if no suggestions found
  };

  // Clean AI message content by removing suggestion chips
  const cleanAIMessageContent = (content: string): string => {
    return content.replace(/SUGGESTION_CHIPS:\s*\[.*?\]/, '').trim();
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'user') {
      return (
        <View key={message.id} style={styles.userMessageContainer}>
          <View style={styles.userMessageWrapper}>
            <LinearGradient
              colors={[...colors.gradients.messageUser]}
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

    const isWelcomeMessage = messages.length <= 1;
    const turtleContainerStyle = isWelcomeMessage 
      ? styles.turtleAvatarContainer 
      : styles.turtleAvatarContainerSmall;
    const turtleStyle = isWelcomeMessage 
      ? styles.turtleAvatar 
      : styles.turtleAvatarSmall;
    const messageContainerStyle = isWelcomeMessage 
      ? styles.systemMessageContainer 
      : styles.systemMessageContainerSmall;
    const messageContentStyle = isWelcomeMessage 
      ? styles.systemMessageContent 
      : styles.systemMessageContentSmall;

    return (
      <View key={message.id} style={messageContainerStyle}>
        <View style={styles.systemMessageBubble}>
          <View style={messageContentStyle}>
            <View style={turtleContainerStyle}>
              <Image 
                source={require('../../assets/images/turtle-simple-3a.png')}
                style={turtleStyle}
                contentFit="cover"
              />
            </View>
            
            {/* Show Anu name for welcome messages */}
            {isWelcomeMessage && fontsLoaded && (
              <Text style={styles.therapistName}>
                Anu
              </Text>
            )}
            
            <TouchableOpacity 
              style={styles.systemMessageTextContainer}
              onPress={isTypewriting && currentTypewriterMessage?.id === message.id ? skipTypewriterAnimation : undefined}
              activeOpacity={isTypewriting && currentTypewriterMessage?.id === message.id ? 0.7 : 1}
            >
              <View>
                {isTypewriting && currentTypewriterMessage?.id === message.id ? (
                  // Show typewriter text when animation is active for this message
                  renderFormattedContent(cleanAIMessageContent(typewriterText))
                ) : (
                  // Show normal content
                  renderFormattedContent(cleanAIMessageContent(message.content || message.text || 'Hello! I\'m here to listen and support you. 🌸'))
                )}
                {/* Typing cursor for typewriter animation */}
                {isTypewriting && currentTypewriterMessage?.id === message.id && (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                    <AnimatedTypingCursor />
                    <Text style={{ fontSize: 11, color: '#6b7280', marginLeft: 8, opacity: 0.7 }}>
                      tap to skip
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            </View>
            
            {/* Message Action Buttons - Only show for non-welcome messages */}
            {!isWelcomeMessage && (
              <View style={styles.messageActions}>
                {playingMessageId === message.id && ttsStatus.isSpeaking ? (
                  <TouchableOpacity
                    onPress={handleStopTTS}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                  >
                    <VolumeX size={16} color="#6b7280" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handlePlayTTS(message.id, message.content || message.text || '')}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                  >
                    <Volume2 size={16} color="#6b7280" />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  onPress={() => handleCopyMessage(message.content || message.text || '')}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  <Copy size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
            )}
            
            {/* Prompt Suggestion Card - Only for welcome messages */}
            {isWelcomeMessage && (
              <TouchableOpacity 
                style={styles.promptSuggestionCard}
                onPress={() => {
                  setInputText("Guide me & suggest");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.promptSuggestionText}>
                  Guide me & suggest
                </Text>
              </TouchableOpacity>
            )}
          </View>
      </View>
    );
  };

  // Define animated background gradients
  const normalGradient = [...colors.gradients.primaryLight];
  const exerciseGradient = ['#f0fdf4', '#ecfdf5', '#d1fae5']; // Calm green gradient

  return (
    <SafeAreaView style={styles.container}>
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
            colors={normalGradient}
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
            colors={exerciseGradient}
            style={styles.backgroundGradient}
          />
        </Animated.View>
      </View>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View style={[
          styles.header,
          {
            backgroundColor: headerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(255, 255, 255, 0)', 'rgba(240, 253, 244, 0.8)'],
            }),
          }
        ]}>
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
                    {exerciseMode && currentExercise ? (
                      '✨ Exercise in Progress'
                    ) : currentExercise && exerciseFlows[currentExercise.type] ? (
                      exerciseFlows[currentExercise.type].name 
                    ) : (
                      '🌸 Gentle Session'
                    )}
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
                  
                  {/* Exercise Progress Indicator */}
                  {exerciseMode && currentExercise && exerciseFlows[currentExercise.type] && exerciseFlows[currentExercise.type].steps && (
                    <View style={styles.exerciseProgressContainer}>
                      {exerciseFlows[currentExercise.type].steps.map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.progressDot,
                            {
                              backgroundColor: index <= exerciseStep ? '#22c55e' : '#d1d5db',
                              transform: [{ scale: index === exerciseStep ? 1.2 : 1 }],
                            }
                          ]}
                        />
                      ))}
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
          {messages.map(renderMessage)}
          
          {/* Exercise Suggestion Card - Library Style */}
          {showExerciseCard && (
            <View style={{margin: 15}}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                  overflow: 'hidden'
                }}
                activeOpacity={0.9}
                onPress={() => handleExerciseCardStart(showExerciseCard)}
              >
                {/* Background Image Section */}
                <View style={{height: 120, position: 'relative'}}>
                  <Image 
                    source={showExerciseCard.image}
                    style={{width: '100%', height: '100%'}}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={[...showExerciseCard.color, `${showExerciseCard.color[1]}80`]}
                    style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                  />
                  <View style={{position: 'absolute', top: 15, right: 15}}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.95)']}
                      style={{width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}
                    >
                      <showExerciseCard.icon size={20} color={showExerciseCard.color[1]} />
                    </LinearGradient>
                  </View>
                </View>

                {/* Content Section */}
                <View style={{padding: 16}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', color: '#1f2937', flex: 1}}>
                      {showExerciseCard.name}
                    </Text>
                    <View style={{backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8}}>
                      <Text style={{fontSize: 12, fontWeight: '600', color: '#6b7280'}}>
                        {showExerciseCard.difficulty}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={{fontSize: 14, color: '#6b7280', lineHeight: 20, marginBottom: 12}}>
                    {showExerciseCard.description}
                  </Text>
                  
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                      <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                        <Clock size={12} color="#9b9b9b" />
                        <Text style={{fontSize: 12, color: '#9b9b9b'}}>
                          {showExerciseCard.duration}
                        </Text>
                      </View>
                      <View style={{width: 1, height: 12, backgroundColor: '#e5e7eb'}} />
                      <Text style={{fontSize: 12, color: '#9b9b9b'}}>
                        {showExerciseCard.category}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setShowExerciseCard(null);
                      }}
                      style={{padding: 4}}
                    >
                      <X size={16} color="#9b9b9b" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Typing Indicator */}
          {isTyping && (
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

        {/* Suggestion Chips - Hide for welcome screen */}
        {suggestions.length > 0 && messages.length > 1 && (
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
            <View style={styles.inputRow}>
              {!isRecording ? (
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type or speak..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  style={styles.textInput}
                  editable={true}
                  allowFontScaling={false}
                  selectionColor="#3b82f6"
                />
              ) : (
                <View style={styles.waveInInputContainer}>
                  <SoundWaveAnimation 
                    isRecording={isRecording} 
                    audioLevels={audioLevels} 
                  />
                </View>
              )}
              
              {!isRecording ? (
                inputText.trim() ? (
                  <TouchableOpacity 
                    onPress={() => handleSend()}
                    style={styles.sendButton}
                    activeOpacity={0.7}
                  >
                    <ArrowUp size={20} color="#ffffff" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    onPress={handleMicToggle}
                    style={styles.micButton}
                    activeOpacity={0.7}
                  >
                    <Mic size={24} color="#6b7280" />
                  </TouchableOpacity>
                )
              ) : (
                <View style={styles.recordingActions}>
                  <TouchableOpacity 
                    onPress={cancelRecording}
                    style={styles.recordingButton}
                    activeOpacity={0.7}
                  >
                    <X size={18} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={stopRecording}
                    style={styles.recordingButton}
                    activeOpacity={0.7}
                  >
                    <Check size={18} color="#1d4ed8" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatInterface;