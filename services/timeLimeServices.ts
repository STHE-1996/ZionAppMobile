import axios from 'axios';
import { PostingRequest } from '../models/PostingRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

const local_uri = 'http://192.168.0.245:8082/api';
const live_uri = 'https://zion-app-8bcc080006a7.herokuapp.com/api';

export const TimeLine = async () => {
    try {
      const response = await axios.get('https://zion-app-8bcc080006a7.herokuapp.com/api/Time_Line_Post');
      // const response = await axios.get('http://192.168.0.245:8082/api/Time_Line_Post');
      return response.data; 
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
 };

 export const postTimeLine = async (postingRequest: PostingRequest) => {
  try {
    const response = await axios.post('http://192.168.0.245:8082/api/postingTimeLine', postingRequest);
    return response.data; // Return the newly created post
  } catch (error) {
    console.error('Error posting to timeline:', error);
    throw error;
  }
};

export const uploadImageTimeLine = async (formData: FormData, id: string, title: string) => {
  const pic = 'yourPicValue';
  console.log(formData, id, title);

  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await axios.post(
      `https://zion-app-8bcc080006a7.herokuapp.com/api/uploadImageTimeLine/${pic}/${id}/${title}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // ✅ Token added here
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading image to timeline:', error);
    throw error;
  }
};


export const comment = async (comment: string, userId: string, postId: string) => {
  console.log('ID :', userId);
  console.log('postId :', postId);
  console.log('comment :', comment);

  try {
    const token = await AsyncStorage.getItem('userToken');

    const requestBody = {
      comment: comment,
      userId: userId,
    };

    const response = await axios.post(
      `https://zion-app-8bcc080006a7.herokuapp.com/api/posts/${postId}/comments`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ Added token here
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error adding comment to post:', error);
    throw error;
  }
};


export const likePost = async (userId: string, postId: string) => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await axios.post(
      'https://zion-app-8bcc080006a7.herokuapp.com/api/likePost',
      null,
      {
        params: { userId, postId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error liking the post:', error);
    throw error;
  }
};

export const heartPost = async (userId: string, postId: string) => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await axios.post(
      'https://zion-app-8bcc080006a7.herokuapp.com/api/heartPost',
      null,
      {
        params: {
          userId,
          postId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error hearting the post:', error);
    throw error;
  }
};

export const izibusisoPost = async (userId: string, postId: string) => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await axios.post(
      'https://zion-app-8bcc080006a7.herokuapp.com/api/izibusisoPost',
      null,
      {
        params: {
          userId,
          postId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error izibusiso the post:', error);
    throw error;
  }
};


