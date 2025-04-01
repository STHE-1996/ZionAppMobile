import axios from 'axios';
import { PostingRequest } from '../models/PostingRequest';

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
  console.log(formData,id, title);
  try {
    const response = await axios.post(
      // `http://192.168.0.245:8082/api/uploadImageTimeLine/${pic}/${id}/${title}`,
      `https://zion-app-8bcc080006a7.herokuapp.com/api/uploadImageTimeLine/yourPicValue/${id}/${title}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error uploading image to timeline:', error);
    throw error;
  }
};
