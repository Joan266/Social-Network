import { Suspense, lazy, useRef } from 'react';
import styles from './PostList.module.scss';
import { usePostListObserve } from '../hooks/usePostListObserve';
// Lazy load the component containing the image
const PostDetails = lazy(() => import('../components/PostDetails'));

const PostList = ({posts, isLoading}) => {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  usePostListObserve({ topRef, bottomRef });

  return (
    <div id="post-list" className={styles.postsContainer}>
     { !isLoading && <div id='top-observer' ref={topRef}/>}

      {posts && posts.map(( post, index ) => (
        <Suspense key={post._id} fallback={""}>
          {index === 0 && <div id='newTopPageMark'/>}
          <PostDetails 
            postId={post._id} 
            username={post.user.username}
          />
        </Suspense>
      ))}
      {!isLoading && <div id='bottom-observer' ref={bottomRef} style={{minHeight:"200px",marginBottom: "30px"}}/>}
    </div>
  )
}

export default PostList;
