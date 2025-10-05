import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';

const ProfileScreenMinimal: React.FC = () => {
  return (
    <SafeAreaWrapper style={{ flex: 1, backgroundColor: '#e9eff1' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, color: '#000' }}>Profile Screen Minimal</Text>
      </View>
    </SafeAreaWrapper>
  );
};

export default ProfileScreenMinimal;
