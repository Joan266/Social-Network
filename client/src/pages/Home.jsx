import styles from './Home.module.scss';
import useFetchHomePosts from '../hooks/useFetchHomePosts';
import PostList from '../components/PostList';
import { usePostsContext } from '../hooks/usePostsContext';
const Home = () => {
  const { homePosts }= usePostsContext;
  useFetchHomePosts();
  // Event listener for scroll events
  // Function to check if the user has scrolled to the bottom of the page

  
  return (
    <div className={styles.homeContainer}>
      <PostList posts={homePosts}/>
    </div>
  )
}

export default Home
