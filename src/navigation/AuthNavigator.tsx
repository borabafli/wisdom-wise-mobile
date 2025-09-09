import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SignInScreen,
  SignUpScreen,
  VerificationScreen,
  ForgotPasswordScreen,
} from '../screens/auth';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Verification: { email: string };
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const [verificationEmail, setVerificationEmail] = useState<string>('');

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F0F9FF' },
      }}
      initialRouteName="SignIn"
    >
      <Stack.Screen name="SignIn">
        {({ navigation }) => (
          <SignInScreen
            onNavigateToSignUp={() => navigation.navigate('SignUp')}
            onNavigateToForgotPassword={() => navigation.navigate('ForgotPassword')}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="SignUp">
        {({ navigation }) => (
          <SignUpScreen
            onNavigateToSignIn={() => navigation.navigate('SignIn')}
            onNavigateToVerification={(email) => {
              setVerificationEmail(email);
              navigation.navigate('Verification', { email });
            }}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Verification">
        {({ navigation, route }) => (
          <VerificationScreen
            email={route.params?.email || verificationEmail}
            onNavigateBack={() => navigation.navigate('SignUp')}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="ForgotPassword">
        {({ navigation }) => (
          <ForgotPasswordScreen
            onNavigateBack={() => navigation.navigate('SignIn')}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};