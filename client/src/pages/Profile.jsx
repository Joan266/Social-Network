import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom'
import { ApiRouter } from '../services/api';
import { useAuthContext } from '../hooks/useAuthContext';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faLock, faUnlock,faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Profile.module.scss';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuthContext();
  const [ lock, setLock ] = useState(false);
  const [ follow, setFollow ] = useState(false);
  const [followHover, setFollowHover] = useState(false);
  const [ followersCount , setFollowersCount ] = useState(0);
  const [ followingCount , setFollowingCount ] = useState(0);
  const [ isUserProfile, setIsUserProfile ] = useState(null);
  const [ userData, setUserData ] = useState({});
  const [ loading, setLoading ] = useState(false);
  
  const handleFollowClick = async() => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
    let response;
    if(!follow){
      response = await ApiRouter.followUser({followerId:user._id, followedUsername: username}, headers);
    }else{
      response = await ApiRouter.unfollowUser({followerId:user._id, followedUsername: username}, headers);
    }
    if(response.error) {
      console.log(response.error)
      return
    }
    if(!follow){
      setFollowersCount(followersCount + 1);
    }else {
      setFollowersCount(followersCount - 1);
    }
   setFollow(!follow);
  };
  const handlePrivacyStatus = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
    const response = await ApiRouter.updatePrivacyStatus({privacyStatus: !lock, username}, headers);
    if(response.error) {
      console.log(response.error)
      return
    }
    setLock(!lock);
  }
  useEffect(()=>{
    if(username === user.username){
      setIsUserProfile(true);
      return
    }
    setIsUserProfile(false);
  },[user,username])
  useEffect(()=>{
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
    const fetchUserData = async () => {
      const response = await ApiRouter.getUser(username, headers);
      if (response.error) {
        return
      }
      setLock(response.privacyStatus);
      setUserData(response);
      setFollowersCount(response.followersCount);
      setFollowingCount(response.followingCount);
      console.log(response);
    };
    setLoading(true);
    fetchUserData();
    setLoading(false);
  },[username, user]);

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
                  <FontAwesomeIcon icon={lock ? faLock : faUnlock} />{lock ? "Private" : "Public"}
                </div>:
                <div className={`${styles.sharedFollow} ${follow && followHover ? styles.unfollow : follow ? styles.following : styles.follow}`} onClick={()=>handleFollowClick()} onMouseEnter={() => {follow && setFollowHover(true)}}
                onMouseLeave={() => setFollowHover(false)}>
                  {follow ? (followHover ? "Unfollow" : "Following") : "Follow"}
                </div>
              }
            </div>
          </div>
          <div className={styles.header}>
            <div className={styles.nameContainer}>{username}</div>
            <div className={styles.usernameContainer}>@{username}</div>
          </div>
          {/* <div className={styles.bio}>
            Hola me llamo Joan, soy de España y soy programador web.
          </div> */}
          <div className={styles.data}>
           <FontAwesomeIcon icon={faCalendarDays} /> Joined January 2017
          </div>
          <div className={styles.following}>
            <span>{followingCount}</span> Following <span>{followersCount}</span> Followers
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
