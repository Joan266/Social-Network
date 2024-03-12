import { useState, useEffect } from 'react';
import { postApi } from '../services/postApi';
import { useAuthContext } from './useAuthContext';

const usePostLike = ({ postId}) => {
  
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [ isPostLiked, setIsPostLiked ] = useState(false);

  const handleLikeToggle = async () => {
    const headers = getHeaders();
    try {
      setIsLoading(true);
      const response = await (isPostLiked
        ? postApi.unlikePost({ userId: user._id, postId }, headers)
        : postApi.likePost({ userId: user._id, postId }, headers));

      if (response.error) {
        console.log(response.error);
        return;
      }

      setIsPostLiked(!isPostLiked);
    } catch (error) {
      console.error('Error liking/unliking user:', error);
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchIsPostLiked = async () => {
      const headers = getHeaders();
      try {
        setIsLoading(true);
        const isLikingResponse = await postApi.isLiking({ userId: user._id, postId }, headers);
        setIsPostLiked(isLikingResponse);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIsPostLiked()

  }, [postId, user]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { isLoading, handleLikeToggle, isPostLiked};
};

export default usePostLike;
