/**
 * Premium Limit Modal Component
 *
 * Shown when premium users hit their weekly message limit (2000/week)
 * Shows a friendly message explaining the abuse prevention limit
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { CheckCircle2, Calendar } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

interface PremiumLimitModalProps {
  visible: boolean;
  onClose: () => void;
  resetDate?: Date;
  weeklyUsed?: number;
  weeklyLimit?: number;
}

export const PremiumLimitModal: React.FC<PremiumLimitModalProps> = ({
  visible,
  onClose,
  resetDate,
  weeklyUsed = 2000,
  weeklyLimit = 2000,
}) => {
  const { t } = useTranslation();

  const formatResetDate = (date?: Date) => {
    if (!date) return t('premium_limit.default_reset');

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Premium Badge */}
              <LinearGradient
                colors={['#8B7FD9', '#6B5FB8']}
                style={styles.premiumBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <CheckCircle2 size={32} color="#FFFFFF" />
              </LinearGradient>

              {/* Title */}
              <Text style={styles.title}>
                {t('premium_limit.title')}
              </Text>

              {/* Subtitle */}
              <Text style={styles.subtitle}>
                {t('premium_limit.subtitle')}
              </Text>

              {/* Usage Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{weeklyUsed.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>{t('premium_limit.messages_used')}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{weeklyLimit.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>{t('premium_limit.weekly_limit')}</Text>
                </View>
              </View>

              {/* Explanation */}
              <View style={styles.explanationBox}>
                <Text style={styles.explanationText}>
                  {t('premium_limit.explanation')}
                </Text>
              </View>

              {/* Reset Information */}
              <View style={styles.resetBox}>
                <Calendar size={20} color="#8B7FD9" />
                <Text style={styles.resetText}>
                  {t('premium_limit.resets_on', { date: formatResetDate(resetDate) })}
                </Text>
              </View>

              {/* Benefits Reminder */}
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>
                  {t('premium_limit.benefits_title')}
                </Text>
                <View style={styles.benefitsList}>
                  <BenefitItem text={t('premium_limit.benefit_exercises')} />
                  <BenefitItem text={t('premium_limit.benefit_voice')} />
                  <BenefitItem text={t('premium_limit.benefit_insights')} />
                  <BenefitItem text={t('premium_limit.benefit_history')} />
                </View>
              </View>

              {/* CTA Button */}
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.ctaButtonText}>
                  {t('premium_limit.cta')}
                </Text>
              </TouchableOpacity>

              {/* Support Link */}
              <Text style={styles.supportText}>
                {t('premium_limit.support_text')}
              </Text>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.benefitItem}>
    <CheckCircle2 size={16} color="#8B7FD9" style={styles.benefitIcon} />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  premiumBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D2644',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B6B8A',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F5FF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0D9F5',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B7FD9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B6B8A',
    textAlign: 'center',
  },
  explanationBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  explanationText: {
    fontSize: 14,
    color: '#6B6B8A',
    lineHeight: 21,
  },
  resetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F5FF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  resetText: {
    fontSize: 15,
    color: '#2D2644',
    fontWeight: '600',
    flex: 1,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2644',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitIcon: {
    flexShrink: 0,
  },
  benefitText: {
    fontSize: 14,
    color: '#6B6B8A',
    flex: 1,
  },
  ctaButton: {
    backgroundColor: '#8B7FD9',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  supportText: {
    fontSize: 13,
    color: '#9B9BAA',
    textAlign: 'center',
  },
});

export default PremiumLimitModal;
