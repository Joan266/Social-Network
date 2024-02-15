import { useState, useRef } from "react"
import { useCreatePost } from "../hooks/useCreatePost"
import styles from './PostForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { timeSince } from "../utils/useTimeSinceString";
import { useNavigate } from 'react-router-dom'; 

const FileContainer = ({file, removeFileSelected}) => {
  return (
    <div className={styles.file}>
      <div className={styles.removeFile} 
          onClick={()=>removeFileSelected()}>
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

function convertToBase64(file){
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result)
    };
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

const PostForm = ({setIsPostFormVisible, postIsCommentData,increaseCommentsCount}) => {
  const { createPost, isLoading } = useCreatePost();
  const [content, setContent] = useState('')
  const navigate = useNavigate(); 
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileSelect = (event) => {
    event.stopPropagation();
    fileInputRef.current.click();
  };

  const removeFileSelected = () => {
    // Remove file selected
    setSelectedFile(null);
  }

  const handleFileChange = async (event) => { 
    // File selected
    const file = event.target.files[0];
    if(!file) return;
    // Transform input into base64
    const base64 = await convertToBase64(file);
    // Store selected file and base64 
    setSelectedFile({file, base64});
    // Clear file input
    event.target.file = null;
  };

  const handlePostSubmit = async () => {
    if(isLoading || (content.trim() === "" && !selectedFile))return;
    createPost({
      content,
      postId: postIsCommentData ?  postIsCommentData._id:false,
      file: selectedFile,
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
                {selectedFile && (
                  <div className={styles.filesContainer}>
                    <FileContainer file={selectedFile.file} removeFileSelected={()=>removeFileSelected()} />
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
              accept='.jpeg, .png, .jpg'
            />
            <div className={styles.mediaDropLink} onClick={handleFileSelect}>
              <FontAwesomeIcon icon={faPhotoFilm} className="rounded me-2"/>
            </div>
            <div className={styles.postButtonContainer}>
              <button disabled={content.trim() === "" && !selectedFile} onClick={handlePostSubmit}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostForm