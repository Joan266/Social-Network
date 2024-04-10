// Navbar.jsx

import { useState,useRef,useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHouse as solidHouse, faEllipsis, faSignsPost } from '@fortawesome/free-solid-svg-icons';
import PostForm from "../components/PostForm"
import styles from './Navbar.module.scss';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [isPostFormVisible, setIsPostFormVisible]=useState(false);
  const [isScreenSizeComputer, setIsScreenSizeComputer]=useState(null);
  const [userControlsVisible, setUserControlsVisible] = useState(false);
  const userControlsRef = useRef(null);
  const menuRef = useRef(null);
  const handleClick = (event) => {
    if (userControlsRef.current && !userControlsRef.current.contains(event.target)) {
      setUserControlsVisible(false);
    }else if (menuRef.current.contains(event.target)){
      setUserControlsVisible(true)
    }
  };

  const handleResize = () => {
    if (window.innerWidth <= 1275) {
      setIsScreenSizeComputer(false);
    }else{
      setIsScreenSizeComputer(true);
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 1275) {
      setIsScreenSizeComputer(false);
    }else{
      setIsScreenSizeComputer(true);
    }
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <nav>
          {/* <div className={styles.linkContainer}>
            <div className={styles.svgContainer}><FontAwesomeIcon icon={ faFish} /></div> 
          </div> */}
          <div className={styles.linkContainer}>
            <Link to="/">
              <div className={styles.svgContainer}>
                <FontAwesomeIcon icon={solidHouse} className="rounded me-2"/>
              </div>
              {isScreenSizeComputer && "Home"}
            </Link>
          </div>
          <div className={styles.linkContainer}>
            <Link to="/profile">
              <div className={styles.svgContainer}>
                <FontAwesomeIcon icon={faUser} className="rounded me-2"/>
              </div>
              {isScreenSizeComputer && "Profile"}
            </Link>
          </div>
        </nav>
        <div className={styles.postButtonContainer}>
          <button className={styles.postButton} onClick={()=>setIsPostFormVisible(true)}>
            {window.innerWidth <= 1275 ? <FontAwesomeIcon icon={faSignsPost} className="rounded me-2" />:"Post"}
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
              {user.profilePicBase64 ? <img src={user.profilePicBase64} alt='menu-profile-pic'></img>:<FontAwesomeIcon icon={faUser} className="rounded me-2" />}
            </div>
          {isScreenSizeComputer &&  
            <div className={styles.infoContainer}>
              <span className={styles.name}>{user.name}</span>
              <span className={styles.username}>@{user.username}</span> 
            </div>
          }
          </div>
        {isScreenSizeComputer &&
          <div className={styles.controls}><div className={styles.svgContainer}><FontAwesomeIcon icon={faEllipsis} className="rounded me-2"/></div></div>
        }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
