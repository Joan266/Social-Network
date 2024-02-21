import { useState, useRef, useEffect } from "react"
import styles from './ProfileForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faXmark, faUnlock,faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import DynamicTextarea from "./DynamicTextarea";
import EditMedia from "./EditMedia";
import { useUpdateProfileData } from "../hooks/useUpdateProfileData";

const ProfileForm = ({setIsProfileFormVisible,  userData}) => {

  const { updateProfileData, isLoading } = useUpdateProfileData();

  const [ inputBio, setInputBio ] = useState("");
  const [ inputName, setInputName ] = useState("");
  const [inputLocation,setInputLocation] = useState("");
  const [ inputBirthDate, setInputBirthDate ] = useState("1901-01-01");  
  const [ inputPrivacyStatus, setInputPrivacyStatus ] = useState(null);
  const [ inputBannerFile, setInputBannerFile ] = useState(null);
  const [ inputProfilePicFile, setInputProfilePicFile ] = useState(null);
  const [ inputBannerUrl, setInputBannerUrl ] = useState(null);
  const [ inputProfilePicUrl, setInputProfilePicUrl ] = useState(null);

  const fileInputRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [ inputImageType, setInputImageType ] = useState(null);
  const [ editingImage, setEditingImage] = useState(false);

  useEffect(()=>{
    const { bio, name, location, birthDate, bannerImage, profilePic, privacyStatus } = userData
    setInputBio(bio)
    setInputName(name)
    setInputLocation(location)
    setInputBirthDate(birthDate)
    setInputBannerUrl(bannerImage)
    setInputProfilePicUrl(profilePic)
    setInputPrivacyStatus(privacyStatus)
  },[userData])

  const handleSaveUserData = () => {
    const data = {
      info: {
        bio: inputBio,
        name: inputName,
        location: inputLocation,
        birthDate: inputBirthDate,
        privacyStatus: inputPrivacyStatus
      },
      profilePicFile:null,
      bannerImage:null,
    }
    if(inputProfilePicUrl !== userData.inputProfilePicUrl){
      data.profilePicFile = inputProfilePicFile;
    }
    if(inputBannerUrl !== userData.inputBannerUrl){
      data.bannerFile = inputBannerFile;
    }
    updateProfileData(data)
  }
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
const endOfEdit = ({file,imageUrl}) => {
  if (inputImageType === "banner") {
    setInputBannerUrl(imageUrl); 
    setInputBannerFile(file); 
  } else if (inputImageType === "userpic") {
    setInputProfilePicUrl(imageUrl); 
    setInputProfilePicFile(file);  
  }
  setEditingImage(false);
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
            {inputBannerUrl && <img src={inputBannerUrl} alt="banner" />}
            <div className={styles.mediaDropLink} onClick={(e) => { handleFileSelect("banner");  e.stopPropagation() }}>
              <FontAwesomeIcon icon={faCameraRetro} />
            </div>
          </div>  
          <div className={styles.picAndControls}>
            <div className={styles.profilePic}>
               {inputProfilePicUrl && <img src={inputProfilePicUrl} alt="userpicture" />}
              <div className={styles.mediaDropLink} onClick={(e) => { handleFileSelect("userpic");  e.stopPropagation() }}>
                <FontAwesomeIcon icon={faCameraRetro} />
              </div>
            </div>
            <div className={styles.settingsContainer} >
              <div className={styles.lock} onClick={() => setInputPrivacyStatus(!inputPrivacyStatus)}>
                <FontAwesomeIcon icon={inputPrivacyStatus ? faLock : faUnlock} />{inputPrivacyStatus ? "Private" : "Public"}
              </div>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.name}>
              <label>Name</label>
              <input 
                  type="text" 
                  maxLength="30" 
                  onChange={(event) => setInputName(event.target.value)} 
                  value={inputName}
              />
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.bio}>
              <label>Bio</label>
              <DynamicTextarea  
                type="text"
                setContent={setInputBio}
                maxLength="160"
                value={inputBio}
              />
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.location}>
              <label>Location</label>
              <input 
                  type="text" 
                  maxLength="30" 
                  onChange={(event) => setInputLocation(event.target.value)} 
                  value={inputLocation}
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
                onChange={(event) => setInputBirthDate(event.target.value)} 
                value={inputBirthDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileForm