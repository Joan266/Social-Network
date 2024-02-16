import { useState, useRef } from "react"
import { useCreatePost } from "../hooks/useCreatePost"
import styles from './PostForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { timeSince } from "../utils/useTimeSinceString";
import { useNavigate } from 'react-router-dom'; 
// import { convertToBase64 } from '../utils/useConvertToBase64';

const FileContainer = ({file, removeImage}) => {
  return (
    <div className={styles.file}>
      <div className={styles.removeFile} 
          onClick={()=>removeImage()}>
        <FontAwesomeIcon
          icon={faXmark}
          className="rounded me-2"
        />
      </div>
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
      />
    </div>
  );
}

const DynamicTextarea = ({setContent,...rest}) => {
  function textAreaAdjust(event) {
    const element = event.target;
    setContent(element.value)
    element.style.height = "auto";
    element.style.height = (25 + element.scrollHeight) + "px";
  }

  return (
    <textarea
      onChange={textAreaAdjust}
      {...rest}
    />
  );
}

const PostTargeted = ({postData}) => {
  return (
    <div className={styles.container}>
    <div className={styles.profilePic}>
      <FontAwesomeIcon icon={faUser} className="rounded me-2"/>
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
      <div className={styles.content}>
        {postData.content}
      </div>
    </div>
  </div>
  )
}



const PostForm = ({setIsPostFormVisible, postIsCommentData,increaseCommentsCount}) => {
  const { createPost, isLoading } = useCreatePost();
  const [content, setContent] = useState('')
  const navigate = useNavigate(); 
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const handleFileSelect = (event) => {
    event.stopPropagation();
    fileInputRef.current.click();
  };

  const removeImage = () => {
    // Remove file selected
    setImage(null);
  }

  const handleFileChange = async (event) => { 
    // File selected
    const file = event.target.files[0];
    if(!file) return;
    console.log(file)
    // // Transform input into base64
    // const base64 = await convertToBase64(file);
    // console.log(base64)
    // // Store selected file and base64 
    setImage(file);
    // Clear file input
  };

  const handlePostSubmit = async () => {
    if(isLoading || (content.trim() === "" && !image))return;
    console.log(`image ${image}`);
    createPost({
      content,
      postId: postIsCommentData ?  postIsCommentData._id:false,
      image,
    })
    postIsCommentData && increaseCommentsCount()
    setContent("")
    setIsPostFormVisible(false)
    const navigateString = `/${postIsCommentData && postIsCommentData._id ? `post/${postIsCommentData._id}` : ""}`;
    navigate(navigateString); 
    console.log(postIsCommentData)
  }
   
  return (
    <div className={styles.postFormOverlay}onClick={(e)=>e.stopPropagation()}>
      <div className={styles.postFormContainer} >
        <div className={styles.header}>
        <FontAwesomeIcon
          className={styles.cancelSearch}
          onClick={()=>setIsPostFormVisible(false)}
          icon={faXmark}
        />
        </div>
        <div className={styles.body}>
          <div className={styles.upperContainer}>
            {postIsCommentData && <PostTargeted postData={postIsCommentData}/>}
            <div className={styles.container}>
              <div className={styles.profilePic}>
                <FontAwesomeIcon icon={faUser} className="rounded me-2"/>
              </div>

              <div className={styles.inputContainer}>
                <div className={styles.textareaContainer}>
                  <DynamicTextarea  
                    type="text"
                    setContent={setContent}
                    maxLength="200"
                    value={content}
                    placeholder={postIsCommentData ? "Add another post" : "What is happening?!"}
                  />
                </div>
                {image && (
                  <div className={styles.filesContainer}>
                    <FileContainer file={image} removeImage={()=>removeImage()} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.bottomContainer}>
           <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
            />
            <div className={styles.mediaDropLink} onClick={handleFileSelect}>
              <FontAwesomeIcon icon={faPhotoFilm} className="rounded me-2"/>
            </div>
            <div className={styles.postButtonContainer}>
              <button disabled={content.trim() === "" && !image} onClick={handlePostSubmit}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostForm