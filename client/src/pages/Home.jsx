import { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import useFetchHomePosts from '../hooks/useFetchHomePosts';
import PostList from '../components/PostList';
const Home = () => {
  useFetchHomePosts();
  // Event listener for scroll events
  // Function to check if the user has scrolled to the bottom of the page

  
  return (
    <div className={styles.homeContainer}>
      <PostList/>
    </div>
  )
}

export default Home
