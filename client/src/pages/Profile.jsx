import { useState} from 'react';
import { useParams } from 'react-router-dom'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Profile.module.scss';
import useFetchUserData from '../hooks/useFetchProfileData';
import useFetchUserPosts from '../hooks/useFetchUserPosts';
import PostList from '../components/PostList';
import ProfileForm from '../components/ProfileForm';
// date 
import {formatDate} from '../utils/useFormatDate';

const Profile = () => {
  const { username } = useParams();
  const { userData, loading, isUserFollowed, isUserProfile, handleFollowToggle, handlePrivacyStatus } = useFetchUserData(username);
  useFetchUserPosts(username);
  const [followHover, setFollowHover] = useState(false);
  const [isProfileFormVisible, setIsProfileFormVisible] = useState(false);
  const date = formatDate(userData.createdAt);
  if(!userData || loading) return;

  return (
    <>
      {isProfileFormVisible && (
          <ProfileForm
            setIsProfileFormVisible={setIsProfileFormVisible}
            handlePrivacyStatus={handlePrivacyStatus}
            userData={userData}
          />
      )}
      <div className={styles.navContainer}>
          <div className={styles.profileLabel}>
            Profile
          </div>
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.userContainer}>
          <div className={styles.banner}>
            {userData.bannerUrl && <img src={userData.bannerUrl} alt="banner" />}
          </div>  
          <div className={styles.body}>
            <div className={styles.picAndControls}>
              <div className={styles.profilePic}>
                {userData.profilePicUrl && <img src={userData.profilePicUrl} alt="profilepic" />}
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className={styles.settingsContainer} >
                {isUserProfile ? 
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
              <div className={styles.nameContainer}>{userData.username}</div>
              <div className={styles.usernameContainer}>@{userData.username}</div>
            </div>
            <div className={styles.data}>
            <FontAwesomeIcon icon={faCalendarDays} /> {date}
            </div>
            <div className={styles.following}>
              <span>{userData.followingCount}</span> Following <span>{userData.followersCount}</span> Followers
            </div>
          </div>
        </div>
        <div className={styles.navContainer}>
          <div className={styles.posts}>
            Posts
          </div>
        </div>
        <PostList />
      </div>
    </>
  );
};

export default Profile
