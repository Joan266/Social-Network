import { useEffect,useState,useRef } from 'react';
import { usePostsContext } from '../hooks/usePostsContext';
import PostDetails from '../components/PostDetails';
import styles from './PostList.module.scss';

const PostList = () => {
  const { posts } = usePostsContext();
  const [isVisible, setIsVisible] = useState(false);
  const postRef = useRef(null);
  useEffect(() => {
    // Store the current value of postRef.current in a variable inside the effect
    const currentPostRef = postRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // Use the viewport as the root
        threshold: 0.1, // Trigger when 50% of the component is visible
      }
    );
  
    // Start observing the PostDetails component
    if (currentPostRef) {
      observer.observe(currentPostRef);
    }
  
    // Cleanup function
    return () => {
      if (currentPostRef) {
        observer.unobserve(currentPostRef);
        setIsVisible(false); // Update isVisible to false when component is no longer observed
      }
    };
  }, [ postRef]); // Include postRef in the dependency array
  return (
    <div className={styles.postsContainer}>
      {posts && posts.map((post,index) => (
        <PostDetails key={`${post._id}${index}`} postId={post._id} />
      ))}
      <div className={styles.endMarkContainer} ref={postRef}></div>
    </div>
  )
}

export default PostList