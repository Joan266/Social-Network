import { useState} from 'react';
import { useParams } from 'react-router-dom'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faLock, faUnlock,faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Profile.module.scss';
import useFetchUserData from '../hooks/useFetchProfileData';

const Profile = () => {
  const { username } = useParams();
  const { userData, loading, isUserFollowed, isUserProfile, handleFollowToggle, handlePrivacyStatus } = useFetchUserData(username);
  const [followHover, setFollowHover] = useState(false);

  if(!userData || loading) return;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.userContainer}>
        <div className={styles.banner}></div>  
        <div className={styles.body}>
          <div className={styles.picAndControls}>
            <div className={styles.profilePic}>
             <FontAwesomeIcon icon={faUser} />
            </div>
            <div className={styles.settingsContainer} >
              {isUserProfile ? 
                <div className={styles.lock} onClick={() => handlePrivacyStatus()}>
                  <FontAwesomeIcon icon={userData.privacyStatus ? faLock : faUnlock} />{userData.privacyStatus ? "Private" : "Public"}
                </div>:
                <div className={`${styles.sharedFollow} ${isUserFollowed && followHover ? styles.unfollow : isUserFollowed ? styles.following : styles.follow}`} onClick={()=>handleFollowToggle()} onMouseEnter={() => {isUserFollowed && setFollowHover(true)}}
                onMouseLeave={() => setFollowHover(false)}>
                  {isUserFollowed ? (followHover ? "Unfollow" : "Following") : "Follow"}
                </div>
              }
            </div>
          </div>
          <div className={styles.header}>
            <div className={styles.nameContainer}>{userData.username}</div>
            <div className={styles.usernameContainer}>@{userData.username}</div>
          </div>
          {/* <div className={styles.bio}>
            Hola me llamo Joan, soy de España y soy programador web.
          </div> */}
          <div className={styles.data}>
           <FontAwesomeIcon icon={faCalendarDays} /> {userData.createdAt}
          </div>
          <div className={styles.following}>
            <span>{userData.followingCount}</span> Following <span>{userData.followersCount}</span> Followers
          </div>
        </div>
      </div>
      <div className={styles.nav}></div>
      <div className={styles.sectionContainer}>

      </div>
    </div>
  );
};

export default Profile
