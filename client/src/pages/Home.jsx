import styles from './Home.module.scss';
import { usePostsContext } from '../hooks/usePostsContext';
import PostDetails from '../components/PostDetails';
import { useEffect } from 'react';
const Home = () => {
  const {posts} = usePostsContext();
  useEffect(()=>{console.log(`PostsContext: ${posts}`)},[posts])
  return (
    <div className={styles.homeContainer}>
      <div className={styles.postsContainer}>
        {posts && posts.map((post) => (
          <PostDetails key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Home
