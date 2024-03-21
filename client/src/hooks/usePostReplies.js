import { useState, useEffect } from 'react';
import { postApi } from '../services/postApi';
import { useAuthContext } from './useAuthContext';

const usePostReplies = (postId) => {
  const { user } = useAuthContext();
  const [ posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPostReplies = async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      };
      // Fetch home posts
      const postRepliesResponse = await postApi.fetchPostReplies(postId,headers);

      setIsError(postRepliesResponse.error)
      setPosts(postRepliesResponse.posts)
      setIsLoading(false)
    } 
    
    setIsLoading(true)
    fetchPostReplies()
  }, [user, postId]);

  return { isLoading, posts, isError };
};

export default usePostReplies;
