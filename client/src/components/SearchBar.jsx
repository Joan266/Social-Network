import React, { useState, useEffect, useRef } from 'react';
import { faSearch as solidLens, faTimes as faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearch } from '../hooks/useSearch.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './SearchBar.module.scss';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, searchResults, clearSearch, isLoading } = useSearch();
  const [selected, setSelected] = useState(false);
  const searchBarRef = useRef(null);
  const navigate = useNavigate(); 

  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setSelected(false);
    }
  };

  const handleUserInfoClick = (username) => {
    clearSearch(); 
    setSelected(false); 
    navigate(`/${username}`); 
};
  useEffect(()=>{
    console.log(selected)
  },[selected])
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.searchBar}  ref={searchBarRef}>
      <div className={styles.formContainer}>
        <form>
          <div className={styles.searchInputContainer}>
            <FontAwesomeIcon icon={solidLens} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onClick={()=>setSelected(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery !== "" && selected ? (
              <FontAwesomeIcon
                className={styles.cancelSearch}
                onClick={clearSearch}
                icon={faXmark}
              />
            ): ""}
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
              {!isLoading && searchQuery === "" ? (
                <p>Try searching for people, emails, or keywords</p>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;


