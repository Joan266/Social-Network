import { useState } from 'react';
import styles from './PostDetails.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { timeSince } from '../utils/useTimeSinceString';
import useFetchPostData from '../hooks/usePostData';
import usePostLikes from '../hooks/usePostLikes';
import PostForm from './PostForm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PostDetails = ({ postId, userId }) => {
  const {  postData, isLoading } = useFetchPostData({postId, userId});
  const {  isLoading: isPostLikesLoading, handleLikeToggle, isPostLiked } = usePostLikes({postId});
  const [ isPostFormVisible, setIsPostFormVisible ] = useState(false);
  const [ commentsCount, setCommentsCount ] = useState(0);
  const navigate = useNavigate(); 
  
  const handlePostLink = () => {
    navigate(`/post/${postId}`); 
  };
  
  const increaseCommentsCount = () => {
    setCommentsCount(commentsCount + 1);
  };


  if (isLoading || !postData) return "";
  
  return (
      <div className={styles.postDetailsContainer} onClick={() => handlePostLink()} >
        {isPostFormVisible && (
          <PostForm
            setIsPostFormVisible={setIsPostFormVisible}
            postIsResponseComment={postData ? postData : null}
            increaseCommentsCount={increaseCommentsCount}
          />
        )}
        <div className={styles.profilePicContainer}>
          <div className={styles.profilePic}>
            {postData.profilePicUrl ? <img src={postData.profilePicUrl} alt='post-profile-pic'></img>:
            <FontAwesomeIcon icon={faUser} className="rounded me-2" />}
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
          <div className={styles.imageContainer} >
          {postData.postImageUrl && (
            <img src={postData.postImageUrl} alt='post' style={{ width: postData.postImgWidth, height: postData.postImgHeight }}/>
          )}
          </div>
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
  );
};

export default PostDetails;
