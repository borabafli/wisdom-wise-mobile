import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { NavigationContainer, useNavigationContainerRef, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import { View, Platform, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


// Import screens
import HomeScreen from '../screens/HomeScreen';
import ExerciseLibrary from '../screens/ExerciseLibrary';
import JournalScreen from '../screens/JournalScreen';
import GuidedJournalScreen from '../screens/GuidedJournalScreen';
import InsightsDashboard from '../screens/InsightsDashboard';
import ProfileScreen from '../screens/ProfileScreen';
import ChatInterface from '../screens/ChatInterface';
import BreathingScreen from '../screens/BreathingScreen';
import TherapyGoalsScreen from '../screens/TherapyGoalsScreen';
import KeyboardTest from '../screens/KeyboardTest'; // TEMPORARY: For keyboard testing
import CustomTabBar from './CustomTabBar';

// Import navigators
import { AuthNavigator } from '../navigation/AuthNavigator';
import { JournalNavigator } from '../navigation/JournalNavigator';
import { OnboardingNavigator } from '../navigation/OnboardingNavigator';

// Import services
import { OnboardingService } from '../services/onboardingService';
import { notificationService } from '../services/notificationService';

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
    background: '#e9eff1', // Match homescreen background
    card: colors.white, // Pure white tab bar
    text: colors.text.primary, // Primary text color
    primary: '#3BB4F5', // Light sky blue accent - matches turtle theme
    border: colors.gray[200], // Visible subtle border
    notification: '#3BB4F5', // Sky blue for notifications
  },
};

// Create context for onboarding control
interface OnboardingContextType {
  restartOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboardingControl = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingControl must be used within AppContent');
  }
  return context;
};

