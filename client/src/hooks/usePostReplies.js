import { useState, useEffect } from 'react';
import { postApi } from '../services/api';
import { useAuthContext } from './useAuthContext';

const useFetchPostReplies = (postId) => {
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
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostReplies();
  }, [postId]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { isLoading };
};

export default useFetchPostReplies;
