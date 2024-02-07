import styles from './Home.module.scss';
import { usePostsContext } from '../hooks/usePostsContext';
import PostDetails from '../components/PostDetails';
const Home = () => {
  const {posts} = usePostsContext();
  
  return (
    <div className={styles.homeContainer}>
      <div className={styles.postsContainer}>
        {posts && posts.map((_id) => (
          <PostDetails key={_id} postId={_id} />
        ))}
      </div>
    </div>
  )
}

export default Home
