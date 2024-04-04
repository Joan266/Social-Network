import { useState, useEffect, useRef } from 'react';
import { faSearch as solidLens, faTimes as faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearch } from '../hooks/useSearch.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './SearchBar.module.scss';
import { useAuthContext } from '../hooks/useAuthContext.js';
import UserSearchResult from './UserSearchResult.jsx';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, searchResults, clearSearch, isLoading } = useSearch();
  const [selected, setSelected] = useState(false);
  const searchBarRef = useRef(null);
  const navigate = useNavigate(); 
  const { user: authUser } = useAuthContext();

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
              <div className={styles.xMark}>
                <FontAwesomeIcon
                onClick={clearSearch}
                icon={faXmark}
                />
              </div>
            ): ""}
          </div>
        </form>
      </div>
      {selected && (
        <div className={styles.searchResultsContainer}>
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((user) => (
                <UserSearchResult key={user.username} user={user} handleUserInfoClick={handleUserInfoClick} userToken={authUser.token}/>
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


