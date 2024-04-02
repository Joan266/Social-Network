import { useState, useEffect, useRef } from 'react';
import styles from './PostDetails.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faTrashCanArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { timeSince } from '../utils/useTimeSinceString';
import useFetchPostData from '../hooks/usePostData';
import usePostLike from '../hooks/usePostLike';
import PostForm from './PostForm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuthContext } from '../hooks/useAuthContext';
const PostDetails = ({ postId, username, page }) => {
  const { user } = useAuthContext();
  const postRef = useRef(null);
  const {  postData, isLoading } = useFetchPostData({postId, username});
  const [ likeCountSwitch, setLikeCountSwitch ] = useState(0);
  const { handleLikeToggle, isPostLiked } = usePostLike({postId, setLikeCountSwitch});
  const [ isPostFormVisible, setIsPostFormVisible ] = useState(false);
  const [ isDeleteVisible, setIsDeleteVisible ] = useState(false);
  const [ commentsCount, setCommentsCount ] = useState(0);
  const [ isPostVisible, setIsPostVisible ] = useState(false);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const observePostRef = () => {
      const element = postRef ? postRef.current : null;
      if (!element || !postData) {
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          // Ensure that the entry is intersecting and is the target element
          if (entry.isIntersecting) {
            setIsPostVisible(true)
          }else{
            setIsPostVisible(false)
          }
        },
        {
          root: null,
          threshold: 0.1,
        }
      );

      observer.observe(element);

      // Cleanup function
      return () => {
        if (observer && element) {
          observer.unobserve(element);
          setIsPostVisible(false)
        }
      };
    };

    observePostRef();

  }, [postRef,postData]);

  const handlePostLink = () => {
    navigate(`/post/${postId}/${username}`); 
  };

  const handleCommentCount = () => {
    setCommentsCount(commentsCount + 1);
  };

  if (isLoading || !postData) return "";
  
  return (
      <div className={styles.postDetailsContainer} ref={postRef} onClick={() => handlePostLink()} >
        {isPostFormVisible && (
          <PostForm
            setIsPostFormVisible={setIsPostFormVisible}
            postFormCommentData={postData ? postData : null}
            handleCommentCount={handleCommentCount}
          />
        )}
        {isDeleteVisible && (
          <PostForm
            setIsPostFormVisible={setIsPostFormVisible}
            postFormCommentData={postData ? postData : null}
            handleCommentCount={handleCommentCount}
          />
        )}
        <div className={styles.profilePicContainer}>
          <div className={styles.profilePic}>
            {postData.profilePicImgUrl && isPostVisible ? <img src={postData.profilePicImgUrl} alt='post-profile-pic'></img>:
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
            { username === user.username && <div className={styles.deletePostPointer} onClick={(e) => {e.stopPropagation(); setIsPostFormVisible(true);}}>
              <FontAwesomeIcon icon={faTrashCanArrowUp} className="rounded me-2" />
            </div>}
          </div>
          {postData.parentPostUsername && page !== "post" && (
            <div className={styles.replyInfo}>
              Replying to 
              <Link to={`/${postData.parentPostUsername}`} onClick={(e) => e.stopPropagation()}>
                @{postData.parentPostUsername}
              </Link>
            </div>
          )}
          <div className={styles.content}>{postData.content}</div>
          <div className={styles.imageContainer} style={{ width: postData.postImgWidth, height: postData.postImgHeight }}>
          {postData.postImageUrl && isPostVisible && (
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
              <span>{postData.likesCount + likeCountSwitch }</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PostDetails;
