// services/apiService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://192.168.0.245:8082/api/Login';

export const loginUser = async (whatsappNumber: string, password: string) => {
  try {
    const response = await axios.post(API_URL, {
      whatsappNumber,
      password,
    });


    const { data } = response;

    if (data.responseCode === "200") {
      const token = data.data; 
      const decodedToken = jwtDecode(token);

      const userId = decodedToken.sub; 

      if (!userId) {
        throw new Error("User ID not found in the token.");
      }

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userId', userId.toString());

      console.log('User logged in successfully!');
      console.log('UserId is : ', userId)
      return { token, userId };
    } else {
      console.error('Login failed:', data.responseMessage);
      throw new Error(data.responseMessage); 
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};



export const getUsers = async () => {
  try {
    const response = await axios.get('http://192.168.0.245:8082/api/filter');
    return response.data; 
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};