import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { UserDetails } from '../models/UserDetails'; 
import { Message } from '../models/ChatMessage'; 
import { getMessages, sendMessage } from '../services/chatServices'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabNavigator from './BottomTabNavigator';

interface ChatScreenProps {
  route: any;
}

const ChatScreen = ({ route }: ChatScreenProps) => {
  const { user }: { user: UserDetails } = route.params; // Receive user details as a parameter
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch messages and current user id on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId'); // Fetch the logged-in user's ID from AsyncStorage
        setCurrentUserId(userId); // Set the current user ID
        if (userId) {
          // Fetch messages between the logged-in user and the selected user
          const fetchedMessages = await getMessages(userId,user?.id);
          setMessages(fetchedMessages);
        } else {
          console.error('User ID not found');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();  // Fetch messages on component mount
  }, [user]);

  // Polling function to check for new messages from the server every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentUserId && user?.id) {
        try {
          const updatedMessages = await getMessages(currentUserId, user?.id);
          setMessages(updatedMessages); // Update the messages state with new data
        } catch (error) {
          console.error('Error fetching new messages:', error);
        }
      }
    }, 3000); // 3-second polling interval

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [currentUserId, user?.id]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const currentUserId = await AsyncStorage.getItem('userId');
        if (currentUserId && user?.id) {
          const messageData = {
            senderId: currentUserId,
            receiverId: user?.id,
            message: newMessage,
            timestamp: Date.now(),
            status: 'sent',
          };

          // Send the message to the server
          const response = await sendMessage(messageData);

          // After the message is successfully sent, get the messageId from the response
          const { messageId } = response;  // Assuming response contains the messageId

          // Add the new message to the state with the received messageId
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              ...messageData,
              id: messageId,  // Use the messageId returned from the API response
            },
          ]);

          setNewMessage('');  // Clear the input field
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    // Check if the message is sent by the current user or the other user
    const isSender = item.senderId === currentUserId;
    return (
      <View
        style={[styles.message, isSender ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.profilePictureUrl }} style={styles.profileImage} />
        <Text style={styles.username}>{`${user.firstName} ${user.secondName}`}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.chatContainer}
      />

      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      {/* <BottomTabNavigator /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    padding: 10,
    backgroundColor: '#01ebff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  message: {
    maxWidth: '70%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  sentMessage: {
    backgroundColor: '2px solid rgb(1, 235, 252)',
    alignSelf: 'flex-end',  // Align the sender's messages to the right
  },
  receivedMessage: {
    backgroundColor: 'rgba(27, 27, 27, 0.17)',
    alignSelf: 'flex-start', // Align the receiver's messages to the left
  },
  messageText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '2px solid rgb(1, 235, 252)',
    borderRadius: 20,
    padding: 10,
  },
  sendButtonText: {
    color: '#fff',
  },
});

export default ChatScreen;
