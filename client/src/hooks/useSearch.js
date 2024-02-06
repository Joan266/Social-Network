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
      setIsLoading(true);

      try {
        setLastSearch(query);
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        };
        const data = await userApi.searchUser(query, headers);
        return data;
      } catch (error) {
        console.log("Error searching for users:", error);
        return [];
      }
    };

    const handleSearchResults = (data) => {
      setSearchResults(data);
    };

    const handleEmptyQuery = () => {
      setSearchResults([]);
      setLastSearch("");
    };

    const search = async () => {
      const query = searchQuery.trim();

      if (lastSearch === query) return;

      if (query === "") {
        handleEmptyQuery();
        return;
      }

      const data = await fetchData(query);
      if (data) {
        handleSearchResults(data);
      }
      setIsLoading(false);
    };
    search();
  }, [searchQuery, lastSearch, isLoading, searchResults, user]);
  return { searchQuery, setSearchQuery, searchResults, isLoading, clearSearch };
};
