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
            let profileBannerPromise = Promise.resolve(null);
            let profilePicPromise = Promise.resolve(null);

            if (userDataResponse.bannerFileId) {
                profileBannerPromise = userApi.fetchUserProfileBanner(username, headers);
            }
            if (userDataResponse.profilePicFileId) {
                profilePicPromise = userApi.fetchUserProfilePic({ username, userToken: user.token });
            }

            const [profileBannerResponse, profilePicResponse] = await Promise.all([
                profileBannerPromise,
                profilePicPromise,
            ]);

            let profileBannerImgUrl = null;
            let profilePicImgUrl = null;

            if (profileBannerResponse) {
                profileBannerImgUrl = URL.createObjectURL(profileBannerResponse.data);
            }

            if (profilePicResponse) {
                profilePicImgUrl = URL.createObjectURL(profilePicResponse.data);
            }

            setUserData({ ...userDataResponse, profileBannerImgUrl, profilePicImgUrl });
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
