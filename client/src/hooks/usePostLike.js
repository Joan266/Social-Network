import { useState, useEffect } from 'react';
import { postApi } from '../services/postApi';
import { useAuthContext } from './useAuthContext';

const usePostLike = ({ postId,setLikeCountSwitch}) => {
  
  const { user } = useAuthContext();
  const [ isPostLiked, setIsPostLiked ] = useState(false);

  const handleLikeToggle = async () => {
    const headers = getHeaders();
    try {
      const response = await (isPostLiked
        ? postApi.unlikePost({ userId: user._id, postId }, headers)
        : postApi.likePost({ userId: user._id, postId }, headers));
        setLikeCountSwitch(prev => isPostLiked ? prev - 1 : prev + 1);

      if (response.error) {
        console.log(response.error);
        return;
      }

      setIsPostLiked(!isPostLiked);
    } catch (error) {
      console.error('Error liking/unliking user:', error);
    }
  };

  useEffect(() => {
    const fetchIsPostLiked = async () => {
      const headers = getHeaders();
      try {
        const isLikingResponse = await postApi.isLiking({ userId: user._id, postId }, headers);
        setIsPostLiked(isLikingResponse);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } 
    };
    fetchIsPostLiked()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, user]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { handleLikeToggle, isPostLiked};
};

export default usePostLike;
