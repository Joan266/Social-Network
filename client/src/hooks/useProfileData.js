import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';
import { useAuthContext } from './useAuthContext';

const useFetchUserData = (username) => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState({});
  const [profileBannerImgUrl, setProfileBannerImgUrl] = useState();

  useEffect(() => {
    if (!username || !user) return;
    
    const fetchProfileData = async () => {
      const headers = getHeaders();
      try {
        // Fetch user data
        const userDataPromise = userApi.fetchUserData(username, headers);
        const profileBannerPromise = userApi.fetchUserProfileBanner(username, headers);
        
        const [userDataResponse, profileBannerResponse ] = await Promise.all([
          userDataPromise,
          profileBannerPromise,
        ]);
        const newProfileBannerImgUrl = URL.createObjectURL(profileBannerResponse);

        // Revoke previous URLs
        if (profileBannerImgUrl) {
          URL.revokeObjectURL(profileBannerImgUrl);
        }

        // Set new URLs and metadata
        setProfileBannerImgUrl(newProfileBannerImgUrl);

        setUserData({ ...userDataResponse, profileBannerImgUrl:newProfileBannerImgUrl });
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
