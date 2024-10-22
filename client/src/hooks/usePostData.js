import { useState, useEffect } from 'react';
import { postApi } from '../services/postApi';
import { userApi } from '../services/userApi';
import { filesApi } from '../services/filesApi';
import { useAuthContext } from './useAuthContext';

const useFetchPostData = ({ postId, username, isPostVisible }) => {
  const { user } = useAuthContext();
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setIsLoading(true); 

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        };


        const [postDataResponse, profilePicBase64, postImageResponse] = await Promise.all([
          postApi.fetchPostData(postId, headers),
          userApi.fetchUserProfilePic(username, headers),
          filesApi.postImage(postId, headers),
        ]);

        const { postImageBase64, postImageMetadata } = postImageResponse;
        setPostData({
          ...postDataResponse,
          profilePicImgUrl: profilePicBase64,
          postImageUrl: postImageBase64,
          ...postImageMetadata,
        });

      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    if (isPostVisible && (!postData || postData._id !== postId)) {
      fetchPostData();
    }
  }, [postId, user, isPostVisible, postData, username]);

  return { postData, isLoading }; 
};

export default useFetchPostData;
