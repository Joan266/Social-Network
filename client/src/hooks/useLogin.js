import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { userApi } from '../services/api' 
import { readImageId } from '../utils/useReadImageId'
export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (emailOrUsername, password) => {
    setIsLoading(true)
    setError(null)

    const loginResponse = await userApi.login({emailOrUsername, password});

    if (loginResponse.error) {
      setIsLoading(false)
      setError(loginResponse.message)
      return
    }
    console.log(loginResponse);
    const { profilePicFileId, ...rest } = loginResponse;
    const profilePicUrl = profilePicFileId ? await readImageId({ fileId: profilePicFileId, userToken:loginResponse.token}) : null;
   
    // update the auth context
    dispatch({type: 'LOGIN', payload:{profilePicUrl,...rest} })

    // update loading state
    setIsLoading(false)
  }

  return { login, isLoading, error }
}