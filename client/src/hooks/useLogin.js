import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { userApi } from '../services/userApi';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicImgUrl, setProfilePicImgUrl] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (emailOrUsername, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const {profilePicData, loginResponseData,error} = await userApi.login({ emailOrUsername, password });
      if(error){
        return console.log(error)
      }

      const newProfilePicImgUrl = setProfilePicUrl(profilePicData);
      // // Update auth context
      updateAuthContext(loginResponseData, newProfilePicImgUrl);
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const setProfilePicUrl = (profilePicData) => {
    if(!profilePicData) return null
    const newProfilePicImgUrl = URL.createObjectURL(profilePicData);
    if (profilePicImgUrl) {
      URL.revokeObjectURL(profilePicImgUrl);
    }
    setProfilePicImgUrl(newProfilePicImgUrl);
    return newProfilePicImgUrl;
  };

  const updateAuthContext = (loginResponseData, profilePicImgUrl) => {
    dispatch({
      type: 'LOGIN',
      payload: { ...loginResponseData, profilePicImgUrl },
    });
  };

  const handleLoginError = (error) => {
    console.error("Error during login:", error);
    setError(error);
  };

  return { login, isLoading, error };
};
