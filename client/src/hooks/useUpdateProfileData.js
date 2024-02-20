import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { postApi } from '../services/api'
import { filesApi } from '../services/api'
export const useUpdateProfileData = () => {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  const updateProfileData = async (data) => {
    setIsLoading(true);
    setIsLoading(false)
  }
  return { updateProfileData, isLoading }
}