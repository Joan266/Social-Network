import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { postApi } from '../services/api'
import { uploadFile } from '../utils/useUploadFile';
import { useQueryClient } from '@tanstack/react-query'

export const useCreatePost = () => {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const createPost = async ({content, postId, postImageFile}) => {
    setIsLoading(true);
    let postData = { postId, content, userId: user._id };
    
    const postImageFileId = postImageFile ? await uploadFile({token: user.token,file:postImageFile}) : null;

    postData.postImageFileId = postImageFileId;
    
    const createPostResponse = await postApi.create(
      postData, 
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
    );
    if (createPostResponse.error) {
      setIsLoading(false)
      console.log(createPostResponse.error);
      return
    }
    console.log(createPostResponse)
    setIsLoading(false)
  }
  return { createPost, isLoading }
}