import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { postApi } from '../services/api'
import { filesApi } from '../services/api'
import { usePostsContext } from './usePostsContext'
export const useCreatePost = () => {
  const { user } = useAuthContext()
  const { dispatch } = usePostsContext()
  const [isLoading, setIsLoading] = useState(false)

  const createPost = async ({content, postId, image}) => {
    setIsLoading(true);
    let postData = { postId, content, userId: user._id };
    if(image){
      const formData = new FormData();
      formData.append("file", image);
      const uploadFileResponse = await filesApi.upload(
        formData, 
        {
          'Content-Type': "multipart/form-data",
          'Authorization': `Bearer ${user.token}`,
        },
      );
      if (uploadFileResponse.error) {
        setIsLoading(false)
        console.log(uploadFileResponse.error);
        return
      }
      postData.fileId = uploadFileResponse.fileId;
    }
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