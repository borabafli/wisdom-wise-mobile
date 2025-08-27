import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Mic, ChevronLeft, MicOff, Sparkles, Heart, User } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  type: 'user' | 'system' | 'exercise';
  text?: string;
  content?: string;
  title?: string;
  exerciseType?: string;
  color?: string;
  timestamp: string;
}

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
  const scrollViewRef = useRef<ScrollView>(null);

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

  useEffect(() => {
    if (currentExercise && exerciseFlows[currentExercise.type]) {
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
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        title: '',
        content: 'Hello, gentle soul 🐢\n\nI\'m here to listen and support you. What\'s on your mind today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([welcomeMessage]);
      setSuggestions(['Feeling good today 😊', 'A bit stressed 😰', 'Need support 🤗', 'Just checking in 👋']);
    }
  }, [currentExercise]);

  const handleSend = (text = inputText) => {
    if (text.trim()) {
      const newMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'user',
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Handle exercise flow progression
      if (currentExercise && exerciseFlows[currentExercise.type]) {
        const flow = exerciseFlows[currentExercise.type];
        if (exerciseStep < flow.steps.length - 1) {
          const nextStep = exerciseStep + 1;
          setTimeout(() => {
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
          }, 1500);
        }
      } else {
        // Regular AI response
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const turtleResponses = [
            {
              title: 'I feel your heart',
              content: '**Thank you for trusting me with your words** 💚\n\nLike rings in a pond, your feelings touch me deeply. Let\'s explore this together, one gentle step at a time.'
            },
            {
              title: 'Your turtle friend listens',
              content: '**I hear the wisdom in your sharing** 🌿\n\nSometimes the most profound truths come quietly, like morning dew. What feels most important about this for you?'
            },
            {
              title: 'Breathing with you',
              content: '**You are so brave to share this** 🌱\n\nLike a steady rock in flowing water, I\'m here with you. Take all the time you need - there\'s no rush in our peaceful space.'
            }
          ];
          
          const randomResponse = turtleResponses[Math.floor(Math.random() * turtleResponses.length)];
          const aiResponse: Message = {
            id: (messages.length + 2).toString(),
            type: 'system',
            title: randomResponse.title,
            content: randomResponse.content,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 2000);
      }
    }
  };

  const handleMicToggle = () => {
    setIsListening(!isListening);
    // Simulate speech recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputText("I've been feeling anxious about work lately.");
      }, 3000);
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
                onPress={onBack} 
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
                      'Your safe space for mindful reflection and support'
                    )}
                  </Text>
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
                placeholder="Share what's on your mind..."
                placeholderTextColor="#94a3b8"
                multiline
                style={[styles.textInput, { textAlignVertical: 'top' }]}
              />
            </View>
            
            <View style={styles.inputActions}>
              <View style={styles.actionsRow}>
                <TouchableOpacity 
                  onPress={handleMicToggle}
                  style={[
                    styles.micButton,
                    isListening ? styles.micButtonListening : styles.micButtonIdle
                  ]}
                  activeOpacity={0.8}
                >
                  {isListening ? (
                    <MicOff size={20} color="white" />
                  ) : (
                    <Mic size={20} color="white" />
                  )}
                </TouchableOpacity>
                
                <View style={styles.centerActions}>
                  {isListening && (
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
                    {isListening ? 'Listening...' : 'Share through voice or text'}
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
  micButtonListening: {
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