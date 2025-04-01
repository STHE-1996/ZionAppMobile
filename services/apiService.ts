// services/apiService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// const API_URL = 'http://192.168.0.245:8082/api/Login';
const API_URL = 'https://zion-app-8bcc080006a7.herokuapp.com/api/Login';

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

export const verifyAccount = async (enteredPin: string) => {
  try {
    const response = await axios.post('http://192.168.0.245:8082/api/VerifyAccount', {
      enteredPin: enteredPin, 
    });

    return response.data; 
  } catch (error) {
    
    if (axios.isAxiosError(error)) {
      console.error('Error response:', error.response?.data);
      throw new Error('Failed to verify account. Please try again.');
    } else {
      console.error('Unknown error:', error);
      throw new Error('An unexpected error occurred.');
    }
  }
};


export const getUsers = async () => {
  try {
    const response = await axios.get('https://zion-app-8bcc080006a7.herokuapp.com/api/filter');
    // const response = await axios.get('http://192.168.0.245:8082/api/filter');
    return response.data; 
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getChurchMembers = async (userId: string) => {
  try {
    const response = await axios.get(`https://zion-app-8bcc080006a7.herokuapp.com/api/ChurchMembers/${userId}`);
    // const response = await axios.get(`http://192.168.0.245:8082/api/ChurchMembers/${userId}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


export const Province = async () => {
  try {
    const response = await axios.get('https://zion-app-8bcc080006a7.herokuapp.com/api/Provinces');
    // const response = await axios.get('http://192.168.0.245:8082/api/Provinces');
    return response.data; 
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const ChurchNames = async () => {
  try {
    const response = await axios.get('https://zion-app-8bcc080006a7.herokuapp.com/api/ChurchNames');
    // const response = await axios.get('http://192.168.0.245:8082/api/ChurchNames')
    return response.data; 
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const registerUser = async (registrationData: any) => {
  console.log('register request :',registrationData)
  try {
    const response = await axios.post(`https://zion-app-8bcc080006a7.herokuapp.com/api/Registration`, registrationData, {
      // const response = await axios.post(`http://192.168.0.245:8082/api/Registration`, registrationData, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error; 
  }
};