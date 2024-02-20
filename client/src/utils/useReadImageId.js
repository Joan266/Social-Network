import { filesApi } from '../services/api';

export async function readImageId({ fileId, userToken }) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    };
    const response = await filesApi.image(fileId, headers);
    return URL.createObjectURL(response);
  } catch (error) {
    console.error('Error fetching image:', error);
    return ''; // Return empty string in case of error
  }
};
