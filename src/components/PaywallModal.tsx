/**
 * Paywall Modal Component
 *
 * Shown when user hits a feature limit (messages, voice, etc.)
 * Minimal modal version of the paywall
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PricingCard } from './paywall/PricingCard';
import { FeatureList } from './paywall/FeatureList';
import { useTranslation } from 'react-i18next';
import { PaywallTrigger } from '../types/subscription';
import { usePostHog } from 'posthog-react-native';
import { StyleSheet } from 'react-native';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  trigger?: PaywallTrigger;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  visible,
  onClose,
  trigger = 'manual',
}) => {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const {
    isLoading: contextLoading,
    currentOffering,
    purchasePackage,
  } = useSubscription();

  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Track paywall view
  useEffect(() => {
    if (visible) {
      posthog?.capture('paywall_viewed', {
        trigger,
        user_tier: 'free',
      });
    }
  }, [visible, trigger, posthog]);

  // Auto-select annual package
  useEffect(() => {
    if (currentOffering && !selectedPackage) {
      const annualPackage = currentOffering.availablePackages.find(pkg =>
        pkg.identifier.toLowerCase().includes('annual')
      );
      if (annualPackage) {
        setSelectedPackage(annualPackage);
      }
    }
  }, [currentOffering, selectedPackage]);

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      setIsPurchasing(true);
      await purchasePackage(selectedPackage);
      onClose(); // Close modal on successful purchase
    } catch (error) {
      console.error('[PaywallModal] Purchase error:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleClose = () => {
    posthog?.capture('paywall_dismissed', {
      action: 'close',
      trigger,
    });
    onClose();
  };

  if (!visible) return null;

  const packages = currentOffering?.availablePackages || [];
  const monthlyPackage = packages.find(pkg =>
    pkg.identifier.toLowerCase().includes('monthly')
  );
  const annualPackage = packages.find(pkg =>
    pkg.identifier.toLowerCase().includes('annual')
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header with close button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('paywall.limit_reached.title')}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#2D2644" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {t('paywall.limit_reached.subtitle')}
          </Text>

          {/* Pricing Cards */}
          {(monthlyPackage || annualPackage) && (
            <View style={styles.pricingSection}>
              <View style={styles.pricingCards}>
                {monthlyPackage && (
                  <PricingCard
                    package={monthlyPackage}
                    isSelected={selectedPackage?.identifier === monthlyPackage.identifier}
                    onPress={() => setSelectedPackage(monthlyPackage)}
                    isLoading={isPurchasing}
                  />
                )}
                {annualPackage && (
                  <PricingCard
                    package={annualPackage}
                    isSelected={selectedPackage?.identifier === annualPackage.identifier}
                    onPress={() => setSelectedPackage(annualPackage)}
                    isBestValue
                    isLoading={isPurchasing}
                  />
                )}
              </View>
            </View>
          )}

          {/* Features */}
          <View style={styles.featuresSection}>
            <FeatureList compact />
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[
              styles.ctaButton,
              (!selectedPackage || isPurchasing) && styles.ctaButtonDisabled,
            ]}
            onPress={handlePurchase}
            disabled={!selectedPackage || isPurchasing}
          >
            {isPurchasing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.ctaButtonText}>
                {t('paywall.limit_reached.cta')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Reset info */}
          <Text style={styles.resetInfo}>
            {t('paywall.limit_reached.reset_info')}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D2644',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B6B8A',
    textAlign: 'center',
    marginBottom: 24,
  },
  pricingSection: {
    marginBottom: 24,
  },
  pricingCards: {
    flexDirection: 'row',
    gap: 12,
  },
  featuresSection: {
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#8B7FD9',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resetInfo: {
    fontSize: 14,
    color: '#9B9BAA',
    textAlign: 'center',
  },
});

export default PaywallModal;
