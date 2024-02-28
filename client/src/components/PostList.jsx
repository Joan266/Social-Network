import { Suspense, lazy } from 'react';
import styles from './PostList.module.scss';

// Lazy load the component containing the image
const PostDetails = lazy(() => import('../components/PostDetails'));

const PostList = ({posts}) => {
  return (
    <div className={styles.postsContainer}>
      {posts && posts.map((post,index) => (
        <Suspense fallback={""}>
          <PostDetails 
            key={`${post._id}${index}`} 
            postId={post._id} 
            isPostObserve={posts.length >= 5 && posts.length === index + 1 ? true : false}
            />
        </Suspense>
      ))}
    </div>
  )
}

export default PostList