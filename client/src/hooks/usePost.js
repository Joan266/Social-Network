import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { usePostsContext } from './usePostsContext'
import { postApi } from '../services/api'

export const usePost = (text) => {
  const { dispatch } = usePostsContext()
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  const createPost = (text) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
    setIsLoading(true);
    const response = postApi.create({username:user.username,text},headers);
    if (response.error) {
      setIsLoading(false)
      console.log(response.error);
      return
    }
    dispatch({type: 'CREATE_POST', payload: response})
  }
  return { createPost, isLoading }
}