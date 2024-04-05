import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './WhoToFollow.module.scss';
import useWhoToFollow from '../hooks/useWhoToFollow'
import WhoToFollowSearchResult from './WhoToFollowSearchResult'

const WhoToFollow = () => {
  const { isLoading, users, isError } = useWhoToFollow();
  
  return (
    <div className={styles.WhoToFollow}  >
      <div className={styles.whoToFollowResultsContainer}>
      <div className={styles.title}>Who to follow</div>
        {/* {users.length > 0 && (
          <>
            {users.map((user) => (
              <WhoToFollowSearchResult key={user.username} user={user} handleUserInfoClick={handleUserInfoClick} userToken={authUser.token}/>
            ))}
          </>
        )} */}
      </div>
    </div>
  );
};

export default WhoToFollow;


