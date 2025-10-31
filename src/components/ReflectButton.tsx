import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { ArrowRight, MessageCircle, Lightbulb, LucideIcon } from 'lucide-react-native';

interface ReflectButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  text?: string;
  variant?: 'primary' | 'values' | 'insights' | 'compact';
  icon?: LucideIcon;
  iconSize?: number;
  disabled?: boolean;
}

export const ReflectButton: React.FC<ReflectButtonProps> = ({
  onPress,
  text = 'Reflect on This',
  variant = 'primary',
  icon,
  iconSize = 16,
  disabled = false,
  style,
  ...props
}) => {
  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'values':
        return {
          container: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: '#5BA3B8',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 16,
          },
          text: {
            color: 'white',
            fontSize: 14,
            fontWeight: '500' as const,
            marginLeft: icon ? 6 : 0,
            marginRight: 4,
          },
          arrowSize: 14,
          iconComponent: icon ? icon : MessageCircle,
        };
      
      case 'insights':
        return {
          container: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: '#059669',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
          },
          text: {
            color: 'white',
            fontSize: 13,
            fontWeight: '500' as const,
            marginRight: 6,
          },
          arrowSize: 12,
          iconComponent: null,
        };
      
      case 'compact':
        return {
          container: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: '#3b82f6',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
          },
          text: {
            color: 'white',
            fontSize: 12,
            fontWeight: '600' as const,
            marginRight: 4,
          },
          arrowSize: 12,
          iconComponent: null,
        };
      
      case 'primary':
      default:
        return {
          container: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: 'rgba(59, 130, 246, 0.9)',
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
          },
          text: {
            color: 'white',
            fontSize: 14,
            fontWeight: '600' as const,
            marginRight: 6,
          },
          arrowSize: 16,
          iconComponent: icon || null,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const IconComponent = variantStyles.iconComponent;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        variantStyles.container,
        disabled && { opacity: 0.6 },
        style,
      ]}
      activeOpacity={0.8}
      disabled={disabled}
      {...props}
    >
      {IconComponent && (
        <IconComponent 
          size={iconSize} 
          color="white" 
          style={{ marginRight: 6 }}
        />
      )}
      <Text style={variantStyles.text}>
        {text}
      </Text>
      <ArrowRight size={variantStyles.arrowSize} color="white" />
    </TouchableOpacity>
  );
};

// For convenience, also export variant-specific components
export const ValuesReflectButton: React.FC<Omit<ReflectButtonProps, 'variant'>> = (props) => (
  <ReflectButton {...props} variant="values" />
);

export const InsightsReflectButton: React.FC<Omit<ReflectButtonProps, 'variant'>> = (props) => (
  <ReflectButton {...props} variant="insights" />
);

export const CompactReflectButton: React.FC<Omit<ReflectButtonProps, 'variant'>> = (props) => (
  <ReflectButton {...props} variant="compact" />
);