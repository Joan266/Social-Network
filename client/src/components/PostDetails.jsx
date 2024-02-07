import styles from './PostDetails.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faBan, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { timeSince } from "../utils/useTimeSinceString";
import useFetchPostData from "../hooks/useFetchPostData";

const PostDetails = ({postId}) => {
  const { postData, isLoading } = useFetchPostData(postId);
  if(isLoading || !postData)return "";
  return (
    <div className={styles.postDetailsContainer}>
      <div className={styles.profilePicContainer}>
        <div className={styles.profilePic}>
          <FontAwesomeIcon icon={faUser} className="rounded me-2"/>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.header}>
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
          <FontAwesomeIcon icon={faBan} className="rounded me-2"/>
        </div>
        <div className={styles.content}>
          {postData.content}
        </div>
        <div className={styles.settings}>
          <FontAwesomeIcon icon={faComment} className="rounded me-2"/>
          <FontAwesomeIcon icon={regularHeart} className="rounded me-2"/>
        </div>
      </div>
    </div>
  )
}

export default PostDetails