import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions, Modal } from 'react-native';
import { Star, MessageCircle, Heart, ArrowRight, BarChart3, ChevronLeft, ChevronRight, Eye, Calendar, Trash2, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ValuesReflectButton } from './ReflectButton';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { valuesService, type UserValue, type ValueReflectionSummary } from '../services/valuesService';

interface ValueCardsProps {
  onStartReflection?: (valueId: string, prompt: string, valueName: string, valueDescription: string) => void;
  onStartExercise?: () => void;
  showBarChart?: boolean;
  maxValues?: number;
  onDelete?: (reflectionId: string) => void;
  onDeleteValue?: (valueId: string) => void;
}

interface ReflectionPrompt {
  text: string;
  category: 'daily' | 'alignment' | 'action';
}

// Reflection prompt keys for translation
const REFLECTION_PROMPT_KEYS: Array<{key: string, category: 'daily' | 'alignment' | 'action'}> = [
  { key: 'insights.values.prompts.liveToday', category: 'daily' },
  { key: 'insights.values.prompts.feltAligned', category: 'alignment' },
  { key: 'insights.values.prompts.smallAction', category: 'action' },
  { key: 'insights.values.prompts.relationships', category: 'daily' },
  { key: 'insights.values.prompts.prioritizeMore', category: 'alignment' },
  { key: 'insights.values.prompts.bringToWork', category: 'action' },
  { key: 'insights.values.prompts.barriers', category: 'alignment' },
  { key: 'insights.values.prompts.evolved', category: 'daily' },
  { key: 'insights.values.prompts.idealDay', category: 'action' }
];

const { width: screenWidth } = Dimensions.get('window');

// Example data for the preview modal
const EXAMPLE_VALUES: Array<Omit<UserValue, 'id' | 'createdDate' | 'updatedDate'> & { id: string }> = [
  {
    id: 'example-1',
    name: 'Connection',
    userDescription: 'Being close to my family and friends gives me strength. I feel most alive when I\'m sharing meaningful moments with people I care about.',
    importance: 5,
    sourceSessionId: 'example',
    tags: ['family', 'friendship', 'relationships', 'love']
  },
  {
    id: 'example-2',
    name: 'Freedom',
    userDescription: 'Having the ability to make my own choices and live life on my terms is incredibly important. I value independence and flexibility.',
    importance: 4,
    sourceSessionId: 'example',
    tags: ['independence', 'choice', 'autonomy', 'flexibility']
  },
  {
    id: 'example-3',
    name: 'Health',
    userDescription: 'Taking care of my body and mind is essential for everything else I want to do. When I feel physically strong, I feel mentally resilient.',
    importance: 4,
    sourceSessionId: 'example',
    tags: ['fitness', 'wellness', 'energy', 'vitality']
  },
  {
    id: 'example-4',
    name: 'Creativity',
    userDescription: 'Expressing myself through art, writing, and creative projects brings me deep joy. It\'s how I process my emotions and share my unique perspective.',
    importance: 4,
    sourceSessionId: 'example',
    tags: ['art', 'expression', 'originality', 'imagination']
  }
];

