import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';
import { useAuthContext } from './useAuthContext';

const useFetchUserData = (username) => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (!username || !user) return;
    
    const fetchProfileData = async () => {
      const headers = getHeaders();
      try {
        // Fetch user data
        const userDataResponse = await userApi.fetchUserData(username, headers);
        const { ...rest } = userDataResponse;
       setUserData({ ...userDataResponse });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } 
    };

    fetchProfileData();
  }, [username, user]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { userData };
};

export default useFetchUserData;
