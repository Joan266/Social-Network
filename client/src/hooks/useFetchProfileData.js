import { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { useAuthContext } from '../hooks/useAuthContext';
import {readImageId} from '../utils/useReadImageId';

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
        ? userApi.unfollowUser({ followerId: user._id, followedUsername: username }, headers)
        : userApi.followUser({ followerId: user._id, followedUsername: username }, headers));

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
        const userDataResponse = await userApi.fetchUserData(username, headers);
        const { profilePicFileId, bannerFileId, ...rest } = userDataResponse;
        const profilePicUrl = profilePicFileId ? await readImageId({ fileId: profilePicFileId, userToken: user.token }) : null;
        const bannerUrl = bannerFileId ? await readImageId({ fileId:bannerFileId, userToken: user.token }) : null;
        setUserData({ profilePicUrl, bannerUrl, ...rest });

        // Check if the logged-in user is following this user
        if (username !== user.username) {
          const isFollowingResponse = await userApi.isFollowing({ userId: user._id, profileUsername: username }, headers);
          setIsUserFollowed(isFollowingResponse);
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

  return { userData, loading, isUserFollowed, isUserProfile,handleFollowToggle };
};

export default useFetchUserData;
