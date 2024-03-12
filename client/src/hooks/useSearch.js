import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';
import { useAuthContext } from './useAuthContext';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearch, setLastSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const clearSearch = () => {
    setSearchQuery('');
    setLastSearch('');
    setSearchResults([]);
    setIsLoading(false);
  };
  useEffect(() => {
    const fetchData = async (query) => {
      try {
        setLastSearch(query);
        setIsLoading(true);
        if (query.trim() === "") {
          setSearchResults([]);
          setLastSearch("");
        } else {
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          };
          const data = await userApi.searchUser({ query, userId: user._id }, headers);
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error searching for users:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (searchQuery !== lastSearch) {
      fetchData(searchQuery.trim());
    }
  }, [searchQuery, lastSearch, user]);
  
  return { searchQuery, setSearchQuery, searchResults, isLoading, clearSearch };
};
