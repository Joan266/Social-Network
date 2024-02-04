// Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as solidUser, faMagnifyingGlass as solidLens, faHouse as solidHouse, faBell as solidBell } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  console.log(user.username);
  const handleClick = () => {
    logout();
  };

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
            <Link to="/home"><FontAwesomeIcon icon={solidHouse} className="rounded me-2"/> Home</Link>
          </div>
          <div className={styles.linkContainer}>
            <Link to="/explore"><FontAwesomeIcon icon={solidLens} className="rounded me-2"/>Explore</Link>
          </div>
          <div className={styles.linkContainer}>
            <Link to="/notifications"><FontAwesomeIcon icon={solidBell} className="rounded me-2"/>Notifications</Link>
          </div>
          <div className={styles.linkContainer}>
            <Link to="/profile"><FontAwesomeIcon icon={solidUser} className="rounded me-2"/>Profile</Link>
          </div>
        </nav>
        <button className={styles.postButton}>Post</button>
      </div>
      <div className={styles.accountMenu}>
        <div className={styles.container}>
          <div className={styles.profilePic}></div>
          <span>@{user.username}</span>
          <div className={styles.logout} onClick={handleClick}>Log out</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
