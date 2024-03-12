import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { userApi } from '../services/userApi' 
export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async ({email, password, username}) => {
    setIsLoading(true)
    setError(null)

    const response = await userApi.signup({email, password, username});
    if (response.error) {
      setIsLoading(false)
      setError(response.message)
      return
    }

    // update the auth context
    dispatch({type: 'LOGIN', payload: response})

    // update loading state
    setIsLoading(false)
  }

  return { signup, isLoading, error }
}