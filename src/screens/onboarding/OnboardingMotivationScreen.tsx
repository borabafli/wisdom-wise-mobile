import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { onboardingMotivationStyles as styles } from '../../styles/components/onboarding/OnboardingMotivation.styles';
import { storageService } from '../../services/storageService';
import { chatService } from '../../services/chatService';

const { width, height } = Dimensions.get('window');

interface MotivationChip {
  id: string;
  text: string;
  keywords: string[];
}

const motivationChips: MotivationChip[] = [
  { id: 'stress', text: 'Feeling stressed', keywords: ['stress', 'overwhelmed', 'pressure'] },
  { id: 'overthinking', text: 'Overthinking everything', keywords: ['overthinking', 'racing thoughts', 'anxiety', 'worry'] },
  { id: 'relationships', text: 'Relationship challenges', keywords: ['relationship', 'communication', 'conflict', 'loneliness'] },
  { id: 'burnout', text: 'Work burnout', keywords: ['burnout', 'exhausted', 'work', 'career', 'job'] },
  { id: 'mood', text: 'Low mood', keywords: ['depression', 'sad', 'down', 'mood', 'hopeless'] },
  { id: 'sleep', text: 'Sleep issues', keywords: ['sleep', 'insomnia', 'tired', 'rest'] },
  { id: 'exploring', text: 'Just exploring', keywords: ['curious', 'exploring', 'learning', 'growth'] },
];

interface OnboardingMotivationScreenProps {
  onContinue: (motivation: string) => void;
  onSkip: () => void;
}

