/**
 * Pricing Card Component
 *
 * Individual pricing card for subscription packages
 * Displays price, period, trial info, and savings
 */

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';
import { pricingCardStyles as styles } from '../../styles/components/PricingCard.styles';
import { useTranslation } from 'react-i18next';
import { PRICING } from '../../config/revenueCat';

interface PricingCardProps {
  package: PurchasesPackage;
  isSelected: boolean;
  onPress: () => void;
  isBestValue?: boolean;
  isLoading?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  package: pkg,
  isSelected,
  onPress,
  isBestValue = false,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  // Determine if monthly or annual
  const isMonthly = pkg.identifier.toLowerCase().includes('monthly');
  const isAnnual = pkg.identifier.toLowerCase().includes('annual');

  // Get pricing info
  const price = pkg.product.priceString;
  const period = isMonthly ? t('paywall.period.month') : t('paywall.period.year');

  // Get plan details from config
  const planConfig = isAnnual ? PRICING.ANNUAL : PRICING.MONTHLY;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        isBestValue && styles.cardBestValue,
        isLoading && styles.cardLoading,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLoading}
    >
      {/* Best Value Badge */}
      {isBestValue && (
        <View style={styles.bestValueBadge}>
          <Text style={styles.bestValueText}>
            {t('paywall.best_value')}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Plan Name */}
        <Text style={styles.planName}>
          {isMonthly ? t('paywall.plan.monthly') : t('paywall.plan.annual')}
        </Text>

        {/* Trial Badge */}
        {planConfig.trialDays > 0 && (
          <View style={styles.trialBadge}>
            <Text style={styles.trialText}>
              {t('paywall.trial_days', { days: planConfig.trialDays })}
            </Text>
          </View>
        )}

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.pricePeriod}>
            {t('paywall.per_period', { period })}
          </Text>

          {/* Savings for Annual */}
          {isAnnual && (
            <>
              <Text style={styles.savingsText}>
                {t('paywall.save_percent', { percent: planConfig.savingsPercent })}
              </Text>
              <Text style={styles.monthlyEquivalent}>
                {t('paywall.monthly_equivalent', { price: `$${planConfig.monthlyEquivalent}` })}
              </Text>
            </>
          )}
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <ActivityIndicator
            size="small"
            color="#8B7FD9"
            style={styles.loadingIndicator}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PricingCard;
