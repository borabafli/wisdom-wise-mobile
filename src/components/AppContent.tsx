import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { NavigationContainer, useNavigationContainerRef, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


// Import screens
import HomeScreen from '../screens/HomeScreen';
import ExerciseLibrary from '../screens/ExerciseLibrary';
import InsightsDashboard from '../screens/InsightsDashboard';
import ProfileScreen from '../screens/ProfileScreen';
import ChatInterface from '../screens/ChatInterface';
import BreathingScreen from '../screens/BreathingScreen';
import CustomTabBar from './CustomTabBar';

// Import auth navigator
import { AuthNavigator } from '../navigation/AuthNavigator';

// Import contexts
import { useApp } from '../contexts';
import { useAuth } from '../contexts';

// Import types
import { RootTabParamList } from '../types';
import { colors } from '../styles/tokens';

const Tab = createBottomTabNavigator<RootTabParamList>();

// Custom navigation theme matching app colors
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F9FBFD', // Therapeutic soft blue-tint background
    card: colors.white, // Pure white tab bar
    text: colors.text.primary, // Primary text color
    primary: '#3BB4F5', // Light sky blue accent - matches turtle theme
    border: colors.gray[200], // Visible subtle border
    notification: '#3BB4F5', // Sky blue for notifications
  },
};

export const AppContent: React.FC = () => {

  const insets = useSafeAreaInsets();

  const { isAuthenticated, isLoading } = useAuth();

  const {
    showChat,
    showBreathing,
    currentExercise,
    chatWithActionPalette,
    handleStartSession,
    handleNewSession,
    handleBackFromChat,
    handleBackFromBreathing,
    handleExerciseClick,
    handleInsightClick,
    handleActionSelect,
  } = useApp();

  // Navigation ref for tab navigation - must be called before any conditional returns
  const navigationRef = useNavigationContainerRef();

  const handleNavigateToExercises = useCallback(() => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('Exercises');
    }
  }, [navigationRef]);

  const handleNavigateToInsights = useCallback(() => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('Insights');
    }
  }, [navigationRef]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('AppContent re-rendered. State:', {
      showChat,
      showBreathing,
      currentExercise: currentExercise ? currentExercise.name : 'null',
      chatWithActionPalette,
    });
  }, [showChat, showBreathing, currentExercise, chatWithActionPalette]);

  // Use a key to force ChatInterface to remount when starting a new exercise
  const chatKey = `chat-session-${currentExercise ? currentExercise.id : 'default'}`;

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 bg-blue-50 justify-center items-center">
        {/* Add loading indicator if needed */}
      </View>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (showBreathing) {
    return (
      <>
        <StatusBar style="dark" backgroundColor="#f0f9ff" />
        <BreathingScreen onBack={handleBackFromBreathing} />
      </>
    );
  }

  if (showChat) {
    return (
      <>
        <StatusBar style="dark" backgroundColor="#f0f9ff" />
        <ChatInterface 
          key={chatKey}
          onBack={handleBackFromChat}
          currentExercise={currentExercise}
          startWithActionPalette={chatWithActionPalette}
          onActionSelect={handleActionSelect}
          onExerciseClick={handleExerciseClick}
        />
      </>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} theme={customTheme}>
        <StatusBar style="dark" backgroundColor="#f0f9ff" />
        <Tab.Navigator
        tabBar={(props: any) => (
          <CustomTabBar 
            {...props} 
            onNewSession={handleNewSession}
            onActionSelect={handleActionSelect}
          />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home">
          {() => (
            <HomeScreen
              onStartSession={handleStartSession}
              onExerciseClick={handleExerciseClick}
              onInsightClick={handleInsightClick}
              onNavigateToExercises={handleNavigateToExercises}
              onNavigateToInsights={handleNavigateToInsights}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Exercises">
          {() => <ExerciseLibrary onExerciseClick={handleExerciseClick} />}
        </Tab.Screen>
        <Tab.Screen name="Insights">
          {() => <InsightsDashboard onInsightClick={handleInsightClick} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
  