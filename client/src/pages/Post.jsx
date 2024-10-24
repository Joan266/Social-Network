import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { BackButtonComponent } from '../components/BackButton';
import { LoaderComponent } from '../components/Loader';

const Post = () => {
  const { postId, username } = useParams();
  usePostReplies(postId);
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [ likeCountSwitch, setLikeCountSwitch ] = useState(0);
  const { postData, isLoading } = useFetchPostData({ postId, username, isPostVisible: true });
  const { handleLikeToggle, isPostLiked } = usePostLike({ postId, setLikeCountSwitch });

  const increaseCommentsCount = () => {
    setCommentsCount(commentsCount + 1);
  };

  if (isLoading || !postData) {
    return (
      <div className={styles.postContainer}>
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className={styles.postContainer}>
      <div className={styles.navContainer}>
        <BackButtonComponent />
        <div className={styles.postLabel}>Post</div>
      </div>
      <div className={styles.postDetailsContainer}>
        {isPostFormVisible && (
          <PostForm
            setIsPostFormVisible={setIsPostFormVisible}
            postIsResponseComment={postData ? postData : false}
            increaseCommentsCount={increaseCommentsCount}
          />
        )}
        <div className={styles.profilePicContainer}>
          <div className={styles.profilePic}>
            {postData.profilePicImgUrl ? (
              <img src={postData.profilePicImgUrl} alt="post-profile-pic" />
            ) : (
              <FontAwesomeIcon icon={faUser} className="rounded me-2" />
            )}
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <div className={styles.name}>
                <Link to={`/user/${postData.username}`} onClick={(e) => e.stopPropagation()}>
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
              Replying to{' '}
              <Link to={`/user/${postData.parentPostUsername}`} onClick={(e) => e.stopPropagation()}>
                @{postData.parentPostUsername}
              </Link>
            </div>
          )}
          <div className={styles.content}>{postData.content}</div>
          <div className={styles.imageContainer}>
            {postData.postImageUrl && <img src={postData.postImageUrl} alt="post" />}
          </div>
          <div className={styles.settings}>
            <div className={styles.commentContainer}>
              <div className={styles.comment} onClick={(e) => { e.stopPropagation(); setIsPostFormVisible(true); }}>
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
              <span>{postData.likesCount + likeCountSwitch}</span>
            </div>
          </div>
        </div>
      </div>
      <PostRepliesList postId={postId} />
    </div>
  );
};

export default Post;
