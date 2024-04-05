import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './WhoToFollow.module.scss';
// import useWhoToFollow from '../hooks/useWhoToFollow'
import WhoToFollowSearchResult from './WhoToFollowSearchResult'

const WhoToFollow = () => {
  // const { searchQuery, whoToFollowResults, isLoading } = useWhoToFollow();
  
  return (
    <div className={styles.WhoToFollow}  >
      <div className={styles.whoToFollowResultsContainer}>
      <div className={styles.title}>Who to follow</div>
        {/* {whoToFollowResults.length > 0 && (
          <>
            {whoToFollowResults.map((user) => (
              <WhoToFollowSearchResult key={user.username} user={user} handleUserInfoClick={handleUserInfoClick} userToken={authUser.token}/>
            ))}
          </>
        )} */}
      </div>
    </div>
  );
};

export default WhoToFollow;


