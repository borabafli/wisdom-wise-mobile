import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal, Keyboard, Animated } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Check, ArrowLeft, Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { guidedJournalStyles as styles } from '../styles/components/GuidedJournal.styles';
import { chatService } from '../services/chatService';
import JournalStorageService from '../services/journalStorageService';
import { useVoiceRecording } from '../hooks/chat/useVoiceRecording';
import { useTTSControls } from '../hooks/chat/useTTSControls';
import { RecordingWave } from '../components/RecordingWave';
import { useTranslation } from 'react-i18next';
import MaskedView from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface GuidedJournalScreenProps {
  route: {
    params: {
      initialPrompt: string;
    };
  };
  navigation: any;
}

interface JournalEntry {
  prompt: string;
  response: string;
}

const GuidedJournalScreen: React.FC<GuidedJournalScreenProps> = ({ route, navigation }) => {
  const { t, i18n } = useTranslation();
  const { initialPrompt } = route.params;

  const [currentStep, setCurrentStep] = useState(0);
  const [entries, setEntries] = useState<JournalEntry[]>([
    { prompt: initialPrompt, response: '' }
  ]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const [sessionPhrases, setSessionPhrases] = useState<string[]>([]);
  const gradientAnim = useRef(new Animated.Value(0)).current;
  const [loadingEmoji, setLoadingEmoji] = useState('🌿');

  // Voice recording hook - exactly like chat
  const {
    isRecording,
    isListening,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording,
    audioLevel,
    partialTranscript,
    sttError
  } = useVoiceRecording((transcript) => {
    if (transcript.trim()) {
      setCurrentResponse(transcript);
    }
  });

  // TTS controls hook
  const {
    ttsStatus,
    playingMessageId,
    handlePlayTTS,
    handleStopTTS,
  } = useTTSControls();

  const isFirstStep = currentStep === 0;
  const isSecondStep = currentStep === 1;
  const isThirdStep = currentStep === 2;
  const isComplete = currentStep >= 3;

  const loadingPhrases = useMemo(() => {
    const fallback = t('journal.generatingFallback');
    const raw = t('journal.waitingPhrases', { returnObjects: true });

    let phrases: string[] = [];

    if (Array.isArray(raw)) {
      phrases = raw.filter((item) => typeof item === 'string' && item.trim().length > 0) as string[];
    } else if (raw && typeof raw === 'object') {
      phrases = Object.values(raw as Record<string, unknown>)
        .map((value) => (typeof value === 'string' ? value : ''))
        .filter((value) => value.trim().length > 0);
    } else if (typeof raw === 'string' && raw.trim().length > 0) {
      phrases = raw.split('|').map((part) => part.trim()).filter(Boolean);
    }

    if (phrases.length === 0) {
      phrases = [fallback];
    }

    return phrases;
  }, [t, i18n.language]);

  const phrasePool = sessionPhrases.length > 0 ? sessionPhrases : loadingPhrases;
  const baseLoadingPhrase = phrasePool.length > 0
    ? phrasePool[loadingPhraseIndex % phrasePool.length]
    : t('journal.generatingFallback');
  const activeLoadingPhrase = `${baseLoadingPhrase}${baseLoadingPhrase.endsWith('...') ? '' : '...'}`;
  const gradientTranslate = gradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 180],
  });

  useEffect(() => {
    if (!isGeneratingQuestion) {
      setSessionPhrases([]);
      setLoadingPhraseIndex(0);
      gradientAnim.stopAnimation();
      gradientAnim.setValue(0);
      return;
    }

    const emojis = ['🌿', '🌱', '🌾', '🍂', '🍃'];
    setLoadingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);

    if (loadingPhrases.length === 0) {
      setSessionPhrases([]);
      setLoadingPhraseIndex(0);
      gradientAnim.stopAnimation();
      return;
    }

    const firstIndex = Math.floor(Math.random() * loadingPhrases.length);
    const firstPhrase = loadingPhrases[firstIndex];
    let selectedPhrases = [firstPhrase];

    if (loadingPhrases.length > 1) {
      const available = loadingPhrases.filter((_, idx) => idx !== firstIndex);
      const secondPhrase = available[Math.floor(Math.random() * available.length)];
      if (secondPhrase && secondPhrase !== firstPhrase) {
        selectedPhrases.push(secondPhrase);
      }
    }

    setSessionPhrases(selectedPhrases);
    setLoadingPhraseIndex(0);

    const animateGradient = () => {
      gradientAnim.setValue(0);
      Animated.sequence([
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 3600,
          useNativeDriver: true,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 3600,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          animateGradient();
        }
      });
    };

    animateGradient();

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (selectedPhrases.length > 1) {
      timeoutId = setTimeout(() => {
        setLoadingPhraseIndex(1);
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      gradientAnim.stopAnimation();
    };
  }, [isGeneratingQuestion, loadingPhrases, gradientAnim]);

  const handleNext = async () => {
    if (!currentResponse.trim()) {
      Alert.alert(t('journal.pleaseWriteSomething'), t('journal.entryCannotBeEmpty'));
      return;
    }

    // Save current response
    const updatedEntries = [...entries];
    updatedEntries[currentStep].response = currentResponse;
    setEntries(updatedEntries);

    if (currentStep < 2) {
      // Generate next question
      setIsGeneratingQuestion(true);
      try {
        const followUpQuestion = await generateFollowUpQuestion(currentResponse, currentStep);
        updatedEntries.push({ prompt: followUpQuestion, response: '' });
        setEntries(updatedEntries);
        setCurrentStep(currentStep + 1);
        setCurrentResponse('');
      } catch (error) {
        console.error('Error generating follow-up question:', error);
        Alert.alert(t('common.error'), t('journal.failedNextQuestion'));
      } finally {
        setIsGeneratingQuestion(false);
      }
    } else {
      // Generate summary
      await generateSummary(updatedEntries);
    }
  };

  const generateFollowUpQuestion = async (userResponse: string, stepNumber: number): Promise<string> => {
    const context = entries.map(entry => `Q: ${entry.prompt}\nA: ${entry.response}`).join('\n\n');

    const prompt = `Based on this journal entry so far:

${context}

For the user's latest reflection: "${userResponse}"

Generate one powerful follow-up question that invites deeper insight and meaningful reflection - a question ideal for inspiring guided journaling. 
This is ${stepNumber === 0 ? 'the first' : 'the second'} follow-up question. 

The question should:
- Be like coming from the person with the deepest wisdom and the deepest truths about life, with all the life wisdom, sharp and direct but still empathetic like a therapist
- Build on what the user shared but don't hesitate to open new perspectives
- Encourage deep reflection, questioning, self-discovery, clarity, or new perspective
- Stay open-ended (no yes/no questions)
- Spark genuine introspection — something the user would *want* to think about
- You don't need much words and you are to the point.
- Return only the question, no explanations or extra text.
- A single question, not multiple questions

Return only the question, no additional text.`;

    try {
      const response = await chatService.sendMessage(prompt, []);
      return response.trim();
    } catch (error) {
      console.error('Error generating follow-up question:', error);

      // Fallback questions based on step
      const fallbackQuestions = [
        "What emotions came up for you as you wrote that? How do those feelings connect to your daily experience?",
        "Looking deeper at what you shared, what patterns or themes do you notice? What might this reveal about what's important to you right now?"
      ];

      return fallbackQuestions[stepNumber] || "What else would you like to explore about this topic?";
    }
  };

  const generateSummary = async (allEntries: JournalEntry[]) => {
    setIsGeneratingQuestion(true);

    const fullJournalText = allEntries.map(entry =>
      `Question: ${entry.prompt}\nResponse: ${entry.response}`
    ).join('\n\n');

    const prompt = `You are a wise guide who helps people see truth clearly.
You distill journal reflections into deep, timeless insights  like something a person would want to write on their wall or remember for life.
e.
Journal text: 
${fullJournalText}

IMPORTANT: You must respond with ONLY valid JSON in exactly this format (no additional text before or after). This is the exact Format to follow:
{
  "summary": Write 1 to 2 sentences from the user’s journal reflection, extract the essence — not as an analysis, but as a message of truth, clarity, and self-awareness.
Your goal is to reveal the lesson, shift, or realization beneath their words — something that feels emotionally alive and profoundly true. 
Use 'you' form — as if you’re gently speaking to them. 
Make it warm, clear, and deeply human — not analytical or distant. 
Focus on what the reflection *reveals* about them — their growth, struggle, values, or realization. 
It should feel like something true and timeless they’d want to remember — a reflection that offers perspective or calm, not advice."",
  "suggestions": ["Key insight"]
}

The insight should:
- A sentence expressing a deep truth or timeless wisdom that emerges from their reflection. 
- It should feel universal, grounded, and wise — something a person would want to write on their wall or remember for life.
- Feel like timeless wisdom or life advice that a wise person would share.  
- Be to the point and emotionally resonant.  
- Be relevant to the user's reflection but can still be a universal truth or guidance.  
- Be something the user might want to save, reread, or live by to live a better life - the deepest hidden truth. 

Respond with JSON only.`;

    const defaultSummaryText = 'Thank you for your thoughtful reflection and willingness to explore what matters to you.';
    const defaultSuggestions = [
      'Self-reflection is a valuable practice for personal growth',
      'Taking time to explore your thoughts and feelings builds self-awareness'
    ];

    const normalizeInsightText = (text: string): string => text.replace(/\s+/g, ' ').replace(/^[-*\u2022]+/, '').trim();

    const toStringArray = (values: unknown): string[] => {
      if (!Array.isArray(values)) return [];
      return values
        .map(item => (typeof item === 'string' ? normalizeInsightText(item) : ''))
        .filter(item => item.length > 0);
    };

    const splitIntoSentences = (text: string): string[] => {
      if (!text) return [];
      const matches = text.match(/[^.!?]+[.!?]?/g);
      if (!matches) return [];
      return matches
        .map(sentence => normalizeInsightText(sentence))
        .filter(sentence => sentence.length > 0);
    };

    const extractInsightsFromString = (text: string): string[] => {
      if (!text) return [];
      const normalized = text.replace(/\r/g, '\n');
      const segments = normalized
        .split(/\n+/)
        .reduce<string[]>((acc, segment) => {
          segment.split(/\s*[\u2022-]+\s*/).forEach(part => {
            const cleaned = normalizeInsightText(part);
            if (cleaned.length > 0) {
              acc.push(cleaned);
            }
          });
          return acc;
        }, []);

      if (segments.length > 1) {
        return segments;
      }

      return splitIntoSentences(text);
    };

    const stripCodeFence = (value: string): string => {
      if (!value) return '';
      const trimmed = value.trim();
      if (!trimmed.startsWith('```')) {
        return trimmed;
      }

      const afterFence = trimmed.replace(/^```[a-zA-Z0-9_-]*\s*/u, '');
      const closingIndex = afterFence.lastIndexOf('```');
      if (closingIndex !== -1) {
        return afterFence.slice(0, closingIndex).trim();
      }

      return afterFence.trim();
    };

    const extractJsonPayload = (raw: string): Record<string, unknown> | null => {
      if (!raw) return null;
      const stripped = stripCodeFence(raw);
      const start = stripped.indexOf('{');
      const end = stripped.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) {
        return null;
      }

      const candidate = stripped.slice(start, end + 1);
      try {
        const parsed = JSON.parse(candidate);
        return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null;
      } catch (jsonError) {
        console.warn('Unable to parse JSON summary payload', jsonError);
        return null;
      }
    };

    const parseSuggestionsFromDump = (rawDump: string): string[] => {
      if (!rawDump) return [];
      const key = '"suggestions"';
      const keyIndex = rawDump.indexOf(key);
      if (keyIndex === -1) return [];

      let remainder = rawDump.slice(keyIndex + key.length);
      const colonIndex = remainder.indexOf(':');
      if (colonIndex === -1) return [];

      remainder = remainder.slice(colonIndex + 1).trim();
      if (!remainder) return [];

      if (remainder.startsWith('[')) {
        let depth = 0;
        for (let i = 0; i < remainder.length; i += 1) {
          const char = remainder[i];
          if (char === '[') depth += 1;
          if (char === ']') {
            depth -= 1;
            if (depth === 0) {
              const arraySegment = remainder.slice(0, i + 1);
              try {
                const parsed = JSON.parse(arraySegment);
                if (Array.isArray(parsed)) {
                  return toStringArray(parsed);
                }
              } catch (arrayError) {
                console.warn('Unable to parse suggestions array from raw dump', arrayError);
              }
              break;
            }
          }
        }
      }

      const results: string[] = [];
      let current = remainder;

      while (current.startsWith('"')) {
        const match = current.match(/^"((?:\\.|[^"\\])*)"([\s\S]*)$/);
        if (!match) {
          break;
        }

        const rawValue = match[1];
        const rest = match[2];
        let decoded = rawValue;

        try {
          const safeValue = rawValue.replace(/\\/g, '\\').replace(/"/g, '\\"');
          decoded = JSON.parse(`"${safeValue}"`);
        } catch {
          decoded = rawValue.replace(/\\n/g, ' ');
        }

        const cleaned = normalizeInsightText(decoded);
        if (cleaned) {
          results.push(cleaned);
        }

        current = rest.trim();
        if (current.startsWith(',')) {
          current = current.slice(1).trim();
          continue;
        }

        break;
      }

      return results;
    };

    try {
      const aiResponse = await chatService.generateSummary(prompt);
      console.log('Raw summary response:', aiResponse);

      const messageText = typeof aiResponse?.message === 'string' ? aiResponse.message.trim() : '';
      const sanitizedMessage = stripCodeFence(messageText);
      const serializedResponse = (() => {
        try {
          return JSON.stringify(aiResponse);
        } catch (serializationError) {
          console.warn('Failed to serialize AI response', serializationError);
          return String(aiResponse);
        }
      })();

      const candidateInsights = new Set<string>();
      const addCandidate = (value: string) => {
        const cleaned = normalizeInsightText(value);
        if (cleaned) {
          candidateInsights.add(cleaned);
        }
      };

      let structuredSummary: string | null = null;

      const parsedPayload = extractJsonPayload(messageText);
      if (parsedPayload) {
        const typedPayload = parsedPayload as { summary?: unknown; suggestions?: unknown; insights?: unknown };
        if (typeof typedPayload.summary === 'string') {
          const cleaned = normalizeInsightText(typedPayload.summary);
          if (cleaned) {
            structuredSummary = cleaned;
          }
        }

        const payloadSuggestions = typedPayload.suggestions ?? typedPayload.insights;
        if (Array.isArray(payloadSuggestions)) {
          toStringArray(payloadSuggestions).forEach(addCandidate);
        } else if (typeof payloadSuggestions === 'string') {
          extractInsightsFromString(payloadSuggestions).forEach(addCandidate);
        }
      }

      const responseSuggestions = (aiResponse as any)?.suggestions;
      if (Array.isArray(responseSuggestions)) {
        toStringArray(responseSuggestions).forEach(addCandidate);
      } else if (typeof responseSuggestions === 'string') {
        extractInsightsFromString(responseSuggestions).forEach(addCandidate);
        const cleaned = normalizeInsightText(responseSuggestions);
        if (cleaned) {
          candidateInsights.add(cleaned);
        }
      }

      parseSuggestionsFromDump(serializedResponse).forEach(addCandidate);

      let summaryText = structuredSummary || normalizeInsightText(sanitizedMessage) || defaultSummaryText;

      if (!structuredSummary) {
        const quotedSummaryMatch = sanitizedMessage.match(/^"([\s\S]*?)"$/);
        if (quotedSummaryMatch) {
          const extracted = normalizeInsightText(quotedSummaryMatch[1]);
          if (extracted) {
            summaryText = extracted;
          }
        }
      }

      const insightList = Array.from(candidateInsights)
        .filter(insight => insight && insight !== summaryText)
        .slice(0, 1);
      const fallbackInsight = defaultSuggestions[0] || summaryText;

      navigation.navigate('JournalSummary', {
        summary: summaryText,
        insights: insightList.length > 0 ? insightList : [fallbackInsight],
        initialPrompt,
        entries: allEntries,
      });
    } catch (error) {
      console.error('Error generating summary:', error);

      const fallbackInsight = defaultSuggestions[0] || defaultSummaryText;
      navigation.navigate('JournalSummary', {
        summary: defaultSummaryText,
        insights: [fallbackInsight],
        initialPrompt,
        entries: allEntries,
      });
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleBackPress = () => {
    // Check if there's any content to save
    const hasContent = entries.some(entry => entry.response.trim() !== '') || currentResponse.trim() !== '';

    if (hasContent) {
      setShowSaveModal(true);
    } else {
      navigation.goBack();
    }
  };

  const handleSaveAndExit = async () => {
    setShowSaveModal(false);
    try {
      // Create a simple summary for incomplete sessions
      const completedEntries = entries.filter(entry => entry.response.trim() !== '');
      if (currentResponse.trim() !== '') {
        completedEntries[currentStep] = {
          ...completedEntries[currentStep],
          response: currentResponse
        };
      }

      const simpleSummary = completedEntries.length > 0
        ? `Partial journal entry: ${completedEntries.map(e => e.response).join(' ').substring(0, 200)}...`
        : 'Draft journal entry';

      await JournalStorageService.saveJournalEntry(
        initialPrompt,
        completedEntries,
        simpleSummary,
        ['Incomplete session - saved as draft'],
        false
      );

      navigation.goBack();
    } catch (error) {
      console.error('Error saving draft:', error);
      Alert.alert(t('common.error'), t('journal.failedToSaveDraft'));
    }
  };

  const handleDontSaveAndExit = () => {
    setShowSaveModal(false);
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaWrapper style={styles.container}>
        {/* Solid Background like Home Screen */}
        <View
          style={[styles.backgroundSolid, { backgroundColor: '#e9eff1' }]}
          pointerEvents="none"
        />
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <ArrowLeft size={24} color="#2B475E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('journal.title')}</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>{t('journal.stepIndicator', { current: currentStep + 1, total: 3 })}</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Current Prompt */}
          <View style={styles.promptContainer}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptText}>{entries[currentStep]?.prompt}</Text>
            </View>
          </View>

          {/* Text Input - Exactly like chat */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              {!isRecording ? (
                <TextInput
                  value={currentResponse}
                  onChangeText={setCurrentResponse}
                  placeholder={isTranscribing ? t('journal.transcribing') : t('journal.typeOrSpeak')}
                  placeholderTextColor="rgba(43, 71, 94, 0.5)"
                  multiline
                  style={styles.textInput}
                  editable={!isGeneratingQuestion && !isTranscribing}
                  textAlignVertical="top"
                  textAlign={isTranscribing ? 'center' : 'left'}
                />
              ) : (
                /* Recording Interface: X button - Wave with Timer - Check button */
                <View style={styles.recordingInterfaceWithTimer}>
                  {/* Cancel Button (X) - Left side */}
                  <View style={styles.recordingButtonContainer}>
                    <TouchableOpacity
                      onPress={cancelRecording}
                      style={styles.recordingCancelButton}
                      activeOpacity={0.7}
                    >
                      <X size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>

                  {/* Wave and Timer Container - Center */}
                  <View style={styles.waveContainer}>
                    <RecordingWave
                      audioLevel={audioLevel}
                      isRecording={isRecording}
                      variant="bars"
                      size="medium"
                      showTimer={true}
                      colorScheme="blue"
                    />
                  </View>

                  {/* Submit Button (Check) - Right side */}
                  <View style={styles.recordingButtonContainer}>
                    <TouchableOpacity
                      onPress={stopRecording}
                      style={styles.submitRecordingButton}
                      activeOpacity={0.7}
                    >
                      <Check size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {!isRecording && (
                <View style={styles.inputButtonsContainer}>
                  {currentResponse.trim() ? null : (
                    <TouchableOpacity
                      onPress={startRecording}
                      style={styles.micButton}
                      activeOpacity={0.7}
                    >
                      <Mic size={26} color="#2B475E" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* TTS Animation - Under the text input */}
          {ttsStatus.isSpeaking && playingMessageId === 'current_prompt' && (
            <View style={styles.ttsAnimationContainer}>
              <RecordingWave
                audioLevel={0.8}
                isRecording={true}
                variant="bars"
                size="medium"
                showTimer={false}
              />
            </View>
          )}

          {/* Continue Button - Positioned directly beneath input */}
          <View style={styles.scrollableContinueButtonContainer}>
            <TouchableOpacity
              style={[
                styles.compactNextButtonContainer,
                (!currentResponse.trim() || isGeneratingQuestion) && styles.compactNextButtonDisabled
              ]}
              onPress={handleNext}
              disabled={!currentResponse.trim() || isGeneratingQuestion}
              activeOpacity={0.8}
            >
              {isGeneratingQuestion ? (
                <LinearGradient
                  colors={['#88ABB1', '#63859B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.compactNextButton}
                >
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.compactNextButtonText} numberOfLines={1}>
                    {`${loadingEmoji} ${activeLoadingPhrase}`}
                  </Text>
                </LinearGradient>
              ) : currentResponse.trim() ? (
                <LinearGradient
                  colors={['#4A6B7C', '#31495A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.compactNextButton}
                >
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.compactNextButtonText}>
                    {currentStep < 2 ? t('journal.continue') : t('journal.finish')}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={[styles.compactNextButton, styles.compactNextButtonDisabled]}>
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.compactNextButtonText}>
                    🌱 {t('journal.writeHint', 'Enter text')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <Image
              source={require('../../assets/images/journal-icon-7.png')}
              style={styles.continueButtonIcon}
              contentFit="contain"
            />
          </View>

          {/* Previous Entries (for context) */}
          {currentStep > 0 && (
            <View style={styles.previousEntriesContainer}>
              <Text style={styles.previousEntriesTitle}>{t('journal.previousReflections')}</Text>
              {entries.slice(0, currentStep).map((entry, index) => (
                <View key={index} style={styles.previousEntry}>
                  <Text style={styles.previousPrompt}>{entry.prompt}</Text>
                  <Text style={styles.previousResponse}>{entry.response}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaWrapper>

      {/* Save Session Modal */}
      <Modal
        visible={showSaveModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.saveModal}>
            <Text style={styles.saveModalTitle}>{t('journal.saveModalTitle')}</Text>

            <TouchableOpacity
              style={styles.saveModalButton}
              onPress={handleSaveAndExit}
              activeOpacity={0.8}
            >
              <Text style={styles.saveModalButtonText}>{t('journal.save')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveModalButton, styles.dontSaveButton]}
              onPress={handleDontSaveAndExit}
              activeOpacity={0.8}
            >
              <Text style={[styles.saveModalButtonText, styles.dontSaveButtonText]}>{t('journal.dontSaveButton')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowSaveModal(false)}
              style={styles.cancelButton}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GuidedJournalScreen;
