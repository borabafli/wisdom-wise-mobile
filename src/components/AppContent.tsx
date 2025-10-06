import React, { createContext, useContext, ReactNode, useState, useEffect, useLayoutEffect, useCallback, useMemo, useRef } from 'react';
import { NavigationContainer, useNavigationContainerRef, DefaultTheme, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import { View, Platform, BackHandler, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';


// Import screens
import HomeScreen from '../screens/HomeScreen';
import ExerciseLibrary from '../screens/ExerciseLibrary';
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
import { TabTransitionProvider, TabSlideView, TabDirection } from '../navigation/tabTransitions';
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

const TAB_ROUTE_ORDER: Array<keyof RootTabParamList> = ['Home', 'Exercises', 'Journal', 'Insights', 'Profile'];

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

  // Simple scale + fade animation values
  const chatScale = useRef(new Animated.Value(1)).current;
  const chatOpacity = useRef(new Animated.Value(1)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Track when chat is visible (including during animations)
  const [isChatVisible, setIsChatVisible] = useState(false);

  const {
    showChat,
    showBreathing,
    showTherapyGoals,
    currentExercise,
    breathingExercise,
    chatWithActionPalette,
    initialChatMessage,
    buttonPosition,
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

  const currentTabIndexRef = useRef<number>(0);
  const [tabDirection, setTabDirection] = useState<TabDirection>(1);

  const setDirectionForTab = useCallback(
    (tabName: keyof RootTabParamList) => {
      const nextIndex = TAB_ROUTE_ORDER.indexOf(tabName);
      if (nextIndex === -1) {
        return;
      }

      const currentIndex = currentTabIndexRef.current;
      if (nextIndex === currentIndex) {
        return;
      }

      setTabDirection(nextIndex > currentIndex ? 1 : -1);
      currentTabIndexRef.current = nextIndex;
    },
    []
  );

  const handleTabIndexChange = useCallback(
    (nextIndex: number) => {
      const nextRoute = TAB_ROUTE_ORDER[nextIndex];
      if (nextRoute) {
        setDirectionForTab(nextRoute);
      }
    },
    [setDirectionForTab]
  );

  const navigateToTab = useCallback(
    (tabName: keyof RootTabParamList) => {
      if (!navigationRef.isReady()) {
        return;
      }

      setDirectionForTab(tabName);
      navigationRef.navigate(tabName);
    },
    [navigationRef, setDirectionForTab]
  );

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
          navigateToTab('Journal');
          break;

        case 'insights':
          // Navigate to insights tab
          navigateToTab('Insights');
          break;

        default:
          console.warn('Unknown notification action type:', actionType);
      }
    });

    return () => subscription.remove();
  }, [handleStartChatWithContext, handleNewSession, handleActionSelect, navigateToTab]);

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
    navigateToTab('Exercises');
  }, [navigateToTab]);

  const handleNavigateToInsights = useCallback(() => {
    navigateToTab('Insights');
  }, [navigateToTab]);

  // Simple scale + fade animation when chat opens/closes
  useEffect(() => {
    if (showChat && !isChatVisible) {
      // Show the modal first
      setIsChatVisible(true);

      // Reset to very small scale for extreme dramatic effect
      chatScale.setValue(0.5);
      chatOpacity.setValue(0);
      backdropOpacity.setValue(0);

      // Animate in with bouncy spring
      Animated.parallel([
        Animated.spring(chatScale, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(chatOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.6,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!showChat && isChatVisible) {
      // Animate out with spring for smooth minimize effect
      Animated.parallel([
        Animated.spring(chatScale, {
          toValue: 0.3, // Scale down even smaller for dramatic minimize effect
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(chatOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hide the modal after animation completes
        setIsChatVisible(false);
      });
    }
  }, [showChat, isChatVisible]);

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

  return (
    <OnboardingContext.Provider value={onboardingContextValue}>
      <NavigationContainer ref={navigationRef} theme={customTheme}>
        <TabTransitionProvider direction={tabDirection}>
          <StatusBar style="dark" backgroundColor="#e9eff1" />
          <Tab.Navigator
            tabBar={(props: any) => (
              <CustomTabBar
                {...props}
                onNewSession={handleNewSession}
                onActionSelect={handleActionSelect}
                onTabChange={handleTabIndexChange}
              />
            )}
            screenOptions={{
              headerShown: false,
              unmountOnBlur: false, // Keep all tabs mounted
            }}
          >
            <Tab.Screen name="Home">
              {(props) => (
                <TabSlideView>
                  <HomeScreen
                    {...props}
                    onStartSession={handleStartSession}
                    onExerciseClick={handleExerciseClick}
                    onInsightClick={handleInsightClick}
                    onNavigateToExercises={handleNavigateToExercises}
                    onNavigateToInsights={handleNavigateToInsights}
                  />
                </TabSlideView>
              )}
            </Tab.Screen>
            <Tab.Screen name="Exercises">
              {(props) => (
                <TabSlideView>
                  <ExerciseLibrary
                    {...props}
                    onExerciseClick={handleExerciseClick}
                  />
                </TabSlideView>
              )}
            </Tab.Screen>
            <Tab.Screen
              name="Journal"
              options={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? 'JournalHome';
                return {
                  tabBarStyle: routeName === 'GuidedJournal' ? { display: 'none' } : undefined,
                };
              }}
            >
              {() => (
                <TabSlideView>
                  <JournalNavigator />
                </TabSlideView>
              )}
            </Tab.Screen>
            <Tab.Screen name="Insights">
              {(props) => (
                <TabSlideView>
                  <InsightsDashboard
                    {...props}
                    onInsightClick={handleInsightClick}
                    onTherapyGoalsClick={handleTherapyGoalsClick}
                    onExerciseClick={handleExerciseClick}
                  />
                </TabSlideView>
              )}
            </Tab.Screen>
            <Tab.Screen name="Profile">
              {(props) => (
                <TabSlideView>
                  <ProfileScreen {...props} />
                </TabSlideView>
              )}
            </Tab.Screen>
            <Tab.Screen
              name="KeyboardTest"
              component={KeyboardTest}
              options={{
                title: '?? Test',
                unmountOnBlur: true, // This one can be unmounted
              }}
            />
          </Tab.Navigator>
        </TabTransitionProvider>
      </NavigationContainer>

      {/* Chat overlay with simple scale + fade animation */}
      {isChatVisible && (
        <>
          {/* Backdrop with blur */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: backdropOpacity,
              zIndex: 1000,
            }}
          >
            <BlurView intensity={20} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
          </Animated.View>

          {/* Animated chat container */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1001,
              elevation: 1001,
              opacity: chatOpacity,
              transform: [{ scale: chatScale }],
            }}
          >
            <ChatInterface
              key={chatKey}
              onBack={handleBackFromChat}
              currentExercise={currentExercise}
              startWithActionPalette={chatWithActionPalette}
              initialMessage={initialChatMessage}
              onActionSelect={handleActionSelect}
              onExerciseClick={handleExerciseClick}
            />
          </Animated.View>
        </>
      )}
    </OnboardingContext.Provider>
  );
};
  








