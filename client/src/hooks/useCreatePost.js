import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { postApi } from '../services/api'
import { usePostsContext } from './usePostsContext'
export const useCreatePost = () => {
  const { user } = useAuthContext()
  const { dispatch } = usePostsContext()
  const [isLoading, setIsLoading] = useState(false)

  const createPost = async ({content, postId, image}) => {
    const headers = {
      'Content-Type': "multipart/form-data",
      'Authorization': `Bearer ${user.token}`,
    };
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    content && formData.append("content", content);
    postId && formData.append("postId", postId);
        // Log the FormData contents
    for (const pair of formData.entries()) {
      console.log(pair[0] + ', 1' + pair[1]);
    }
    const response = await postApi.create(
      formData, 
      headers,
    );
    if (response.error) {
      setIsLoading(false)
      console.log(response.error);
      return
    }
    console.log(response)
    setIsLoading(false)
    dispatch({type: 'ADD_POST', payload: response})
  }
  return { createPost, isLoading }
}