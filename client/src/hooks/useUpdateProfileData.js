import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { userApi } from '../services/userApi';
import { filesApi } from '../services/filesApi';
import { uploadFile } from '../utils/useUploadFile';
import { useNavigate } from 'react-router-dom';
export const useUpdateProfileData = () => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 
  const navigateString = `/profile`;

  const updateProfileData = async (data) => {
    setIsLoading(true);
    try {
      const { inputData, profilePicFile, bannerFile, bannerFileId, profilePicFileId } = data;
      const userDataUpdate = {
        ...inputData
      };
      if(profilePicFile) {
        userDataUpdate.profilePicFileId = await uploadFile({token: user.token,file:profilePicFile});
        await filesApi.delete({userToken: user.token,fileId:profilePicFileId});
      }
      if(bannerFile) {
        userDataUpdate.bannerFileId = await uploadFile({token: user.token,file:bannerFile});
        await filesApi.delete({userToken: user.token,fileId:bannerFileId});
      }

      const updateProfileDataResponse = await userApi.updateProfileData(
        {userDataUpdate, userId:user._id}, 
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      );

      if (updateProfileDataResponse.error) {
        throw new Error(updateProfileDataResponse.error);
      }

      setIsLoading(false);
      navigate(navigateString);
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    }
  };

  return { updateProfileData, isLoading };
};
