import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom'
import { ApiRouter } from '../services/api';
import { useAuthContext } from '../hooks/useAuthContext';
import styles from './Profile.module.scss';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuthContext();
  const [ userData, setUserData ] = useState({});
  const [ loading, setLoading ] = useState(false);

  useEffect(()=>{
    const fetchUserData = async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      };
      const response = await ApiRouter.getUser(username, headers);
      if (response.error) {
        return
      }
      setUserData(response);
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
            <div className={styles.profilePic}></div>
            <button>Edit profile</button>
          </div>
          <div className={styles.header}>
            <div className={styles.nameContainer}>Joan Alemany</div>
            <div className={styles.usernameContainer}>@joan12145</div>
          </div>
          <div className={styles.bio}>
            Hola me llamo Joan, soy de España y soy programador web.
          </div>
          <div className={styles.data}>
            Born August 29Joined January 2017
          </div>
          <div className={styles.following}>
            <span>123</span> Following <span>5.4</span> Followers
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
