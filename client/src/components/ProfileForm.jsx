import { useState, useRef } from "react"
import styles from './ProfileForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faXmark, faUnlock,faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import DynamicTextarea from "./DynamicTextarea";
import EditMedia from "./EditMedia";
const ProfileForm = ({setIsProfileFormVisible, handlePrivacyStatus, userData}) => {
  const [ content, setContent ] = useState(""); 
  const fileInputRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [editingImage,setEditingImage] = useState(false);
  const [ bannerImage, setBannerImage ] = useState(null);
  const [ userImage, setUserImage ] = useState(null);
  const [ inputImageType, setInputImageType ] = useState(null);
  const handleFileSelect = (type) => {
    setInputImageType(type)
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => { 
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(event.target.files[0])
      setEditingImage(true);
    }
  };
const endOfEdit = (editedImage) => {
  setEditingImage(false);
  if (inputImageType === "banner") {
    setBannerImage(editedImage); 
  } else if (inputImageType === "userpic") {
    setUserImage(editedImage); 
  }
};
  if(editingImage){
    return (
      <div className={styles.profileFormOverlay} onClick={(e)=>e.stopPropagation()}>
        <div className={styles.profileFormContainer} >
          <EditMedia imgSrc={imgSrc} endOfEdit={(file)=> endOfEdit(file)} inputImageType={inputImageType}/>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.profileFormOverlay} onClick={(e)=>e.stopPropagation()}>
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
          <input 
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*">
          </input>
          <div className={styles.banner}>
            {bannerImage && <img src={bannerImage} alt="banner" />}
            <div className={styles.mediaDropLink} onClick={(e) => { handleFileSelect("banner");  e.stopPropagation() }}>
              <FontAwesomeIcon icon={faCameraRetro} />
            </div>
          </div>  
          <div className={styles.picAndControls}>
            <div className={styles.profilePic}>
               {userImage && <img src={userImage} alt="userpicture" />}
              <div className={styles.mediaDropLink} onClick={(e) => { handleFileSelect("userpic");  e.stopPropagation() }}>
                <FontAwesomeIcon icon={faCameraRetro} />
              </div>
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

export default ProfileForm