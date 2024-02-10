import styles from './Home.module.scss';
import useFetchHomePosts from '../hooks/useFetchHomePosts';
import PostList from '../components/PostList';
const Home = () => {
  useFetchHomePosts();
  
  return (
    <div className={styles.homeContainer}>
      <div className={styles.navContainer}>
        <div className={styles.homeLabel}>
          Home
        </div>
      </div>
      <PostList />
    </div>
  )
}

export default Home
