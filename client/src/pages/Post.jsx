import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import styles from './Post.module.scss';
import useFetchPostReplies from '../hooks/useFetchPostReplies';
import PostList from '../components/PostList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { timeSince } from '../utils/useTimeSinceString';
import useFetchPostData from '../hooks/useFetchPostData';
import { Link } from 'react-router-dom';
import PostForm from '../components/PostForm';
import ImageComponent from '../components/Image';
const Post = () => {
  const { postId } = useParams();
  useFetchPostReplies(postId);
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const {  postData, isLoading, handleLikeToggle, isPostLiked } = useFetchPostData({isVisible:true, postId});



  const increaseCommentsCount = () => {
    setCommentsCount(commentsCount + 1);
  };

  if (isLoading || !postData  ) return (
    <div className={styles.postRepliesContainer}>

    </div>
  );

  return (
    <div className={styles.postRepliesContainer}>
      <div className={styles.navContainer}>
        <div className={styles.postLabel}>
          Post
        </div>
      </div>
      <div className={styles.postDetailsContainer} >
        {isPostFormVisible && (
          <PostForm
            setIsPostFormVisible={setIsPostFormVisible}
            postIsCommentData={postData ? postData : false}
            increaseCommentsCount={increaseCommentsCount}
          />
        )}
        <div className={styles.profilePicContainer}>
          <div className={styles.profilePic}>
            <FontAwesomeIcon icon={faUser} className="rounded me-2" />
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.header} >
            <div className={styles.userInfo}>
              <div className={styles.name}>
                <Link to={`/${postData.username}`} onClick={(e) => e.stopPropagation()}>
                  {postData.username}
                </Link>
              </div>
              <div className={styles.username}>@{postData.username}</div>
              <div className={styles.dote}>·</div>
              <div className={styles.date}>{timeSince(postData.createdAt)}</div>
            </div>
          </div>
          {postData.reply && postData.reply.username && (
            <div className={styles.replyInfo}>
              Replying to 
              <Link to={`/${postData.reply.username}`} onClick={(e) => e.stopPropagation()}>
                @{postData.reply.username}
              </Link>
            </div>
          )}
          <div className={styles.content}>{postData.content}</div>
          {postData.file && (
            <div className={styles.imageContainer}>
              <ImageComponent fileId={postData.file}/>
            </div>
          )}
          <div className={styles.settings}>
            <div className={styles.commentContainer}>
              <div className={styles.comment} onClick={(e) => {e.stopPropagation(); setIsPostFormVisible(true);}}>
                <FontAwesomeIcon icon={faComment} className="rounded me-2" />
              </div>
              <span>{postData.commentsCount + commentsCount}</span>
            </div>
            <div className={styles.likesContainer}>
              <div className={styles.heart} onClick={(e) => { e.stopPropagation(); handleLikeToggle(); }}>
                <FontAwesomeIcon
                  icon={isPostLiked ? faHeart : regularHeart}
                  className="rounded me-2"
                  style={{ color: isPostLiked ? 'rgb(255, 0, 162)' : '' }}
                />
              </div>
              <span>{postData.likesCount}</span>
            </div>
          </div>
        </div>
      </div>
      <PostList/>
    </div>
  )
}

export default Post