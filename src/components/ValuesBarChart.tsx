import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart3, Star, TrendingUp, Heart } from 'lucide-react-native';
import { valuesService, UserValue } from '../services/valuesService';

const { width } = Dimensions.get('window');

interface ValuesBarChartProps {
  onValuePress?: (value: UserValue) => void;
  maxValues?: number;
  showTitle?: boolean;
}

const ValuesBarChart: React.FC<ValuesBarChartProps> = ({
  onValuePress,
  maxValues = 8,
  showTitle = true
}) => {
  const [values, setValues] = useState<UserValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadValues();
  }, []);

  const loadValues = async () => {
    try {
      setIsLoading(true);
      const userValues = await valuesService.getValuesByImportance();
      setValues(userValues.slice(0, maxValues));
    } catch (error) {
      console.error('Error loading values for chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImportanceColor = (importance: number, index: number) => {
    const colors = [
      ['#ef4444', '#dc2626'], // red
      ['#f97316', '#ea580c'], // orange
      ['#eab308', '#ca8a04'], // yellow
      ['#22c55e', '#16a34a'], // green
      ['#3b82f6', '#2563eb'], // blue
      ['#8b5cf6', '#7c3aed'], // violet
      ['#ec4899', '#db2777'], // pink
      ['#06b6d4', '#0891b2'], // cyan
    ];
    
    if (importance >= 5) return colors[0];
    if (importance >= 4) return colors[1];
    if (importance >= 3) return colors[2];
    return colors[Math.min(index % colors.length, colors.length - 1)];
  };

  const maxImportance = Math.max(...values.map(v => v.importance), 5);
  const chartWidth = width - 64; // Account for padding

  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading values chart...</Text>
        </View>
      </View>
    );
  }

  if (values.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyState}>
          <BarChart3 size={48} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Values Yet</Text>
          <Text style={styles.emptyText}>
            Complete the Values Clarification exercise to see your importance chart
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardAccent} />
      
      {showTitle && (
        <View style={styles.cardHeader}>
          <LinearGradient
            colors={['#fef3c7', '#fbbf24']}
            style={styles.iconContainer}
          >
            <BarChart3 size={24} color="#d97706" />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.title}>Values by Importance</Text>
            <Text style={styles.subtitle}>What matters most to you</Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.chartContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={styles.chart}>
          {values.map((value, index) => {
            const barWidth = (value.importance / maxImportance) * (chartWidth - 120); // Leave space for labels
            const colors = getImportanceColor(value.importance, index);
            
            return (
              <TouchableOpacity
                key={value.id}
                style={styles.barRow}
                onPress={() => onValuePress && onValuePress(value)}
                activeOpacity={0.8}
              >
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barLabel} numberOfLines={1}>
                    {value.name}
                  </Text>
                  <View style={styles.importanceDisplay}>
                    <Star size={10} color="#fbbf24" fill="#fbbf24" />
                    <Text style={styles.importanceText}>{value.importance}</Text>
                  </View>
                </View>
                
                <View style={styles.barContainer}>
                  <LinearGradient
                    colors={colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.bar, { width: Math.max(barWidth, 20) }]}
                  >
                    <View style={styles.barContent}>
                      <Text style={styles.barText}>{value.importance}/5</Text>
                    </View>
                  </LinearGradient>
                </View>
                
                <View style={styles.barEnd}>
                  <Text style={styles.barValue}>{value.importance}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Heart size={16} color="#ef4444" />
            <Text style={styles.summaryLabel}>Top Value</Text>
            <Text style={styles.summaryValue}>
              {values.length > 0 ? values[0].name : 'None'}
            </Text>
          </View>
          
          <View style={styles.summaryCard}>
            <TrendingUp size={16} color="#22c55e" />
            <Text style={styles.summaryLabel}>Avg Importance</Text>
            <Text style={styles.summaryValue}>
              {values.length > 0 
                ? (values.reduce((sum, v) => sum + v.importance, 0) / values.length).toFixed(1)
                : '0'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
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
  chartContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: 400,
  },
  chart: {
    marginBottom: 20,
  },
  barRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
    paddingVertical: 4,
  },
  barLabelContainer: {
    width: 80,
    marginRight: 12,
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 2,
  },
  importanceDisplay: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  importanceText: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 2,
  },
  barContainer: {
    flex: 1,
    height: 28,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    overflow: 'hidden' as const,
    marginRight: 8,
  },
  bar: {
    height: '100%',
    borderRadius: 14,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    minWidth: 20,
  },
  barContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  barText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600' as const,
  },
  barEnd: {
    width: 24,
    alignItems: 'center' as const,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#374151',
  },
  summaryContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  summaryCard: {
    alignItems: 'center' as const,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center' as const,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center' as const,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center' as const,
    lineHeight: 20,
  },
};

export default ValuesBarChart;