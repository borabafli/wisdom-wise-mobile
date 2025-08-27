// import "./global.css";
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { loadFonts } from './src/config/fonts';
import * as SplashScreen from 'expo-splash-screen';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ExerciseLibrary from './src/screens/ExerciseLibrary';
import InsightsDashboard from './src/screens/InsightsDashboard';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatInterface from './src/screens/ChatInterface';
import CustomTabBar from './src/components/CustomTabBar';

export type RootTabParamList = {
  Home: undefined;
  Exercises: undefined;
  Insights: undefined;
  Profile: undefined;
  Chat: { currentExercise?: any };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [chatWithActionPalette, setChatWithActionPalette] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleStartSession = (exercise = null) => {
    setCurrentExercise(exercise);
    setShowChat(true);
  };

  const handleNewSession = () => {
    setShowChat(true);
    setChatWithActionPalette(true);
  };

  const handleBackFromChat = () => {
    setShowChat(false);
    setChatWithActionPalette(false);
    setCurrentExercise(null);
  };

  const handleExerciseClick = (exercise?: any) => {
    if (exercise) {
      handleStartSession(exercise);
    }
  };

  const handleInsightClick = (type: string, insight?: any) => {
    // Handle insight navigation
  };

  const handleActionSelect = (actionId: string) => {
    switch (actionId) {
      case 'guided-session':
        handleStartSession();
        break;
      case 'guided-journaling':
        handleStartSession({ type: 'gratitude', name: 'Guided Journaling', duration: '10 min' });
        break;
      case 'suggested-exercises':
        handleStartSession({ type: 'mindfulness', name: 'Morning Mindfulness', duration: '5 min' });
        break;
      default:
        handleStartSession();
    }
  };

  if (!fontsLoaded) {
    return <View className="flex-1 bg-blue-50" />;
  }

  if (showChat) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#f0f9ff" />
        <ChatInterface 
          onBack={handleBackFromChat}
          currentExercise={currentExercise}
          startWithActionPalette={chatWithActionPalette}
          onActionSelect={handleActionSelect}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#f0f9ff" />
        <Tab.Navigator
          tabBar={(props) => (
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
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Exercises" component={ExerciseLibrary} />
          <Tab.Screen name="Insights">
            {() => <InsightsDashboard onInsightClick={handleInsightClick} />}
          </Tab.Screen>
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
