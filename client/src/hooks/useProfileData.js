import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';
import { useAuthContext } from './useAuthContext';

const useFetchUserData = (username) => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username || !user) return;

    const fetchProfileData = async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      };
      try {
        const userDataResponse = await userApi.fetchUserData(username, headers);
        let profileBannerPromise = Promise.resolve(null);
        let profilePicPromise = Promise.resolve(null);

        if (userDataResponse.bannerFileId) {
          profileBannerPromise = userApi.fetchUserProfileBanner(username, headers);
        }
        if (userDataResponse.profilePicFileId) {
          profilePicPromise = userApi.fetchUserProfilePic(username, headers);
        }

        const [profileBannerBase64, profilePicBase64] = await Promise.all([
          profileBannerPromise,
          profilePicPromise,
        ]);

        setUserData({
          ...userDataResponse,
          profileBannerImgUrl: profileBannerBase64,
          profilePicImgUrl: profilePicBase64,
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);

    const delayTimeout = setTimeout(() => {
      fetchProfileData();
    }, 1250);

    return () => clearTimeout(delayTimeout);
  }, [username, user]);

  return { userData, loading };
};

export default useFetchUserData;
