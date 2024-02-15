import { useState, useRef, useEffect } from "react"
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
      {file.type.startsWith('image/') ? (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
        />
      ) : file.type.startsWith('video/') ? (
        <video
          src={URL.createObjectURL(file)}
          alt={file.name}
          controls
        />
      ) : null}
    </div>
  );
}

function DynamicTextarea({setContent,...rest}) {
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleFileSelect = (event) => {
    event.stopPropagation();
    fileInputRef.current.click();
  };
  const removeFileSelected = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((file, i) => i !== index));
  }
  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log(event.target.files);
    const maxFiles = 1;

    // Take only the first 4 files
    const selectedFilesArray = Array.from(files).slice(0, maxFiles);
    // Store selected files in state
    setSelectedFiles(selectedFilesArray);
    event.target.value = null;
  };
  useEffect(()=> {
    console.log(selectedFiles)
  },[selectedFiles])

  const handlePostSubmit = async () => {
    if(isLoading || content.trim() === "")return;
    createPost({content,postId:postIsCommentData ?  postIsCommentData._id:false})
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
                {selectedFiles.length > 0 && (
                  <div className={styles.filesContainer}>
                    {selectedFiles.map((file, index) => (
                      <FileContainer key={index} file={file} removeFileSelected={()=>removeFileSelected(index)} />
                    ))}
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
              accept="image/jpeg,image/png,image/gif,video/mp4,video/mpeg,video/quicktime"
            />
            <div className={styles.mediaDropLink} onClick={handleFileSelect}>
              <FontAwesomeIcon icon={faPhotoFilm} className="rounded me-2"/>
            </div>
            <div className={styles.postButtonContainer}>
              <button disabled={content.trim() === "" && selectedFiles.length === 0} onClick={handlePostSubmit}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostForm