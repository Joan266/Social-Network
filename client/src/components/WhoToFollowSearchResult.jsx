import { useState, useEffect } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './WhoToFollow.module.scss';
import { userApi } from '../services/userApi.js';
import useProfileFollow from '../hooks/useProfileFollow'
import { useNavigate } from 'react-router-dom'; 

const WhoToFollowSearchResult = ({user, userToken}) => {
  const [ profilePicImgUrl, setProfilePicImgUrl ] =useState(null);
  const [ isLoading, setIsLoading ] =useState(true);
  const { isUserFollowed, handleFollowToggle } = useProfileFollow({username: user.username, isLoggedInUserProfile:false});
  const [followHover, setFollowHover] = useState(false);
  const navigate = useNavigate(); 

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
      onClick={() => navigate(`/${user.username}`)} 
    >
      <div className={styles.leftUserContainer}>
        <div className={styles.profilePic}>
          {profilePicImgUrl ? <img src={profilePicImgUrl}  style={{ width: 44, height: 44 }} alt='search-profile-pic'></img> : !isLoading ? <FontAwesomeIcon icon={faUser} className="rounded me-2" />: null}
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
      <div
        className={`${styles.sharedFollow} ${
          isUserFollowed && followHover ? styles.unfollow : isUserFollowed ? styles.following : styles.follow
        }`}
        onClick={(e) => { e.stopPropagation(); handleFollowToggle(); }}
        onMouseEnter={() => {
          setFollowHover(true);
        }}
        onMouseLeave={() => setFollowHover(false)}
      >
        {isUserFollowed ? (followHover ? "Unfollow" : "Following") : "Follow"}
      </div>
    </div>
  )
}

export default WhoToFollowSearchResult;