const OnboardingMotivationScreen: React.FC<OnboardingMotivationScreenProps> = ({ onContinue, onSkip }) => {
  const [textInput, setTextInput] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isTextFocused, setIsTextFocused] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [inputsHidden, setInputsHidden] = useState(false);
  const [userName, setUserName] = useState<string>('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const responseAnim = useRef(new Animated.Value(0)).current;
  const avatarPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for avatar
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(avatarPulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(avatarPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };
    pulseAnimation();

    // Load user name
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const firstName = await storageService.getFirstName();
      setUserName(firstName);
    } catch (error) {
      console.error('Error loading user name:', error);
      setUserName('Friend');
    }
  };

  const handleChipPress = (chipId: string) => {
    if (selectedChips.includes(chipId)) {
      setSelectedChips(selectedChips.filter(id => id !== chipId));
    } else {
      setSelectedChips([...selectedChips, chipId]);
    }
  };

  const getMotivationText = (): string => {
    if (textInput.trim()) {
      return textInput.trim();
    }
    
    if (selectedChips.length > 0) {
      const selectedTexts = selectedChips.map(chipId => 
        motivationChips.find(chip => chip.id === chipId)?.text
      ).filter(Boolean);
      return selectedTexts.join(', ');
    }
    
    return '';
  };

  const generateAIResponse = async (motivationText: string) => {
    setIsLoadingResponse(true);
    
    try {
      // Create onboarding-specific system prompt
      const systemMessage = {
        role: 'system',
        content: `You are Anu, a wise and gentle AI therapy turtle companion. This is your first interaction with the user during onboarding. The user has just shared what brought them to the app.

Key guidelines for this first interaction:
- Use the user's name (${userName}) naturally in your response
- Write a thoughtful response (3-4 sentences) that feels genuine and caring
- Be specific about what they shared - acknowledge their actual situation
- Validate their feelings with sincere understanding
- Use gentle, calm language with occasional simple nature references
- Mention that you'll remember this for your future conversations together
- Create a sense of being heard and understood without being overly dramatic
- End with a simple, appropriate emoji
- Be warm but not overly poetic - aim for sincere therapeutic support

Remember: This is their first interaction with you. Be genuinely caring, specific to their sharing, and establish trust through authentic understanding rather than flowery language.`
      };

      const userMessage = {
        role: 'user',
        content: `What brought me here today: ${motivationText}`
      };

      const response = await chatService.getChatCompletionWithContext([systemMessage, userMessage]);
      
      if (response.success && response.message) {
        setAiResponse(response.message);
        setShowResponse(true);
        
        // Animate response appearance
        Animated.timing(responseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } else {
        throw new Error(response.error || 'Failed to generate response');
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiResponse(`Thank you for sharing that with me, ${userName}. I can feel the trust you're placing in me by opening up about what brought you here. I want you to know that what you've shared is now part of my memory - I'll remember this as we begin our journey together. 🌿`);
      setShowResponse(true);
      
      Animated.timing(responseAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleContinue = async () => {
    const motivation = getMotivationText();
    
    if (!motivation) {
      Alert.alert(
        'Share Something',
        'Please share what brought you here today, or select from the options below.'
      );
      return;
    }

    // Generate AI response if not already shown
    if (!showResponse) {
      // Hide input elements immediately for better UX
      setInputsHidden(true);
      await generateAIResponse(motivation);
      // Don't proceed immediately - let user read the response
      return;
    }

    // Save motivation data and proceed
    try {
      await storageService.updateUserProfile({
        motivation: motivation,
        motivationTimestamp: new Date().toISOString(),
      });
      
      onContinue(motivation);
    } catch (error) {
      console.error('Error saving motivation:', error);
      // Still proceed even if save fails
      onContinue(motivation);
    }
  };

  const canContinue = Boolean(getMotivationText());
  const characterCount = textInput.length;
  const isNearLimit = characterCount > 180;
  const isOverLimit = characterCount > 200;

  return (
    <LinearGradient
      colors={['#f0fdfa', '#e6fffa', '#ccfbf1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Anu Character Section */}
        <View style={styles.characterContainer}>
          <Animated.View
            style={[
              styles.avatarContainer,
              {
                transform: [{ scale: avatarPulseAnim }],
              }
            ]}
          >
            <Image
              source={require('../../../assets/images/turtle-anu-greetings.png')}
              style={styles.anuAvatar}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Tell me more about what brings you here</Text>
          <Text style={styles.subtitle}>
            This helps me understand how to best support you
          </Text>
        </View>

        <Animated.ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Input Section - Hide completely when inputs are hidden */}
          {!inputsHidden && !showResponse && (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Share what's on your mind</Text>
              
              <View style={[
                styles.textAreaContainer,
                isTextFocused && styles.textAreaContainerFocused
              ]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="I've been feeling overwhelmed at work and..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={textInput}
                  onChangeText={setTextInput}
                  onFocus={() => setIsTextFocused(true)}
                  onBlur={() => setIsTextFocused(false)}
                  maxLength={200}
                />
              </View>
              
              <Text style={[
                styles.characterCount,
                (isNearLimit || isOverLimit) && styles.characterCountLimit
              ]}>
                {characterCount}/200
              </Text>

              {/* Quick Chips - Only show if no text input */}
              {!textInput.trim() && (
                <View style={styles.chipsSection}>
                  <Text style={styles.chipsLabel}>Or choose from these common experiences:</Text>
                  
                  <View style={styles.chipsContainer}>
                    {motivationChips.map((chip) => (
                      <TouchableOpacity
                        key={chip.id}
                        style={[
                          styles.chip,
                          selectedChips.includes(chip.id) && styles.chipSelected
                        ]}
                        onPress={() => handleChipPress(chip.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.chipText,
                          selectedChips.includes(chip.id) && styles.chipTextSelected
                        ]}>
                          {chip.text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
            
          {/* Show selected chips summary when inputs are hidden/response is shown */}
          {(showResponse || inputsHidden) && !textInput.trim() && selectedChips.length > 0 && (
            <View style={styles.selectedChipsSummary}>
              <Text style={styles.selectedChipsLabel}>You shared:</Text>
              <Text style={styles.selectedChipsText}>
                {selectedChips.map(chipId => 
                  motivationChips.find(chip => chip.id === chipId)?.text
                ).join(', ')}
              </Text>
            </View>
          )}

          {/* AI Response Section */}
          {isLoadingResponse && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#5BA3B8" />
              <Text style={styles.loadingText}>Anu is responding...</Text>
            </View>
          )}

          {showResponse && (
            <Animated.View style={[
              styles.responseSection,
              {
                opacity: responseAnim,
                transform: [{ 
                  translateY: responseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })
                }],
              }
            ]}>
              <View style={styles.responseContainer}>
                <View style={styles.responseHeader}>
                  <Image
                    source={require('../../../assets/images/Teal watercolor single element/home-background.png')}
                    style={styles.responseAvatarSmall}
                    resizeMode="contain"
                  />
                  <Text style={styles.responseLabel}>Anu's Response</Text>
                </View>
                <Text style={styles.responseText}>{aiResponse}</Text>
              </View>
            </Animated.View>
          )}
        </Animated.ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[
              styles.primaryButton,
              !canContinue && styles.primaryButtonDisabled
            ]} 
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={isLoadingResponse}
          >
            <LinearGradient
              colors={['#5BA3B8', '#357A8A']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>
                {showResponse ? 'Continue' : 'Share with Anu'}
              </Text>
              <ChevronRight size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingMotivationScreen;