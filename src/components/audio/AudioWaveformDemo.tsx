import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AudioWaveform, CircularAudioWaveform } from './AudioWaveform';
import { useAudioWaveform } from '../../hooks/useAudioWaveform';
import { audioWaveformStyles as styles } from '../../styles/components/AudioWaveform.styles';
import { Mic, Square, Play, Pause } from 'lucide-react-native';

/**
 * Demo component showcasing real-time audio waveform capabilities
 * This demonstrates the integration with your existing STT service
 */
export const AudioWaveformDemo: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<'bar' | 'circular'>('bar');

  // Use the audio waveform hook that integrates with your STT service
  const audioWaveform = useAudioWaveform({
    sensitivity: 1.5,
    smoothing: 0.2,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        setTranscript(prev => prev + (prev ? ' ' : '') + text);
      }
    },
    onError: (error) => {
      console.error('Audio waveform demo error:', error);
    },
  });

  const toggleVariant = () => {
    setSelectedVariant(prev => prev === 'bar' ? 'circular' : 'bar');
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.waveformContainer}>
        <Text style={styles.visualizerTitle}>
          Real-Time Audio Waveform
        </Text>
        
        {/* Waveform Display */}
        <View style={[styles.recordingContainer, audioWaveform.isRecording && styles.active]}>
          {selectedVariant === 'bar' ? (
            <AudioWaveform
              isRecording={audioWaveform.isRecording}
              audioLevels={audioWaveform.audioLevels}
              width={320}
              height={100}
              color="#06B6D4"
              gradientColors={['#06B6D4', '#0891B2', '#0E7490']}
              sensitivity={1.2}
              showSpectrum={true}
            />
          ) : (
            <View style={styles.circularContainer}>
              <CircularAudioWaveform
                isRecording={audioWaveform.isRecording}
                audioLevels={audioWaveform.audioLevels}
                width={140}
                height={140}
                color="#06B6D4"
                gradientColors={['#06B6D4', '#0891B2', '#0E7490']}
                sensitivity={1.0}
              />
            </View>
          )}
          
          {/* Recording Status */}
          {audioWaveform.isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>
                Recording • {audioWaveform.overallLevel.toFixed(2)} dB
              </Text>
            </View>
          )}
        </View>

        {/* Audio Level Indicators */}
        <View style={styles.levelIndicator}>
          {audioWaveform.audioLevels.map((level, index) => (
            <View
              key={index}
              style={[
                styles.levelBar,
                { width: `${12}%` },
                level > 0.3 && styles.levelBarActive,
                { opacity: Math.max(0.3, level) }
              ]}
            />
          ))}
        </View>

        {/* Controls */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 20 }}>
          <TouchableOpacity
            onPress={audioWaveform.toggleRecording}
            style={[
              {
                backgroundColor: audioWaveform.isRecording ? '#ef4444' : '#06B6D4',
                borderRadius: 50,
                width: 60,
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
              }
            ]}
          >
            {audioWaveform.isRecording ? (
              <Square size={24} color="#ffffff" fill="#ffffff" />
            ) : (
              <Mic size={28} color="#ffffff" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleVariant}
            style={{
              backgroundColor: '#64748b',
              borderRadius: 50,
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selectedVariant === 'bar' ? (
              <Play size={24} color="#ffffff" />
            ) : (
              <Pause size={24} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Variant Selection */}
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.visualizerTitle, { fontSize: 12 }]}>
            Visualization: {selectedVariant === 'bar' ? 'Spectrum Bars' : 'Circular Waveform'}
          </Text>
        </View>
      </View>

      {/* Transcript Display */}
      {transcript && (
        <View style={[styles.waveformContainer, { marginTop: 20 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.visualizerTitle}>Live Transcript</Text>
            <TouchableOpacity onPress={clearTranscript}>
              <Text style={{ color: '#06B6D4', fontSize: 12 }}>Clear</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ 
            fontSize: 14, 
            color: '#334155', 
            lineHeight: 20,
            marginTop: 10,
            padding: 12,
            backgroundColor: '#f1f5f9',
            borderRadius: 8,
          }}>
            {transcript || 'Start speaking to see live transcription...'}
          </Text>
        </View>
      )}

      {/* Technical Info */}
      <View style={[styles.waveformContainer, { marginTop: 20 }]}>
        <Text style={styles.visualizerTitle}>Technical Details</Text>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 12, color: '#64748b' }}>
            Status: {audioWaveform.isRecording ? 'Recording' : 'Idle'}
          </Text>
          <Text style={{ fontSize: 12, color: '#64748b' }}>
            Audio Level: {audioWaveform.overallLevel.toFixed(3)}
          </Text>
          <Text style={{ fontSize: 12, color: '#64748b' }}>
            Frequency Bands: {audioWaveform.audioLevels.length}
          </Text>
          <Text style={{ fontSize: 12, color: '#64748b' }}>
            Engine: OpenAI Whisper via Supabase Edge Functions
          </Text>
          <Text style={{ fontSize: 12, color: '#64748b' }}>
            Visualization: React Native Skia + Reanimated
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};