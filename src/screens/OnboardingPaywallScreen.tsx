/**
 * Onboarding Paywall Screen
 *
 * Main paywall screen shown after signup
 * Minimal & calm design with 3-day free trial offer
 * Users can select monthly or annual plan, or continue with free
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { PurchasesPackage } from 'react-native-purchases';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PricingCard } from '../components/paywall/PricingCard';
import { FeatureList } from '../components/paywall/FeatureList';
import { onboardingPaywallStyles as styles } from '../styles/components/OnboardingPaywallScreen.styles';
import { useTranslation } from 'react-i18next';
import { usePostHog } from 'posthog-react-native';

interface OnboardingPaywallScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingPaywallScreen: React.FC<OnboardingPaywallScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();
  const {
    isLoading: contextLoading,
    currentOffering,
    purchasePackage,
    restorePurchases,
  } = useSubscription();

  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Track paywall view
  useEffect(() => {
    posthog?.capture('paywall_viewed', {
      trigger: 'onboarding',
      user_tier: 'free',
    });
  }, [posthog]);

  // Auto-select annual package (best value)
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
    if (!selectedPackage) {
      return;
    }

    try {
      setIsPurchasing(true);

      await purchasePackage(selectedPackage);

      // On success, complete onboarding
      onComplete();
    } catch (error) {
      console.error('[OnboardingPaywall] Purchase error:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleSkip = () => {
    posthog?.capture('paywall_dismissed', {
      action: 'close_button',
      trigger: 'onboarding',
    });
    onSkip();
  };

  const handleRestore = async () => {
    try {
      setIsPurchasing(true);
      posthog?.capture('paywall_restore_attempted', {
        trigger: 'onboarding',
      });

      // Call the actual restore purchases function from SubscriptionContext
      await restorePurchases();

      // If restore was successful and user now has premium, complete onboarding
      // Note: The restorePurchases function handles showing success/error alerts

    } catch (error) {
      console.error('[OnboardingPaywall] Restore error:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  // Loading state - only show loading spinner while RevenueCat is initializing
  // After initialization, show UI even if products aren't loaded (for testing/preview)
  if (contextLoading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5BA3B8" />
              <Text style={styles.loadingText}>
                {t('paywall.loading')}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Get packages from offering (may be empty if products aren't configured yet)
  const packages = currentOffering?.availablePackages || [];
  const monthlyPackage = packages.find(pkg =>
    pkg.identifier.toLowerCase().includes('monthly')
  );
  const annualPackage = packages.find(pkg =>
    pkg.identifier.toLowerCase().includes('annual')
  );

  // Track if we have products loaded
  const hasProducts = packages.length > 0;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Close Button - Top Right with proper safe area */}
        <TouchableOpacity
          style={[
            styles.closeButton,
            {
              top: Math.max(insets.top + 8, 24), // Ensure it's below status bar/notch with minimum 24px
              right: 16,
            }
          ]}
          onPress={handleSkip}
          disabled={isPurchasing}
          activeOpacity={0.6}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch area
        >
          <X size={24} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Math.max(insets.top + 56, 72) }, // Add top padding for close button
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            {/* Illustration - Turtle mascot Anu */}
            <View style={styles.illustrationContainer}>
              {/* TODO: Replace with actual turtle illustration */}
              <Text style={{ fontSize: 64 }}>🐢</Text>
            </View>

            <Text style={styles.title}>
              {t('paywall.title')}
            </Text>
            <Text style={styles.subtitle}>
              {t('paywall.subtitle')}
            </Text>
          </View>

          {/* Pricing Cards */}
          <View style={styles.pricingSection}>
            {!hasProducts ? (
              // Show message when products aren't loaded (development/testing)
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#6B6B8A', textAlign: 'center', marginBottom: 12 }}>
                  💡 Products not configured yet
                </Text>
                <Text style={{ fontSize: 14, color: '#9B9BAA', textAlign: 'center' }}>
                  Configure products in App Store Connect and RevenueCat, then add StoreKit configuration to Xcode.
                </Text>
              </View>
            ) : (
              <View style={styles.pricingCards}>
                {/* Monthly Card */}
                {monthlyPackage && (
                  <PricingCard
                    package={monthlyPackage}
                    isSelected={selectedPackage?.identifier === monthlyPackage.identifier}
                    onPress={() => setSelectedPackage(monthlyPackage)}
                    isLoading={isPurchasing}
                  />
                )}

                {/* Annual Card (Best Value) */}
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
            )}
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>
              {t('paywall.features_title')}
            </Text>
            <FeatureList />
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            {/* Primary CTA - Start Trial (disabled if no products) */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!selectedPackage || isPurchasing || !hasProducts) && styles.primaryButtonDisabled,
              ]}
              onPress={handlePurchase}
              disabled={!selectedPackage || isPurchasing || !hasProducts}
              activeOpacity={0.8}
            >
              {isPurchasing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {hasProducts ? t('paywall.cta_primary') : 'Products Not Available'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Restore Purchases Link - Required by Apple */}
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={isPurchasing}
              activeOpacity={0.6}
            >
              <Text style={styles.restoreButtonText}>
                {t('paywall.subscription_management.restore')}
              </Text>
            </TouchableOpacity>

            {/* Legal Text */}
            <Text style={styles.legalText}>
              {t('paywall.legal')}
            </Text>
          </View>
        </ScrollView>

        {/* Loading Overlay */}
        {isPurchasing && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5BA3B8" />
              <Text style={styles.loadingText}>
                {t('paywall.processing')}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default OnboardingPaywallScreen;
