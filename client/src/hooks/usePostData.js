import { useState, useEffect } from 'react';
import { postApi } from '../services/postApi';
import { filesApi } from '../services/filesApi';
import { useAuthContext } from './useAuthContext';

const useFetchPostData = ({ postId, userId }) => {
  const { user } = useAuthContext();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        const headers = getHeaders();
        
        const [postDataResponse, profilePicResponse, postImageResponse] = await Promise.all([
          postApi.fetchPostData(postId, headers),
          filesApi.profilePic(userId, headers),
          filesApi.postImage(postId, headers)
        ]);

        const { postImageData, postImageMetadata } = postImageResponse;
        const postImageUrl = URL.createObjectURL(postImageData);
        const profilePicImgUrl = URL.createObjectURL(profilePicResponse);
        setPostData({...postDataResponse, profilePicImgUrl, postImageUrl, ...postImageMetadata});
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
