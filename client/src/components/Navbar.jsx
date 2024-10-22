// Navbar.jsx

import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHouse as solidHouse, faEllipsis, faSignsPost } from '@fortawesome/free-solid-svg-icons';
import PostForm from "../components/PostForm"
import styles from './Navbar.module.scss';
import { useWindowContext } from '../hooks/useWindowContext';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { isWindowWidthOver1275 } = useWindowContext();
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);
  const [userControlsVisible, setUserControlsVisible] = useState(false);
  const userControlsRef = useRef(null);
  const menuRef = useRef(null);
  const handleClick = (event) => {
    if (userControlsRef.current && !userControlsRef.current.contains(event.target)) {
      setUserControlsVisible(false);
    } else if (menuRef.current.contains(event.target)) {
      setUserControlsVisible(true)
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className={styles.logo}>{isWindowWidthOver1275 ? "FakeNet" : "FN"}</h1>
        </Link>
        <nav>
          <div className={styles.linkContainer}>
            <Link to="/home">
              <div className={styles.svgContainer}>
                <FontAwesomeIcon icon={solidHouse} className="rounded me-2" />
              </div>
              {isWindowWidthOver1275 && "Home"}
            </Link>
          </div>
          <div className={styles.linkContainer}>
            <Link to="/profile">
              <div className={styles.svgContainer}>
                <FontAwesomeIcon icon={faUser} className="rounded me-2" />
              </div>
              {isWindowWidthOver1275 && "Profile"}
            </Link>
          </div>
        </nav>
        <div className={styles.postButtonContainer}>
          <button className={styles.postButton} onClick={() => setIsPostFormVisible(true)}>
            {isWindowWidthOver1275 ? "Post" : <FontAwesomeIcon icon={faSignsPost} className="rounded me-2" />}
          </button>
        </div>
        {isPostFormVisible && <PostForm setIsPostFormVisible={setIsPostFormVisible} />}
      </div>
      {userControlsVisible &&
        <div className={styles.userControls} ref={userControlsRef}>
          <div
            className={styles.userControlsContainer}
            onClick={() => logout()}
          >
            <span>Log out</span>
            <span>@{user.username}</span>
          </div>
        </div>}
      <div className={styles.accountMenu} ref={menuRef}>
        <div className={`${styles.container} ${!userControlsVisible ? styles.controlsVisible : ''}`}>
          <div className={styles.leftContainer}>
            <div className={styles.profilePic}>
              {user.profilePicBase64 ? <img src={user.profilePicBase64} alt='menu-profile-pic'></img> : <FontAwesomeIcon icon={faUser} className="rounded me-2" />}
            </div>
            {isWindowWidthOver1275 &&
              <div className={styles.infoContainer}>
                <span className={styles.name}>{user.name}</span>
                <span className={styles.username}>@{user.username}</span>
              </div>
            }
          </div>
          {isWindowWidthOver1275 &&
            <div className={styles.controls}><div className={styles.svgContainer}><FontAwesomeIcon icon={faEllipsis} className="rounded me-2" /></div></div>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
