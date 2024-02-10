import { useState, useEffect } from 'react';
import { postApi } from '../services/api';
import { useAuthContext } from './useAuthContext';
import {usePostsContext} from './usePostsContext';

const useFetchHomePosts = () => {
  const { dispatch } = usePostsContext()
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  useEffect(() => {
    const fetchHomePosts = async () => {
      const headers = getHeaders();
      try {
        setLoading(true);

        // Fetch home posts
        const homePostsResponse = await postApi.fetchHomePosts(user._id,headers);
        console.log(`homePostsResponse: ${homePostsResponse}`)
        if(!homePostsResponse.error){
          dispatch({type: 'ADD_POSTS', payload: homePostsResponse})
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePosts();
  }, [dispatch]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { loading };
};

export default useFetchHomePosts;
