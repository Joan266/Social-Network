import { useState, useRef } from "react"
import styles from './ProfileForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faXmark, faUnlock,faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import DynamicTextarea from "./DynamicTextarea";

const PostForm = ({setIsProfileFormVisible, handlePrivacyStatus, userData}) => {
  const [ content, setContent ] = useState("");
  return (
    <div className={styles.profileFormOverlay}onClick={(e)=>e.stopPropagation()}>
      <div className={styles.profileFormContainer} >
        <div className={styles.profileForm}>
          <div className={styles.navContainer}>
            <div className={styles.xMark}>
              <FontAwesomeIcon
                  onClick={()=>setIsProfileFormVisible(false)}
                  icon={faXmark}
              />
            </div>
            <div className={styles.profileLabel}>
              Profile
            </div>
            <div className={styles.saveButton}>
              <button>Save</button>
            </div>
          </div>
          <div className={styles.banner}></div>  
          <div className={styles.picAndControls}>
            <div className={styles.profilePic}>
            <FontAwesomeIcon icon={faCameraRetro} />
            </div>
            <div className={styles.settingsContainer} >
              <div className={styles.lock} onClick={() => handlePrivacyStatus()}>
                <FontAwesomeIcon icon={userData.privacyStatus ? faLock : faUnlock} />{userData.privacyStatus ? "Private" : "Public"}
              </div>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.name}>
              <label>Name</label>
              <input type="text" maxlength="30"/>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.bio}>
              <label>Bio</label>
              <DynamicTextarea  
                type="text"
                setContent={setContent}
                maxLength="160"
                value={content}
              />
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.location}>
              <label>Location</label>
              <input type="text" maxlength="30"/>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.birthDate}>
              <label>Birth date</label>
              <input type="date" min="1900-01-01" max={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostForm