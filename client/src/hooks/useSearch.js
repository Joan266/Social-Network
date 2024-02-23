import { useState, useEffect } from 'react';
import { userApi } from '../services/api';
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
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        };
        const data = await userApi.searchUser({query, userId: user._id}, headers);
        setSearchResults(data);
      } catch (error) {
        console.log("Error searching for users:", error);
      }
    };
    const handleEmptyQuery = () => {
      setSearchResults([]);
      setLastSearch("");
      setIsLoading(false);
    };

    setIsLoading(true);
    const query = searchQuery.trim();

    if (lastSearch === query) return;

    if (query === "") {
      handleEmptyQuery();
      return;
    }
    fetchData(query); 
    setIsLoading(false);
  }, [searchQuery, lastSearch, isLoading, searchResults, user]);
  return { searchQuery, setSearchQuery, searchResults, isLoading, clearSearch };
};
