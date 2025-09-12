import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Star, Lightbulb, ArrowRight, Calendar, Heart } from 'lucide-react-native';
import { visionInsightsService, VisionInsight } from '../services/visionInsightsService';
import { ValuesReflectButton } from './ReflectButton';

const { width, height } = Dimensions.get('window');

interface VisionDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onReflectPress?: (visionInsight: VisionInsight) => void;
}

export const VisionDetailsModal: React.FC<VisionDetailsModalProps> = ({
  visible,
  onClose,
  onReflectPress
}) => {
  const [visions, setVisions] = useState<VisionInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedVision, setExpandedVision] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadVisions();
    }
  }, [visible]);

  const loadVisions = async () => {
    try {
      setIsLoading(true);
      const allVisions = await visionInsightsService.getVisionInsights();
      setVisions(allVisions);
    } catch (error) {
      console.error('Error loading visions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisionExpansion = (visionId: string) => {
    setExpandedVision(prev => prev === visionId ? null : visionId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderVisionCard = (vision: VisionInsight) => {
    const isExpanded = expandedVision === vision.id;
    const domains = Object.entries(vision.lifeDomains);

    return (
      <View key={vision.id} style={styles.visionCard}>
        <TouchableOpacity
          onPress={() => toggleVisionExpansion(vision.id)}
          style={styles.visionHeader}
          activeOpacity={0.8}
        >
          <View style={styles.visionHeaderLeft}>
            <LinearGradient
              colors={['#E0F2FE', '#7DD3FC']}
              style={styles.visionIcon}
            >
              <Star size={20} color="#0369A1" />
            </LinearGradient>
            <View style={styles.visionHeaderText}>
              <Text style={styles.visionDate}>
                {formatDate(vision.date)}
              </Text>
              <Text style={styles.visionPreview} numberOfLines={2}>
                {vision.fullDescription}
              </Text>
            </View>
          </View>
          <ArrowRight 
            size={18} 
            color="#64748b" 
            style={isExpanded ? { transform: [{ rotate: '90deg' }] } : {}}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.visionContent}>
            {/* Full Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Your Vision</Text>
              <Text style={styles.descriptionText}>
                "{vision.fullDescription}"
              </Text>
            </View>

            {/* Core Qualities */}
            {vision.coreQualities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Core Qualities</Text>
                <View style={styles.tagsContainer}>
                  {vision.coreQualities.map((quality, index) => (
                    <View key={index} style={styles.qualityTag}>
                      <Text style={styles.qualityText}>{quality}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Life Domains */}
            {domains.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Life Areas</Text>
                {domains.map(([domain, description]) => (
                  <View key={domain} style={styles.domainItem}>
                    <Text style={styles.domainTitle}>
                      {domain.charAt(0).toUpperCase() + domain.slice(1)}
                    </Text>
                    <Text style={styles.domainDescription}>{description}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Guiding Sentences */}
            {vision.guidingSentences.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Guiding Words</Text>
                {vision.guidingSentences.map((sentence, index) => (
                  <View key={index} style={styles.guidingSentence}>
                    <Text style={styles.guidingText}>"{sentence}"</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Practical Takeaways */}
            {vision.practicalTakeaways.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Practical Steps</Text>
                {vision.practicalTakeaways.map((takeaway, index) => (
                  <View key={index} style={styles.takeawayItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.takeawayText}>{takeaway}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Emotional Connection */}
            {vision.emotionalConnection && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>How It Feels</Text>
                <Text style={styles.emotionalText}>
                  {vision.emotionalConnection}
                </Text>
              </View>
            )}

            {/* Wisdom Exchange */}
            {vision.wisdomExchange && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Wisdom from Your Future Self</Text>
                <Text style={styles.wisdomText}>
                  "{vision.wisdomExchange}"
                </Text>
              </View>
            )}

            {/* Reflect Button */}
            {onReflectPress && (
              <ValuesReflectButton
                onPress={() => {
                  onClose();
                  onReflectPress(vision);
                }}
                text="Reflect on This Vision"
              />
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={['#E0F2FE', '#7DD3FC']}
              style={styles.headerIcon}
            >
              <Star size={24} color="#0369A1" />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>Vision of Myself</Text>
              <Text style={styles.headerSubtitle}>
                {visions.length} vision{visions.length !== 1 ? 's' : ''} created
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading your visions...</Text>
            </View>
          ) : visions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Star size={64} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Visions Yet</Text>
              <Text style={styles.emptyText}>
                Complete a "Vision of the Future" exercise to see your inspiring visions here.
              </Text>
            </View>
          ) : (
            <View style={styles.visionsContainer}>
              {visions.map(renderVisionCard)}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center' as const,
    lineHeight: 24,
  },
  visionsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  visionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden' as const,
  },
  visionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 16,
  },
  visionHeaderLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
    marginRight: 12,
  },
  visionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  visionHeaderText: {
    flex: 1,
  },
  visionDate: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  visionPreview: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  visionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  descriptionSection: {
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0EA5E9',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1e293b',
    fontStyle: 'italic' as const,
  },
  section: {
    marginBottom: 16,
  },
  tagsContainer: {
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
  domainItem: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  domainTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#0369a1',
    marginBottom: 4,
  },
  domainDescription: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  guidingSentence: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  guidingText: {
    fontSize: 14,
    color: '#92400e',
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
  },
  takeawayItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#0EA5E9',
    fontWeight: 'bold' as const,
    marginRight: 8,
    marginTop: 2,
  },
  takeawayText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
    flex: 1,
  },
  emotionalText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
    fontStyle: 'italic' as const,
  },
  wisdomText: {
    fontSize: 15,
    color: '#059669',
    lineHeight: 22,
    fontStyle: 'italic' as const,
    fontWeight: '500' as const,
  },
  reflectButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#0EA5E9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
  reflectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600' as const,
  },
};