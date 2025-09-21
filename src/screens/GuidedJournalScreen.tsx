import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Check, ArrowLeft, Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { guidedJournalStyles as styles } from '../styles/components/GuidedJournal.styles';
import JournalSummaryCard from '../components/JournalSummaryCard';
import { chatService } from '../services/chatService';
import JournalStorageService from '../services/journalStorageService';
import { useVoiceRecording } from '../hooks/chat/useVoiceRecording';
import { useTTSControls } from '../hooks/chat/useTTSControls';
import { RecordingWave } from '../components/RecordingWave';

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
  const { initialPrompt } = route.params;

  const [currentStep, setCurrentStep] = useState(0);
  const [entries, setEntries] = useState<JournalEntry[]>([
    { prompt: initialPrompt, response: '' }
  ]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [journalSummary, setJournalSummary] = useState<{
    summary: string;
    insights: string[];
  } | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

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

  const handleNext = async () => {
    if (!currentResponse.trim()) {
      Alert.alert('Please write something', 'Your journal entry cannot be empty.');
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
        Alert.alert('Error', 'Failed to generate next question. Please try again.');
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

Latest response: "${userResponse}"

Generate a thoughtful follow-up question that goes deeper into their reflection. This is ${stepNumber === 0 ? 'the first' : 'the second'} follow-up question. Make it:
- Personal and introspective
- Related to what they just wrote
- Designed to help them explore their thoughts and feelings more deeply
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

    const prompt = `Please create a brief, encouraging summary of this journal entry and extract 1-2 key insights:

${fullJournalText}

IMPORTANT: You must respond with ONLY valid JSON in exactly this format (no additional text before or after):
{
  "summary": "A warm, brief summary (2-3 sentences) of their reflection",
  "insights": ["Key insight 1", "Key insight 2 (optional)"]
}

Make the summary supportive and affirming. Keep insights concise and meaningful. Respond with JSON only.`;

    try {
      const response = await chatService.sendMessage(prompt, []);
      console.log('Raw summary response:', response);

      let summaryData;

      // Try to parse as JSON first
      try {
        summaryData = JSON.parse(response.trim());
      } catch (jsonError) {
        console.log('Failed to parse as JSON, attempting to extract JSON from response');

        // Try to find JSON within the response text
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            summaryData = JSON.parse(jsonMatch[0]);
          } catch (extractError) {
            throw new Error('Could not extract valid JSON from response');
          }
        } else {
          // If no JSON found, create summary from plain text
          summaryData = {
            summary: response.trim().split('\n')[0] || "Thank you for your thoughtful reflection.",
            insights: ["Your willingness to explore your thoughts shows great self-awareness"]
          };
        }
      }

      // Validate the structure
      if (!summaryData.summary || !summaryData.insights) {
        throw new Error('Invalid summary structure');
      }

      setJournalSummary(summaryData);
      setShowSummary(true);
    } catch (error) {
      console.error('Error generating summary:', error);

      // Fallback summary
      setJournalSummary({
        summary: "Thank you for taking the time to reflect and explore your thoughts. Your willingness to look deeper shows great self-awareness and commitment to personal growth.",
        insights: ["Self-reflection is a valuable practice for personal growth", "Taking time to explore your thoughts and feelings builds self-awareness"]
      });
      setShowSummary(true);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleSave = async (shouldPolish: boolean = false) => {
    try {
      if (!journalSummary) return;

      await JournalStorageService.saveJournalEntry(
        initialPrompt,
        entries,
        journalSummary.summary,
        journalSummary.insights,
        shouldPolish
      );

      Alert.alert(
        'Journal Saved',
        shouldPolish ? 'Your entry has been saved and polished!' : 'Your journal entry has been saved!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
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
      Alert.alert('Error', 'Failed to save your draft. Please try again.');
    }
  };

  const handleDontSaveAndExit = () => {
    setShowSaveModal(false);
    navigation.goBack();
  };

  if (showSummary && journalSummary) {
    return (
      <JournalSummaryCard
        visible={showSummary}
        summary={journalSummary.summary}
        insights={journalSummary.insights}
        onSave={() => handleSave(false)}
        onSaveAndPolish={() => handleSave(true)}
        onClose={() => setShowSummary(false)}
      />
    );
  }

  return (
    <>
      <SafeAreaWrapper style={styles.container}>
        {/* Solid Background like Home Screen */}
        <View
          style={[styles.backgroundSolid, { backgroundColor: '#ebf5f9' }]}
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
          <Text style={styles.headerTitle}>Guided Journal</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>{currentStep + 1}/3</Text>
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
                  placeholder={isTranscribing ? "Transcribing..." : "Type or speak your thoughts..."}
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
                  <TouchableOpacity
                    onPress={cancelRecording}
                    style={styles.cancelButton}
                    activeOpacity={0.7}
                  >
                    <X size={20} color="#ffffff" />
                  </TouchableOpacity>

                  {/* Wave and Timer Container - Center */}
                  <View style={styles.waveWithTimerInside}>
                    <RecordingWave
                      audioLevel={audioLevel}
                      isRecording={isRecording}
                      variant="bars"
                      size="medium"
                      showTimer={true}
                    />
                  </View>

                  {/* Submit Button (Check) - Right side */}
                  <TouchableOpacity
                    onPress={stopRecording}
                    style={styles.submitRecordingButton}
                    activeOpacity={0.7}
                  >
                    <Check size={20} color="#ffffff" />
                  </TouchableOpacity>
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

          {/* Previous Entries (for context) */}
          {currentStep > 0 && (
            <View style={styles.previousEntriesContainer}>
              <Text style={styles.previousEntriesTitle}>Your Previous Reflections:</Text>
              {entries.slice(0, currentStep).map((entry, index) => (
                <View key={index} style={styles.previousEntry}>
                  <Text style={styles.previousPrompt}>{entry.prompt}</Text>
                  <Text style={styles.previousResponse}>{entry.response}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Continue Button - Part of scrollable content */}
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
              {(!currentResponse.trim() || isGeneratingQuestion) ? (
                <View style={[styles.compactNextButton, styles.compactNextButtonDisabled]}>
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.compactNextButtonText}>
                    {isGeneratingQuestion ? '...' : (currentStep < 2 ? 'Continue' : 'Finish')}
                  </Text>
                </View>
              ) : (
                <LinearGradient
                  colors={['#4A6B7C', '#1A2B36']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.compactNextButton}
                >
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.compactNextButtonText}>
                    {currentStep < 2 ? 'Continue' : 'Finish'}
                  </Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>
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
            <Text style={styles.saveModalTitle}>Save Session?</Text>

            <TouchableOpacity
              style={styles.saveModalButton}
              onPress={handleSaveAndExit}
              activeOpacity={0.8}
            >
              <Text style={styles.saveModalButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveModalButton, styles.dontSaveButton]}
              onPress={handleDontSaveAndExit}
              activeOpacity={0.8}
            >
              <Text style={[styles.saveModalButtonText, styles.dontSaveButtonText]}>Don't Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowSaveModal(false)}
              style={styles.cancelButton}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GuidedJournalScreen;