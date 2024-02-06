import { useState, useEffect } from 'react';
import { ApiRouter } from '../services/api';
import { useAuthContext } from '../hooks/useAuthContext';

const useFetchUserData = (username) => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [ isUserProfile, setIsUserProfile ] = useState(false);
  const [ isUserFollowed, setIsUserFollowed ] = useState(false);

  const handleFollowToggle = async () => {
    const headers = getHeaders();
    try {
      const response = await (isUserFollowed
        ? ApiRouter.unfollowUser({ followerId: user._id, followedUsername: username }, headers)
        : ApiRouter.followUser({ followerId: user._id, followedUsername: username }, headers));

      if (response.error) {
        console.log(response.error);
        return;
      }

      setIsUserFollowed(!isUserFollowed);
      setUserData({
        ...userData,
        followersCount: isUserFollowed ? userData.followersCount - 1 : userData.followersCount + 1,
      });
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handlePrivacyStatus = async () => {
    const headers = getHeaders();
    try {
      const response = await ApiRouter.updatePrivacyStatus({ privacyStatus: !userData.privacyStatus, username }, headers);
      if (response.error) {
        console.log(response.error);
        return;
      }
      setUserData({
        ...userData, 
        privacyStatus:!userData.privacyStatus,
      });
    } catch (error) {
      console.error('Error updating privacy status:', error);
    }
  };

  
  useEffect(() => {
    if (!username || !user) return;
    if (username === user.username) {
      setIsUserProfile(true)
    }else{
      setIsUserProfile(false)
    }
    const fetchProfileData = async () => {
      const headers = getHeaders();
      try {
        setLoading(true);

        // Fetch user data
        const userDataResponse = await ApiRouter.fetchUserData(username, headers);

        setUserData(userDataResponse);

        // Check if the logged-in user is following this user
        if (username !== user.username) {
          const isFollowingResponse = await ApiRouter.isFollowing({ userId: user._id, profileUsername: username }, headers);
          setIsUserFollowed(!isFollowingResponse.error);
        }

        
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, user]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { userData, loading, isUserFollowed, isUserProfile,handleFollowToggle,handlePrivacyStatus };
};

export default useFetchUserData;
