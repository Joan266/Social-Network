import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { postApi } from '../services/api'

export const useCreatePost = () => {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  const createPost = async ({content, postId}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
    setIsLoading(true);
    const response = await postApi.create({userId:user._id,content,postId}, headers);
    if (response.error) {
      setIsLoading(false)
      console.log(response.error);
      return
    }
  }
  return { createPost, isLoading }
}