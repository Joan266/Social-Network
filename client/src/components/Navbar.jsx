// Navbar.jsx

import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHouse as solidHouse, faEllipsis } from '@fortawesome/free-solid-svg-icons';
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
            <Link to="/"><div className={styles.svgContainer}><FontAwesomeIcon icon={solidHouse} className="rounded me-2"/></div> Home</Link>
          </div>
          <div className={styles.linkContainer}>
            <Link to="/profile"><div className={styles.svgContainer}><FontAwesomeIcon icon={faUser} className="rounded me-2"/></div>Profile</Link>
          </div>
        </nav>
        <button className={styles.postButton} onClick={()=>setIsPostFormVisible(true)}>Post</button>
        {isPostFormVisible && <PostForm setIsPostFormVisible={setIsPostFormVisible} />}
      </div>
      <div className={styles.accountMenu}>
        <div className={styles.container}>
          <div className={styles.profilePic}>
            {user.profilePicImgUrl ? <img src={user.profilePicImgUrl} alt='menu-profile-pic'></img>:<FontAwesomeIcon icon={faUser} className="rounded me-2" />}
          </div>
          <div className={styles.infoContainer}>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.username}>@{user.username}</span>
          </div>
          <div className={styles.controls} onClick={logout}><div className={styles.svgContainer}><FontAwesomeIcon icon={faEllipsis} className="rounded me-2"/></div></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
