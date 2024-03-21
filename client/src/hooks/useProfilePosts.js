import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';
import { useAuthContext } from './useAuthContext';

const useProfilePosts = (username) => {
  const { user } = useAuthContext();
  const [ posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProfilePosts = async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      };
      // Fetch user posts
      const profilePostsResponse = await userApi.fetchUserPosts({username}, headers);
      setIsError(profilePostsResponse.error)
      setPosts(profilePostsResponse.posts)
      setIsLoading(false)
    };
    setIsLoading(true)
    fetchProfilePosts();
  }, [username,user]);

  return { isLoading, posts, isError };
};

export default useProfilePosts;
