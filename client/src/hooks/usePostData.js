import { useState, useEffect } from 'react';
import { postApi } from '../services/postApi';
import { userApi } from '../services/userApi';
import { filesApi } from '../services/filesApi';
import { useAuthContext } from './useAuthContext';

const useFetchPostData = ({ postId, username }) => {
  const { user } = useAuthContext();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        const headers = getHeaders();
        
        const [postDataResponse, profilePicBase64, postImageResponse] = await Promise.all([
          postApi.fetchPostData(postId, headers),
          userApi.fetchUserProfilePic(username, headers),
          filesApi.postImage(postId, headers)
        ]);

        const { postImageBase64, postImageMetadata } = postImageResponse;

        setPostData({...postDataResponse, profilePicImgUrl: profilePicBase64, postImageUrl: postImageBase64, ...postImageMetadata});
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId, user]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { loading, postData };
};

export default useFetchPostData;