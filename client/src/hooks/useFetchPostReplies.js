import { useState, useEffect } from 'react';
import { postApi } from '../services/api';
import { useAuthContext } from './useAuthContext';
import { usePostsContext } from './usePostsContext';

const useFetchPostReplies = (postId) => {
  const { dispatch } = usePostsContext()
  const [ isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  useEffect(() => {
    const fetchPostReplies = async () => {
      const headers = getHeaders();
      try {
        setIsLoading(true);

        // Fetch home posts
        const fetchPostRepliesResponse = await postApi.fetchPostReplies(postId,headers);
        if(!fetchPostRepliesResponse.error){
          dispatch({type: 'ADD_POSTS', payload: fetchPostRepliesResponse})
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostReplies();
  }, [dispatch, postId]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { isLoading };
};

export default useFetchPostReplies;
