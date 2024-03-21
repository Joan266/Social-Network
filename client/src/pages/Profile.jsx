import { useState} from 'react';
import { useParams } from 'react-router-dom'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faUser, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Profile.module.scss';
import useProfileData from '../hooks/useProfileData';
import useProfileFollow from '../hooks/useProfileFollow';
import { useAuthContext } from '../hooks/useAuthContext';
import ProfilePostsList from '../components/ProfilePostsList';
import ProfileForm from '../components/ProfileForm';
// date 
import {formatDate} from '../utils/useFormatDate';

const Profile = () => {
  const { user } = useAuthContext();
  const { username } = useParams();
  const { userData, isLoading: profileDataLoading } = useProfileData(username);
  const { isUserFollowed, handleFollowToggle } = useProfileFollow({username,isLoggedInUserProfile:username === user.username});

  const [followHover, setFollowHover] = useState(false);
  const [isProfileFormVisible, setIsProfileFormVisible] = useState(false);
  
  if(profileDataLoading)return null
  return (
    <>
      {isProfileFormVisible && (
          <ProfileForm
            setIsProfileFormVisible={setIsProfileFormVisible}
            userData={userData}
          />
      )}
      <div className={styles.profileContainer}>
        <div className={styles.navContainer}>
          <div className={styles.nameLabel}>
            {userData.name}
          </div>
        </div>
        <div className={styles.userContainer}>
          <div className={styles.banner}>
            {userData.profileBannerImgUrl && <img src={userData.profileBannerImgUrl} alt="banner" />}
          </div>  
          <div className={styles.body}>
            <div className={styles.picAndControls}>
              <div className={styles.profilePic}>
                
                {userData.profilePicImgUrl ? <img src={userData.profilePicImgUrl} alt="profilepic" />:<FontAwesomeIcon icon={faUser} />}
              </div>
              <div className={styles.settingsContainer} >
                {username === user.username ? 
                  <div className={styles.edit} onClick={(e) => {e.stopPropagation(); setIsProfileFormVisible(true);}}>
                    Edit Profile
                  </div> 
                :
                  <div
                    className={`${styles.sharedFollow} ${
                      isUserFollowed && followHover ? styles.unfollow : isUserFollowed ? styles.following : styles.follow
                    }`}
                    onClick={handleFollowToggle}
                    onMouseEnter={() => {
                      setFollowHover(true);
                    }}
                    onMouseLeave={() => setFollowHover(false)}
                  >
                    {isUserFollowed ? (followHover ? "Unfollow" : "Following") : "Follow"}
                  </div>
                }
              </div>
            </div>
            <div className={styles.header}>
              <div className={styles.nameContainer}>{userData.name}</div>
              <div className={styles.usernameContainer}>@{userData.username}</div>
            </div>
            { userData.bio && 
            <div className={styles.bio}>
              {userData.bio}
            </div>}
            <div className={styles.data}>
              {userData.location && 
              <div className={styles.location}>
                <FontAwesomeIcon icon={faLocationDot} />{userData.location}
              </div>}
              {userData.birthDate && <div className={styles.birthDate}>
                <FontAwesomeIcon icon={faCalendarDays} />Born {formatDate(userData.birthDate)}
              </div>}
              <div className={styles.joinDate}>
                <FontAwesomeIcon icon={faCalendarDays} />Joined {formatDate(userData.createdAt)}
              </div>
            </div>
            <div className={styles.following}>
              <span>{userData.followingCount}</span> Following <span>{userData.followersCount}</span> Followers
            </div>
          </div>
        </div>
        <div className={styles.postLabelContainer}>
          <div className={styles.posts}>
            Posts
          </div>
        </div>
        <ProfilePostsList username={username}/>
      </div>
    </>
  );
};

export default Profile
