import { useState, useEffect } from 'react';
import { postApi } from '../services/api';
import { useAuthContext } from '../hooks/useAuthContext';

const useFetchPostData = (postId) => {
  const { user } = useAuthContext();
  const [postData, setPostData] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchPostData = async () => {
      const headers = getHeaders();
      try {
        setLoading(true);

        // Fetch user data
        const postDataResponse = await postApi.fetchPostData(postId, headers);
        console.log(postDataResponse)
        setPostData(postDataResponse);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId, user]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
  });

  return { loading, postData};
};

export default useFetchPostData;
