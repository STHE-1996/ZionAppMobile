import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VerificationScreen from './screens/VerificationScreen';
import HomeScreen from './screens/HomeScreen';
import NotificationScreen from './screens/NotificationScreen';
import BottomTabNavigator from './screens/BottomTabNavigator';
import TimelineScreen from './screens/TimelineScreen';
import ShopScreen from './screens/ShopScreen';
import RecentChatsScreen from './screens/RecentChatsScreen';
import UsersScreen from './screens/UsersScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import ViewProfileScreen from './screens/ViewProfileScreen';
import StatusScreen from './screens/StatusScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {/* Non-tab Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Chats" component={ChatScreen} />
        <Stack.Screen name="UsersScreen" component={UsersScreen}/>
        <Stack.Screen name="StatusScreen" component={StatusScreen}/>
        

        {/* Main Tab Navigator */}
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
        {/* Other Screens with Bottom Tab Visible */}
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        
        <Stack.Screen name="Recent" component={RecentChatsScreen} />
        
        <Stack.Screen name="ShopScreen" component={ShopScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="TimelineScreen" component={TimelineScreen} />
        <Stack.Screen name="View" component={ViewProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
