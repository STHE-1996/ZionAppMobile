import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure AsyncStorage is imported
import { UserDetails } from '../models/UserDetails';
import { fetchChatData } from '../services/chatServices';


const RecentChatsScreen = () => {
  const [chatData, setChatData] = useState<UserDetails[]>([]); // State to store the chat data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getChatData = async () => {
      try {
        const senderId = await AsyncStorage.getItem('userId'); // Get senderId from AsyncStorage
        if (senderId) {
          const data = await fetchChatData(senderId); // Fetch data using the senderId
          setChatData(data); // Update the state with fetched data
        }
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching chat data:', error);
        setLoading(false); // Stop loading if an error occurs
      }
    };

    getChatData(); // Call the async function

  }, []); // Empty dependency array means it will run only once when the component mounts

  const renderChatItem = ({ item }: { item: UserDetails }) => {
    // Check if postModelList is not null and is an array
    const hasPosts = Array.isArray(item.postModelList) && item.postModelList.length > 0;
    
    return (
      <TouchableOpacity style={styles.chatItem}>
        <Image source={{ uri: item.profilePictureUrl }} style={styles.avatar} />
        <View style={styles.chatInfo}>
          <Text style={styles.userName}>{item.firstName} {item.secondName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {hasPosts ? item.postModelList[0].content : 'No recent posts'}
          </Text>
        </View>
        {hasPosts && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.postModelList.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderChatItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 20,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
  },
  badge: {
    backgroundColor: '#FF4500',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default RecentChatsScreen;
