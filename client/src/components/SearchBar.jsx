import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { faSearch as solidLens } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './SearchBar.module.scss';

const SearchBar = () => {
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(false);
  const [searchResults, setSearchResults] = useState(['Result 1', 'Result 2', 'Result 3']);
  const searchBarRef = useRef(null);

  const handleSearch = () => {
    const dummyResults = ['Result A', 'Result B', 'Result C'];
    setSearchResults(dummyResults);
  };

  const handleClick = () => {
    setSelected(true);
  };

  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setSelected(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.searchBar} onClick={handleClick} ref={searchBarRef}>
      <div className={styles.formContainer}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div className={styles.searchInputContainer}>
            <FontAwesomeIcon icon={solidLens} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      {searchResults.length > 0 && selected && (
        <div className={styles.searchResultsContainer}>
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
