/**
 * ResponsiveButton - Cross-platform button with proper touch targets
 */
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { responsivePatterns, platformStyles } from '../utils/crossPlatform';
import { ButtonText } from './ResponsiveText';

interface ResponsiveButtonProps extends TouchableOpacityProps {
  title?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  title,
  size = 'medium',
  variant = 'primary',
  fullWidth = false,
  children,
  leftIcon,
  rightIcon,
  style,
  disabled,
  ...props
}) => {
  // Base button sizing from responsive patterns
  const sizeStyle = responsivePatterns.buttonSize[size];
  
  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: disabled ? '#9ca3af' : '#3b82f6',
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: disabled ? '#f3f4f6' : '#e5e7eb',
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? '#d1d5db' : '#3b82f6',
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };

  // Text color based on variant
  const textColors = {
    primary: disabled ? '#6b7280' : '#ffffff',
    secondary: disabled ? '#9ca3af' : '#374151',
    outline: disabled ? '#9ca3af' : '#3b82f6',
    ghost: disabled ? '#9ca3af' : '#3b82f6',
  };

  const buttonStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: platformStyles.borderRadius,
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : undefined,
    ...sizeStyle,
    ...variantStyles[variant],
    ...platformStyles.shadow,
    ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
  };

  const textStyle = {
    color: textColors[variant],
    textAlign: 'center' as const,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      {leftIcon && (
        <View style={{ marginRight: 8 }}>
          {leftIcon}
        </View>
      )}
      
      {title && (
        <ButtonText style={textStyle}>
          {title}
        </ButtonText>
      )}
      
      {children && (
        <View style={{ color: textColors[variant] }}>
          {children}
        </View>
      )}
      
      {rightIcon && (
        <View style={{ marginLeft: 8 }}>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Specialized button variants
export const PrimaryButton: React.FC<ResponsiveButtonProps> = (props) => {
  return <ResponsiveButton variant="primary" {...props} />;
};

export const SecondaryButton: React.FC<ResponsiveButtonProps> = (props) => {
  return <ResponsiveButton variant="secondary" {...props} />;
};

export const OutlineButton: React.FC<ResponsiveButtonProps> = (props) => {
  return <ResponsiveButton variant="outline" {...props} />;
};

export const GhostButton: React.FC<ResponsiveButtonProps> = (props) => {
  return <ResponsiveButton variant="ghost" {...props} />;
};