import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Star, Calendar, Quote, MoreHorizontal } from 'lucide-react-native';
import { valuesService, UserValue } from '../services/valuesService';

const { width } = Dimensions.get('window');

interface ValuesCardProps {
  onValuePress?: (value: UserValue) => void;
  showAddButton?: boolean;
  onAddValue?: () => void;
  maxValues?: number;
}

const ValuesCard: React.FC<ValuesCardProps> = ({
  onValuePress,
  showAddButton = true,
  onAddValue,
  maxValues = 6
}) => {
  const [values, setValues] = useState<UserValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadValues();
  }, []);

  const loadValues = async () => {
    try {
      setIsLoading(true);
      const userValues = await valuesService.getAllValues();
      setValues(userValues.slice(0, maxValues));
    } catch (error) {
      console.error('Error loading values:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderImportanceStars = (importance: number) => {
    return (
      <View style={styles.importanceContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            color={star <= importance ? '#fbbf24' : '#d1d5db'}
            fill={star <= importance ? '#fbbf24' : 'none'}
          />
        ))}
      </View>
    );
  };

  const renderImportanceDots = (importance: number) => {
    return (
      <View style={styles.dotsContainer}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <View
            key={dot}
            style={[
              styles.importanceDot,
              dot <= importance ? styles.importanceDotFilled : styles.importanceDotEmpty
            ]}
          />
        ))}
      </View>
    );
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 5) return '#ef4444'; // red-500
    if (importance >= 4) return '#f97316'; // orange-500
    if (importance >= 3) return '#eab308'; // yellow-500
    if (importance >= 2) return '#22c55e'; // green-500
    return '#6b7280'; // gray-500
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <LinearGradient
            colors={['#fef3c7', '#fbbf24']}
            style={styles.iconContainer}
          >
            <Heart size={24} color="#d97706" />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.title}>Your Values</Text>
            <Text style={styles.subtitle}>Loading...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (values.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <LinearGradient
            colors={['#fef3c7', '#fbbf24']}
            style={styles.iconContainer}
          >
            <Heart size={24} color="#d97706" />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.title}>Your Values</Text>
            <Text style={styles.subtitle}>What matters most to you?</Text>
          </View>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Start exploring your core values through the Values Clarification exercise
          </Text>
          {showAddButton && onAddValue && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddValue}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>Explore My Values</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardAccent} />
      
      <View style={styles.cardHeader}>
        <LinearGradient
          colors={['#fef3c7', '#fbbf24']}
          style={styles.iconContainer}
        >
          <Heart size={24} color="#d97706" />
        </LinearGradient>
        <View style={styles.headerText}>
          <Text style={styles.title}>Your Values</Text>
          <Text style={styles.subtitle}>What matters most to you</Text>
        </View>
        {showAddButton && onAddValue && (
          <TouchableOpacity
            style={styles.moreButton}
            onPress={onAddValue}
            activeOpacity={0.7}
          >
            <MoreHorizontal size={20} color="#d97706" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        style={styles.valuesContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {values.map((value, index) => (
          <TouchableOpacity
            key={value.id}
            style={styles.valueCard}
            onPress={() => onValuePress && onValuePress(value)}
            activeOpacity={0.9}
          >
            <View style={styles.valueHeader}>
              <View style={styles.valueNameContainer}>
                <Text style={styles.valueName}>{value.name}</Text>
                <View style={styles.valueMetadata}>
                  {renderImportanceStars(value.importance)}
                  <View style={styles.dateContainer}>
                    <Calendar size={10} color="#9ca3af" />
                    <Text style={styles.valueDate}>{formatDate(value.updatedDate)}</Text>
                  </View>
                </View>
              </View>
              
              {/* Importance Bar */}
              <View style={styles.importanceBarContainer}>
                <View style={styles.importanceBar}>
                  <View 
                    style={[
                      styles.importanceBarFill,
                      {
                        width: `${(value.importance / 5) * 100}%`,
                        backgroundColor: getImportanceColor(value.importance)
                      }
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.valueQuote}>
              <Quote size={12} color="#9ca3af" />
              <Text style={styles.valueDescription}>
                {value.userDescription}
              </Text>
            </View>

            {value.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {value.tags.slice(0, 3).map((tag, tagIndex) => (
                  <View key={tagIndex} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
                {value.tags.length > 3 && (
                  <Text style={styles.moreTagsText}>+{value.tags.length - 3}</Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showAddButton && onAddValue && (
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={onAddValue}
          activeOpacity={0.8}
        >
          <Text style={styles.viewAllText}>View All Values</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden' as const,
  },
  cardAccent: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#fbbf24',
  },
  cardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 20,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  moreButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  valuesContainer: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  valueCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  valueHeader: {
    marginBottom: 10,
  },
  valueNameContainer: {
    marginBottom: 8,
  },
  valueName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 4,
  },
  valueMetadata: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  importanceContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  dotsContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  importanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  importanceDotFilled: {
    backgroundColor: '#fbbf24',
  },
  importanceDotEmpty: {
    backgroundColor: '#e5e7eb',
  },
  dateContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  valueDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
  importanceBarContainer: {
    marginTop: 4,
  },
  importanceBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  importanceBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  valueQuote: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 10,
  },
  valueDescription: {
    fontSize: 14,
    color: '#4b5563',
    fontStyle: 'italic' as const,
    flex: 1,
    marginLeft: 6,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    alignItems: 'center' as const,
  },
  tag: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#d97706',
    fontWeight: '500' as const,
  },
  moreTagsText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500' as const,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center' as const,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center' as const,
    marginBottom: 16,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  viewAllButton: {
    margin: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center' as const,
  },
  viewAllText: {
    color: '#d97706',
    fontSize: 14,
    fontWeight: '600' as const,
  },
};

export default ValuesCard;