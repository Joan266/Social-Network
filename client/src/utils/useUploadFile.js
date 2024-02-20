import { filesApi } from '../services/api';

export const uploadFile = async ({file, token}) => {
  const formData = new FormData();
  formData.append("file", file);
  const uploadFileResponse = await filesApi.upload(
    formData, 
    {
      'Content-Type': "multipart/form-data",
      'Authorization': `Bearer ${token}`,
    },
  );
  if (uploadFileResponse.error) {
    throw new Error(uploadFileResponse.error);
  }
  return uploadFileResponse.fileId;
};