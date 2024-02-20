import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { postApi } from '../services/api'
import { usePostsContext } from './usePostsContext'
import { uploadFile } from '../utils/useUploadFile';

export const useCreatePost = () => {
  const { user } = useAuthContext()
  const { dispatch } = usePostsContext()
  const [isLoading, setIsLoading] = useState(false)

  const createPost = async ({content, postId, image}) => {
    setIsLoading(true);
    let postData = { postId, content, userId: user._id };
    
    const postImageFileId = image ? await uploadFile({token: user.token,file:image}) : null;

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
    dispatch({type: 'ADD_POST', payload: createPostResponse})
  }
  return { createPost, isLoading }
}