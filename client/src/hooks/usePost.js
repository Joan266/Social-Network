import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { usePostsContext } from './usePostsContext'
import { postApi } from '../services/api'

export const usePost = () => {
  const { dispatch } = usePostsContext()
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  const createPost = async (content) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
    setIsLoading(true);
    const response = await postApi.create({userId:user._id,content}, headers);
    if (response.error) {
      setIsLoading(false)
      console.log(response.error);
      return
    }
    dispatch({type: 'CREATE_POST', payload: response})
  }
  return { createPost, isLoading }
}