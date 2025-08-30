import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
  const [navigationRef, setNavigationRef] = React.useState<any>(null);

  const handleNavigateToExercises = React.useCallback(() => {
    if (navigationRef) {
      navigationRef.navigate('Exercises');
    }
  }, [navigationRef]);

  const handleNavigateToInsights = React.useCallback(() => {
    if (navigationRef) {
      navigationRef.navigate('Insights');
    }
  }, [navigationRef]);

  if (showChat) {
    return (
      <>
        <StatusBar style="dark" backgroundColor="#f0f9ff" />
        <ChatInterface 
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
    <NavigationContainer ref={setNavigationRef}>
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