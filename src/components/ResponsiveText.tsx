/**
 * ResponsiveText - Cross-platform text component with proper typography
 */
import React from 'react';
import { Text, TextProps } from 'react-native';
import { typography } from '../styles/tokens/typography';
import { typographyHelpers } from '../utils/crossPlatform';

interface ResponsiveTextProps extends TextProps {
  variant?: keyof typeof typography.textStyles;
  fontFamily?: string;
  responsive?: boolean;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  variant = 'body',
  fontFamily,
  responsive = true,
  style,
  children,
  ...props
}) => {
  // Get base style from design tokens
  const baseStyle = typography.textStyles[variant] || typography.textStyles.body;
  
  // Apply responsive scaling if enabled
  const responsiveStyle = responsive 
    ? typographyHelpers.applyTextStyle(baseStyle)
    : baseStyle;

  // Override font family if provided
  const finalFontFamily = fontFamily 
    ? typographyHelpers.getFontFamily(fontFamily)
    : typographyHelpers.getFontFamily(responsiveStyle.fontFamily);

  const textStyle = {
    ...responsiveStyle,
    fontFamily: finalFontFamily,
    ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
  };

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

// Specialized text components for common use cases
export const Heading: React.FC<ResponsiveTextProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }> = ({
  level = 1,
  ...props
}) => {
  const variantMap = {
    1: 'h1',
    2: 'h2', 
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  } as const;

  return <ResponsiveText variant={variantMap[level]} {...props} />;
};

export const BodyText: React.FC<ResponsiveTextProps & { size?: 'small' | 'default' | 'large' }> = ({
  size = 'default',
  ...props
}) => {
  const variantMap = {
    small: 'bodySmall',
    default: 'body',
    large: 'bodyLarge',
  } as const;

  return <ResponsiveText variant={variantMap[size]} {...props} />;
};

export const ChatText: React.FC<ResponsiveTextProps> = (props) => {
  return <ResponsiveText variant="chatMessage" fontFamily="Ubuntu-Regular" {...props} />;
};

export const ButtonText: React.FC<ResponsiveTextProps> = (props) => {
  return <ResponsiveText variant="button" {...props} />;
};

export const Caption: React.FC<ResponsiveTextProps> = (props) => {
  return <ResponsiveText variant="caption" {...props} />;
};

export const Label: React.FC<ResponsiveTextProps> = (props) => {
  return <ResponsiveText variant="label" {...props} />;
};