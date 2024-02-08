import { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { useAuthContext } from './useAuthContext';
import {usePostsContext} from './usePostsContext';

const useFetchUserPosts = (username) => {
  const { dispatch } = usePostsContext()
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  useEffect(() => {
    const fetchUserPosts = async () => {
      const headers = getHeaders();
      try {
        setLoading(true);

        // Fetch user posts
        const userPostsResponse = await userApi.fetchUserPosts(username, headers);

        dispatch({type: 'ADD_POSTS', payload: userPostsResponse})
   
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username,dispatch]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { loading };
};

export default useFetchUserPosts;
