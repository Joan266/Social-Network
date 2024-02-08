import { useState } from "react"
import { usePost } from "../hooks/usePost"
import styles from './PostForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { timeSince } from "../utils/useTimeSinceString";
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
const PostForm = ({setIsPostFormVisible, postCommentData,increaseCommentsCount}) => {
  const { createPost, isLoading } = usePost();
  const [content, setContent] = useState('')
  const handlePostSubmit = async () => {
    if(isLoading || content.trim() === "")return;
    createPost({content,postId:postCommentData ?  postCommentData._id:false})
    postCommentData && increaseCommentsCount()
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
            {postCommentData && <PostTargeted postData={postCommentData}/>}
            <div className={styles.container}>
              <div className={styles.profilePic}>
                <FontAwesomeIcon icon={faUser} className="rounded me-2"/>
              </div>
              <div className={styles.inputContainer}>
                <textarea 
                  rows="7" cols="50"
                  maxLength="300"
                  type="text"
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                  placeholder={postCommentData ? "Add another post":"What is happening?!"}
                />
              </div>
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