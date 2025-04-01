import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDetails } from '../models/UserDetails';
import { fetchChatData, getMessages, markMessagesAsRead } from '../services/chatServices';
import { Message } from '../models/ChatMessage';
import { useFocusEffect } from '@react-navigation/native';

const RecentChatsScreen = ({ navigation }: { navigation: any }) => {
  const [chatData, setChatData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getChatData = async () => {
    try {
      const senderId = await AsyncStorage.getItem('userId');
      if (senderId) {
        const data = await fetchChatData(senderId);
        const updatedData = await Promise.all(
          data.map(async (user: UserDetails) => {
            const receiverId = user?.id;
            const messages: Message[] = await getMessages(senderId, receiverId);
            const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp);
            const latestMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;
            const unreadMessages = messages.filter(
              (message: Message) => message.status === 'unread' && message.receiverId === senderId
            ).length;

            return { user, latestMessage, unreadMessages };
          })
        );
        setChatData(updatedData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getChatData(); // Initial data fetch

    const interval = setInterval(() => {
      getChatData(); // Update chat data every 3 seconds
    }, 3000);

    // Cleanup interval on component unmount or when the screen loses focus
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Call to refresh chat data when screen is focused
      getChatData();
    }, [])
  );

  const handleChatSelect = async (user: UserDetails) => {
    try {
      const senderId = await AsyncStorage.getItem('userId');
      const receiverId = user.id;

      if (senderId && receiverId) {
        // Call markMessagesAsRead API to mark all messages between sender and receiver as read
        await markMessagesAsRead(senderId, receiverId);
      }

      // Navigate to ChatScreen with the selected user
      navigation.navigate('Chats', { user: user });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const renderChatItem = ({ item }: { item: any }) => {
    if (!item?.user) {
      return null;
    }

    const { user, latestMessage, unreadMessages } = item;
    const hasMessages = latestMessage !== null;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatSelect(user)} // Use the handleChatSelect function
      >
        <Image source={{ uri: user.profilePictureUrl }} style={styles.avatar} />
        <View style={styles.chatInfo}>
          <Text style={styles.userName}>{user.firstName} {user.secondName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {hasMessages ? latestMessage?.message : 'No recent messages'}
          </Text>
        </View>
        {unreadMessages > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadMessages}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.user?.id.toString()}
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
