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
    'morning-mindfulness': {
      id: 4,
      type: 'morning-mindfulness',
      name: 'Morning Mindfulness',
      duration: '8 min',
      description: 'Start your day with gentle awareness and presence',
      category: 'Mindfulness',
      difficulty: 'Beginner',
      icon: Eye,
      color: ['#E0F2FE', '#BAE6FD'],
      image: require('../../assets/images/1.jpeg')
    },
    'gratitude': {
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      name: 'Body Scan',
      color: 'blue',
      useAI: true,
      steps: [
        {
          title: 'Welcome to Body Scan',
          stepNumber: 1,
          description: 'Begin your body scan practice with gentle awareness',
          aiPrompt: `Welcome them warmly to this body scan practice. Explain that body scanning helps release tension and increase body awareness. Ask how they're feeling physically right now and what brought them to try a body scan.`,
          dataToCapture: 'initial-body-state',
          suggestions: ['Feeling tense', 'Body feels heavy', 'Can\'t relax', 'Need physical relief']
        },
        {
          title: 'Scanning Your Body',
          stepNumber: 2,
          description: 'Guide through systematic body awareness from head to toe',
          aiPrompt: `Guide them through a systematic body scan: starting from the top of their head, moving down through face, neck, shoulders, arms, chest, back, abdomen, legs, and feet. Ask them to notice sensations without judgment. Check in on what they're experiencing.`,
          dataToCapture: 'body-scan-experience',
          suggestions: ['Feeling more aware', 'Noticing tension', 'Some areas feel relaxed', 'Hard to focus']
        },
        {
          title: 'Releasing Tension',
          stepNumber: 3,
          description: 'Help release any tension discovered during the scan',
          aiPrompt: `Ask them to identify any areas of tension they discovered. Guide them to gently release that tension with their breath. Help them feel the difference between tension and relaxation.`,
          dataToCapture: 'tension-release',
          suggestions: ['Feeling more relaxed', 'Tension is releasing', 'Still some tightness', 'Much better now']
        },
        {
          title: 'Body Scan Complete',
          stepNumber: 4,
          description: 'Reflect on the body scan experience and its benefits',
          aiPrompt: `Ask them to reflect on how their body feels now compared to when they started. Celebrate any changes, however small. Remind them this practice can be used anytime to check in with their body and release tension.`,
          dataToCapture: 'post-scan-reflection',
          suggestions: ['More relaxed', 'Better body awareness', 'Would use this again', 'Feel more present']
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
    'morning-mindfulness': {
      name: '🌸 Morning Mindfulness',
      color: 'blue',
      useAI: true,
      steps: [
        {
          title: 'Welcome to Morning Mindfulness',
          stepNumber: 1,
          description: 'Begin your morning with gentle awareness and presence',
          aiPrompt: `Welcome them warmly to this morning mindfulness practice. Explain that morning mindfulness helps set a positive tone for the day. Ask how they're feeling this morning and what they hope to gain from this practice.`,
          dataToCapture: 'morning-state',
          suggestions: ['Feeling calm 😌', 'A bit anxious 😰', 'Ready to relax 🌟', 'Just checking in 👋']
        },
        {
          title: 'Gentle Breathing',
          stepNumber: 2,
          description: 'Focus on your breath to center yourself',
          aiPrompt: `Guide them through gentle breathing awareness. Ask them to notice their breath without trying to change it. Help them feel more present and centered. Check in on how this feels for them.`,
          dataToCapture: 'breathing-experience',
          suggestions: ['My breathing feels shallow 💭', 'I\'m feeling more relaxed 🕊️', 'Hard to focus 🌀', 'This feels nice ✨']
        },
        {
          title: 'Morning Intention',
          stepNumber: 3,
          description: 'Set a gentle intention for your day',
          aiPrompt: `Help them set a simple, kind intention for their day. This could be something like "I'll be patient with myself" or "I'll notice moments of joy." Make it personal and achievable.`,
          dataToCapture: 'morning-intention',
          suggestions: ['To be kind to myself', 'To stay present', 'To notice beauty', 'To be patient']
        },
        {
          title: 'Morning Mindfulness Complete',
          stepNumber: 4,
          description: 'Reflect on your morning practice and carry it forward',
          aiPrompt: `Ask them to reflect on how this morning practice felt. Celebrate their commitment to starting the day mindfully. Remind them they can return to this awareness throughout the day.`,
          dataToCapture: 'morning-reflection',
          suggestions: ['More centered 🎯', 'Peaceful 🌸', 'Grateful 🙏', 'Ready for my day ☀️']
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

  // Custom hooks
  const chatSession = useChatSession(currentExercise, exerciseFlows);
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
    // Check if this is an AI-guided exercise that needs special handling
    if (currentExercise && exerciseFlows[currentExercise.type]) {
      const flow = exerciseFlows[currentExercise.type];
      
      if (flow.useAI && flow.steps?.length > 0) {
        // AI-guided exercise with step structure
        console.log('Starting AI-guided exercise:', currentExercise.type);
        enterExerciseMode();
        startAIGuidedExercise(flow);
        return;
      }
    }
    
    // Regular chat session or non-AI exercises
    chatSession.initializeChatSession();
  }, [currentExercise]);

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
      
      // Set suggestions immediately so they appear right away
      chatSession.setSuggestions(currentStep.suggestions);
      
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
        // Prefer backend-provided suggestions when available
        if (response.suggestions && response.suggestions.length > 0) {
          chatSession.setSuggestions(response.suggestions);
        }
        
        console.log('Exercise mode state after AI response:', exerciseMode);
        console.log('Messages updated, exercise should be visible');
        console.log('Current exercise type:', currentExercise.type);
        console.log('Exercise step:', 0);
      } else {
        // Fallback to static step content
        const fallbackMessage: Message = {
          id: Date.now().toString(),
          type: 'exercise', 
          title: `Step ${currentStep.stepNumber}: ${currentStep.title}`,
          content: `Welcome to the ${currentExercise.name} exercise! Let's start with the first step of this therapeutic exercise.`,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };
        
        chatSession.setMessages([fallbackMessage]);
        chatSession.setSuggestions(currentStep.suggestions);
        
        console.log('Fallback exercise message created, exercise mode should be active');
      }
    } catch (error) {
      console.error('Error starting AI-guided exercise:', error);
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

    // Check if we're in an AI-guided exercise flow
    if (currentExercise && exerciseFlows[currentExercise.type]) {
      const flow = exerciseFlows[currentExercise.type];
      
      if (flow.useAI && flow.steps?.length > 0) {
        // AI-guided exercise with step structure
        await handleAIGuidedExerciseResponse(text, flow);
        return;
      }
    }
    
    // Regular chat or non-AI exercises
    await chatSession.handleSendMessage(text);
  };

  // Handle AI-guided exercise with step structure
  const handleAIGuidedExerciseResponse = async (userText: string, flow: any) => {
    try {
      console.log('Handling AI-guided exercise response for step:', exerciseStep + 1);
      
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
      const shouldAdvance = userText.trim().length >= 8; // Simple advancement logic
      
      if (shouldAdvance && exerciseStep < flow.steps.length - 1) {
        // Move to next step
        const nextStepIndex = exerciseStep + 1;
        const nextStep = flow.steps[nextStepIndex];
        
        const systemPrompt = `You are a warm, compassionate CBT therapist. You're having a real therapeutic conversation within the structure of a CBT exercise.

**THERAPEUTIC CONTEXT:**
Previous step: "${currentStep.title}" 
What they shared: "${userText}"

**MOVING TO NEXT STEP:**
Step ${nextStep.stepNumber}/${flow.steps.length}: ${nextStep.title}
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

        chatSession.setIsTyping(true);
        const response = await apiService.getChatCompletionWithContext([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `I just completed step ${currentStep.stepNumber}. Please guide me to step ${nextStep.stepNumber}.` }
        ]);
        chatSession.setIsTyping(false);

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
          
          // Use backend suggestions if present; otherwise step defaults
          chatSession.setSuggestions(
            response.suggestions && response.suggestions.length > 0
              ? response.suggestions
              : nextStep.suggestions
          );
          setExerciseStep(nextStepIndex);
          
          await ttsService.speakIfAutoPlay(response.message);
        }
        
      } else if (exerciseStep >= flow.steps.length - 1) {
        // Exercise completed
        console.log('CBT exercise completed');
        
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
        
        // Exit exercise mode with smooth transition
        exitExerciseMode();
        
        chatSession.setSuggestions(['That was helpful 😊', 'I learned something new 🌟', 'I want to try again 🔄', 'Thank you 🙏']);
        
      } else {
        // Stay on current step - ask for more clarification
        const clarificationPrompt = `You are a warm, compassionate CBT therapist having a real therapeutic conversation.

**WHAT THEY SHARED:** "${userText}"

**CURRENT THERAPEUTIC FOCUS:**
Step ${currentStep.stepNumber}/${flow.steps.length}: ${currentStep.title}
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

        chatSession.setIsTyping(true);
        const response = await apiService.getChatCompletionWithContext([
          { role: 'system', content: clarificationPrompt },
          { role: 'user', content: userText }
        ]);
        chatSession.setIsTyping(false);

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
          
          // Use backend suggestions if present; otherwise step defaults
          chatSession.setSuggestions(
            response.suggestions && response.suggestions.length > 0
              ? response.suggestions
              : currentStep.suggestions
          );
          
          await ttsService.speakIfAutoPlay(response.message);
        }
      }
      
    } catch (error) {
      console.error('Error in handleAIGuidedExerciseResponse:', error);
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
    chatSession.setShowExerciseCard(null);
    
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
                      currentExercise && exerciseFlows[currentExercise.type] && styles.exerciseTitle
                    ]}>
                      {exerciseMode && currentExercise ? (
                        exerciseFlows[currentExercise.type]?.name || 'Exercise in Progress'
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
            isVisible={chatSession.suggestions.length > 0 && (chatSession.messages.length > 1 || exerciseMode)}
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