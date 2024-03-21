import { Suspense, lazy, useRef } from 'react';
import styles from './PostList.module.scss';
import { usePostListObserve } from '../hooks/usePostListObserve';
import useHomePosts from '../hooks/useHomePosts';
// Lazy load the component containing the image
const PostDetails = lazy(() => import('./PostDetails'));

const HomePostsList = () => {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const { isLoading, isError, posts } = useHomePosts();
  usePostListObserve({ topRef, bottomRef });
  return (
    <>
      {posts.length > 0 && 
        <div id="post-list" className={styles.postsContainer}>
          {!isLoading && <div id='top-observer' ref={topRef}/>}
          
          {posts.map(( post, index ) => (
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
      }
      
      {isLoading && <p>Cargando...</p>}

      {isError && <p>Ha habido un error</p>}

      {!isLoading && !isError && posts.length === 0 && <p>No hay posts</p>}  
    </>
  )
}

export default HomePostsList;
