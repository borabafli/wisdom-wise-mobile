import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ExerciseLibrary from '../screens/ExerciseLibrary';
import InsightsDashboard from '../screens/InsightsDashboard';
import ProfileScreen from '../screens/ProfileScreen';
import ChatInterface from '../screens/ChatInterface';
import CustomTabBar from './CustomTabBar';

// Import context
import { useApp } from '../contexts';

// Import types
import { RootTabParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const AppContent: React.FC = () => {
  const {
    showChat,
    currentExercise,
    chatWithActionPalette,
    handleStartSession,
    handleNewSession,
    handleBackFromChat,
    handleExerciseClick,
    handleInsightClick,
    handleActionSelect,
  } = useApp();

  // Navigation ref for tab navigation
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
      currentExercise: currentExercise ? currentExercise.name : 'null',
      chatWithActionPalette,
    });
  }, [showChat, currentExercise, chatWithActionPalette]);

  // Use a key to force ChatInterface to remount when starting a new exercise
  const chatKey = `chat-session-${currentExercise ? currentExercise.id : 'default'}`;

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
    <NavigationContainer ref={navigationRef}>
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
  