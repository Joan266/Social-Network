import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { userApi } from '../services/userApi';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (emailOrUsername, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const loginReponseData = await userApi.login({ emailOrUsername, password });
      if(loginReponseData.error){
        return console.log(error)
      }

      // // Update auth context
      dispatch({
        type: 'LOGIN',
        payload: loginReponseData,
      });
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleLoginError = (error) => {
    console.error("Error during login:", error);
    setError(error);
  };

  return { login, isLoading, error };
};
