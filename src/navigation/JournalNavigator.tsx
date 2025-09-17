import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { JournalStackParamList } from '../types/navigation';

// Import screens
import JournalScreen from '../screens/JournalScreen';
import GuidedJournalScreen from '../screens/GuidedJournalScreen';
import JournalEntryDetailScreen from '../screens/JournalEntryDetailScreen';

const Stack = createStackNavigator<JournalStackParamList>();

export const JournalNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
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
        }}
      />
    </Stack.Navigator>
  );
};