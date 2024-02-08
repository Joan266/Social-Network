import styles from './PostDetails.module.scss'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faBan, faHeart, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { timeSince } from "../utils/useTimeSinceString";
import useFetchPostData from "../hooks/useFetchPostData";
import PostForm from './PostForm';
import { Link } from 'react-router-dom';

const PostDetails = ({postId}) => {
  const { postData, isLoading, handleLikeToggle, isPostLiked } = useFetchPostData(postId);
  const [isPostFormVisible, setIsPostFormVisible]=useState(false);
  const [ commentsCount, setCommentsCount] = useState(0);

  const increaseCommentsCount = () => {
    setCommentsCount(commentsCount+1)
  };
  if(isLoading || !postData)return "";
  return (
    <div className={styles.postDetailsContainer}>
      {isPostFormVisible && <PostForm setIsPostFormVisible={setIsPostFormVisible} postCommentData={postData ? postData : false} increaseCommentsCount={increaseCommentsCount}/>}
      <div className={styles.profilePicContainer}>
        <div className={styles.profilePic}>
          <FontAwesomeIcon icon={faUser} className="rounded me-2"/>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.header}>
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
          {/* <div className={styles.delete}>
            <FontAwesomeIcon icon={faBan} className="rounded me-2"/>
          </div> */}
        </div>
        {postData.reply && postData.reply.username && (
          <div className={styles.replyInfo}>
            Replying to <Link to={`/`+ postData.reply.username}>@{postData.reply.username}</Link>
          </div>
        )}
        <div className={styles.content}>
          {postData.content}
        </div>
        <div className={styles.settings}>
          <div className={styles.commentContainer}>
            <div className={styles.comment} onClick={()=>setIsPostFormVisible(true)}>
             <FontAwesomeIcon icon={faComment} className="rounded me-2"/>
            </div>
            <span>{postData.commentsCount+commentsCount}</span>
          </div>
          <div className={styles.likesContainer}>
            <div className={styles.heart} onClick={()=>handleLikeToggle()}>
              <FontAwesomeIcon 
                icon={isPostLiked ? faHeart : regularHeart} 
                className="rounded me-2" 
                style={{ color: isPostLiked ? "rgb(255, 0, 162)" : "" }} 
              />
            </div>
           <span>{postData.likesCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetails