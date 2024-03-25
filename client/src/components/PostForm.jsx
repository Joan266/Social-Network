import { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom'; 
import { useCreatePost } from "../hooks/useCreatePost"
import styles from './PostForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { timeSince } from "../utils/useTimeSinceString";
import DynamicTextarea from "./DynamicTextarea";
import EditMedia from "./EditMedia";
import { useAuthContext } from "../hooks/useAuthContext";

const PostTargeted = ({postData}) => {
  return (
    <div className={styles.container}>
      <div className={styles.profilePicContainer}>
        <div className={styles.profilePic}>
          {postData.profilePicImgUrl ? <img src={postData.profilePicImgUrl} alt='post-profile-pic'></img>:
          <FontAwesomeIcon icon={faUser} className="rounded me-2" />}
        </div>
      </div>
      <div className={styles.postInfo}>
        <div className={styles.userInfo}>
          <div className={styles.name}>
          {postData.username}
          </div>
          <div className={styles.username}>
          @{postData.username}
          </div>
          <div className={styles.dote}>
            ·
          </div>
          <div className={styles.date}>
            {timeSince(postData.createdAt)}
          </div>
        </div>
        {postData.content && <div className={styles.content}>
          {postData.content}
        </div>}
        {postData.postImageUrl && (
          <div className={styles.imageContainer}>
            <img src={postData.postImageUrl} alt="postcomment"/>
          </div>
        )}
      </div>
    </div>
  )
}



const PostForm = ({setIsPostFormVisible, postFormCommentData }) => {
  const {user} = useAuthContext();
  const { createPost, isLoading } = useCreatePost();
  const [content, setContent] = useState('')
  const [ imgSrc, setImgSrc ] = useState(null);
  const [ editingImage, setEditingImage ] = useState(false);
  const [ postImageUrl, setPostImageUrl ] = useState(null);
  const [ postImageFile, setPostImageFile ] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate()
  const handleFileSelect = (event) => {
    event.stopPropagation();
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
    setPostImageUrl(imageUrl)
    setPostImageFile(file)
    setEditingImage(false);
  };
  const removeImage = () => {
    // Remove file selected
    setPostImageUrl(null)
    setPostImageFile(null)
  }


  const handlePostSubmit = async () => {
    if(isLoading || (content.trim() === "" && !postImageFile))return;
    console.log(postFormCommentData)
    const newPostResponse = await createPost({
      content,
      postId: postFormCommentData ?  postFormCommentData._id:false,
      postImageFile,
    })
    setContent("")
    const navigateString = `/home/${newPostResponse._id}`;
    navigate(navigateString); 
    setIsPostFormVisible(false)
  }
  if(editingImage){
    return (
      <div className={styles.postFormOverlay} onClick={(e)=>e.stopPropagation()}>
        <div className={styles.postFormContainer}>
          <div className={styles.postForm}>
            <EditMedia imgSrc={imgSrc} endOfEdit={(file)=> endOfEdit(file)} inputImageType={"postimage"}/>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.postFormOverlay}onClick={(e)=>e.stopPropagation()}>
      <div className={styles.postFormContainer}>
        <div className={styles.postForm} >
          <div className={styles.navContainer}>
            <div className={styles.xMark} onClick={()=>setIsPostFormVisible(false)}>
              <FontAwesomeIcon
                className={styles.cancelSearch}
                icon={faXmark}
              />
            </div>
          </div>
          <div className={styles.body}>
            {postFormCommentData && <PostTargeted postData={postFormCommentData}/>}
            <div className={styles.container}>
              <div className={styles.profilePicContainer}>
                <div className={styles.profilePic}>
                  {user.profilePicBase64 ? <img src={user.profilePicBase64} alt='menu-profile-pic'></img>:<FontAwesomeIcon icon={faUser} className="rounded me-2" />}
                </div>
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.textareaContainer}>
                  <DynamicTextarea  
                    type="text"
                    setContent={setContent}
                    maxLength="200"
                    value={content}
                    placeholder={postFormCommentData ? "Add another post" : "What is happening?!"}
                  />
                </div>
                {postImageUrl && (
                  <div className={styles.postImageContainer}>
                    <div className={styles.postImage}>
                      <div className={styles.removePostImage} 
                          onClick={()=>removeImage()}>
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="rounded me-2"
                        />
                      </div>
                      <img
                        src={postImageUrl}
                        alt={"postimage"}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.controls}>
            <input 
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*">
            </input>
            <div className={styles.mediaDropLink} onClick={handleFileSelect}>
              <FontAwesomeIcon icon={faPhotoFilm} className="rounded me-2"/>
            </div>
            <div className={styles.postButtonContainer}>
              <button disabled={content.trim() === "" && !postImageFile} onClick={handlePostSubmit}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostForm