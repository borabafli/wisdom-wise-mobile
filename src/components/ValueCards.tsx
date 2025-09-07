import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions, Modal } from 'react-native';
import { Star, MessageCircle, Heart, ArrowRight, BarChart3, ChevronLeft, ChevronRight, Eye, Calendar } from 'lucide-react-native';
import { ValuesReflectButton } from './ReflectButton';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { valuesService, type UserValue, type ValueReflectionSummary } from '../services/valuesService';
import { generateSampleValuesData } from '../utils/sampleValuesData';

interface ValueCardsProps {
  onStartReflection?: (valueId: string, prompt: string, valueName: string, valueDescription: string) => void;
  showBarChart?: boolean;
  maxValues?: number;
}

interface ReflectionPrompt {
  text: string;
  category: 'daily' | 'alignment' | 'action';
}

const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  { text: "How did you live this value today?", category: 'daily' },
  { text: "When did you last feel aligned with this?", category: 'alignment' },
  { text: "What small action could honor this value this week?", category: 'action' },
  { text: "How does this value show up in your relationships?", category: 'daily' },
  { text: "What would change if you prioritized this more?", category: 'alignment' },
  { text: "How can you bring more of this into your work?", category: 'action' },
  { text: "What barriers prevent you from living this fully?", category: 'alignment' },
  { text: "How has this value evolved in your life?", category: 'daily' },
  { text: "What would your ideal day look like with this value?", category: 'action' }
];

const { width: screenWidth } = Dimensions.get('window');

