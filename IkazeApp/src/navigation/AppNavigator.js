import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import {
  NavigationDashboardScreen,
  SiteDetailScreen,
  SiteDirectoryScreen,
} from '../screens/ExploreScreens';
import TourGuidePortalScreen from '../screens/TourGuidePortalScreen';
import TouristPortalScreen from '../screens/TouristPortalScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

function RwandanHomeScreen(props) {
  return <SiteDirectoryScreen {...props} isLocal />;
}

function ForeignerHomeScreen(props) {
  return <SiteDirectoryScreen {...props} isLocal={false} />;
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="TouristPortal" component={TouristPortalScreen} />
        <Stack.Screen name="TourGuidePortal" component={TourGuidePortalScreen} />
        <Stack.Screen name="RwandanHome" component={RwandanHomeScreen} />
        <Stack.Screen name="ForeignerHome" component={ForeignerHomeScreen} />
        <Stack.Screen name="SiteDetail" component={SiteDetailScreen} />
        <Stack.Screen name="NavigationDashboard" component={NavigationDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
