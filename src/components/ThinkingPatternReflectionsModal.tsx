import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Lightbulb, X, FileText } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThinkingPatternReflectionSummary } from '../services/thinkingPatternsService';

interface ThinkingPatternReflectionsModalProps {
  visible: boolean;
  reflections: ThinkingPatternReflectionSummary[];
  onClose: () => void;
  onReflectionPress?: (reflection: ThinkingPatternReflectionSummary) => void;
}

export const ThinkingPatternReflectionsModal: React.FC<ThinkingPatternReflectionsModalProps> = ({
  visible,
  reflections,
  onClose,
  onReflectionPress
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingTop: 20,
      }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: '#e0e7ff',
              padding: 8,
              borderRadius: 10,
              marginRight: 12,
            }}>
              <Lightbulb size={20} color="#6366f1" />
            </View>
            <View>
              <Text style={{
                fontSize: 20,
                fontWeight: '600',
                color: '#374151',
              }}>
                Thinking Pattern Reflections
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#64748b',
                marginTop: 2,
              }}>
                {reflections.length} reflection{reflections.length > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: '#698991',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <X size={16} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500',
              marginLeft: 4,
            }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          {reflections.length === 0 ? (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 60,
            }}>
              <View style={{
                backgroundColor: '#f1f5f9',
                padding: 20,
                borderRadius: 20,
                marginBottom: 16,
              }}>
                <FileText size={32} color="#94a3b8" />
              </View>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: '#64748b',
                textAlign: 'center',
                marginBottom: 8,
              }}>
                No reflections yet
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#94a3b8',
                textAlign: 'center',
                lineHeight: 20,
              }}>
                Complete thinking pattern reflections to see them here
              </Text>
            </View>
          ) : (
            reflections.map((reflection, index) => (
              <TouchableOpacity
                key={reflection.id}
                onPress={() => onReflectionPress?.(reflection)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 1,
                  borderLeftWidth: 4,
                  borderLeftColor: '#6366f1',
                }}
                activeOpacity={0.9}
              >
                {/* Header */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}>
                  <View style={{ flex: 1 }}>
                    <View style={{
                      backgroundColor: '#f0f0ff',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      alignSelf: 'flex-start',
                      marginBottom: 8,
                    }}>
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: '#6366f1',
                      }}>
                        {reflection.distortionType}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 12,
                      color: '#94a3b8',
                      fontWeight: '500',
                    }}>
                      {formatDate(reflection.date)}
                    </Text>
                  </View>
                </View>

                {/* Original Thought */}
                <View style={{
                  backgroundColor: '#fef2f2',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                  borderLeftWidth: 3,
                  borderLeftColor: '#f87171',
                }}>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#7f1d1d',
                    marginBottom: 4,
                  }}>
                    Original Thought:
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#991b1b',
                    fontStyle: 'italic',
                    lineHeight: 18,
                  }}>
                    "{reflection.originalThought}"
                  </Text>
                </View>

                {/* Reframed Thought */}
                <View style={{
                  backgroundColor: '#f0fdf4',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                  borderLeftWidth: 3,
                  borderLeftColor: '#4ade80',
                }}>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#14532d',
                    marginBottom: 4,
                  }}>
                    Reframed Thought:
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#166534',
                    fontStyle: 'italic',
                    lineHeight: 18,
                  }}>
                    "{reflection.reframedThought}"
                  </Text>
                </View>

                {/* Summary */}
                <Text style={{
                  fontSize: 14,
                  color: '#475569',
                  lineHeight: 20,
                  marginBottom: 12,
                }}>
                  {reflection.summary}
                </Text>

                {/* Key Insights */}
                {reflection.keyInsights && reflection.keyInsights.length > 0 && (
                  <View>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#475569',
                      marginBottom: 8,
                    }}>
                      Key Insights:
                    </Text>
                    {reflection.keyInsights.map((insight, insightIndex) => (
                      <View key={insightIndex} style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginBottom: 6,
                      }}>
                        <View style={{
                          width: 4,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: '#6366f1',
                          marginTop: 6,
                          marginRight: 8,
                        }} />
                        <Text style={{
                          fontSize: 13,
                          color: '#64748b',
                          lineHeight: 18,
                          flex: 1,
                        }}>
                          {insight}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
          
          {/* Bottom padding */}
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ThinkingPatternReflectionsModal;