import axios from 'axios';
import { Message, SendMessage } from '../models/ChatMessage';

const API_URL = 'http://192.168.0.245:8082/api';

export const getMessages = async (senderId: string, receiverId: string): Promise<Message[]> => {

    console.log('sender :',senderId);
    console.log('receiver :',receiverId);
  try {
    const response = await axios.get(`${API_URL}/getMessages/${senderId}/${receiverId}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error; 
  }
};

export const sendMessage = async (messageData: SendMessage) => {
    try {
        const response = await axios.post(`${API_URL}/sendMessage`, messageData);
      return response.data;  
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; 
    }
  };


  // apiService.js
  export const fetchChatData = async (senderId: string) => {
    console.log('Fetching chat data for senderId:', senderId); // To verify the senderId
    try {
      // Make the GET request to the API
      const response = await axios.get(`${API_URL}/usersTexted/${senderId}`);
  
      // Check if the status is in the range 200-299, indicating success
      if (response.status >= 200 && response.status < 300) {
        return response.data; // Axios automatically parses JSON, so access data directly
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
      return []; // Return an empty array if an error occurs
    }
  };
  