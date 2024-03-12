import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';
import { useAuthContext } from './useAuthContext';

const useProfileFollow = ({ username, isLoggedInUserProfile}) => {
  const { user } = useAuthContext();
  const [ isUserFollowed, setIsUserFollowed ] = useState(false);


  const handleFollowToggle = async () => {
    const headers = getHeaders();
    try {
      const response = await (isUserFollowed
        ? userApi.unfollowUser({ followerId: user._id, followedUsername: username }, headers)
        : userApi.followUser({ followerId: user._id, followedUsername: username }, headers));

      if (response.error) {
        console.log(response.error);
        return;
      }

      setIsUserFollowed(!isUserFollowed);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };
 
  useEffect(() => {
    const fetchFollowingUser = async () => {
      const headers = getHeaders();
      try {
        // Check if the logged-in user is following this user
        const isFollowingResponse = await userApi.isFollowingUser({ userId: user._id, profileUsername: username }, headers);
        setIsUserFollowed(isFollowingResponse);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } 
    };

    // Check if its logged-in user profile case true return
    if (!username || !user || isLoggedInUserProfile) return;

    fetchFollowingUser();
  }, [username, user]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { isUserFollowed, handleFollowToggle };
};

export default useProfileFollow;
