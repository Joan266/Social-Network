import { useState, useEffect } from 'react';
import { postApi } from '../services/api';
import { useAuthContext } from '../hooks/useAuthContext';
import { readImageId } from '../utils/useReadImageId';

const useFetchPostData = ({isVisible, postId}) => {
  const { user } = useAuthContext();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ isPostLiked, setIsPostLiked ] = useState(false);

  const handleLikeToggle = async () => {
    const headers = getHeaders();
    try {
      setLoading(true);
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
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPostData = async () => {
      const headers = getHeaders();
      try {
        setLoading(true);

        // Fetch user data
        const postDataResponse = await postApi.fetchPostData(postId, headers);
        console.log(postDataResponse.postData)
        const { postImageFileId, ...rest } = postDataResponse.postData;
        const postImageUrl = postImageFileId ? await readImageId({ fileId: postImageFileId, userToken:user.token}) : null;

        setPostData({postImageUrl,...rest});
        const isLikingResponse = await postApi.isLiking({ userId: user._id, postId }, headers);
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
