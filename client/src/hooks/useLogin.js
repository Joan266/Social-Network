import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { userApi } from '../services/userApi' 
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
    // update the auth context
    dispatch({type: 'LOGIN', payload:{...loginResponse} })
    
    // update loading state
    setIsLoading(false)
  }

  return { login, isLoading, error }
}