import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { userApi } from '../services/api';
import { uploadFile } from '../utils/useUploadFile';
export const useUpdateProfileData = () => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);


  const updateProfileData = async (data) => {
    setIsLoading(true);
    try {
      const { info, profilePicFile, bannerFile } = data;
      
      const profilePicFileId = profilePicFile ? await uploadFile({token: user.token,file:profilePicFile}) : null;
      const bannerFileId = bannerFile ? await uploadFile({token: user.token,file:bannerFile}) : null;
    
      const updateData = {
        ...info,
        profilePicFileId,
        bannerFileId
      };

      const updateProfileDataResponse = await userApi.updateProfileData(
        {updateData, userId:user._id}, 
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      );

      if (updateProfileDataResponse.error) {
        throw new Error(updateProfileDataResponse.error);
      }

      console.log(updateProfileDataResponse);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    }
  };

  return { updateProfileData, isLoading };
};
