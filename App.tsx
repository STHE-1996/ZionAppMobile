import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';  // Adjust the path if needed
import HomeScreen from './screens/HomeScreen';
import UsersScreen from './screens/UsersScreen';
import RecentChatsScreen from './screens/RecentChatsScreen';
import ChatScreen from './screens/ChatScreen';
import ShopScreen from './screens/ShopScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationScreen from './screens/NotificationScreen';
import RegistrationScreen from './screens/RegisterScreen';
import RegisterScreen from './screens/RegisterScreen';
import VerificationScreen from './screens/VerificationScreen';

// Create a Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="UsersScreen" component={UsersScreen}/>
        <Stack.Screen name="RecentChatsScreen" component={RecentChatsScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ShopScreen" component={ShopScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} /> 
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
