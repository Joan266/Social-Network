import { Suspense, lazy } from 'react';
import styles from './PostList.module.scss';
import usePostReplies from '../hooks/usePostReplies';
// Lazy load the component containing the image
const PostDetails = lazy(() => import('./PostDetails'));

const PostRepliesList = ({postId}) => {
  const { isLoading, isError, posts } = usePostReplies(postId);
  return (
    <>
      {posts && posts.length > 0 && 
        <div id="post-list" className={styles.postsContainer}>
          
          {posts.map(( post ) => (
            <Suspense key={post._id} fallback={""}>
              <PostDetails 
                postId={post._id} 
                username={post.user.username}
                page='post'
              />
            </Suspense>
          ))}
          <div style={{minHeight:"200px",marginBottom: "30px"}}/>
       </div>
      }
      
      {isLoading && <p>Cargando...</p>}

      {isError && <p>Ha habido un error</p>}

      {posts && !isLoading && !isError && posts.length === 0 && <p>No hay posts</p>}  
    </>
  )
}

export default PostRepliesList;
