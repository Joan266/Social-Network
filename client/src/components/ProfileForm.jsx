import { useState, useRef, useEffect } from "react"
import styles from './ProfileForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faXmark, faUnlock,faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import DynamicTextarea from "./DynamicTextarea";
import EditMedia from "./EditMedia";
import { useUpdateProfileData } from "../hooks/useUpdateProfileData";

const ProfileForm = ({ setIsProfileFormVisible, userData }) => {
  const { updateProfileData, isLoading } = useUpdateProfileData();
  const [inputData, setInputData] = useState({
    bio: '',
    name: '',
    location: '',
    birthDate: '1901-01-01',
    privacyStatus: null,
    bannerFile: null,
    profilePicFile: null,
    bannerFileId: null,
    profilePicFileId: null,
  });
  
  const fileInputRef = useRef(null);
  const [ imgSrc, setImgSrc ] = useState(null);
  const [ bannerUrl , setBannerUrl ]= useState(null);
  const [ profilePicUrl , setProfilePicUrl ]= useState(null);
  const [ inputImageType, setInputImageType ] = useState(null);
  const [ editingImage, setEditingImage ] = useState(false);

  
  useEffect(() => {
    if(userData.profilePicUrl){
      setProfilePicUrl(userData.profilePicUrl)
    }
    if(userData.bannerUrl){
      setBannerUrl(userData.bannerUrl)
    }
    // Filter out undefined or null values from the userData object
    const filteredUserData = Object.fromEntries(
      Object.entries(userData).filter(([key, value]) => value !== undefined && value !== null)
    );
  
    // Convert birthDate to ISO string format if it exists
    if (filteredUserData.birthDate) {
      const date = new Date(filteredUserData.birthDate);
      filteredUserData.birthDate = date.toISOString().split('T')[0];
    }
  
    // Update state with filteredUserData
    setInputData((prevInputData) => (filteredUserData));
  }, [userData]);
  

  const handleSaveUserData = () => {
    const data = { inputData };
    if (profilePicUrl !== userData.profilePicUrl) {
      data.profilePicFile = inputData.profilePicFile;
      data.profilePicFileId = userData.profilePicFileId;
    }
    if (bannerUrl !== userData.bannerUrl) {
      data.bannerFile = inputData.bannerFile;
      data.bannerFileId = userData.bannerFileId;
    }
    updateProfileData(data);
  };

  const handleFileSelect = (type) => {
    setInputImageType(type);
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(event.target.files[0]);
      setEditingImage(true);
    }
  };

  const endOfEdit = (data) => {
    if (!data) {
      setEditingImage(false);
      return;
    }
    const { file, imageUrl } = data
    if(inputImageType==="banner"){
      setBannerUrl(imageUrl)
      setInputData({...inputData, bannerFile: file})
    } else if (inputImageType==="profilepic"){
      setProfilePicUrl(imageUrl)
      setInputData({...inputData, profilePicFile: file})
    }
    setEditingImage(false)
  };

  if(isLoading){
    return (
    <div className={styles.profileFormOverlay} onClick={(e)=>e.stopPropagation()}>
      <div className={styles.profileFormContainer} >
        Loading
      </div>
    </div>
  )

  }
  if(editingImage){
    return (
      <div className={styles.profileFormOverlay} onClick={(e)=>e.stopPropagation()}>
        <div className={styles.profileFormContainer} >
          <div className={styles.profileForm}>
           <EditMedia imgSrc={imgSrc} endOfEdit={(file)=> endOfEdit(file)} inputImageType={inputImageType}/>
          </div>
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
              <button onClick={handleSaveUserData}>Save</button>
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
            {bannerUrl && <img src={bannerUrl} alt="banner" />}
            <div className={styles.imgOverlay}></div>
            <div className={styles.mediaDropLink} onClick={(e) => { handleFileSelect("banner");  e.stopPropagation() }}>
              <FontAwesomeIcon icon={faCameraRetro} />
            </div>
          </div>  
          <div className={styles.picAndControls}>
            <div className={styles.profilePic}>
              {profilePicUrl && <img src={profilePicUrl} alt="userpicture" />}
              <div className={styles.imgOverlay}></div>
              <div className={styles.mediaDropLink} onClick={(e) => { handleFileSelect("profilepic");  e.stopPropagation() }}>
                <FontAwesomeIcon icon={faCameraRetro} />
              </div>
            </div>
            <div className={styles.settingsContainer} >
            <div className={styles.lock} onClick={() => setInputData(prevData => ({
              ...prevData,
              privacyStatus: !prevData.privacyStatus,
            }))}>
              <FontAwesomeIcon icon={inputData.privacyStatus ? faLock : faUnlock} />
              {inputData.privacyStatus ? "Private" : "Public"}
            </div>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.name}>
              <label>Name</label>
              <input 
                type="text" 
                maxLength="30" 
                onChange={(event) => setInputData(prevData => ({
                  ...prevData,
                  name: event.target.value
                }))} 
                value={inputData.name}
              />
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.bio}>
              <label>Bio</label>
              <DynamicTextarea  
                type="text"
                setContent={(event) => setInputData(prevData => ({
                  ...prevData,
                  bio: event
                }))}
                maxLength="160"
                value={inputData.bio}
              />
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.location}>
              <label>Location</label>
              <input 
                  type="text" 
                  maxLength="30" 
                  onChange={(event) => setInputData(prevData => ({
                    ...prevData,
                    location: event.target.value
                  }))} 
                  value={inputData.location}
              />
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.birthDate}>
              <label>Birth date</label>
              <input 
                type="date" 
                min="1900-01-01" 
                max={new Date().toISOString().split('T')[0]} 
                onChange={(event) => setInputData(prevData => ({
                  ...prevData,
                  birthDate: event.target.value
                }))} 
                value={inputData.birthDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileForm