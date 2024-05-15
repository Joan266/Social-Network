import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';
import { useAuthContext } from './useAuthContext';

const useWhoToFollow = () => {
  const { user } = useAuthContext();
  const [ users, setUsers] = useState([]);

  useEffect(() => {
    const fetchWhoToFollow = async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      };

      const whoToFollowResponse = await userApi.fetchWhoToFollow({username:user.username, userId:user._id},headers);

      setUsers(whoToFollowResponse.users)
    };
    fetchWhoToFollow();
  }, [user]);

  return { users };
};

export default useWhoToFollow;
