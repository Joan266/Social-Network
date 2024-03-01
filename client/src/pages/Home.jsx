import styles from './Home.module.scss';
import { useParams } from 'react-router-dom'
import PostList from '../components/PostList';
import  useHomePosts  from '../hooks/useHomePosts'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react';
import PostDetails from '../components/PostDetails';
const Home = () => {
  const { newPostId } = useParams();
  const { isLoading, isError, posts } = useHomePosts();
  const queryClient = useQueryClient()
  useEffect(()=>{
    queryClient.resetQueries({ 
      queryKey:["home_posts"],
      exact: true,
    })
  },[])

  return (
    <div className={styles.homeContainer}>
      <div className={styles.navContainer}>
        <div className={styles.homeLabel}>
          Home
        </div>
      </div>
      { newPostId && 
       <PostDetails 
          key={`${newPostId}`} 
          postId={newPostId} 
        /> 
      }

      {posts.length>0 && <PostList posts={ posts }/>}
      
      {isLoading && <strong>Cargando...</strong>}

      {isError && <p>Ha habido un error</p>}

      {!isLoading && !isError && posts.length === 0 && <p>No hay posts</p>}  
    </div>
  )
}

export default Home
