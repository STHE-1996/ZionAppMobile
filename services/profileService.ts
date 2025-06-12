import axios from 'axios';

export const uploadProfilePicture = async (imageUri: any, userId: any) => {
  // const formData = new FormData();

  // formData.append('file', {
  //   uri: imageUri,
  //   type: 'image/jpeg', 
  //   name: 'profile.jpg',
  // });
  

   const file = {
  uri: imageUri, // local file URI
  type: 'image/jpeg',
  name: 'image.jpg',
} as any;

const formData = new FormData();
formData.append('file', file);
  try {
    const response = await axios.post(
      `https://zion-app-8bcc080006a7.herokuapp.com/api/profileProfilePicture/pic/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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
    const response = await fetch(`https://zion-app-8bcc080006a7.herokuapp.com/api/deletePost/${userId}/${postId}`, {
      method: 'DELETE',
    });

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