export const AppContent: React.FC = () => {

  const insets = useSafeAreaInsets();

  const { isAuthenticated, isLoading } = useAuth();
  
  // Onboarding state management
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  const {
    showChat,
    showBreathing,
    showTherapyGoals,
    currentExercise,
    breathingExercise,
    chatWithActionPalette,
    initialChatMessage,
    handleStartSession,
    handleNewSession,
    handleStartChatWithContext,
    handleBackFromChat,
    handleBackFromBreathing,
    handleTherapyGoalsClick,
    handleBackFromTherapyGoals,
    handleExerciseClick,
    handleInsightClick,
    handleActionSelect,
  } = useApp();

  // Navigation ref for tab navigation - must be called before any conditional returns
  const navigationRef = useNavigationContainerRef();

  // Check onboarding status on app load
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const completed = await OnboardingService.hasCompletedOnboarding();
        setIsOnboardingComplete(completed);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingComplete(false); // Default to showing onboarding on error
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Handle notification taps
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const actionType = response.notification.request.content.data?.actionType;
      const chatContext = response.notification.request.content.data?.chatContext;

      console.log('Notification tapped - actionType:', actionType, 'chatContext:', chatContext);

      if (!actionType) return;

      switch (actionType) {
        case 'chat':
          // Open chat with context
          if (chatContext && typeof chatContext === 'string') {
            handleStartChatWithContext(chatContext);
          } else {
            handleNewSession();
          }
          break;

        case 'breathing':
          // Open breathing screen
          handleActionSelect('breathing');
          break;

        case 'journal':
          // Navigate to journal tab
          if (navigationRef.isReady()) {
            navigationRef.navigate('Journal');
          }
          break;

        case 'insights':
          // Navigate to insights tab
          if (navigationRef.isReady()) {
            navigationRef.navigate('Insights');
          }
          break;

        default:
          console.warn('Unknown notification action type:', actionType);
      }
    });

    return () => subscription.remove();
  }, [handleStartChatWithContext, handleNewSession, handleActionSelect, navigationRef]);

  // Track user activity for notifications
  useEffect(() => {
    const updateActivity = async () => {
      try {
        await notificationService.updateUserContext({
          lastActiveTimestamp: Date.now(),
        });
      } catch (error) {
        console.error('Error updating user activity:', error);
      }
    };

    updateActivity();
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = useCallback(() => {
    setIsOnboardingComplete(true);
  }, []);

  // Handle onboarding restart
  const restartOnboarding = useCallback(async () => {
    await OnboardingService.resetOnboarding();
    setIsOnboardingComplete(false);
  }, []);

  // Memoize context value
  const onboardingContextValue = useMemo(() => ({
    restartOnboarding
  }), [restartOnboarding]);

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
      showTherapyGoals,
      currentExercise: currentExercise ? currentExercise.name : 'null',
      chatWithActionPalette,
    });
  }, [showChat, showBreathing, showTherapyGoals, currentExercise, chatWithActionPalette]);

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // If any overlay screens are showing, handle back navigation
      if (showChat) {
        handleBackFromChat();
        return true; // Prevent default behavior
      }
      if (showBreathing) {
        handleBackFromBreathing();
        return true;
      }
      if (showTherapyGoals) {
        handleBackFromTherapyGoals();
        return true;
      }

      // Let React Navigation handle back for nested navigators (Journal, Auth, Onboarding)
      // Return false to allow default behavior
      return false;
    });

    return () => backHandler.remove();
  }, [showChat, showBreathing, showTherapyGoals, handleBackFromChat, handleBackFromBreathing, handleBackFromTherapyGoals]);

  // Use a key to force ChatInterface to remount when starting a new exercise
  const chatKey = `chat-session-${currentExercise ? currentExercise.id : 'default'}`;

  // Show loading screen while checking auth or onboarding status
  if (isLoading || isCheckingOnboarding) {
    return (
      <View className="flex-1 bg-blue-50 justify-center items-center">
        {/* Add loading indicator if needed */}
      </View>
    );
  }

  // Show onboarding if not completed (this should come first!)
  if (!isOnboardingComplete) {
    return <OnboardingNavigator onComplete={handleOnboardingComplete} />;
  }

  // Show auth screen if not authenticated (only after onboarding is complete)
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (showBreathing) {
    return (
      <>
        <StatusBar style="dark" backgroundColor="#e9eff1" />
        <BreathingScreen onBack={handleBackFromBreathing} exercise={breathingExercise} />
      </>
    );
  }

  if (showTherapyGoals) {
    return (
      <>
        <StatusBar style="dark" backgroundColor="#e9eff1" />
        <TherapyGoalsScreen
          onBack={handleBackFromTherapyGoals}
          onNavigateToExercises={handleNavigateToExercises}
          onStartGoalSetting={() => {
            // TODO: Add goal setting navigation when that feature is implemented
            console.log('Goal setting requested');
          }}
        />
      </>
    );
  }

  if (showChat) {
    return (
      <>
        <StatusBar style="dark" backgroundColor="#e9eff1" />
        <ChatInterface
          key={chatKey}
          onBack={handleBackFromChat}
          currentExercise={currentExercise}
          startWithActionPalette={chatWithActionPalette}
          initialMessage={initialChatMessage}
          onActionSelect={handleActionSelect}
          onExerciseClick={handleExerciseClick}
        />
      </>
    );
  }

  return (
    <OnboardingContext.Provider value={onboardingContextValue}>
      <NavigationContainer ref={navigationRef} theme={customTheme}>
          <StatusBar style="dark" backgroundColor="#e9eff1" />
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
          {(props) => (
            <HomeScreen
              {...props}
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
        <Tab.Screen name="Journal" component={JournalNavigator} />
        <Tab.Screen name="Insights">
          {() => <InsightsDashboard onInsightClick={handleInsightClick} onTherapyGoalsClick={handleTherapyGoalsClick} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen
          name="KeyboardTest"
          component={KeyboardTest}
          options={{
            title: '🧪 Test',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </OnboardingContext.Provider>
  );
};
  