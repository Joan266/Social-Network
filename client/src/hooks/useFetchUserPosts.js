import { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { useAuthContext } from './useAuthContext';
const useFetchUserData = (username) => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  useEffect(() => {
    const fetchUserPosts = async () => {
      const headers = getHeaders();
      try {
        setLoading(true);

        // Fetch user posts
        const userPostsResponse = await userApi.fetchUserPosts(username, headers);

        setUserPosts(userPostsResponse);
   
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { loading, userPosts };
};

export default useFetchUserData;
