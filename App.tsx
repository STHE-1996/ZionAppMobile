import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';  // Adjust the path if needed
import HomeScreen from './screens/HomeScreen';
import UsersScreen from './screens/UsersScreen';
import RecentChatsScreen from './screens/RecentChatsScreen';
import ChatScreen from './screens/ChatScreen';

// Create a Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Add other screens here, for example, Home screen */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="UsersScreen" component={UsersScreen}/>
        <Stack.Screen name="RecentChatsScreen" component={RecentChatsScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
    
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