export const ValueCards: React.FC<ValueCardsProps> = ({
  onStartReflection,
  onStartExercise,
  showBarChart = true,
  maxValues = 6,
  onDelete,
  onDeleteValue
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState<UserValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompts, setSelectedPrompts] = useState<Map<string, ReflectionPrompt>>(new Map());
  const [currentValueIndex, setCurrentValueIndex] = useState(0);
  const [reflections, setReflections] = useState<Map<string, ValueReflectionSummary[]>>(new Map());
  const [showReflectionsModal, setShowReflectionsModal] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);

  const loadValues = useCallback(async (options: { skipLoadingState?: boolean } = {}) => {
    const { skipLoadingState = false } = options;
    try {
      if (!skipLoadingState) {
        setLoading(true);
      }
      let userValues = await valuesService.getValuesByImportance();

      // REMOVED: Auto-generation of sample data
      // Users should see empty state if they have no values

      const limitedValues = userValues.slice(0, maxValues);
      setValues(limitedValues);
      
      // Assign random prompts to each value
      const promptMap = new Map();
      limitedValues.forEach(value => {
        const randomPromptKey = REFLECTION_PROMPT_KEYS[Math.floor(Math.random() * REFLECTION_PROMPT_KEYS.length)];
        const promptText = t(randomPromptKey.key);
        promptMap.set(value.id, { text: promptText, category: randomPromptKey.category });
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
      if (!skipLoadingState) {
        setLoading(false);
      }
    }
  }, [maxValues, t]);

  useEffect(() => {
    loadValues();
  }, [loadValues]);

  useEffect(() => {
    const unsubscribe = valuesService.subscribe(() => {
      loadValues({ skipLoadingState: true });
    });

    return unsubscribe;
  }, [loadValues]);

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
            {t('insights.values.overview')}
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
          💭 {t('insights.values.reflectionPrompt')}
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
            marginBottom: 10,
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
{valueReflections.length === 1 ? t('insights.values.viewReflectionSingle') : t('insights.values.viewReflections', { count: valueReflections.length })}
          </Text>
        </TouchableOpacity>
      )}

      {/* Delete Button */}
      {onDeleteValue && (
        <View style={{
          marginTop: valueReflections.length > 0 ? 0 : 2,
          alignItems: 'center',
        }}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDeleteValue(value.id);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Trash2 size={16} color="#698991" opacity={0.6} style={{ marginRight: 6 }} />
            <Text style={{
              color: '#698991',
              fontSize: 13,
              fontWeight: '500',
              opacity: 0.6,
            }}>
              {t('insights.values.deleteValue')}
            </Text>
          </TouchableOpacity>
        </View>
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
          {t('insights.values.loading')}
        </Text>
      </View>
    );
  }

  if (values.length === 0) {
    return (
      <>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 180
        }}>
          <Heart size={48} color="#698991" />
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#374151',
            marginTop: 12,
            textAlign: 'center'
          }}>
            {t('insights.values.emptyState.title') || 'Discover Your Core Values'}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6B7280',
            marginTop: 8,
            textAlign: 'center',
            lineHeight: 20,
            paddingHorizontal: 10
          }}>
            {t('insights.values.emptyState.description') || 'Complete the Values Exploration exercise to identify what truly matters to you'}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => {
                console.log('See Example clicked, setting modal to true');
                setShowExampleModal(true);
              }}
              style={{
                backgroundColor: 'transparent',
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderWidth: 1.5,
                borderColor: '#5A88B5',
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                color: '#5A88B5',
                fontSize: 14,
                fontWeight: '600'
              }}>
                {t('insights.values.emptyState.seeExample') || 'See Example'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log('Start Exercise clicked');
                onStartExercise?.();
              }}
              style={{
                backgroundColor: '#5A88B5',
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              activeOpacity={0.8}
            >
              <MessageCircle size={16} color="white" />
              <Text style={{
                color: 'white',
                fontSize: 14,
                fontWeight: '600',
                marginLeft: 6
              }}>
                {t('insights.values.emptyState.startExercise') || 'Start Exercise'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Example Modal - Must be included in empty state return */}
        <Modal
          visible={showExampleModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowExampleModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              marginHorizontal: 20,
              maxHeight: '85%',
              width: '90%',
              overflow: 'hidden',
            }}>
              {/* Header with EXAMPLE Badge */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
              }}>
                <View style={{
                  backgroundColor: '#FEF3C7',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#F59E0B',
                }}>
                  <Text style={{
                    color: '#D97706',
                    fontSize: 12,
                    fontWeight: '700',
                    letterSpacing: 0.5,
                  }}>
                    {t('insights.values.exampleModal.badge') || 'EXAMPLE'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowExampleModal(false)}
                  style={{ padding: 4 }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Scrollable Content */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* Info Message */}
                <View style={{
                  marginHorizontal: 20,
                  marginTop: 16,
                  backgroundColor: '#EFF6FF',
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: '#3B82F6',
                }}>
                  <Text style={{
                    fontSize: 13,
                    color: '#1E40AF',
                    lineHeight: 18,
                  }}>
                    {t('insights.values.exampleModal.infoMessage') || 'This is an example of what you\'ll see after completing the Values Exploration exercise. Your personal values will be identified and displayed here.'}
                  </Text>
                </View>

                {/* Example Bar Chart */}
                <View style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 20,
                  marginHorizontal: 20,
                  marginTop: 16,
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
                      {t('insights.values.overview') || 'Core Values'}
                    </Text>
                  </View>

                  {EXAMPLE_VALUES.map((value, index) => {
                    const maxBarWidth = 200;
                    const barWidth = Math.max(20, (value.importance / 5) * maxBarWidth);
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
                          width: maxBarWidth
                        }}>
                          <Svg width={barWidth} height={8}>
                            <Defs>
                              <LinearGradient id={`exampleValueGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="#698991" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#8BA3A8" stopOpacity="1" />
                              </LinearGradient>
                            </Defs>
                            <Rect
                              x={0}
                              y={0}
                              width={barWidth}
                              height={8}
                              fill={`url(#exampleValueGradient${index})`}
                              rx={4}
                            />
                          </Svg>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Example Value Cards (show 2) */}
                {EXAMPLE_VALUES.slice(0, 2).map((value) => (
                  <View key={value.id} style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 16,
                    marginHorizontal: 20,
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
                        <View style={{ flexDirection: 'row', gap: 2 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              color={star <= value.importance ? '#698991' : '#E5E7EB'}
                              fill={star <= value.importance ? '#698991' : 'transparent'}
                            />
                          ))}
                        </View>
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
                    }}>
                      <Text style={{
                        fontSize: 13,
                        color: '#1E40AF',
                        marginBottom: 8,
                        fontWeight: '500'
                      }}>
                        💭 {t('insights.values.reflectionPrompt') || 'Reflection Prompt'}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        color: '#374151',
                        lineHeight: 20
                      }}>
                        {t('insights.values.prompts.liveToday') || 'How did you live this value today?'}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Bottom Action Button */}
                <View style={{
                  marginHorizontal: 20,
                  marginTop: 8,
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowExampleModal(false);
                      onStartExercise?.();
                    }}
                    style={{
                      backgroundColor: '#5A88B5',
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                    }}
                    activeOpacity={0.8}
                  >
                    <MessageCircle
                      size={16}
                      color="#FFFFFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: 15,
                      fontWeight: '600',
                    }}>
                      {t('insights.values.exampleModal.startButton') || 'Start Values Exercise'}
                    </Text>
                    <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </>
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
  const currentPrompt = currentValue ? selectedPrompts.get(currentValue.id) || { text: t(REFLECTION_PROMPT_KEYS[0].key), category: REFLECTION_PROMPT_KEYS[0].category } : null;

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
                {t('insights.values.pagination', { current: currentValueIndex + 1, total: values.length })}
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#9CA3AF',
                marginTop: 2
              }}>
                {t('insights.values.swipeToExplore')}
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
              {currentValue?.name} {t('insights.values.reflections')}
            </Text>
            <TouchableOpacity
              onPress={() => setShowReflectionsModal(false)}
              style={{
                backgroundColor: '#5A88B5',
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
                {t('common.close')}
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
                  {t('insights.values.prompt')}: {reflection.prompt}
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
                      {t('insights.values.keyInsights')}:
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

                {/* Delete Button */}
                {onDelete && (
                  <View style={{
                    marginTop: 12,
                    alignItems: 'center',
                  }}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        onDelete(reflection.id);
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Trash2 size={16} color="#698991" opacity={0.6} style={{ marginRight: 6 }} />
                      <Text style={{
                        color: '#698991',
                        fontSize: 13,
                        fontWeight: '500',
                        opacity: 0.6,
                      }}>
                        {t('insights.values.deleteReflection')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Example Modal */}
      <Modal
        visible={showExampleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExampleModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            marginHorizontal: 20,
            maxHeight: '85%',
            width: '90%',
            overflow: 'hidden',
          }}>
            {/* Header with EXAMPLE Badge */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
            }}>
              <View style={{
                backgroundColor: '#FEF3C7',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#F59E0B',
              }}>
                <Text style={{
                  color: '#D97706',
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                }}>
                  {t('insights.values.exampleModal.badge') || 'EXAMPLE'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowExampleModal(false)}
                style={{ padding: 4 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Info Message */}
              <View style={{
                marginHorizontal: 20,
                marginTop: 16,
                backgroundColor: '#EFF6FF',
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#3B82F6',
              }}>
                <Text style={{
                  fontSize: 13,
                  color: '#1E40AF',
                  lineHeight: 18,
                }}>
                  {t('insights.values.exampleModal.infoMessage') || 'This is an example of what you\'ll see after completing the Values Exploration exercise. Your personal values will be identified and displayed here.'}
                </Text>
              </View>

              {/* Example Bar Chart */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 20,
                marginHorizontal: 20,
                marginTop: 16,
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
                    {t('insights.values.overview') || 'Core Values'}
                  </Text>
                </View>

                {EXAMPLE_VALUES.map((value, index) => {
                  const maxBarWidth = 200;
                  const barWidth = Math.max(20, (value.importance / 5) * maxBarWidth);
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
                        width: maxBarWidth
                      }}>
                        <Svg width={barWidth} height={8}>
                          <Defs>
                            <LinearGradient id={`exampleValueGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <Stop offset="0%" stopColor="#698991" stopOpacity="1" />
                              <Stop offset="100%" stopColor="#8BA3A8" stopOpacity="1" />
                            </LinearGradient>
                          </Defs>
                          <Rect
                            x={0}
                            y={0}
                            width={barWidth}
                            height={8}
                            fill={`url(#exampleValueGradient${index})`}
                            rx={4}
                          />
                        </Svg>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Example Value Cards (show 2) */}
              {EXAMPLE_VALUES.slice(0, 2).map((value) => (
                <View key={value.id} style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 16,
                  marginHorizontal: 20,
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
                      <View style={{ flexDirection: 'row', gap: 2 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            color={star <= value.importance ? '#698991' : '#E5E7EB'}
                            fill={star <= value.importance ? '#698991' : 'transparent'}
                          />
                        ))}
                      </View>
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
                  }}>
                    <Text style={{
                      fontSize: 13,
                      color: '#1E40AF',
                      marginBottom: 8,
                      fontWeight: '500'
                    }}>
                      💭 {t('insights.values.reflectionPrompt') || 'Reflection Prompt'}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#374151',
                      lineHeight: 20
                    }}>
                      {t('insights.values.prompts.liveToday') || 'How did you live this value today?'}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Bottom Action Button */}
              <View style={{
                marginHorizontal: 20,
                marginTop: 8,
              }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowExampleModal(false);
                    onStartExercise?.();
                  }}
                  style={{
                    backgroundColor: '#5A88B5',
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                  }}
                  activeOpacity={0.8}
                >
                  <MessageCircle
                    size={16}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: '600',
                  }}>
                    {t('insights.values.exampleModal.startButton') || 'Start Values Exercise'}
                  </Text>
                  <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};