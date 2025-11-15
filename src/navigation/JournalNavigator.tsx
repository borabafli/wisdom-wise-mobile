import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { JournalStackParamList } from '../types/navigation';
import { smoothSlideTransition } from './transitions';

// Import screens
import JournalScreen from '../screens/JournalScreen';
import GuidedJournalScreen from '../screens/GuidedJournalScreen';
import JournalEntryDetailScreen from '../screens/JournalEntryDetailScreen';
import JournalSummaryScreen from '../screens/JournalSummaryScreen';

const Stack = createStackNavigator<JournalStackParamList>();

export const JournalNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...smoothSlideTransition,
      }}
    >
      <Stack.Screen name="JournalHome" component={JournalScreen} />
      <Stack.Screen
        name="JournalEntryDetail"
        component={JournalEntryDetailScreen}
      />
      <Stack.Screen
        name="GuidedJournal"
        component={GuidedJournalScreen}
        options={{
          presentation: 'modal',
          ...(Platform.OS === 'ios'
            ? TransitionPresets.ModalSlideFromBottomIOS
            : TransitionPresets.DefaultTransition),
        }}
      />
      <Stack.Screen
        name="JournalSummary"
        component={JournalSummaryScreen}
        options={{
          // Ensure JournalSummary is a regular screen (not modal) for proper navigation
          presentation: 'card',
          ...smoothSlideTransition,
        }}
      />
    </Stack.Navigator>
  );
};
