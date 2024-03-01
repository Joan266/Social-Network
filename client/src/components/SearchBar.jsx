import { useState, useEffect, useRef } from 'react';
import { faSearch as solidLens, faTimes as faXmark,faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearch } from '../hooks/useSearch.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { readImageId } from '../utils/useReadImageId';
import styles from './SearchBar.module.scss';
import { useAuthContext } from '../hooks/useAuthContext.js';
const User = ({user,handleUserInfoClick, userToken}) => {
  const [ profilePicUrl, setProfilePicUrl ] =useState(null);
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const { profilePicFileId } = user;
        const profilePicUrl = profilePicFileId ? await readImageId({ fileId: profilePicFileId, userToken }) : null;
        console.log(profilePicUrl);
        setProfilePicUrl(profilePicUrl);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };
  
    fetchProfilePic();
  }, [user]);
  
  return (
    <div
      className={styles.userInfoContainer}
      onClick={() => handleUserInfoClick(user.username)} 
      key={user.username}
    >
      <div className={styles.profilePic}>
        <FontAwesomeIcon icon={faUser} className="rounded me-2" />
        {profilePicUrl && <img src={profilePicUrl} alt='search-profile-pic'></img>}
      </div>
      <div className={styles.userInfo}>
        <div className={styles.name}>
          <span>{user.name}</span>
        </div>
        <div className={styles.username}>
          <span>@{user.username}</span>
        </div>
      </div>
    </div>
  )
}
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
                <User user={user} handleUserInfoClick={handleUserInfoClick} userToken={authUser.token}/>
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


