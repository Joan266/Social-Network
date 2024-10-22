import { Suspense, lazy, useRef } from 'react';
import styles from './PostList.module.scss';
import { usePostListObserve } from '../hooks/usePostListObserve';
import useHomePosts from '../hooks/useHomePosts';
import { LoaderComponent } from '../components/Loader';

const PostDetails = lazy(() => import('./PostDetails'));

const HomePostsList = () => {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const { isFetchingNextPage, isLoading, isError, posts } = useHomePosts();
  usePostListObserve({ topRef, bottomRef });

  return (
    <>
      {(isLoading || isFetchingNextPage) && (
        <LoaderComponent />
      )}
      {posts.length > 0 && (
        <div id="post-list" className={styles.postsContainer}>
          {posts.map((post) => (
            <Suspense key={post._id} fallback={null}>
              <PostDetails postId={post._id} username={post.user.username} />
            </Suspense>
          ))}



          <div
            id="bottom-observer"
            ref={bottomRef}
            style={{ minHeight: '200px', marginBottom: '30px' }}
          />
        </div>
      )}

      {isError && <p>Ha habido un error</p>}

      {!isLoading && !isFetchingNextPage && !isError && posts.length === 0 && <p>No hay posts</p>}
    </>
  );
};

export default HomePostsList;
