import styles from './Home.module.scss';
import { usePostsContext } from '../hooks/usePostsContext';
import PostDetails from '../components/PostDetails';
import useFetchHomePosts from '../hooks/useFetchHomePosts';
const Home = () => {
  const { posts } = usePostsContext();
  useFetchHomePosts();
  
  return (
    <div className={styles.homeContainer}>
      <div className={styles.postsContainer}>
        {posts && posts.map((_id,index) => (
          <PostDetails key={`${_id}${index}`} postId={_id} />
        ))}
      </div>
    </div>
  )
}

export default Home
