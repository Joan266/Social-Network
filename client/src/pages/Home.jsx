import styles from './Home.module.scss';
import { useParams } from 'react-router-dom';
import HomePostsList from '../components/HomePostsList';
import { useQueryClient } from '@tanstack/react-query';
import PostDetails from '../components/PostDetails';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect } from 'react';

const Home = () => {
  const { newPostId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  useEffect(()=>{
    queryClient.resetQueries({ 
      queryKey: ["home_posts"],
      exact: true,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleNavClick = (e) => {
    e.preventDefault();
    queryClient.resetQueries({ 
      queryKey: ["home_posts"],
      exact: true,
    });
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.navContainer} onClick={handleNavClick}>
        <div className={styles.homeLabel}>
          Home
        </div>
      </div>

      {newPostId && 
       <PostDetails 
          key={newPostId} 
          postId={newPostId} 
          username={user.username}
        /> 
      }
      <HomePostsList />
    </div>
  );
};

export default Home;
