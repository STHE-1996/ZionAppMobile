import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UsersScreen from './UsersScreen';
import RecentChatsScreen from './RecentChatsScreen';
import ProfileScreen from './ProfileScreen';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icons = {
            Home: 'home', 
            Users: 'account-group',
            Chats: 'message-text',
            Profile: 'account-circle',
          };
          return <Icon name={icons[route.name]} size={size} color="#01ebff"/>;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '01ebff',
        tabBarStyle: { backgroundColor: '#fff', height: 60 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* <Tab.Screen name="Users" component={UsersScreen} /> */}
      <Tab.Screen name="Chats" component={RecentChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} /> 
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