export const ValueCards: React.FC<ValueCardsProps> = ({ 
  onStartReflection, 
  showBarChart = true, 
  maxValues = 6 
}) => {
  const [values, setValues] = useState<UserValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompts, setSelectedPrompts] = useState<Map<string, ReflectionPrompt>>(new Map());
  const [currentValueIndex, setCurrentValueIndex] = useState(0);
  const [reflections, setReflections] = useState<Map<string, ValueReflectionSummary[]>>(new Map());
  const [showReflectionsModal, setShowReflectionsModal] = useState(false);

  useEffect(() => {
    loadValues();
  }, []);

  const loadValues = async () => {
    try {
      setLoading(true);
      let userValues = await valuesService.getValuesByImportance();
      
      // Auto-generate sample data if no values exist (for demo purposes)
      if (userValues.length === 0) {
        console.log('No values found, auto-generating sample data...');
        const success = await generateSampleValuesData();
        if (success) {
          // Reload values after generating sample data
          userValues = await valuesService.getValuesByImportance();
          console.log('Sample values generated and loaded:', userValues.length);
        }
      }
      
      const limitedValues = userValues.slice(0, maxValues);
      setValues(limitedValues);
      
      // Assign random prompts to each value
      const promptMap = new Map();
      limitedValues.forEach(value => {
        const randomPrompt = REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
        promptMap.set(value.id, randomPrompt);
      });
      setSelectedPrompts(promptMap);

      // Load reflections for each value
      const reflectionsMap = new Map();
      for (const value of limitedValues) {
        const valueReflections = await valuesService.getReflectionSummariesForValue(value.id);
        if (valueReflections.length > 0) {
          reflectionsMap.set(value.id, valueReflections);
        }
      }
      setReflections(reflectionsMap);
    } catch (error) {
      console.error('Error loading values:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderImportanceStars = (importance: number) => {
    return (
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            color={star <= importance ? '#698991' : '#E5E7EB'}
            fill={star <= importance ? '#698991' : 'transparent'}
          />
        ))}
      </View>
    );
  };

  const ValueBarChart: React.FC = () => {
    if (!showBarChart || values.length === 0) return null;
    
    const maxBarWidth = 200;
    const maxImportance = Math.max(...values.map(v => v.importance));
    
    return (
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <BarChart3 size={24} color="#698991" />
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#374151',
            marginLeft: 8
          }}>
            Your Values Overview
          </Text>
        </View>
        
        {values.map((value, index) => {
          const barWidth = Math.max(20, (value.importance / 5) * maxBarWidth); // Ensure minimum visibility and proper scaling
          return (
            <View key={value.id} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151' }}>
                  {value.name}
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                  {value.importance}/5
                </Text>
              </View>
              <View style={{
                height: 8,
                backgroundColor: '#F3F4F6',
                borderRadius: 4,
                overflow: 'hidden',
                width: maxBarWidth // Ensure container has full width
              }}>
                <Svg width={barWidth} height={8}>
                  <Defs>
                    <LinearGradient id={`valueGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <Stop offset="0%" stopColor="#698991" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#8BA3A8" stopOpacity="1" />
                    </LinearGradient>
                  </Defs>
                  <Rect
                    x={0}
                    y={0}
                    width={barWidth}
                    height={8}
                    fill={`url(#valueGradient${index})`}
                    rx={4}
                  />
                </Svg>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const ValueCard: React.FC<{ value: UserValue; prompt: ReflectionPrompt }> = ({ value, prompt }) => {
    const valueReflections = reflections.get(value.id) || [];
    
    return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: '#698991',
    }}>
      {/* Header with value name and stars */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#374151',
            marginBottom: 4
          }}>
            🏷️ {value.name}
          </Text>
          {renderImportanceStars(value.importance)}
        </View>
      </View>

      {/* User's own words */}
      <View style={{
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#698991'
      }}>
        <Text style={{
          fontSize: 14,
          color: '#475569',
          fontStyle: 'italic',
          lineHeight: 20
        }}>
          "{value.userDescription}"
        </Text>
      </View>

      {/* Reflection prompt */}
      <View style={{
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12
      }}>
        <Text style={{
          fontSize: 13,
          color: '#1E40AF',
          marginBottom: 8,
          fontWeight: '500'
        }}>
          💭 Reflection Prompt
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#374151',
          lineHeight: 20
        }}>
          {prompt.text}
        </Text>
      </View>

      {/* Action button */}
      <ValuesReflectButton
        onPress={() => onStartReflection?.(value.id, prompt.text, value.name, value.userDescription)}
        style={{ marginBottom: 10 }}
      />

      {/* Reflections button (if any exist) */}
      {valueReflections.length > 0 && (
        <TouchableOpacity
          onPress={() => setShowReflectionsModal(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            borderColor: '#698991',
            borderWidth: 1,
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
          activeOpacity={0.8}
        >
          <Eye size={14} color="#698991" />
          <Text style={{
            color: '#698991',
            fontSize: 13,
            fontWeight: '500',
            marginLeft: 6,
            marginRight: 4
          }}>
            View {valueReflections.length} Reflection{valueReflections.length > 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}
    </View>
    );
  };

  if (loading) {
    return (
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120
      }}>
        <Heart size={32} color="#698991" />
        <Text style={{
          fontSize: 16,
          color: '#6B7280',
          marginTop: 8,
          textAlign: 'center'
        }}>
          Loading your values...
        </Text>
      </View>
    );
  }

  if (values.length === 0) {
    return (
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 160
      }}>
        <Heart size={48} color="#698991" />
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: '#374151',
          marginTop: 12,
          textAlign: 'center'
        }}>
          Discover Your Values
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#6B7280',
          marginTop: 8,
          textAlign: 'center',
          lineHeight: 20
        }}>
          Complete a value exercise to see your personal values and importance ratings here.
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#698991',
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 20,
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1
            }}
            activeOpacity={0.8}
          >
            <MessageCircle size={16} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500',
              marginLeft: 6
            }}>
              Start Values Exercise
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={async () => {
              setLoading(true);
              await generateSampleValuesData();
              await loadValues();
              setLoading(false);
            }}
            style={{
              backgroundColor: '#A78BFA',
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 20,
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1
            }}
            activeOpacity={0.8}
          >
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500'
            }}>
              Generate Sample
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSwipeLeft = () => {
    if (currentValueIndex < values.length - 1) {
      setCurrentValueIndex(currentValueIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentValueIndex > 0) {
      setCurrentValueIndex(currentValueIndex - 1);
    }
  };

  const currentValue = values[currentValueIndex];
  const currentPrompt = currentValue ? selectedPrompts.get(currentValue.id) || REFLECTION_PROMPTS[0] : null;

  return (
    <View>
      {/* Bar Chart Overview */}
      <ValueBarChart />
      
      {/* Single Swipeable Value Card */}
      {currentValue && currentPrompt && (
        <View>
          {/* Navigation Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 12
          }}>
            <TouchableOpacity
              onPress={handleSwipeRight}
              disabled={currentValueIndex === 0}
              style={{
                opacity: currentValueIndex === 0 ? 0.3 : 1,
                padding: 8
              }}
            >
              <ChevronLeft size={24} color="#698991" />
            </TouchableOpacity>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 14,
                color: '#698991',
                fontWeight: '500'
              }}>
                {currentValueIndex + 1} of {values.length}
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#9CA3AF',
                marginTop: 2
              }}>
                Swipe to explore
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleSwipeLeft}
              disabled={currentValueIndex === values.length - 1}
              style={{
                opacity: currentValueIndex === values.length - 1 ? 0.3 : 1,
                padding: 8
              }}
            >
              <ChevronRight size={24} color="#698991" />
            </TouchableOpacity>
          </View>
          
          {/* Current Value Card */}
          <ValueCard 
            value={currentValue} 
            prompt={currentPrompt}
          />
        </View>
      )}

      {/* Reflections Modal */}
      <Modal
        visible={showReflectionsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{
          flex: 1,
          backgroundColor: '#f8fafc',
          paddingTop: 20,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#374151',
            }}>
              {currentValue?.name} Reflections
            </Text>
            <TouchableOpacity
              onPress={() => setShowReflectionsModal(false)}
              style={{
                backgroundColor: '#698991',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 14,
                fontWeight: '500',
              }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            {reflections.get(currentValue?.id || '')?.map((reflection) => (
              <View
                key={reflection.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 16,
                  marginVertical: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <Calendar size={16} color="#698991" />
                  <Text style={{
                    fontSize: 14,
                    color: '#6b7280',
                    marginLeft: 8,
                  }}>
                    {new Date(reflection.date).toLocaleDateString()}
                  </Text>
                </View>

                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: 8,
                }}>
                  Prompt: {reflection.prompt}
                </Text>

                <Text style={{
                  fontSize: 15,
                  color: '#374151',
                  lineHeight: 22,
                  marginBottom: 12,
                }}>
                  {reflection.summary}
                </Text>

                {reflection.keyInsights.length > 0 && (
                  <View>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#698991',
                      marginBottom: 6,
                    }}>
                      Key Insights:
                    </Text>
                    {reflection.keyInsights.map((insight, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 14,
                          color: '#475569',
                          lineHeight: 20,
                          marginBottom: 4,
                        }}
                      >
                        • {insight}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};