import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { ApiRouter } from '../services/api' 

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (emailOrUsername, password) => {
    setIsLoading(true)
    setError(null)

    const response = await ApiRouter.login({emailOrUsername, password});

    if (response.error) {
      setIsLoading(false)
      setError(response.message)
      return
    }
    console.log(response);
    // save the user to local storage
    localStorage.setItem('user', JSON.stringify(response))

    // update the auth context
    dispatch({type: 'LOGIN', payload: response})

    // update loading state
    setIsLoading(false)
  }

  return { login, isLoading, error }
}