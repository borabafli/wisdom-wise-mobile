import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, ArrowRight, Eye, Lightbulb } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { visionInsightsService, VisionInsight } from '../services/visionInsightsService';
import { insightsDashboardStyles } from '../styles/components/InsightsDashboard.styles';

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
  const { t } = useTranslation();
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
      <View style={insightsDashboardStyles.patternsCard}>
        <View style={[insightsDashboardStyles.patternsAccent, { backgroundColor: 'rgba(135, 186, 163, 0.15)' }]} />
        
        <View style={insightsDashboardStyles.patternsHeader}>
          <View style={insightsDashboardStyles.patternsIcon}>
            <Image 
              source={require('../../assets/images/New Icons/icon-5.png')}
              style={{ width: 60, height: 60 }}
              contentFit="contain"
            />
          </View>
          <View style={insightsDashboardStyles.patternsTitleContainer}>
            <Text style={insightsDashboardStyles.patternsTitle}>{t('insights.vision.title')}</Text>
            <Text style={insightsDashboardStyles.patternsSubtitle}>{t('insights.vision.loading')}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!latestVision) {
    return (
      <View style={insightsDashboardStyles.patternsCard}>
        <View style={[insightsDashboardStyles.patternsAccent, { backgroundColor: 'rgba(135, 186, 163, 0.15)' }]} />
        
        <View style={insightsDashboardStyles.patternsHeader}>
          <View style={insightsDashboardStyles.patternsIcon}>
            <Image 
              source={require('../../assets/images/New Icons/icon-5.png')}
              style={{ width: 60, height: 60 }}
              contentFit="contain"
            />
          </View>
          <View style={insightsDashboardStyles.patternsTitleContainer}>
            <Text style={insightsDashboardStyles.patternsTitle}>{t('insights.vision.title')}</Text>
            <Text style={insightsDashboardStyles.patternsSubtitle}>{t('insights.vision.createInspiring')}</Text>
          </View>
        </View>
        
        <View style={insightsDashboardStyles.patternsContainer}>
          <View style={insightsDashboardStyles.emptyStateContainer}>
            <Text style={insightsDashboardStyles.emptyStateText}>
              {t('insights.vision.emptyState')}
            </Text>
            {onStartExercise && (
              <TouchableOpacity
                onPress={onStartExercise}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#5BA3B8',
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  gap: 8,
                  marginTop: 16,
                }}
                activeOpacity={0.8}
              >
                <Star size={16} color="white" />
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{t('insights.vision.startExercise')}</Text>
                <ArrowRight size={14} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={insightsDashboardStyles.patternsCard}>
      <View style={[insightsDashboardStyles.patternsAccent, { backgroundColor: 'rgba(135, 186, 163, 0.15)' }]} />
      
      <View style={insightsDashboardStyles.patternsHeader}>
        <View style={insightsDashboardStyles.patternsIcon}>
          <Image 
            source={require('../../assets/images/Teal watercolor single element/teal-icon-5.png')}
            style={{ width: 60, height: 60 }}
            contentFit="contain"
          />
        </View>
        <View style={insightsDashboardStyles.patternsTitleContainer}>
          <Text style={insightsDashboardStyles.patternsTitle}>{t('insights.vision.title')}</Text>
          <Text style={insightsDashboardStyles.patternsSubtitle}>{t('insights.vision.inspiringFuture')}</Text>
        </View>
      </View>

      <View style={insightsDashboardStyles.patternsContainer}>
        {/* Vision Description */}
        <View style={styles.visionDescription}>
          <Text style={styles.descriptionText}>
            "{latestVision.fullDescription}"
          </Text>
          <Text style={styles.visionDate}>
            {t('insights.vision.created')} {new Date(latestVision.date).toLocaleDateString()}
          </Text>
        </View>

        {/* Core Qualities */}
        {latestVision.coreQualities.length > 0 && (
          <View style={styles.qualitiesContainer}>
            <Text style={styles.sectionTitle}>{t('insights.vision.coreQualities')}</Text>
            <View style={styles.qualitiesRow}>
              {latestVision.coreQualities.slice(0, 4).map((quality, index) => (
                <View key={index} style={styles.qualityTag}>
                  <Text style={styles.qualityText}>{quality}</Text>
                </View>
              ))}
              {latestVision.coreQualities.length > 4 && (
                <View style={styles.qualityTag}>
                  <Text style={styles.qualityText}>+{latestVision.coreQualities.length - 4} {t('insights.vision.more')}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Life Domains Preview */}
        {Object.keys(latestVision.lifeDomains).length > 0 && (
          <View style={styles.domainsContainer}>
            <Text style={styles.sectionTitle}>{t('insights.vision.lifeAreasExplored')}</Text>
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
                    +{Object.keys(latestVision.lifeDomains).length - 3} {t('insights.vision.more')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() => onReflectPress(latestVision)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#5BA3B8',
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              gap: 8,
            }}
            activeOpacity={0.8}
          >
            <Lightbulb size={16} color="white" />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{t('insights.vision.reflectOnVision')}</Text>
            <ArrowRight size={14} color="white" />
          </TouchableOpacity>

          {visionStats.totalVisions > 1 && onViewAllPress && (
            <TouchableOpacity
              onPress={onViewAllPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                borderColor: '#5BA3B8',
                borderWidth: 1,
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 12,
                gap: 6,
              }}
              activeOpacity={0.8}
            >
              <Eye size={14} color="#5BA3B8" />
              <Text style={{ color: '#5BA3B8', fontSize: 13, fontWeight: '500' }}>
                {t('insights.vision.view')} {visionStats.totalVisions} {visionStats.totalVisions > 1 ? t('insights.vision.visions') : t('insights.vision.vision')}
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
    borderLeftColor: '#87BAA3',
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
    backgroundColor: 'rgba(135, 186, 163, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qualityText: {
    fontSize: 12,
    color: '#87BAA3',
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
    backgroundColor: 'rgba(135, 186, 163, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(135, 186, 163, 0.2)',
  },
  domainText: {
    fontSize: 12,
    color: '#87BAA3',
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