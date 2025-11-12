/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Landing from './src/screens/Landing';
import Login from './src/screens/login';
import Signup from './src/screens/signup';
import Home from './src/screens/Home';
import OTP from './src/screens/OTP';
import Loading from './src/screens/Loading';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  RegisterProduct: { file?: any } | undefined;
  OTP: { phone?: string; countryCode?: string } | undefined;
  Loading: undefined;
};
import RegisterProduct from './src/screens/RegisterProduct';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const isDarkMode = useColorScheme() === 'dark';

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isAuthenticated ? "Home" : "Landing"} 
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
  <Stack.Screen name="RegisterProduct" component={RegisterProduct} options={{ title: 'Add Document Details' }} />
        <Stack.Screen name="OTP" component={OTP} options={{ title: 'Verify' }} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
