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
        const profilePicDataResponse = await userApi.fetchUserProfilePic({username: user.username,userToken});
        if(profilePicDataResponse){
          if (profilePicImgUrl) {
            URL.revokeObjectURL(profilePicImgUrl);
          }
          const newProfilePicImgUrl = URL.createObjectURL(profilePicDataResponse);
          setProfilePicImgUrl(newProfilePicImgUrl)
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }finally{
        setIsLoading(false)
      }
    };
    if(user.profilePicFileId){
      fetchProfilePic();
    }
    // Cleanup function to revoke URLs when component unmounts
    return () => {
      if (profilePicImgUrl) {
        URL.revokeObjectURL(profilePicImgUrl);
      }
    };
  }, [user, userToken]);
  if(isLoading) return <div className={styles.userInfoContainer}/>
      
  return (
    <div
      className={styles.userInfoContainer}
      onClick={() => handleUserInfoClick(user.username)} 
      key={user.username}
    >
      <div className={styles.profilePic}>
        {profilePicImgUrl ? <img src={profilePicImgUrl} alt='search-profile-pic'></img>:<FontAwesomeIcon icon={faUser} className="rounded me-2" />}
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
