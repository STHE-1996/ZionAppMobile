import axios from 'axios';
import { Message, SendMessage } from '../models/ChatMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://192.168.0.245:8082/api';
const API_URL = 'https://zion-app-8bcc080006a7.herokuapp.com/api';

export const getMessages = async (senderId: string, receiverId: string): Promise<Message[]> => {
  

  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await axios.get(
      `${API_URL}/getMessages/${senderId}/${receiverId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token added here
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (messageData: SendMessage) => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      throw new Error('Authentication token not found.');
    }

    const response = await axios.post(
      `${API_URL}/sendMessage`,
      messageData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token added here
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};



export const fetchChatData = async (senderId: string) => {

  try {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      throw new Error('Authentication token not found.');
    }

    // Make the GET request to the API with Authorization header
    const response = await axios.get(
      `${API_URL}/usersTexted/${senderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token added here
        },
      }
    );

    // Check if the response status is in the range 200–299
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Axios automatically parses JSON
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching chat data:', error);
    return []; // Return an empty array if an error occurs
  }
};

  

  export const markMessagesAsRead = async (senderId: string, receiverId: string) => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      throw new Error('Authentication token not found.');
    }

    // Prepare the request body
    const requestData = {
      senderId: senderId,
      receiverId: receiverId,
    };

    // Make the POST request with Authorization header
    const response = await axios.post(
      `${API_URL}/markMessagesAsRead`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token added here
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      console.log('Messages marked as read successfully');
      return response.data;
    } else {
      throw new Error(`Failed to mark messages as read. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};