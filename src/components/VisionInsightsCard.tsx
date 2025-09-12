import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, ArrowRight, Eye, Lightbulb } from 'lucide-react-native';
import { visionInsightsService, VisionInsight } from '../services/visionInsightsService';

interface VisionInsightsCardProps {
  onReflectPress: (visionInsight: VisionInsight) => void;
  onViewAllPress?: () => void;
  onStartExercise?: () => void;
}

export const VisionInsightsCard: React.FC<VisionInsightsCardProps> = ({
  onReflectPress,
  onViewAllPress,
  onStartExercise
}) => {
  const [latestVision, setLatestVision] = useState<VisionInsight | null>(null);
  const [visionStats, setVisionStats] = useState({
    totalVisions: 0,
    commonQualities: [] as Array<{ quality: string; count: number }>
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVisionData();
  }, []);

  const loadVisionData = async () => {
    try {
      setIsLoading(true);
      const [latest, stats] = await Promise.all([
        visionInsightsService.getLatestVisionInsight(),
        visionInsightsService.getVisionStats()
      ]);
      
      setLatestVision(latest);
      setVisionStats({
        totalVisions: stats.totalVisions,
        commonQualities: stats.commonQualities.slice(0, 3) // Top 3 qualities
      });
    } catch (error) {
      console.error('Error loading vision data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.card}>
        <LinearGradient
          colors={['rgba(240, 249, 255, 0.8)', 'rgba(255, 255, 255, 0.95)', 'rgba(240, 249, 255, 0.6)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        />
        <View style={styles.accent} />
        <View style={styles.header}>
          <LinearGradient
            colors={['#A4CEDC', '#599BC1', '#4A8AAE', '#3C7A9B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.icon}
          >
            <Star size={24} color="white" />
          </LinearGradient>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Vision of Myself</Text>
            <Text style={styles.subtitle}>Loading your inspiring vision...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!latestVision) {
    return (
      <View style={styles.card}>
        <LinearGradient
          colors={['rgba(240, 249, 255, 0.8)', 'rgba(255, 255, 255, 0.95)', 'rgba(240, 249, 255, 0.6)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        />
        <View style={styles.accent} />
        <View style={styles.header}>
          <LinearGradient
            colors={['#A4CEDC', '#599BC1', '#4A8AAE', '#3C7A9B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.icon}
          >
            <Star size={24} color="white" />
          </LinearGradient>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Vision of Myself</Text>
            <Text style={styles.subtitle}>Create an inspiring vision of your future self</Text>
          </View>
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Create an inspiring vision of your future self! ✨
          </Text>
          {onStartExercise && (
            <TouchableOpacity
              onPress={onStartExercise}
              style={styles.startExerciseButton}
              activeOpacity={0.8}
            >
              <Star size={16} color="white" />
              <Text style={styles.startExerciseText}>Start Vision Exercise</Text>
              <ArrowRight size={14} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(240, 249, 255, 0.8)', 'rgba(255, 255, 255, 0.95)', 'rgba(240, 249, 255, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      <View style={styles.accent} />
      
      <View style={styles.header}>
        <LinearGradient
          colors={['#E0F2FE', '#7DD3FC']}
          style={styles.icon}
        >
          <Star size={24} color="#0369A1" />
        </LinearGradient>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Vision of Myself</Text>
          <Text style={styles.subtitle}>Your inspiring future self</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Vision Description */}
        <View style={styles.visionDescription}>
          <Text style={styles.descriptionText}>
            "{latestVision.fullDescription}"
          </Text>
          <Text style={styles.visionDate}>
            Created {new Date(latestVision.date).toLocaleDateString()}
          </Text>
        </View>

        {/* Core Qualities */}
        {latestVision.coreQualities.length > 0 && (
          <View style={styles.qualitiesContainer}>
            <Text style={styles.sectionTitle}>Core Qualities</Text>
            <View style={styles.qualitiesRow}>
              {latestVision.coreQualities.slice(0, 4).map((quality, index) => (
                <View key={index} style={styles.qualityTag}>
                  <Text style={styles.qualityText}>{quality}</Text>
                </View>
              ))}
              {latestVision.coreQualities.length > 4 && (
                <View style={styles.qualityTag}>
                  <Text style={styles.qualityText}>+{latestVision.coreQualities.length - 4} more</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Life Domains Preview */}
        {Object.keys(latestVision.lifeDomains).length > 0 && (
          <View style={styles.domainsContainer}>
            <Text style={styles.sectionTitle}>Life Areas Explored</Text>
            <View style={styles.domainsRow}>
              {Object.keys(latestVision.lifeDomains).slice(0, 3).map((domain, index) => (
                <View key={index} style={styles.domainBadge}>
                  <Text style={styles.domainText}>
                    {domain.charAt(0).toUpperCase() + domain.slice(1)}
                  </Text>
                </View>
              ))}
              {Object.keys(latestVision.lifeDomains).length > 3 && (
                <View style={styles.domainBadge}>
                  <Text style={styles.domainText}>
                    +{Object.keys(latestVision.lifeDomains).length - 3} more
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => onReflectPress(latestVision)}
            style={styles.reflectButton}
            activeOpacity={0.8}
          >
            <Lightbulb size={16} color="white" />
            <Text style={styles.reflectButtonText}>Reflect on Vision</Text>
            <ArrowRight size={14} color="white" />
          </TouchableOpacity>

          {visionStats.totalVisions > 1 && onViewAllPress && (
            <TouchableOpacity
              onPress={onViewAllPress}
              style={styles.viewAllButton}
              activeOpacity={0.8}
            >
              <Eye size={14} color="#0369A1" />
              <Text style={styles.viewAllText}>
                View {visionStats.totalVisions} vision{visionStats.totalVisions > 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = {
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden' as const,
    position: 'relative' as const,
  },
  gradientBackground: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  accent: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(165, 180, 252, 0.15)',
    borderRadius: 64,
    transform: [{ translateY: 64 }, { translateX: 64 }],
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 20,
    paddingBottom: 12,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 28,
    fontFamily: 'Nunito-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  visionDescription: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0EA5E9',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1e293b',
    fontFamily: 'ClashGrotesk-Regular',
    marginBottom: 8,
  },
  visionDate: {
    fontSize: 12,
    color: '#64748b',
  },
  qualitiesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 8,
  },
  qualitiesRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
  },
  qualityTag: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qualityText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500' as const,
  },
  domainsContainer: {
    marginBottom: 20,
  },
  domainsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
  },
  domainBadge: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  domainText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '500' as const,
  },
  buttonsContainer: {
    gap: 12,
  },
  reflectButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#599BC1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  reflectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  viewAllButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#f8fafc',
    borderColor: '#0369A1',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  viewAllText: {
    color: '#0369A1',
    fontSize: 13,
    fontWeight: '500' as const,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center' as const,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center' as const,
    lineHeight: 20,
    marginBottom: 16,
  },
  startExerciseButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#599BC1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startExerciseText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600' as const,
  },
};