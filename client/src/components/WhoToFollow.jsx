import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './WhoToFollow.module.scss';
import useWhoToFollow from '../hooks/useWhoToFollow'
import WhoToFollowSearchResult from './WhoToFollowSearchResult'
import { useAuthContext } from '../hooks/useAuthContext';

const WhoToFollow = () => {
  const { isLoading, users, isError } = useWhoToFollow();
  const { user: authUser } = useAuthContext();
  return (
    <div className={styles.WhoToFollow}  >
      <div className={styles.whoToFollowResultsContainer}>
        <div className={styles.title}>Who to follow</div>
        { users && users.length > 0 && (
          <>
            {users.map((user) => (
              <WhoToFollowSearchResult  key={user.username}  user={user} userToken={authUser.token}/>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default WhoToFollow;


