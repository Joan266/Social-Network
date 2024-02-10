// Navbar.jsx

import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as solidUser, faMagnifyingGlass as solidLens, faHouse as solidHouse, faBell as solidBell } from '@fortawesome/free-solid-svg-icons';
import PostForm from "../components/PostForm"
import styles from './Navbar.module.scss';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [isPostFormVisible, setIsPostFormVisible]=useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <div className={styles.logo}>
          <Link to="/">
            {/* <h1>Social network</h1> */}
          </Link>
        </div>
        <nav>
          <div className={styles.linkContainer}>
            <Link to="/"><FontAwesomeIcon icon={solidHouse} className="rounded me-2"/> Home</Link>
          </div>
          <div className={styles.linkContainer}>
            <Link to="/profile"><FontAwesomeIcon icon={solidUser} className="rounded me-2"/>Profile</Link>
          </div>
        </nav>
        <button className={styles.postButton} onClick={()=>setIsPostFormVisible(true)}>Post</button>
        {isPostFormVisible && <PostForm setIsPostFormVisible={setIsPostFormVisible} postIsCommentData={false} />}
      </div>
      <div className={styles.accountMenu}>
        <div className={styles.container}>
          <div className={styles.profilePic}>
            <FontAwesomeIcon icon={solidUser} className="rounded me-2"/>
          </div>
          <span>@{user.username}</span>
          <div className={styles.logout} onClick={logout}>Log out</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
