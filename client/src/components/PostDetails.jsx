import { useState, useEffect, useRef } from 'react';
import styles from './PostDetails.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { timeSince } from '../utils/useTimeSinceString';
import useFetchPostData from '../hooks/usePostData';
import usePostLike from '../hooks/usePostLike';
import PostForm from './PostForm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PostDetails = ({ postId, username }) => {
  const postRef = useRef(null);
  const {  postData, isLoading } = useFetchPostData({postId, username});
  const { handleLikeToggle, isPostLiked } = usePostLike({postId});
  const [ isPostFormVisible, setIsPostFormVisible ] = useState(false);
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
    navigate(`/post/${postId}`); 
  };
  
  const increaseCommentsCount = () => {
    setCommentsCount(commentsCount + 1);
  };


  if (isLoading || !postData) return "";
  
  return (
      <div className={styles.postDetailsContainer} ref={postRef} onClick={() => handlePostLink()} >
        {isPostFormVisible && (
          <PostForm
            setIsPostFormVisible={setIsPostFormVisible}
            postIsResponseComment={postData ? postData : null}
            increaseCommentsCount={increaseCommentsCount}
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
              <span>{postData.likesCount + (isPostLiked ? 1 : 0)}</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PostDetails;
