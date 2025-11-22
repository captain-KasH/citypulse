import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import SplashScreen from '../modules/auth/SplashScreen';
import LandingScreen from '../modules/auth/LandingScreen';
import SignUpScreen from '../modules/auth/SignUpScreen';
import TabNavigator from './TabNavigator';
import EventDetailScreen from '../modules/event/EventDetailScreen';

export type RootStackParamList = {
  Splash: undefined;
  Landing: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  EventDetail: { eventId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { hasSeenSplash } = useSelector((state: RootState) => state.app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={hasSeenSplash ? (isAuthenticated ? 'MainTabs' : 'Landing') : 'Splash'}
        screenOptions={{
          headerShown: false,
        }}
      >
        {!hasSeenSplash && <Stack.Screen name="Splash" component={SplashScreen} />}
        
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;