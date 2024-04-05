import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';
import { useAuthContext } from './useAuthContext';

const useWhoToFollow = (username) => {
  const { user } = useAuthContext();
  const [ users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchWhoToFollow = async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      };

      const whoToFollowResponse = await userApi.fetchWhoToFollow({username},headers);
      setIsError(whoToFollowResponse.error)
      setUsers(whoToFollowResponse.users)
      setIsLoading(false)
    };
    setIsLoading(true)
    fetchWhoToFollow();
  }, [username,user]);

  return { isLoading, users, isError };
};

export default useWhoToFollow;
