import { useState, useEffect } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './SearchBar.module.scss';
import { userApi } from '../services/userApi.js';

const UserSearchResult = ({user,handleUserInfoClick, userToken}) => {
  const [ profilePicImgUrl, setProfilePicImgUrl ] =useState(null);
  const [ isLoading, setIsLoading ] =useState(true);
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        setIsLoading(true)
        const profilePicBase64 = await userApi.fetchUserProfilePic(user.username,{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        });
        setProfilePicImgUrl(profilePicBase64)
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }finally{
        setIsLoading(false)
      }
    }; 
    if(user.profilePicFileId){
      fetchProfilePic();
    }
  }, [user, userToken]);
  return (
    <div
      className={styles.userInfoContainer}
      onClick={() => handleUserInfoClick(user.username)} 
      key={user.username}
    >
      <div className={styles.profilePic}>
        {profilePicImgUrl ? <img src={profilePicImgUrl} alt='search-profile-pic'></img> : !isLoading ? <FontAwesomeIcon icon={faUser} className="rounded me-2" />: null}
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

export default UserSearchResult;
