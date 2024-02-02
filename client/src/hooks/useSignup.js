import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { ApiRouter } from '../services/api' 
export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await ApiRouter.signup({email, password});
    if (response.error) {
      setIsLoading(false)
      setError(response.message)
      return
    }
    // save the user to local storage
    localStorage.setItem('user', response)

    // update the auth context
    dispatch({type: 'LOGIN', payload: response})

    // update loading state
    setIsLoading(false)
  }

  return { signup, isLoading, error }
}