import { useState } from "react"
import { usePost } from "../hooks/usePost"
import styles from './PostForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

const PostForm = ({setIsPostFormVisible}) => {
  const { createPost, isLoading } = usePost();
  const [content, setContent] = useState('')
  const handlePostSubmit = async () => {
    if(isLoading || content.trim() === "")return;
    createPost(content)
    setContent("")
    setIsPostFormVisible(false)
  }
   
  return (
    <div className={styles.postFormOverlay}>
      <div className={styles.postFormContainer}>
        <div className={styles.header}>
        <FontAwesomeIcon
                className={styles.cancelSearch}
                onClick={()=>setIsPostFormVisible(false)}
                icon={faXmark}
              />
        </div>
        <div className={styles.body}>
          <div className={styles.upperContainer}>
            <div className={styles.profilePic}>
              <FontAwesomeIcon icon={faUser} className="rounded me-2"/>
            </div>
            <div className={styles.inputContainer}>
              <textarea 
                rows="7" cols="50"
                maxLength="251"
                type="text"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                placeholder="What is happening?!"
              />
            </div>
          </div>
          <div className={styles.postButtonContainer}>
            <button disabled={content.trim() === ""} onClick={handlePostSubmit}>Post</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostForm