import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

export type NavigationBarStyle = 'light' | 'dark';

interface NavigationBarConfig {
  backgroundColor: string; // Used for root view background, not nav bar
  style: NavigationBarStyle; // Controls button/icon contrast
}

/**
 * Custom hook to manage navigation bar and status bar styling
 * for edge-to-edge mode - only controls button/icon contrast
 */
export const useNavigationBarStyle = (config: NavigationBarConfig) => {
  useEffect(() => {
    const updateNavigationBar = async () => {
      if (Platform.OS === 'android') {
        try {
          // Set both background color and button style for modern appearance
          const buttonStyle = config.style === 'light' ? 'dark' : 'light';
          await NavigationBar.setBackgroundColorAsync(config.backgroundColor);
          await NavigationBar.setButtonStyleAsync(buttonStyle);
          
          console.log(`Android navigation bar: ${config.backgroundColor} background, ${buttonStyle} buttons`);
        } catch (error) {
          console.log('Navigation bar styling not supported:', error);
        }
      }
    };

    updateNavigationBar();
  }, [config.style, config.backgroundColor]); // Depend on both style and background color

  // Return status bar style for iOS
  const statusBarStyle = config.style === 'light' ? 'dark' : 'light';
  
  return {
    statusBarStyle,
    isLightBackground: config.style === 'light'
  };
};

/**
 * Helper function to determine if a color is light or dark
 * Used to automatically determine the appropriate text/button color
 */
export const getColorBrightness = (hexColor: string): NavigationBarStyle => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness using luminance formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return 'light' for bright colors, 'dark' for dark colors
  return brightness > 128 ? 'light' : 'dark';
};

/**
 * Predefined configurations for common screen backgrounds
 * backgroundColor: Used for root view background (extends under system bars in edge-to-edge)
 * style: Controls navigation/status bar button contrast
 */
export const navigationBarConfigs = {
  default: {
    backgroundColor: '#ebf5f9',
    style: 'light' as NavigationBarStyle
  },
  homeScreen: {
    backgroundColor: '#ebf5f9',
    style: 'light' as NavigationBarStyle
  },
  exerciseLibrary: {
    backgroundColor: '#ebf5f9',
    style: 'light' as NavigationBarStyle
  },
  insightsDashboard: {
    backgroundColor: '#ebf5f9',
    style: 'light' as NavigationBarStyle
  },
  profileScreen: {
    backgroundColor: '#ebf5f9',
    style: 'light' as NavigationBarStyle
  },
  chatInterface: {
    backgroundColor: '#ebf5f9',
    style: 'light' as NavigationBarStyle
  }
};