import { useState, useEffect } from 'react';
import { postApi } from '../services/postApi';
import { filesApi } from '../services/filesApi';
import { useAuthContext } from './useAuthContext';

const useFetchPostData = ({ postId, userId }) => {
  const { user } = useAuthContext();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postImageUrl, setPostImageUrl] = useState(null);
  const [profilePicImgUrl, setProfilePicImgUrl] = useState(null);

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
        const newPostImageUrl = URL.createObjectURL(postImageData);
        const newProfilePicImgUrl = URL.createObjectURL(profilePicResponse);

        // Revoke previous URLs
        if (postImageUrl) {
          URL.revokeObjectURL(postImageUrl);
        }
        if (profilePicImgUrl) {
          URL.revokeObjectURL(profilePicImgUrl);
        }

        // Set new URLs and metadata
        setPostImageUrl(newPostImageUrl);
        setProfilePicImgUrl(newProfilePicImgUrl);
        setPostData({...postDataResponse, profilePicImgUrl: newProfilePicImgUrl, postImageUrl: newPostImageUrl, ...postImageMetadata});
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();

    // Cleanup function to revoke URLs when component unmounts
    return () => {
      if (postImageUrl) {
        URL.revokeObjectURL(postImageUrl);
      }
      if (profilePicImgUrl) {
        URL.revokeObjectURL(profilePicImgUrl);
      }
    };

  }, [postId, user]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { loading, postData };
};

export default useFetchPostData;