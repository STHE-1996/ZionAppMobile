import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const uploadProfilePicture = async (imageUri: any, userId: any) => {
  const file = {
    uri: imageUri,           // local file URI
    type: 'image/jpeg',
    name: 'image.jpg',
  } as any;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await axios.post(
      `https://zion-app-8bcc080006a7.herokuapp.com/api/profileProfilePicture/pic/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // ✅ Add the token here
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

export const deletePost = async (userId: string, postId: string): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await fetch(
      `https://zion-app-8bcc080006a7.herokuapp.com/api/deletePost/${userId}/${postId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      return true;
    } else {
      console.error('Failed to delete post');
      return false;
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
};
