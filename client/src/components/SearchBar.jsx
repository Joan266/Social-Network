import React, { useState, useEffect, useRef } from 'react';
import { faSearch as solidLens, faTimes as faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearch } from '../hooks/useSearch.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './SearchBar.module.scss';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, searchResults, clearSearch } = useSearch();
  const [selected, setSelected] = useState(false);
  const searchBarRef = useRef(null);
  const navigate = useNavigate(); // Create a navigate function

  const handleClick = () => {
    setSelected(true);
  };

  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setSelected(false);
    }
  };

  const handleUserInfoClick = (username) => {
    navigate(`/${username}`);
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
        <form>
          <div className={styles.searchInputContainer}>
            <FontAwesomeIcon icon={solidLens} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery !== "" && (
              <FontAwesomeIcon
                className={styles.cancelSearch}
                onClick={clearSearch}
                icon={faXmark}
              />
            )}
          </div>
        </form>
      </div>
      {selected && (
        <div className={styles.searchResultsContainer}>
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((user) => (
                <div
                  className={styles.userInfoContainer}
                  onClick={() => handleUserInfoClick(user.username)} // Change here
                  key={user.username}
                >
                  <div className={styles.profilePic}></div>
                  <span>@{user.username}</span>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.emptySearchResultsContainer}>
              Try searching for people, emails, or keywords
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;


