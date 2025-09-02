import React from 'react';
import { View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: any;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

/**
 * Cross-platform SafeAreaView wrapper that handles web compatibility issues.
 * Uses SafeAreaView on mobile platforms and regular View on web.
 */
export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ 
  children, 
  style, 
  edges 
}) => {
  if (Platform.OS === 'web') {
    // On web, use regular View to avoid SafeAreaView compatibility issues
    return <View style={style}>{children}</View>;
  }
  
  // On mobile platforms, use SafeAreaView for proper safe area handling
  return (
    <SafeAreaView style={style} edges={edges}>
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;