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

  const handleClick = () => {
    logout();
  };

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Link to="/">
          <div className={styles.logo}><h1>Social network</h1></div>
        </Link>
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
        <div className={styles.profilePic}></div>
        <div>
          <span>@{user.username}</span>
          <button onClick={handleClick}>Log out</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
