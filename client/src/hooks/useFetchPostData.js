import { useState, useEffect } from 'react';
import { postApi } from '../services/api';
import { useAuthContext } from '../hooks/useAuthContext';

const useFetchPostData = ({isVisible,postId}) => {
  const { user } = useAuthContext();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ isPostLiked, setIsPostLiked ] = useState(false);
  const handleLikeToggle = async () => {
    const headers = getHeaders();
    try {
      const response = await (isPostLiked
        ? postApi.unlikePost({ userId: user._id, postId }, headers)
        : postApi.likePost({ userId: user._id, postId }, headers));

      if (response.error) {
        console.log(response.error);
        return;
      }

      setIsPostLiked(!isPostLiked);
      setPostData({
        ...postData,
        likesCount: isPostLiked ? postData.likesCount - 1 : postData.likesCount + 1,
      });
    } catch (error) {
      console.error('Error liking/unliking user:', error);
    }
  };
  useEffect(() => {
    const fetchPostData = async () => {
      const headers = getHeaders();
      try {
        setLoading(true);

        // Fetch user data
        const postDataResponse = await postApi.fetchPostData(postId, headers);
        console.log(postDataResponse)
        setPostData(postDataResponse);
        const isLikingResponse = await postApi.isLiking({ userId: user._id, postId }, headers);
        console.log(isLikingResponse)
        setIsPostLiked(isLikingResponse);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if(isVisible) {
      fetchPostData()
      return
    };
    setPostData(null);
  }, [postId, user, isVisible]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { loading, postData,handleLikeToggle,isPostLiked};
};

export default useFetchPostData;
