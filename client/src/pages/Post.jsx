import { useState } from 'react';
import { useParams } from 'react-router-dom'
import styles from './Post.module.scss';
import usePostReplies from '../hooks/usePostReplies';
import useFetchPostData from '../hooks/usePostData';
import usePostLike from '../hooks/usePostLike';
import PostRepliesList from '../components/PostRepliesList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { timeSince } from '../utils/useTimeSinceString';
import { Link } from 'react-router-dom';
import PostForm from '../components/PostForm';

const Post = () => {
  const { postId, username } = useParams();
  usePostReplies(postId);
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const {  postData, isLoading } = useFetchPostData({postId, username});
  const { handleLikeToggle, isPostLiked } = usePostLike({postId});

  const increaseCommentsCount = () => {
    setCommentsCount(commentsCount + 1);
  };

  if (isLoading || !postData   ) return (
    <div className={styles.postContainer}>

    </div>
  );

  return (
    <div className={styles.postContainer}>
      <div className={styles.navContainer}>
        <div className={styles.postLabel}>
          Post
        </div>
      </div>
      <div className={styles.postDetailsContainer} >
        {isPostFormVisible && (
          <PostForm
            setIsPostFormVisible={setIsPostFormVisible}
            postIsResponseComment={postData ? postData : false}
            increaseCommentsCount={increaseCommentsCount}
          />
        )}
        <div className={styles.profilePicContainer}>
          <div className={styles.profilePic}>
            {postData.profilePicImgUrl  ? <img src={postData.profilePicImgUrl} alt='post-profile-pic'></img>:
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
          {postData.parentPostUsername && (
            <div className={styles.replyInfo}>
              Replying to 
              <Link to={`/${postData.parentPostUsername}`} onClick={(e) => e.stopPropagation()}>
                @{postData.parentPostUsername}
              </Link>
            </div>
          )}
          <div className={styles.content}>{postData.content}</div>
          <div className={styles.imageContainer} style={{ width: postData.postImgWidth, height: postData.postImgHeight }}>
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
              <span>{postData.likesCount + (isPostLiked ? 1 : 0)}</span>
            </div>
          </div>
        </div>
      </div>
      <PostRepliesList  postId={postId}/>
    </div>
  )
}

export default Post